// 云对象：测评结果（网页端 survey.vue 提交后保存，小程序端复用）
// 调用方式：
//   const surveyObj = uniCloud.importObject('survey')
//   await surveyObj.saveResult({ token, result })
//   方法：saveResult / myResults
// 返回统一结构：{ errCode: 0 成功 | 非0 失败, errMsg, ... }

const db = uniCloud.database()

// 根据 token 解析当前用户
async function getUserByToken(token) {
  if (!token) return null
  const res = await db.collection('user').where({ token }).limit(1).get()
  return res.data[0] || null
}

module.exports = {
  /**
   * 保存测评结果（需登录 token）
   * @param {object} result { score, level, dimensions, recommendations, mode, specialCategory }
   */
  async saveResult({ token, result = {} } = {}) {
    const user = await getUserByToken(token)
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
      dimensions: Array.isArray(result.dimensions) ? result.dimensions : [],
      recommendations: Array.isArray(result.recommendations) ? result.recommendations : [],
      createDate: Date.now()
    }
    const addRes = await db.collection('survey_result').add(doc)
    return { errCode: 0, errMsg: '', id: addRes.id }
  },

  /**
   * 当前用户的测评记录（需登录 token）
   */
  async myResults({ token, page = 1, pageSize = 10 } = {}) {
    const user = await getUserByToken(token)
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

    return { errCode: 0, errMsg: '', list: listRes.data, total: totalRes.total }
  },

  /**
   * 删除某条测评记录（本人或管理员）
   */
  async removeResult({ token, id } = {}) {
    const user = await getUserByToken(token)
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
