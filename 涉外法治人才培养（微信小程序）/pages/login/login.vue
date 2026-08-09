<template>
  <view class="page-wrap">
    <!-- 状态栏安全区占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 浮动装饰球 -->
    <view class="orb orb-1"></view>
    <view class="orb orb-2"></view>
    <view class="orb orb-3"></view>

    <!-- 可滚动内容区 -->
    <scroll-view scroll-y class="screen" scroll-with-animation>
      <!-- 品牌区域 -->
      <view class="brand-section">
          <view class="brand-logo anim-logo">
            <view class="brand-logo-icon ls-svg-glyph" aria-hidden="true"></view>
          </view>
          <view class="brand-title anim-title">涉外法治人才培养</view>
          <view class="brand-subtitle anim-subtitle">专业 · 国际 · 权威</view>
        </view>

        <!-- 玻璃卡片 -->
        <view class="glass-card anim-card">
        <!-- 标签切换 -->
        <view class="tab-switcher">
          <view
            class="tab-btn"
            :class="{ 'tab-btn--active': loginType === 'account' }"
            @click="switchLoginType('account')"
          >
            账号登录
          </view>
          <view
            class="tab-btn"
            :class="{ 'tab-btn--active': loginType === 'wechat' }"
            @click="switchLoginType('wechat')"
          >
            微信登录
          </view>
          <view class="tab-indicator" :style="indicatorStyle"></view>
        </view>

        <!-- 账号登录面板 -->
        <view v-if="loginType === 'account'" class="tab-panel tab-panel--active">
          <view class="input-group">
            <view class="input-field">
              <view class="input-field-icon input-ico-phone"></view>
              <input
                class="input-field-input"
                type="text"
                v-model="phone"
                placeholder="请输入手机号"
                placeholder-class="input-placeholder"
              />
            </view>
          </view>
          <view class="input-group">
            <view class="input-field">
              <view class="input-field-icon input-ico-lock"></view>
              <input
                class="input-field-input"
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder="请输入密码"
                placeholder-class="input-placeholder"
              />
              <view class="pwd-toggle" @click="showPassword = !showPassword">
                <view :class="showPassword ? 'pwd-ico-eye-off' : 'pwd-ico-eye'"></view>
              </view>
            </view>
          </view>
          <view class="forgot-link" @click="onForgotPassword">
            <text>忘记密码？</text>
          </view>
          <view class="login-btn anim-btn" hover-class="login-btn-active" @click="handleAccountLogin">
            <text class="login-btn-text">登录</text>
          </view>
        </view>

        <!-- 微信登录面板 -->
        <view v-else class="tab-panel tab-panel--active">
          <view class="wechat-icon-area">
            <view class="wechat-icon-circle">
              <image class="wechat-icon-circle-img" src="/static/wechat-icon.svg" mode="aspectFit"></image>
            </view>
            <view class="wechat-label">微信一键登录</view>
          </view>
          <view class="wechat-btn" hover-class="wechat-btn-active" @click="handleWechatLogin">
            <text class="wechat-btn-icon-text ri-chat-3-line"></text>
            <text class="wechat-btn-text">微信登录</text>
          </view>
          <view class="wechat-note">
            <text>微信授权后将自动登录</text>
          </view>
        </view>
      </view>

      <!-- 底部区域 -->
      <view class="login-footer">
        <view class="agreement" @click="agreed = !agreed">
          <view class="custom-checkbox" :class="{ checked: agreed }">
            <text v-if="agreed" class="check-mark">✓</text>
          </view>
          <view class="agreement-text-wrap">
            <text class="agreement-text">我已阅读并同意</text>
            <text class="agreement-link" @click.stop="onUserAgreement">《用户协议》</text>
            <text class="agreement-text">和</text>
            <text class="agreement-link" @click.stop="onPrivacyPolicy">《隐私政策》</text>
          </view>
        </view>
        <view class="register-link" @click="onRegister">
          <text>还没有账号？</text>
          <text class="register-link-a">立即注册</text>
        </view>
      </view>

      <view style="height: 80rpx;"></view>
    </scroll-view>

    <!-- Toast -->
    <view class="toast" :class="{ show: showToast }">
      <text>{{ toastText }}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 0,
      loginType: 'account',
      phone: '',
      password: '',
      showPassword: false,
      agreed: false,
      showToast: false,
      toastText: ''
    }
  },
  computed: {
    indicatorStyle() {
      return {
        transform: this.loginType === 'wechat' ? 'translateX(100%)' : 'translateX(0)'
      }
    }
  },
  onLoad(options) {
    // 从注册页返回时自动回填账号
    if (options && options.account) {
      this.phone = decodeURIComponent(options.account)
    }
  },
  onReady() {
    this.statusBarHeight = this.getStatusBarHeight()
  },
  methods: {
    getStatusBarHeight() {
      try {
        return uni.getWindowInfo().statusBarHeight || 0
      } catch (e) {
        try {
          return uni.getSystemInfoSync().statusBarHeight || 0
        } catch (err) {
          return 0
        }
      }
    },
    switchLoginType(type) {
      this.loginType = type
    },
    handleAccountLogin() {
      if (!this.phone.trim()) {
        this.showToastMsg('请输入手机号')
        return
      }
      if (!this.password.trim()) {
        this.showToastMsg('请输入密码')
        return
      }
      if (!this.agreed) {
        this.showToastMsg('请先同意用户协议')
        return
      }
      // 调用 users 云对象（与网页端共用同一服务空间）
    const usersObj = uniCloud.importObject('users', { customUI: true })
      usersObj.login({ account: this.phone, password: this.password, role: 'user' })
        .then((r) => {
          r = r || {}
          if (r.errCode !== 0) {
            this.showToastMsg(r.errMsg || '登录失败')
            return
          }
          const app = getApp()
          const user = r.userInfo
          app.setLogin(user, 'account')
          uni.setStorageSync('token', r.token)
          this.showToastMsg('登录成功')
          setTimeout(() => {
            uni.switchTab({
              url: '/pages/index/index'
            })
          }, 800)
        })
        .catch((err) => {
          console.error('[login] users 云对象调用失败:', err)
          this.showToastMsg((err && err.errMsg) || '网络异常，请稍后重试')
        })
    },
    handleWechatLogin() {
      if (!this.agreed) {
        this.showToastMsg('请先同意用户协议')
        return
      }
      const app = getApp()
      // 调用微信登录获取 code
      uni.login({
        provider: 'weixin',
        success: (loginRes) => {
          const code = loginRes.code
          // 获取用户信息
          uni.getUserProfile({
            desc: '用于完善用户资料',
            success: (profileRes) => {
              const userInfo = profileRes.userInfo
              const user = {
                name: userInfo.nickName,
                avatar: userInfo.avatarUrl,
                role: '法学研究生',
                level: 'L3',
                levelText: '高级学习者',
                levelFill: 72
              }
              app.setLogin(user, 'wechat')
              app.setWechatUserInfo(userInfo)
              uni.setStorageSync('wechatCode', code)
              this.showToastMsg('微信登录成功')
              setTimeout(() => {
                uni.switchTab({
                  url: '/pages/index/index'
                })
              }, 800)
            },
            fail: () => {
              // 用户拒绝授权，使用默认信息登录
              const user = {
                name: '微信用户',
                role: '法学研究生',
                level: 'L3',
                levelText: '高级学习者',
                levelFill: 72
              }
              app.setLogin(user, 'wechat')
              uni.setStorageSync('wechatCode', code)
              this.showToastMsg('微信登录成功')
              setTimeout(() => {
                uni.switchTab({
                  url: '/pages/index/index'
                })
              }, 800)
            }
          })
        },
        fail: () => {
          this.showToastMsg('微信登录失败，请重试')
        }
      })
    },
    onForgotPassword() {
      this.showToastMsg('请联系管理员重置密码')
    },
    onRegister() {
      uni.navigateTo({ url: '/pages/register/register' })
    },
    onUserAgreement() {
      this.showToastMsg('用户协议')
    },
    onPrivacyPolicy() {
      this.showToastMsg('隐私政策')
    },
    showToastMsg(text) {
      this.toastText = text
      this.showToast = true
      setTimeout(() => {
        this.showToast = false
      }, 2200)
    }
  }
}
</script>

<style>
@import '../../static/remixicon.css';

page {
  --legal-primary: #1a56db;
  --legal-primary-50: #eff6ff;
  --legal-primary-100: #dbeafe;
  --legal-primary-200: #bfdbfe;
  --legal-primary-300: #93c5fd;
  --legal-primary-400: #60a5fa;
  --legal-primary-500: #3b82f6;
  --legal-primary-600: #2563eb;
  --legal-primary-700: #1d4ed8;
  --legal-primary-800: #1e40af;
  --legal-primary-900: #1e3a8a;
  --legal-background: #f0f6ff;
  --legal-foreground: #0f172a;
  --legal-card: #ffffff;
  --legal-muted: #e8f0fe;
  --legal-muted-foreground: #64748b;
  --legal-border: #c7d7f0;
  --legal-input: #c7d7f0;
  --legal-ring: #1a56db;
  --legal-radius-sm: 8rpx;
  --legal-radius-md: 16rpx;
  --legal-radius-lg: 32rpx;
  --state-success: #16a34a;
  --state-warning: #d97706;
  --state-error: #dc2626;
  --state-info: #2563eb;
  --wechat-green: #07c160;
}

/* ---------- Page wrap ---------- */
.page-wrap {
  min-height: 100vh;
  background: linear-gradient(165deg, var(--legal-primary-300) 0%, var(--legal-primary-500) 40%, var(--legal-primary-700) 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
page { min-height: 100vh; }

/* ---------- Status bar ---------- */
.status-bar {
  width: 100%;
  flex-shrink: 0;
  background: transparent;
}

/* ---------- Screen ---------- */
.screen {
  position: relative;
  z-index: 1;
  flex: 1;
  box-sizing: border-box;
  padding: 96rpx 0 0;
  width: 100%;
}

/* ---------- Floating Orbs ---------- */
.orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}

.orb-1 {
  width: 600rpx;
  height: 600rpx;
  background: var(--legal-primary-200);
  opacity: 0.15;
  top: -160rpx;
  right: -200rpx;
  animation: floatOrb1 10s ease-in-out infinite alternate;
}

.orb-2 {
  width: 440rpx;
  height: 440rpx;
  background: var(--legal-primary-300);
  opacity: 0.12;
  bottom: 120rpx;
  left: -160rpx;
  animation: floatOrb2 12s ease-in-out infinite alternate;
}

.orb-3 {
  width: 320rpx;
  height: 320rpx;
  background: var(--legal-primary-100);
  opacity: 0.1;
  top: 480rpx;
  left: 60rpx;
  animation: floatOrb3 8s ease-in-out infinite alternate;
}

@keyframes floatOrb1 {
  from { transform: translate(0, 0); }
  to { transform: translate(-40rpx, 80rpx); }
}

@keyframes floatOrb2 {
  from { transform: translate(0, 0); }
  to { transform: translate(60rpx, -60rpx); }
}

@keyframes floatOrb3 {
  from { transform: translate(0, 0); }
  to { transform: translate(30rpx, 50rpx); }
}

/* ---------- Brand Section ---------- */
.brand-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 56rpx;
  width: 86%;
  max-width: 620rpx;
  margin-left: auto;
  margin-right: auto;
}

.brand-logo {
  width: 128rpx;
  height: 128rpx;
  border-radius: 50%;
  background: var(--legal-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32rpx;
  box-shadow: 0 16rpx 48rpx rgba(26, 86, 219, 0.4);
}

.brand-logo-icon {
  width: 64rpx;
  height: 64rpx;
  background: #ffffff;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/%3E%3Cpath d='M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/%3E%3Cpath d='M7 21h10'/%3E%3Cpath d='M12 3v18'/%3E%3Cpath d='M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2'/%3E%3C/svg%3E") center/contain no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/%3E%3Cpath d='M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/%3E%3Cpath d='M7 21h10'/%3E%3Cpath d='M12 3v18'/%3E%3Cpath d='M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2'/%3E%3C/svg%3E") center/contain no-repeat;
}

.brand-title {
  font-size: 46rpx;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0rpx;
  text-align: center;
}

.brand-subtitle {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 12rpx;
  text-align: center;
}

/* ---------- Glass Card ---------- */
.glass-card {
  width: 86%;
  max-width: 620rpx;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(40rpx);
  -webkit-backdrop-filter: blur(40rpx);
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-radius: var(--legal-radius-lg);
  box-shadow: 0 16rpx 64rpx rgba(0, 0, 0, 0.1);
  padding: 48rpx 40rpx;
  position: relative;
  z-index: 1;
  margin-left: auto;
  margin-right: auto;
}

/* ---------- Tab Switcher ---------- */
.tab-switcher {
  position: relative;
  display: flex;
  margin-bottom: 48rpx;
  border-bottom: 2rpx solid rgba(255, 255, 255, 0.15);
}

.tab-btn {
  flex: 1;
  padding: 20rpx 0;
  text-align: center;
  font-size: 30rpx;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  transition: color 200ms ease;
}

.tab-btn--active {
  color: #ffffff;
}

.tab-indicator {
  position: absolute;
  bottom: -2rpx;
  left: 0;
  width: 50%;
  height: 6rpx;
  background: var(--legal-primary-200);
  border-radius: 4rpx 4rpx 0 0;
  transition: transform 280ms cubic-bezier(0.3, 0, 0, 1);
}

/* ---------- Tab Panels ---------- */
.tab-panel {
  display: none;
}

.tab-panel--active {
  display: block;
}

/* ---------- Form Inputs ---------- */
.input-group {
  margin-bottom: 28rpx;
}

.input-field {
  height: 96rpx;
  border-radius: var(--legal-radius-md);
  background: rgba(255, 255, 255, 0.12);
  border: 2rpx solid rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  padding: 0 28rpx;
  gap: 20rpx;
  transition: border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease;
}

.input-field-icon {
  width: 40rpx;
  height: 40rpx;
  background: rgba(255, 255, 255, 0.6);
  flex-shrink: 0;
}
.input-ico-phone {
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='14' height='20' x='5' y='2' rx='2'/%3E%3Cpath d='M12 18h.01'/%3E%3C/svg%3E") center/contain no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='14' height='20' x='5' y='2' rx='2'/%3E%3Cpath d='M12 18h.01'/%3E%3C/svg%3E") center/contain no-repeat;
}
.input-ico-lock {
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='11' x='3' y='11' rx='2' ry='2'/%3E%3Cpath d='M7 11V7a5 5 0 0 1 10 0v4'/%3E%3C/svg%3E") center/contain no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='11' x='3' y='11' rx='2' ry='2'/%3E%3Cpath d='M7 11V7a5 5 0 0 1 10 0v4'/%3E%3C/svg%3E") center/contain no-repeat;
}

.input-field-input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: 28rpx;
  height: 100%;
}

.input-placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.pwd-toggle {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  flex-shrink: 0;
}

.pwd-ico-eye,
.pwd-ico-eye-off {
  width: 40rpx;
  height: 40rpx;
  background: rgba(255, 255, 255, 0.6);
}
.pwd-ico-eye {
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3C/svg%3E") center/contain no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3C/svg%3E") center/contain no-repeat;
}
.pwd-ico-eye-off {
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24'/%3E%3Cline x1='1' y1='1' x2='23' y2='23'/%3E%3C/svg%3E") center/contain no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24'/%3E%3Cline x1='1' y1='1' x2='23' y2='23'/%3E%3C/svg%3E") center/contain no-repeat;
}

/* ---------- Forgot Link ---------- */
.forgot-link {
  display: flex;
  justify-content: flex-end;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 40rpx;
}

/* ---------- Login Button ---------- */
.login-btn {
  width: 100%;
  height: 96rpx;
  border-radius: var(--legal-radius-md);
  background: var(--legal-primary);
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 120ms ease, box-shadow 160ms ease;
}

.login-btn-active {
  transform: scale(0.99);
  box-shadow: 0 4rpx 16rpx rgba(26, 86, 219, 0.3);
}

.login-btn-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
}

/* ---------- WeChat Login Panel ---------- */
.wechat-icon-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 0 48rpx;
}

.wechat-icon-circle {
  width: 112rpx;
  height: 112rpx;
  border-radius: 50%;
  background: var(--wechat-green);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
}

.wechat-icon-circle-img {
  width: 64rpx;
  height: 64rpx;
}

.wechat-label {
  font-size: 30rpx;
  color: #ffffff;
}

.wechat-btn {
  width: 100%;
  height: 96rpx;
  border-radius: var(--legal-radius-md);
  background: var(--wechat-green);
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  transition: transform 120ms ease, box-shadow 160ms ease;
}

.wechat-btn-active {
  transform: scale(0.99);
  box-shadow: 0 4rpx 16rpx rgba(7, 193, 96, 0.3);
}

.wechat-btn-icon-text {
  font-size: 44rpx;
  color: #ffffff;
  font-family: 'remixicon' !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  line-height: 1;
}

.wechat-btn-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
}

.wechat-note {
  text-align: center;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 28rpx;
}

/* ---------- Footer ---------- */
.login-footer {
  margin-top: 56rpx;
  width: 86%;
  max-width: 620rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32rpx;
  position: relative;
  z-index: 1;
  margin-left: auto;
  margin-right: auto;
}

.agreement {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
}

.custom-checkbox {
  width: 32rpx;
  height: 32rpx;
  border-radius: 8rpx;
  border: 3rpx solid rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2rpx;
  transition: background-color 160ms ease, border-color 160ms ease;
}

.custom-checkbox.checked {
  background: var(--legal-primary);
  border-color: var(--legal-primary);
}

.check-mark {
  font-size: 22rpx;
  color: #ffffff;
  font-weight: 700;
}

.agreement-text-wrap {
  flex: 1;
}

.agreement-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

.agreement-link {
  font-size: 24rpx;
  color: var(--legal-primary-200);
  font-weight: 500;
}

.register-link {
  text-align: center;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.7);
}

.register-link-a {
  color: #ffffff;
  font-weight: 500;
}

/* ---------- Toast ---------- */
.toast {
  position: fixed;
  left: 50%;
  bottom: 336rpx;
  transform: translateX(-50%) translateY(56rpx);
  background: rgba(22, 49, 79, 0.93);
  color: #fff;
  padding: 22rpx 40rpx;
  border-radius: var(--legal-radius-lg);
  font-size: 26rpx;
  font-weight: 500;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.22s, transform 0.22s;
  z-index: 80;
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
  box-shadow: 0 40rpx 104rpx rgba(0, 0, 0, 0.28);
  white-space: nowrap;
  max-width: 84%;
}

.toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* ---------- Entrance Animations ---------- */
@keyframes fadeScaleUp {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes fadeSlideDown {
  from { opacity: 0; transform: translateY(-20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(60rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.anim-logo {
  opacity: 0;
  animation: fadeScaleUp 600ms ease-out 100ms forwards;
}

.anim-title {
  opacity: 0;
  animation: fadeSlideDown 500ms ease-out 300ms forwards;
}

.anim-subtitle {
  opacity: 0;
  animation: fadeIn 500ms ease-out 500ms forwards;
}

.anim-card {
  opacity: 0;
  animation: fadeSlideUp 500ms cubic-bezier(0.3, 0, 0, 1) 600ms forwards;
}

.anim-btn {
  opacity: 0;
  animation: fadeIn 400ms ease-out 950ms forwards;
}
</style>
