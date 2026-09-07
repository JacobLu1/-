// 云对象：测评结果（网页端 survey.vue 提交后保存，小程序端复用）
// 所有方法返回 { errCode, errMsg, ... }，errCode 为 0 表示成功

const db = uniCloud.database()

// 根据 token 解析当前用户
async function findUser(token) {
  if (!token) return null
  const res = await db.collection('user').where({ token }).limit(1).get()
  return res.data[0] || null
}

async function checkAdmin(adminToken) {
  const user = await findUser(adminToken)
  if (!user) {
    return { errCode: 'NO_TOKEN', errMsg: '未登录或登录已失效' }
  }
  if (user.role !== 'admin') {
    return { errCode: 'FORBIDDEN', errMsg: '无管理员权限' }
  }
  return { errCode: 0, user }
}

function clipRaw(doc) {
  const rest = { ...doc }
  delete rest.rawAnswers
  delete rest.items
  return rest
}

// 列表视图剥离明细（快照体积大，仅详情接口返回）
function stripDetail(doc) {
  const rest = { ...doc }
  delete rest.rawAnswers
  delete rest.items
  return rest
}

module.exports = {
  /* 保存测评结果（需登录 token） */
  async saveResult({ token, result = {} } = {}) {
    const user = await findUser(token)
    if (!user) {
      return { errCode: 'NO_TOKEN', errMsg: '未登录或登录已失效' }
    }

    const doc = {
      userId: user._id,
      account: user.account,
      name: user.name || user.account,
      mode: result.mode || 'comprehensive',
      specialCategory: result.specialCategory || '',
      score: Number(result.score) || 0,
      level: result.level || '',
      time: result.time || '',
      dimensions: Array.isArray(result.dimensions) ? result.dimensions : [],
      recommendations: Array.isArray(result.recommendations) ? result.recommendations : [],
      rawAnswers: result.rawAnswers || {},
      items: Array.isArray(result.items) ? result.items : [],
      createDate: Date.now()
    }
    const addRes = await db.collection('survey_result').add(doc)
    return { errCode: 0, errMsg: '', id: addRes.id }
  },

  /* 当前用户的测评记录（需登录 token） */
  async myResults({ token, page = 1, pageSize = 10 } = {}) {
    const user = await findUser(token)
    if (!user) {
      return { errCode: 'NO_TOKEN', errMsg: '未登录或登录已失效' }
    }

    const table = db.collection('survey_result')
    const totalRes = await table.where({ userId: user._id }).count()
    const listRes = await table
      .where({ userId: user._id })
      .orderBy('createDate', 'desc')
      .skip((Number(page) - 1) * Number(pageSize))
      .limit(Number(pageSize))
      .get()

    return {
      errCode: 0,
      errMsg: '',
      list: listRes.data.map(stripDetail),
      total: totalRes.total
    }
  },

  /* 单条测评记录详情（本人或管理员，含逐题快照） */
  async detail({ token, id } = {}) {
    const user = await findUser(token)
    if (!user) {
      return { errCode: 'NO_TOKEN', errMsg: '未登录或登录已失效' }
    }
    if (!id) {
      return { errCode: 'PARAM_IS_NULL', errMsg: 'id 不能为空' }
    }
    const res = await db.collection('survey_result').doc(id).get()
    const rec = res.data[0]
    if (!rec) {
      return { errCode: 'NOT_EXIST', errMsg: '记录不存在' }
    }
    if (rec.userId !== user._id && user.role !== 'admin') {
      return { errCode: 'FORBIDDEN', errMsg: '无权查看该记录' }
    }
    return { errCode: 0, errMsg: '', doc: rec }
  },

  /* 管理端测评统计（需管理员 token） */
  async stats({ adminToken } = {}) {
    const check = await checkAdmin(adminToken)
    if (check.errCode !== 0) return check

    const table = db.collection('survey_result')
    const totalRes = await table.count()
    const scoreRes = await table.field({ score: true }).limit(1000).get()
    const scores = (scoreRes.data || []).map(r => Number(r.score) || 0)
    const avgScore = scores.length ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0
    const maxScore = scores.length ? Math.max(...scores) : 0
    const minScore = scores.length ? Math.min(...scores) : 0
    const weekStart = Date.now() - 7 * 24 * 3600 * 1000
    const weekRes = await table.where({ createDate: db.command.gte(weekStart) }).count()

    return {
      errCode: 0,
      errMsg: '',
      total: totalRes.total,
      avgScore: Number(avgScore.toFixed(1)),
      maxScore,
      minScore,
      weekCount: weekRes.total
    }
  },

  /* 管理端测评记录列表（需管理员 token，不返回 rawAnswers） */
  async list({ adminToken, page = 1, pageSize = 10 } = {}) {
    const check = await checkAdmin(adminToken)
    if (check.errCode !== 0) return check

    const table = db.collection('survey_result')
    const totalRes = await table.count()
    const listRes = await table
      .orderBy('createDate', 'desc')
      .skip((Number(page) - 1) * Number(pageSize))
      .limit(Number(pageSize))
      .get()

    return {
      errCode: 0,
      errMsg: '',
      list: listRes.data.map(stripDetail),
      total: totalRes.total
    }
  },

  /* 我的错题：聚合本人测评记录里答错/漏答的客观题（按题目去重并统计错误次数） */
  async wrongQuestions({ token, page = 1, pageSize = 20 } = {}) {
    const user = await findUser(token)
    if (!user) {
      return { errCode: 'NO_TOKEN', errMsg: '未登录或登录已失效' }
    }

    const recsRes = await db
      .collection('survey_result')
      .where({ userId: user._id })
      .field({ items: true, createDate: true })
      .orderBy('createDate', 'desc')
      .limit(300)
      .get()

    const map = new Map()
    ;(recsRes.data || []).forEach(rec => {
      const ts = rec.createDate || 0
      ;(rec.items || []).forEach(it => {
        // 仅统计客观题且判定为错误/漏答的题目
        if (!it || it.type === 'subjective' || it.isCorrect !== false) return
        const key = it.questionId || it.title || ''
        if (!key) return
        let entry = map.get(key)
        if (!entry) {
          entry = {
            questionId: it.questionId || '',
            type: it.type || '',
            subType: it.subType || '',
            title: it.title || '',
            caseText: it.caseText || '',
            options: Array.isArray(it.options) ? it.options : [],
            answer: it.answer,
            analysis: it.analysis || '',
            userAnswer: it.userAnswer,
            wrongTimes: 0,
            lastWrongDate: 0
          }
          map.set(key, entry)
        }
        entry.wrongTimes++
        if (ts >= entry.lastWrongDate) {
          entry.lastWrongDate = ts
          entry.userAnswer = it.userAnswer
        }
      })
    })

    const list = Array.from(map.values()).sort((a, b) => (b.lastWrongDate || 0) - (a.lastWrongDate || 0))
    const total = list.length
    const start = (Number(page) - 1) * Number(pageSize)
    return {
      errCode: 0,
      errMsg: '',
      list: list.slice(start, start + Number(pageSize)),
      total
    }
  },

  /* 删除某条测评记录（本人或管理员） */
  async removeResult({ token, id } = {}) {
    const user = await findUser(token)
    if (!user) {
      return { errCode: 'NO_TOKEN', errMsg: '未登录或登录已失效' }
    }
    if (!id) {
      return { errCode: 'PARAM_IS_NULL', errMsg: 'id 不能为空' }
    }
    const res = await db.collection('survey_result').doc(id).get()
    const rec = res.data[0]
    if (!rec) {
      return { errCode: 'NOT_EXIST', errMsg: '记录不存在' }
    }
    if (rec.userId !== user._id && user.role !== 'admin') {
      return { errCode: 'FORBIDDEN', errMsg: '无权删除该记录' }
    }
    await db.collection('survey_result').doc(id).remove()
    return { errCode: 0, errMsg: '' }
  }
}
