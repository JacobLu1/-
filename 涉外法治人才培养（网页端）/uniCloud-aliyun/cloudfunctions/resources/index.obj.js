// 云对象：学习资源管理（网页端管理后台 + 小程序学习中心共用）
// 调用方式：
//   const resourcesObj = uniCloud.importObject('resources')
//   await resourcesObj.list({ adminToken, type: 'video'|'english'|'all' })
//   方法：list / add / update / remove
// 返回统一结构：{ errCode: 0 成功 | 非0 失败, errMsg, ... }

const db = uniCloud.database()

// 默认资源：首次部署后无需手动导入即可展示
const DEFAULT_RESOURCES = [
  // 视频资源
  { type: 'video', title: '国际商事仲裁实务精讲', cat: '国际仲裁', tagClass: 'qb-type-single', meta: '45:30', diffClass: '', date: '2026-07-20', status: '已上线', statusClass: 'qb-diff-easy' },
  { type: 'video', title: 'WTO争端解决机制解析', cat: 'WTO法', tagClass: 'qb-type-multi', meta: '38:15', diffClass: '', date: '2026-07-19', status: '已上线', statusClass: 'qb-diff-easy' },
  { type: 'video', title: '跨境投资法律风险防控', cat: '跨境投资', tagClass: 'qb-type-case', meta: '52:00', diffClass: '', date: '2026-07-18', status: '审核中', statusClass: 'qb-diff-mid' },
  { type: 'video', title: '国际海商法典型案例', cat: '海商法', tagClass: 'qb-type-single', meta: '41:20', diffClass: '', date: '2026-07-17', status: '已上线', statusClass: 'qb-diff-easy' },
  { type: 'video', title: '跨境数据合规实务解析', cat: '跨境投资', tagClass: 'qb-type-multi', meta: '36:40', diffClass: '', date: '2026-07-16', status: '已上线', statusClass: 'qb-diff-easy' },
  // 法律英语资源
  { type: 'english', title: '法律英语核心词汇 300 词', cat: '词汇积累', tagClass: 'qb-type-single', meta: '初级', diffClass: 'qb-diff-easy', date: '2026-07-20', status: '已上线', statusClass: 'qb-diff-easy' },
  { type: 'english', title: '涉外合同常用术语精讲', cat: '术语精讲', tagClass: 'qb-type-multi', meta: '中级', diffClass: 'qb-diff-mid', date: '2026-07-19', status: '已上线', statusClass: 'qb-diff-easy' },
  { type: 'english', title: '每周法律英语听力实训', cat: '听力训练', tagClass: 'qb-type-case', meta: '中级', diffClass: 'qb-diff-mid', date: '2026-07-18', status: '已上线', statusClass: 'qb-diff-easy' },
  { type: 'english', title: '国际商事仲裁英文案例分析', cat: '实战练习', tagClass: 'qb-type-single', meta: '高级', diffClass: 'qb-diff-hard', date: '2026-07-17', status: '审核中', statusClass: 'qb-diff-mid' },
  { type: 'english', title: 'CISG 适用案例法律英语精讲', cat: '术语精讲', tagClass: 'qb-type-multi', meta: '中级', diffClass: 'qb-diff-mid', date: '2026-07-16', status: '已上线', statusClass: 'qb-diff-easy' },
  { type: 'english', title: '跨境合规谈判场景英语训练', cat: '实战练习', tagClass: 'qb-type-single', meta: '高级', diffClass: 'qb-diff-hard', date: '2026-07-15', status: '已上线', statusClass: 'qb-diff-easy' }
]

// 幂等：resource 集合为空时写入默认资源
async function ensureDefaultResources() {
  const table = db.collection('resource')
  const countRes = await table.count()
  if (countRes.total > 0) return
  for (const r of DEFAULT_RESOURCES) {
    await table.add({ ...r, createDate: Date.now() })
  }
}

module.exports = {
  _before: async function () {
    try {
      await ensureDefaultResources()
    } catch (e) {
      console.error('ensureDefaultResources error:', e)
    }
  },

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

    const allow = ['title', 'cat', 'tagClass', 'meta', 'diffClass', 'status', 'statusClass']
    const patch = {}
    for (const key of allow) {
      if (data[key] !== undefined) patch[key] = data[key]
    }
    if (patch.title !== undefined && !String(patch.title).trim()) {
      return { errCode: 'PARAM_ERROR', errMsg: '资源标题不能为空' }
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
