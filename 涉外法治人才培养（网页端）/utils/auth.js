// 登录鉴权工具（网页端 + 小程序端共用）
// 使用：页面 onLoad / onShow / onMounted 开头调用，未登录会自动跳转登录页

export function requireLogin(redirect = '/pages/login/login') {
  const token = uni.getStorageSync('token')
  if (!token) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    setTimeout(() => {
      uni.redirectTo({ url: redirect })
    }, 600)
    return false
  }
  return true
}

export function requireAdmin(redirect = '/pages/login/login') {
  const token = uni.getStorageSync('adminToken')
  if (!token) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    setTimeout(() => {
      uni.redirectTo({ url: redirect })
    }, 600)
    return false
  }
  return true
}

export function getUserInfo() {
  try {
    return uni.getStorageSync('userInfo') || {}
  } catch (e) {
    return {}
  }
}

// 读取存储中的用户信息（普通用户 userInfo / 管理员 adminInfo）
export function getStoredUserInfo() {
  try {
    return uni.getStorageSync('userInfo') || uni.getStorageSync('adminInfo') || {}
  } catch (e) {
    return {}
  }
}

// 显示名：填了姓名显示姓名，否则显示登录账号
export function getDisplayName() {
  const u = getStoredUserInfo()
  const name = (u && u.name && String(u.name).trim()) || ''
  return name || (u && u.account) || '用户'
}

// 等级描述：有 levelText 用之，否则按角色兜底
export function getLevelText() {
  const u = getStoredUserInfo()
  if (u && u.levelText) return u.levelText
  return u && u.role === 'admin' ? '系统管理员' : '普通用户'
}
