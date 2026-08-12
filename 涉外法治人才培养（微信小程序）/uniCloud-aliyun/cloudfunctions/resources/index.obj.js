// 云对象：学习资源管理（网页端管理后台 + 小程序学习中心共用）
// 调用方式：
//   const resourcesObj = uniCloud.importObject('resources')
//   await resourcesObj.list({ adminToken, type: 'video'|'english'|'all' })
//   await resourcesObj.listPublic({ type: 'video'|'english'|'all' })
//   await resourcesObj.get({ id })
//   方法：list / listPublic / get / add / update / remove
// 返回统一结构：{ errCode: 0 成功 | 非0 失败, errMsg, ... }

const db = uniCloud.database()

module.exports = {
  /**
   * 资源列表（需管理员 token）
   * @param {string} type video | english | all
   */
  async list({ adminToken, type = 'all' } = {}) {
    const check = await checkAdmin(adminToken)
    if (check.errCode !== 0) return check

    const table = db.collection('resource')
    const where = type === 'all' ? {} : { type }
    const listRes = await table.where(where).orderBy('createDate', 'desc').get()
    return { errCode: 0, errMsg: '', list: listRes.data }
  },

  /**
   * 公开资源列表（学习中心使用，只返回已上线）
   * @param {string} type video | english | all
   */
  async listPublic({ type = 'all' } = {}) {
    const table = db.collection('resource')
    const where = type === 'all' ? { status: '已上线' } : { type, status: '已上线' }
    const listRes = await table.where(where).orderBy('createDate', 'desc').get()
    return { errCode: 0, errMsg: '', list: listRes.data }
  },

  /**
   * 公开资源详情（学习中心使用，只返回已上线）
   */
  async get({ id } = {}) {
    if (!id) {
      return { errCode: 'PARAM_IS_NULL', errMsg: 'id 不能为空' }
    }
    const res = await db.collection('resource').where({ _id: id, status: '已上线' }).limit(1).get()
    const doc = res.data[0]
    if (!doc) {
      return { errCode: 'NOT_FOUND', errMsg: '资源不存在或未上线' }
    }
    return { errCode: 0, errMsg: '', doc }
  },

  /**
   * 新增资源（需管理员 token）
   */
  async add({ adminToken, type = 'video', data = {} } = {}) {
    const check = await checkAdmin(adminToken)
    if (check.errCode !== 0) return check
    if (!['video', 'english'].includes(type)) {
      return { errCode: 'PARAM_ERROR', errMsg: '资源类型不合法' }
    }
    if (!data.title || !String(data.title).trim()) {
      return { errCode: 'PARAM_IS_NULL', errMsg: '资源标题不能为空' }
    }

    const doc = {
      type,
      title: String(data.title).trim(),
      cat: data.cat || '待分类',
      tagClass: data.tagClass || 'qb-type-case',
      meta: data.meta || '',
      diffClass: data.diffClass || '',
      cover: data.cover || '',
      fileUrl: data.fileUrl || '',
      description: data.description || '',
      date: data.date || '',
      status: data.status || '审核中',
      statusClass: data.statusClass || 'qb-diff-mid',
      createDate: Date.now()
    }
    const addRes = await db.collection('resource').add(doc)
    return { errCode: 0, errMsg: '', id: addRes.id }
  },

  /**
   * 更新资源（需管理员 token）
   */
  async update({ adminToken, id, data = {} } = {}) {
    const check = await checkAdmin(adminToken)
    if (check.errCode !== 0) return check
    if (!id) {
      return { errCode: 'PARAM_IS_NULL', errMsg: 'id 不能为空' }
    }

    const allow = ['title', 'cat', 'tagClass', 'meta', 'diffClass', 'cover', 'fileUrl', 'description', 'date', 'status', 'statusClass']
    const patch = {}
    for (const key of allow) {
      if (data[key] !== undefined) patch[key] = data[key]
    }
    if (patch.title !== undefined && !String(patch.title).trim()) {
      return { errCode: 'PARAM_ERROR', errMsg: '资源标题不能为空' }
    }
    if (patch.status !== undefined && !['已上线', '审核中'].includes(patch.status)) {
      return { errCode: 'PARAM_ERROR', errMsg: '资源状态不合法' }
    }

    await db.collection('resource').doc(id).update(patch)
    return { errCode: 0, errMsg: '' }
  },

  /**
   * 删除资源（需管理员 token）
   */
  async remove({ adminToken, id } = {}) {
    const check = await checkAdmin(adminToken)
    if (check.errCode !== 0) return check
    if (!id) {
      return { errCode: 'PARAM_IS_NULL', errMsg: 'id 不能为空' }
    }
    await db.collection('resource').doc(id).remove()
    return { errCode: 0, errMsg: '' }
  }
}

// 管理员鉴权（与 users 云对象一致）
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
