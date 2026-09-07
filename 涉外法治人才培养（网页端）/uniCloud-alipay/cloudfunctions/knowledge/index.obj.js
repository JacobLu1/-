// 云对象：法律知识库（网页端法律库 + 管理后台共用）
// 所有方法返回 { errCode, errMsg, ... }，errCode 为 0 表示成功

const db = uniCloud.database()

function toArr(value) {
  if (Array.isArray(value)) {
    return value.map(s => String(s || '').trim()).filter(Boolean)
  }
  return String(value || '').split(/[,，、]/).map(s => s.trim()).filter(Boolean)
}

function defCat(value) {
  return String(value || '').trim() || '综合'
}

async function getCats(status = '已上线') {
  const table = db.collection('legal_doc')
  const where = status ? { status } : {}
  const countRes = await table.where(where).count()
  const total = countRes.total || 0
  const set = new Set()
  // 分类是从全表拉出来去重的，文档多了就分批取，一次全拿云函数会超时
  const MAX = 500
  for (let i = 0; i < total; i += MAX) {
    const res = await table
      .where(where)
      .field({ category: true })
      .skip(i)
      .limit(MAX)
      .get()
    ;(res.data || []).forEach(doc => {
      const c = defCat(doc.category)
      if (c) set.add(c)
    })
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'zh-CN'))
}

function makeWhere(status, category, keyword) {
  const where = {}
  if (status) where.status = status
  if (category && category !== 'all') where.category = category
  const kw = keyword ? String(keyword).trim() : ''
  if (kw) where.title = new RegExp(kw, 'i')
  return where
}

function hideBody(doc) {
  const rest = { ...doc }
  delete rest.content
  return rest
}

module.exports = {
  /* 公开知识库列表（法律库使用，只返回已上线，列表不包含正文） */
  async listPublic({ category = 'all', keyword = '', page = 1, pageSize = 50 } = {}) {
    const table = db.collection('legal_doc')
    const where = makeWhere('已上线', category, keyword)
    const countRes = await table.where(where).count()
    const listRes = await table
      .where(where)
      .orderBy('createDate', 'desc')
      .skip((Number(page) - 1) * Number(pageSize))
      .limit(Number(pageSize))
      .get()
    return {
      errCode: 0,
      errMsg: '',
      list: listRes.data.map(hideBody),
      total: countRes.total
    }
  },

  /* 公开知识条目详情（法律库使用，只返回已上线） */
  async get({ id } = {}) {
    if (!id) {
      return { errCode: 'PARAM_IS_NULL', errMsg: 'id 不能为空' }
    }
    const res = await db.collection('legal_doc').where({ _id: id, status: '已上线' }).limit(1).get()
    const doc = res.data[0]
    if (!doc) {
      return { errCode: 'NOT_FOUND', errMsg: '知识条目不存在或未上线' }
    }
    return { errCode: 0, errMsg: '', doc }
  },

  /* 获取知识分类列表（用户端法律库和管理端搜索共用） */
  async getCategories({ status = '已上线' } = {}) {
    const list = await getCats(status)
    return { errCode: 0, errMsg: '', list }
  },

  /* 管理端知识库列表（需管理员 token） */
  async list({ adminToken, category = 'all', keyword = '', status = '', page = 1, pageSize = 50 } = {}) {
    const check = await checkAdmin(adminToken)
    if (check.errCode !== 0) return check
    const table = db.collection('legal_doc')
    const where = makeWhere(status, category, keyword)
    const countRes = await table.where(where).count()
    const listRes = await table
      .where(where)
      .orderBy('createDate', 'desc')
      .skip((Number(page) - 1) * Number(pageSize))
      .limit(Number(pageSize))
      .get()
    return {
      errCode: 0,
      errMsg: '',
      list: listRes.data,
      total: countRes.total
    }
  },

  /* 知识库统计（需管理员 token） */
  async stats({ adminToken } = {}) {
    const check = await checkAdmin(adminToken)
    if (check.errCode !== 0) return check
    const table = db.collection('legal_doc')
    const count = async (where = {}) => (await table.where(where).count()).total
    const categories = {}
    const categoryList = await getCats('')
    for (const name of categoryList) {
      categories[name] = await count({ category: name })
    }
    return {
      errCode: 0,
      errMsg: '',
      total: await count({}),
      online: await count({ status: '已上线' }),
      review: await count({ status: '审核中' }),
      categories
    }
  },

  /* 新增知识条目（需管理员 token） */
  async add({ adminToken, data = {} } = {}) {
    const check = await checkAdmin(adminToken)
    if (check.errCode !== 0) return check
    if (!data.title || !String(data.title).trim()) {
      return { errCode: 'PARAM_IS_NULL', errMsg: '标题不能为空' }
    }
    const category = defCat(data.category)
    const now = Date.now()
    const doc = {
      title: String(data.title).trim(),
      category,
      docType: data.docType || '',
      summary: data.summary || '',
      content: data.content || '',
      fields: toArr(data.fields),
      regions: toArr(data.regions),
      tags: toArr(data.tags),
      source: data.source || '',
      date: data.date || '',
      fileUrl: data.fileUrl || '',
      status: data.status === '已上线' ? '已上线' : '审核中',
      createDate: now,
      updateDate: now
    }
    const addRes = await db.collection('legal_doc').add(doc)
    return { errCode: 0, errMsg: '', id: addRes.id }
  },

  /* 更新知识条目（需管理员 token） */
  async update({ adminToken, id, data = {} } = {}) {
    const check = await checkAdmin(adminToken)
    if (check.errCode !== 0) return check
    if (!id) {
      return { errCode: 'PARAM_IS_NULL', errMsg: 'id 不能为空' }
    }
    const allow = ['title', 'category', 'docType', 'summary', 'content', 'fields', 'regions', 'tags', 'source', 'date', 'fileUrl', 'status']
    const patch = {}
    for (const key of allow) {
      if (data[key] !== undefined) patch[key] = data[key]
    }
    if (patch.title !== undefined && !String(patch.title).trim()) {
      return { errCode: 'PARAM_ERROR', errMsg: '标题不能为空' }
    }
    if (patch.category !== undefined) {
      patch.category = defCat(patch.category)
    }
    if (patch.status !== undefined && !['已上线', '审核中'].includes(patch.status)) {
      return { errCode: 'PARAM_ERROR', errMsg: '状态不合法' }
    }
    if (patch.fields !== undefined) patch.fields = toArr(patch.fields)
    if (patch.regions !== undefined) patch.regions = toArr(patch.regions)
    if (patch.tags !== undefined) patch.tags = toArr(patch.tags)
    patch.updateDate = Date.now()
    await db.collection('legal_doc').doc(id).update(patch)
    return { errCode: 0, errMsg: '' }
  },

  /* 删除知识条目（需管理员 token） */
  async remove({ adminToken, id } = {}) {
    const check = await checkAdmin(adminToken)
    if (check.errCode !== 0) return check
    if (!id) {
      return { errCode: 'PARAM_IS_NULL', errMsg: 'id 不能为空' }
    }
    await db.collection('legal_doc').doc(id).remove()
    return { errCode: 0, errMsg: '' }
  },

  /* 批量导入知识条目（需管理员 token），按 #key=value 文本格式解析 */
  async batchCreate({ adminToken, text = '' } = {}) {
    const check = await checkAdmin(adminToken)
    if (check.errCode !== 0) return check
    const docs = parseDocs(text)
    if (!docs.length) {
      return { errCode: 'PARAM_IS_NULL', errMsg: '未解析到任何知识条目，请检查格式' }
    }
    if (docs.length > 50) {
      // 一次塞太多会把云函数跑超时，之前试过 200 条直接报超时，就先限制 50
      return { errCode: 'PARAM_ERROR', errMsg: `共 ${docs.length} 条，超出单次 50 条上限，请分批导入` }
    }
    const now = Date.now()
    const toAdd = docs.map(d => ({
      title: d.title,
      category: defCat(d.category),
      docType: d.docType || '',
      summary: d.summary || '',
      content: d.content,
      fields: [],
      regions: d.regions,
      tags: d.tags,
      source: d.source || '',
      date: d.date || '',
      fileUrl: '',
      status: '已上线',
      createDate: now,
      updateDate: now
    }))
    const res = await db.collection('legal_doc').add(toAdd)
    return { errCode: 0, errMsg: '', count: toAdd.length, ids: res.idList || [] }
  }
}

// 解析批量导入文本：多条文档，每条以 #title= 开头，#key=value 为元数据，其余行拼为正文
function parseDocs(text) {
  const lines = String(text || '').split(/\r?\n/)
  const docs = []
  let cur = null
  for (const line of lines) {
    const m = line.match(/^#([a-zA-Z]+)\s*=\s*(.*)$/)
    if (m) {
      const key = m[1].trim()
      const val = m[2].trim()
      if (key === 'title') {
        cur = { title: val, meta: {}, body: [] }
        docs.push(cur)
      } else if (cur) {
        cur.meta[key] = val
      }
      continue
    }
    if (cur) cur.body.push(line)
  }
  return docs
    .map(d => ({
      title: (d.title || '').trim(),
      category: (d.meta.category || '').trim() || '综合',
      docType: (d.meta.docType || '').trim(),
      source: (d.meta.source || '').trim(),
      date: (d.meta.date || '').trim(),
      regions: toArr(d.meta.regions),
      tags: toArr(d.meta.tags),
      summary: (d.meta.summary || '').trim(),
      content: d.body.join('\n').replace(/\n{3,}/g, '\n\n').trim()
    }))
    .filter(d => d.title)
}

// 管理员鉴权（与 resources/questions 云对象一致）
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
