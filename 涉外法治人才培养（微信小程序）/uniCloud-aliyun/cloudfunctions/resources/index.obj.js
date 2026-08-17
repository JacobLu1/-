// 云对象：学习资源管理（网页端管理后台 + 小程序学习中心共用）
// 调用方式：
//   const resourcesObj = uniCloud.importObject('resources')
//   await resourcesObj.list({ adminToken, type: 'video'|'vocabulary'|'reading'|'listening'|'all', category, keyword, lang })
//   await resourcesObj.listPublic({ type: 'video'|'vocabulary'|'reading'|'listening'|'all', category, keyword, lang })
//   await resourcesObj.get({ id })
//   方法：list / listPublic / get / add / update / remove / batchCreateVocabulary
// 返回统一结构：{ errCode: 0 成功 | 非0 失败, errMsg, ... }

const db = uniCloud.database()

const RESOURCE_TYPES = ['video', 'vocabulary', 'reading', 'listening']
const RESOURCE_LANGS = ['英语', '德语', '法语', '拉丁语', '西班牙语']
const MAX_QUERY_LIMIT = 500

async function fetchAllByPage(query, countQuery) {
  const countRes = await (countQuery || query).count()
  const total = countRes.total || 0
  const pageCount = Math.ceil(total / MAX_QUERY_LIMIT)
  if (pageCount <= 0) return []
  const results = await Promise.all(
    Array.from({ length: pageCount }, (_, index) => (
      query.skip(index * MAX_QUERY_LIMIT).limit(MAX_QUERY_LIMIT).get()
    ))
  )
  return results.reduce((all, res) => all.concat(res.data), [])
}

function normalizeQuestions(value) {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => {
      const options = Array.isArray(item.options)
        ? item.options.map((opt) => String(opt || '').trim()).filter(Boolean)
        : []
      return {
        type: item.type === 'multi' ? 'multi' : 'single',
        stem: String(item.stem || '').trim(),
        options,
        answer: item.answer
      }
    })
    .filter((item) => item.stem)
}

function splitTags(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || '').trim()).filter(Boolean)
  }
  return String(value || '')
    .split(/[,，、]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function buildWhere({ type = 'all', category = '', keyword = '', lang = '', status = '' } = {}) {
  const where = {}
  if (status) where.status = status
  if (type && type !== 'all') where.type = type
  if (category && category !== 'all') where.cat = category
  if (lang && lang !== 'all') where.lang = lang
  const kw = String(keyword || '').trim()
  if (kw) where.title = new RegExp(kw, 'i')
  return where
}

module.exports = {
  /**
   * 资源列表（需管理员 token）
   * @param {string} type video | vocabulary | reading | listening | all
   */
  async list({ adminToken, type = 'all', category = '', keyword = '', lang = '' } = {}) {
    const check = await checkAdmin(adminToken)
    if (check.errCode !== 0) return check

    const table = db.collection('resource')
    const where = buildWhere({ type, category, keyword, lang })
    const query = table
      .where(where)
      .orderBy('sortOrder', 'asc')
      .orderBy('createDate', 'desc')
    const list = await fetchAllByPage(query, table.where(where))
    return { errCode: 0, errMsg: '', list }
  },

  /**
   * 公开资源列表（学习中心使用，只返回已上线）
   * @param {string} type video | vocabulary | reading | listening | all
   */
  async listPublic({ type = 'all', category = '', keyword = '', lang = '' } = {}) {
    const table = db.collection('resource')
    const where = buildWhere({ type, category, keyword, lang, status: '已上线' })
    const query = table
      .where(where)
      .orderBy('sortOrder', 'asc')
      .orderBy('createDate', 'desc')
    const list = await fetchAllByPage(query, table.where(where))
    return { errCode: 0, errMsg: '', list }
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
    if (!RESOURCE_TYPES.includes(type)) {
      return { errCode: 'PARAM_ERROR', errMsg: '资源类型不合法' }
    }
    if (type === 'vocabulary' && data.lang && !RESOURCE_LANGS.includes(data.lang)) {
      return { errCode: 'PARAM_ERROR', errMsg: '词汇语言分类不合法' }
    }
    if (!data.title || !String(data.title).trim()) {
      return { errCode: 'PARAM_IS_NULL', errMsg: '资源标题不能为空' }
    }

    const doc = {
      type,
      title: String(data.title).trim(),
      lang: data.lang || (type === 'vocabulary' ? '英语' : ''),
      cat: data.cat || '待分类',
      tagClass: data.tagClass || 'qb-type-case',
      meta: data.meta || '',
      diffClass: data.diffClass || '',
      level: data.level || '',
      cover: data.cover || '',
      fileUrl: data.fileUrl || '',
      audioUrl: data.audioUrl || '',
      content: data.content || '',
      description: data.description || '',
      questions: normalizeQuestions(data.questions),
      tags: splitTags(data.tags),
      sortOrder: Number(data.sortOrder) >= 0 ? Number(data.sortOrder) : 9999,
      date: data.date || '',
      status: data.status === '已上线' ? '已上线' : '审核中',
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

    const allow = [
      'title', 'lang', 'cat', 'tagClass', 'meta', 'diffClass', 'level', 'cover',
      'fileUrl', 'audioUrl', 'content', 'description', 'questions',
      'tags', 'sortOrder', 'date', 'status', 'statusClass'
    ]
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
    if (patch.lang !== undefined && patch.lang && !RESOURCE_LANGS.includes(patch.lang)) {
      return { errCode: 'PARAM_ERROR', errMsg: '词汇语言分类不合法' }
    }
    if (patch.questions !== undefined) patch.questions = normalizeQuestions(patch.questions)
    if (patch.tags !== undefined) patch.tags = splitTags(patch.tags)
    if (patch.sortOrder !== undefined) patch.sortOrder = Number(patch.sortOrder) >= 0 ? Number(patch.sortOrder) : 9999

    await db.collection('resource').doc(id).update(patch)
    return { errCode: 0, errMsg: '' }
  },

  /**
   * 批量导入词汇（需管理员 token）
   * @param {Array} items [{ title, description, meta, content, cat, lang }]
   *   按 title 去重（忽略已存在的词汇），单次最多 2000 条
   */
  async batchCreateVocabulary({ adminToken, items = [] } = {}) {
    const check = await checkAdmin(adminToken)
    if (check.errCode !== 0) return check
    if (!Array.isArray(items) || !items.length) {
      return { errCode: 'PARAM_IS_NULL', errMsg: '导入内容不能为空' }
    }
    if (items.length > 2000) {
      return { errCode: 'PARAM_ERROR', errMsg: '单次最多导入 2000 条' }
    }

    const docs = []
    items.forEach((raw, index) => {
      const title = String((raw && raw.title) || '').trim()
      if (!title) return
      const lang = (raw && raw.lang) || '英语'
      if (!RESOURCE_LANGS.includes(lang)) return
      docs.push({
        type: 'vocabulary',
        title,
        lang,
        cat: String((raw && raw.cat) || '').trim() || '待分类',
        tagClass: 'qb-type-case',
        meta: String((raw && raw.meta) || '').trim(),
        diffClass: '',
        level: '',
        cover: '',
        fileUrl: '',
        audioUrl: '',
        content: String((raw && raw.content) || '').trim(),
        description: String((raw && raw.description) || '').trim(),
        questions: [],
        tags: splitTags(raw && raw.tags),
        sortOrder: 9999,
        date: '',
        status: '已上线',
        statusClass: 'qb-diff-mid',
        createDate: Date.now() + index
      })
    })

    if (!docs.length) {
      return { errCode: 'PARAM_ERROR', errMsg: '没有可导入的有效词条' }
    }

    // 云端去重：按 title（忽略大小写）跳过已存在的词汇
    const existingWhere = {
      type: 'vocabulary',
      title: db.command.in(docs.map(d => d.title))
    }
    const existingQuery = db.collection('resource')
      .where(existingWhere)
      .field({ title: true })
    const existingList = await fetchAllByPage(existingQuery, db.collection('resource').where(existingWhere))
    const existingSet = new Set(existingList.map(x => String(x.title).toLowerCase()))
    const fresh = docs.filter(d => !existingSet.has(d.title.toLowerCase()))
    const skipped = docs.length - fresh.length

    if (!fresh.length) {
      return { errCode: 0, errMsg: '', added: 0, skipped }
    }

    // 阿里云版支持数组批量 add，分批写入（每批不超过 400 条）
    const MAX_BATCH = 400
    let added = 0
    for (let i = 0; i < fresh.length; i += MAX_BATCH) {
      const batch = fresh.slice(i, i + MAX_BATCH)
      await db.collection('resource').add(batch)
      added += batch.length
    }
    return { errCode: 0, errMsg: '', added, skipped }
  },

  /**
   * 删除资源（需管理员 token）
   */
  async remove({ adminToken, id, ids } = {}) {
    const check = await checkAdmin(adminToken)
    if (check.errCode !== 0) return check
    let idList = []
    if (Array.isArray(ids) && ids.length) {
      idList = ids
    } else if (id) {
      idList = [id]
    }
    if (!idList.length) {
      return { errCode: 'PARAM_IS_NULL', errMsg: 'id 不能为空' }
    }
    const res = await db.collection('resource').where({ _id: db.command.in(idList) }).remove()
    return { errCode: 0, errMsg: '', removed: res && res.deleted }
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
