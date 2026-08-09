// 云对象：题目库管理（网页端管理后台 + 测评页共用）
// 调用方式：
//   const questionsObj = uniCloud.importObject('questions')
//   await questionsObj.listPublic({ type, dimension, keyword, page, pageSize })
//   await questionsObj.list({ adminToken, type, dimension, keyword, page, pageSize })
//   方法：listPublic / list / stats / add / update / remove
// 返回统一结构：{ errCode: 0 成功 | 非0 失败, errMsg, ... }

const db = uniCloud.database()

function buildWhere(type, dimension, keyword, status) {
  const where = {}
  if (status) where.status = status
  if (type && type !== 'all') where.type = type
  if (dimension && dimension !== 'all') where.dimension = dimension
  const kw = keyword ? String(keyword).trim() : ''
  if (kw) where.title = new RegExp(kw, 'i')
  return where
}

function normalizeAnswer(type, answer) {
  if (type === 'judge') {
    return answer === true || answer === 'true' || answer === '对'
  }
  if (type === 'multi') {
    if (Array.isArray(answer)) return answer
    if (typeof answer === 'string' && answer.trim()) {
      return answer.split(/[,，]/).map(s => s.trim()).filter(Boolean)
    }
    return []
  }
  return answer === undefined ? '' : answer
}

module.exports = {
  /**
   * 公开题目列表（测评页使用，只返回已上线）
   */
  async listPublic({ type = 'all', dimension = '', keyword = '', page = 1, pageSize = 50 } = {}) {
    const table = db.collection('question')
    const where = buildWhere(type, dimension, keyword, '已上线')
    const countRes = await table.where(where).count()
    const listRes = await table
      .where(where)
      .orderBy('createDate', 'asc')
      .skip((Number(page) - 1) * Number(pageSize))
      .limit(Number(pageSize))
      .get()
    return { errCode: 0, errMsg: '', list: listRes.data, total: countRes.total }
  },

  /**
   * 管理端题目列表（需管理员 token）
   */
  async list({ adminToken, type = 'all', dimension = '', keyword = '', page = 1, pageSize = 50 } = {}) {
    const check = await checkAdmin(adminToken)
    if (check.errCode !== 0) return check
    const table = db.collection('question')
    const where = buildWhere(type, dimension, keyword, '')
    const countRes = await table.where(where).count()
    const listRes = await table
      .where(where)
      .orderBy('createDate', 'desc')
      .skip((Number(page) - 1) * Number(pageSize))
      .limit(Number(pageSize))
      .get()
    return { errCode: 0, errMsg: '', list: listRes.data, total: countRes.total }
  },

  /**
   * 题库统计（需管理员 token）
   */
  async stats({ adminToken } = {}) {
    const check = await checkAdmin(adminToken)
    if (check.errCode !== 0) return check
    const table = db.collection('question')
    const count = async (where = {}) => (await table.where(where).count()).total
    return {
      errCode: 0,
      errMsg: '',
      total: await count({}),
      single: await count({ type: 'single' }),
      multi: await count({ type: 'multi' }),
      judge: await count({ type: 'judge' }),
      subjective: await count({ type: 'subjective' })
    }
  },

  /**
   * 新增题目（需管理员 token）
   */
  async add({ adminToken, data = {} } = {}) {
    const check = await checkAdmin(adminToken)
    if (check.errCode !== 0) return check
    if (!['single', 'multi', 'judge', 'subjective'].includes(data.type)) {
      return { errCode: 'PARAM_ERROR', errMsg: '题型不合法' }
    }
    if (!data.title || !String(data.title).trim()) {
      return { errCode: 'PARAM_IS_NULL', errMsg: '题目内容不能为空' }
    }

    const now = Date.now()
    const doc = {
      type: data.type,
      subType: data.subType || '',
      title: String(data.title).trim(),
      options: Array.isArray(data.options) ? data.options : [],
      answer: normalizeAnswer(data.type, data.answer),
      dimension: data.dimension || '综合',
      difficulty: ['easy', 'mid', 'hard'].includes(data.difficulty) ? data.difficulty : 'mid',
      caseText: data.caseText || '',
      placeholder: data.placeholder || '',
      status: data.status || '审核中',
      createDate: now,
      updateDate: now
    }
    const addRes = await db.collection('question').add(doc)
    return { errCode: 0, errMsg: '', id: addRes.id }
  },

  /**
   * 更新题目（需管理员 token）
   */
  async update({ adminToken, id, data = {} } = {}) {
    const check = await checkAdmin(adminToken)
    if (check.errCode !== 0) return check
    if (!id) {
      return { errCode: 'PARAM_IS_NULL', errMsg: 'id 不能为空' }
    }
    const allow = ['type', 'subType', 'title', 'options', 'answer', 'dimension', 'difficulty', 'caseText', 'placeholder', 'status']
    const patch = {}
    for (const key of allow) {
      if (data[key] !== undefined) patch[key] = data[key]
    }
    if (patch.title !== undefined && !String(patch.title).trim()) {
      return { errCode: 'PARAM_ERROR', errMsg: '题目内容不能为空' }
    }
    if (patch.type !== undefined && !['single', 'multi', 'judge', 'subjective'].includes(patch.type)) {
      return { errCode: 'PARAM_ERROR', errMsg: '题型不合法' }
    }
    if (patch.answer !== undefined) {
      patch.answer = normalizeAnswer(patch.type || data.type || 'single', patch.answer)
    }
    patch.updateDate = Date.now()
    await db.collection('question').doc(id).update(patch)
    return { errCode: 0, errMsg: '' }
  },

  /**
   * 删除题目（需管理员 token）
   */
  async remove({ adminToken, id } = {}) {
    const check = await checkAdmin(adminToken)
    if (check.errCode !== 0) return check
    if (!id) {
      return { errCode: 'PARAM_IS_NULL', errMsg: 'id 不能为空' }
    }
    await db.collection('question').doc(id).remove()
    return { errCode: 0, errMsg: '' }
  }
}

// 管理员鉴权（与 resources 云对象一致）
async function checkAdmin(adminToken) {
  if (!adminToken) {
    return { errCode: 'NO_TOKEN', errMsg: '未登录' }
  }
  const res = await db.collection('user').where({ token: adminToken }).limit(1).get()
  const user = res.data[0]
  if (!user) {
    return { errCode: 'TOKEN_INVALID', errMsg: '登录已失效' }
  }
  if (user.role !== 'admin') {
    return { errCode: 'FORBIDDEN', errMsg: '无管理员权限' }
  }
  return { errCode: 0, user }
}
