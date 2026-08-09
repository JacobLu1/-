// 云对象：用户体系（网页端 + 小程序端共用同一个服务空间）
// 云函数只在此项目维护/部署，小程序端不重复部署，直接调用即可。
//
// 调用方式（两端一致）：
//   const usersObj = uniCloud.importObject('users')
//   await usersObj.login({ account: 'user001', password: '123456', role: 'user' })
//   方法：login / register / logout / getUserInfo / list / stats / update / remove
//
// 返回统一结构：{ errCode: 0 成功 | 非0 失败, errMsg, token, userInfo }

const crypto = require('crypto')

const db = uniCloud.database()

// 默认账号：首次部署后无需手动导入即可登录
const DEFAULT_USERS = [
  {
    account: 'admin001',
    password: '123456',
    name: '管理员',
    role: 'admin',
    level: 'Lv.9',
    levelText: '系统管理员',
    phone: '13800000001'
  },
  {
    account: 'user001',
    password: '123456',
    name: '张明',
    role: 'user',
    level: 'Lv.5',
    levelText: '高级学习者',
    phone: '13800000002'
  }
]

function sha256(str) {
  return crypto.createHash('sha256').update(String(str)).digest('hex')
}

// 幂等：确保默认账号存在于 user 集合
async function ensureDefaultUsers() {
  const table = db.collection('user')
  for (const u of DEFAULT_USERS) {
    const res = await table.where({ account: u.account }).limit(1).get()
    if (res.data.length === 0) {
      const salt = crypto.randomBytes(8).toString('hex')
      await table.add({
        account: u.account,
        salt,
        password: sha256(u.password + salt),
        name: u.name,
        role: u.role,
        level: u.level,
        levelText: u.levelText,
        phone: u.phone,
        token: '',
        createDate: Date.now()
      })
    }
  }
}

function pickUserInfo(user) {
  return {
    _id: user._id,
    account: user.account,
    name: user.name || '',
    role: user.role,
    level: user.level,
    levelText: user.levelText,
    phone: user.phone || '',
    email: user.email || '',
    gender: user.gender || '',
    region: user.region || '',
    position: user.position || ''
  }
}

async function safeCount(table, where) {
  try {
    const res = where ? await table.where(where).count() : await table.count()
    return res.total || 0
  } catch (e) {
    return 0
  }
}

module.exports = {
  _before: async function () {
    // 首次调用时保证默认账号存在
    try {
      await ensureDefaultUsers()
    } catch (e) {
      // 若表不存在等异常，由具体方法返回错误
      console.error('ensureDefaultUsers error:', e)
    }
  },

  /**
   * 公开平台概览统计（首页/登录页使用，无需登录）
   */
  async overview() {
    const userTable = db.collection('user')
    const surveyTable = db.collection('survey_result')
    const questionTable = db.collection('question')
    const resourceTable = db.collection('resource')
    const knowledgeTable = db.collection('legal_doc')

    return {
      errCode: 0,
      errMsg: '',
      userCount: await safeCount(userTable),
      surveyCount: await safeCount(surveyTable),
      questionCount: await safeCount(questionTable),
      resourceCount: await safeCount(resourceTable, { status: '已上线' }),
      knowledgeCount: await safeCount(knowledgeTable, { status: '已上线' })
    }
  },

  /**
   * 账号密码登录
   * @param {string} account 账号（网页端即账号，小程序端传入手机号）
   * @param {string} password 密码
   * @param {string} role 期望角色 user | admin（不匹配则拒绝）
   */
  async login({ account, password, role = 'user' } = {}) {
    if (!account || !password) {
      return { errCode: 'PARAM_IS_NULL', errMsg: '账号或密码不能为空' }
    }
    // 支持按账号或手机号登录（网页端输账号，小程序端输手机号）
    const res = await db.collection('user').where({
      $or: [{ account }, { phone: account }]
    }).limit(1).get()
    const user = res.data[0]
    if (!user) {
      return { errCode: 'USER_NOT_EXIST', errMsg: '账号不存在或密码错误' }
    }
    if (sha256(password + user.salt) !== user.password) {
      return { errCode: 'PASSWORD_ERROR', errMsg: '账号不存在或密码错误' }
    }
    if (role === 'admin' && user.role !== 'admin') {
      return { errCode: 'ROLE_ERROR', errMsg: '该账号无管理员权限' }
    }

    const token = crypto.randomBytes(24).toString('hex')
    await db.collection('user').doc(user._id).update({ token, lastLoginDate: Date.now() })

    return { errCode: 0, errMsg: '', token, userInfo: pickUserInfo(user) }
  },

  /**
   * 注册新用户
   */
  async register({ account, password, name = '', phone = '' } = {}) {
    if (!account || !password) {
      return { errCode: 'PARAM_IS_NULL', errMsg: '账号或密码不能为空' }
    }
    if (String(password).length < 6) {
      return { errCode: 'PASSWORD_TOO_SHORT', errMsg: '密码至少 6 位' }
    }
    const existed = await db.collection('user').where({ account }).limit(1).get()
    if (existed.data.length > 0) {
      return { errCode: 'ACCOUNT_EXIST', errMsg: '该账号已存在' }
    }

    const salt = crypto.randomBytes(8).toString('hex')
    const addRes = await db.collection('user').add({
      account,
      salt,
      password: sha256(password + salt),
      name: name || '',
      role: 'user',
      level: 'Lv.1',
      levelText: '初级学习者',
      phone: phone || '',
      token: '',
      createDate: Date.now()
    })

    const res = await db.collection('user').doc(addRes.id).get()
    const user = res.data[0]
    const token = crypto.randomBytes(24).toString('hex')
    await db.collection('user').doc(user._id).update({ token, lastLoginDate: Date.now() })

    return { errCode: 0, errMsg: '', token, userInfo: pickUserInfo(user) }
  },

  /**
   * 退出登录（清空 token）
   */
  async logout({ token } = {}) {
    if (token) {
      await db.collection('user').where({ token }).update({ token: '' })
    }
    return { errCode: 0, errMsg: '' }
  },

  /**
   * 根据 token 获取当前用户
   */
  async getUserInfo({ token } = {}) {
    if (!token) {
      return { errCode: 'NO_TOKEN', errMsg: '未登录' }
    }
    const res = await db.collection('user').where({ token }).limit(1).get()
    const user = res.data[0]
    if (!user) {
      return { errCode: 'TOKEN_INVALID', errMsg: '登录已失效' }
    }
    return { errCode: 0, errMsg: '', userInfo: pickUserInfo(user) }
  },

  /**
   * 用户自助更新个人信息（根据当前 token 定位用户）
   * @param {object} data 白名单字段：name / phone / email / gender / region / position（均选填）
   */
  async updateProfile({ token, data = {} } = {}) {
    if (!token) {
      return { errCode: 'NO_TOKEN', errMsg: '未登录' }
    }
    const res = await db.collection('user').where({ token }).limit(1).get()
    const user = res.data[0]
    if (!user) {
      return { errCode: 'TOKEN_INVALID', errMsg: '登录已失效' }
    }

    const allow = ['name', 'phone', 'email', 'gender', 'region', 'position']
    const patch = {}
    for (const key of allow) {
      if (data[key] !== undefined) patch[key] = String(data[key]).trim()
    }
    if (patch.phone && !/^1\d{10}$/.test(patch.phone)) {
      return { errCode: 'PHONE_ERROR', errMsg: '手机号格式不正确' }
    }
    if (patch.email && !/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(patch.email)) {
      return { errCode: 'EMAIL_ERROR', errMsg: '邮箱格式不正确' }
    }

    await db.collection('user').doc(user._id).update(patch)
    const after = await db.collection('user').doc(user._id).get()
    return { errCode: 0, errMsg: '', userInfo: pickUserInfo(after.data[0]) }
  },

  /**
   * 修改密码（根据当前 token 定位用户，需校验旧密码）
   * @param {string} token 当前登录 token
   * @param {string} oldPassword 旧密码
   * @param {string} newPassword 新密码（至少 6 位）
   */
  async changePassword({ token, oldPassword, newPassword } = {}) {
    if (!token) {
      return { errCode: 'NO_TOKEN', errMsg: '未登录' }
    }
    if (!oldPassword || !newPassword) {
      return { errCode: 'PARAM_IS_NULL', errMsg: '旧密码或新密码不能为空' }
    }
    if (String(newPassword).length < 6) {
      return { errCode: 'PASSWORD_TOO_SHORT', errMsg: '新密码至少 6 位' }
    }
    const res = await db.collection('user').where({ token }).limit(1).get()
    const user = res.data[0]
    if (!user) {
      return { errCode: 'TOKEN_INVALID', errMsg: '登录已失效' }
    }
    if (sha256(String(oldPassword) + user.salt) !== user.password) {
      return { errCode: 'OLD_PASSWORD_ERROR', errMsg: '当前密码不正确' }
    }
    // 换新盐再哈希，防止旧哈希直接复用
    const newSalt = crypto.randomBytes(8).toString('hex')
    await db.collection('user').doc(user._id).update({
      salt: newSalt,
      password: sha256(String(newPassword) + newSalt)
    })
    return { errCode: 0, errMsg: '' }
  },

  /**
   * 用户列表（需管理员 token）
   */
  async list({ adminToken, page = 1, pageSize = 10, keyword = '', role = '' } = {}) {
    const check = await checkAdmin(adminToken)
    if (check.errCode !== 0) return check

    const table = db.collection('user')
    const conds = []
    if (keyword) {
      conds.push({ $or: [{ account: new RegExp(keyword) }, { name: new RegExp(keyword) }, { phone: new RegExp(keyword) }] })
    }
    if (role && ['user', 'admin'].includes(role)) {
      conds.push({ role })
    }
    const where = conds.length ? { $and: conds } : {}

    const totalRes = await table.where(where).count()
    const listRes = await table
      .where(where)
      .orderBy('createDate', 'desc')
      .skip((Number(page) - 1) * Number(pageSize))
      .limit(Number(pageSize))
      .get()

    const list = listRes.data.map((u) => ({
      ...pickUserInfo(u),
      createDate: u.createDate || '',
      lastLoginDate: u.lastLoginDate || ''
    }))

    return { errCode: 0, errMsg: '', list, total: totalRes.total }
  },

  /**
   * 用户统计（需管理员 token）：总数 / 普通用户 / 管理员 / 本周新增
   */
  async stats({ adminToken } = {}) {
    const check = await checkAdmin(adminToken)
    if (check.errCode !== 0) return check

    const table = db.collection('user')
    const totalRes = await table.count()
    const userRes = await table.where({ role: 'user' }).count()
    const adminRes = await table.where({ role: 'admin' }).count()
    const weekStart = Date.now() - 7 * 24 * 3600 * 1000
    const weekRes = await table.where({ createDate: db.command.gte(weekStart) }).count()

    return {
      errCode: 0,
      errMsg: '',
      total: totalRes.total,
      userCount: userRes.total,
      adminCount: adminRes.total,
      weekNewCount: weekRes.total
    }
  },

  /**
   * 更新用户信息（需管理员 token）
   */
  async update({ adminToken, userId, data = {} } = {}) {
    const check = await checkAdmin(adminToken)
    if (check.errCode !== 0) return check
    if (!userId) {
      return { errCode: 'PARAM_IS_NULL', errMsg: 'userId 不能为空' }
    }

    const allow = ['name', 'role', 'level', 'levelText', 'phone']
    const patch = {}
    for (const key of allow) {
      if (data[key] !== undefined) patch[key] = data[key]
    }
    if (patch.role && !['user', 'admin'].includes(patch.role)) {
      return { errCode: 'ROLE_ERROR', errMsg: '角色不合法' }
    }

    await db.collection('user').doc(userId).update(patch)
    return { errCode: 0, errMsg: '' }
  },

  /**
   * 删除用户（需管理员 token，不能删除自己）
   */
  async remove({ adminToken, userId } = {}) {
    const check = await checkAdmin(adminToken)
    if (check.errCode !== 0) return check
    if (!userId) {
      return { errCode: 'PARAM_IS_NULL', errMsg: 'userId 不能为空' }
    }
    if (userId === check.user._id) {
      return { errCode: 'FORBIDDEN', errMsg: '不能删除当前登录账号' }
    }
    await db.collection('user').doc(userId).remove()
    return { errCode: 0, errMsg: '' }
  }
}

// 管理员鉴权：校验 adminToken 且角色为 admin
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
