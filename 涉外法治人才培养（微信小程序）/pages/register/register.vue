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
        <view class="brand-logo">
          <view class="brand-logo-icon ls-svg-glyph" aria-hidden="true"></view>
        </view>
        <view class="brand-title">涉外法治人才培养</view>
        <view class="brand-subtitle">注册后即可开始胜任力测评</view>
      </view>

      <!-- 玻璃卡片 -->
      <view class="glass-card">
        <view class="card-title">创建账号</view>

        <view class="form-field">
          <text class="form-label">登录账号 <text class="required">*</text></text>
          <input class="form-input" v-model="account" type="text" placeholder="请输入登录账号" placeholder-class="input-placeholder" />
        </view>
        <view class="form-field">
          <text class="form-label">姓名</text>
          <input class="form-input" v-model="name" type="text" placeholder="请输入姓名（选填）" placeholder-class="input-placeholder" />
        </view>
        <view class="form-field">
          <text class="form-label">手机号</text>
          <input class="form-input" v-model="phone" type="number" maxlength="11" placeholder="选填，可用手机号登录" placeholder-class="input-placeholder" />
        </view>
        <view class="form-field">
          <text class="form-label">密码 <text class="required">*</text></text>
          <input class="form-input" :type="showPwd ? 'text' : 'password'" v-model="password" placeholder="至少 6 位" placeholder-class="input-placeholder" />
        </view>
        <view class="form-field">
          <text class="form-label">确认密码 <text class="required">*</text></text>
          <input class="form-input" :type="showPwd ? 'text' : 'password'" v-model="confirmPwd" placeholder="再次输入密码" placeholder-class="input-placeholder" />
        </view>

        <view class="agree-row" @click="agreed = !agreed">
          <view class="custom-checkbox" :class="{ checked: agreed }">
            <text v-if="agreed" class="check-mark">✓</text>
          </view>
          <text class="agree-text">我已阅读并同意《用户协议》和《隐私政策》</text>
        </view>

        <view class="reg-btn" hover-class="reg-btn-active" @click="handleRegister">
          <text class="reg-btn-text">{{ submitText }}</text>
        </view>

        <view class="back-row" @click="goLogin">
          <text class="back-text">已有账号？</text>
          <text class="back-link">返回登录</text>
        </view>
      </view>

      <view style="height: 80rpx;"></view>
    </scroll-view>

    <!-- Toast -->
    <view v-if="toastVisible" class="toast-mask">
      <view class="toast-box">
        <view class="toast-icon">
          <text>{{ toastIcon }}</text>
        </view>
        <text class="toast-msg">{{ toastMsg }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 20,
      account: '',
      name: '',
      phone: '',
      password: '',
      confirmPwd: '',
      showPwd: false,
      agreed: false,
      submitText: '注 册',
      toastVisible: false,
      toastMsg: '',
      toastIcon: ''
    }
  },
  onLoad() {
    try {
      const info = uni.getSystemInfoSync()
      this.statusBarHeight = info.statusBarHeight || 20
    } catch (e) {}
  },
  methods: {
    showToastMsg(msg, icon) {
      this.toastMsg = msg
      this.toastIcon = icon || '✓'
      this.toastVisible = true
      setTimeout(() => {
        this.toastVisible = false
      }, 1800)
    },
    goLogin() {
      uni.navigateBack({
        fail: () => {
          uni.redirectTo({ url: '/pages/login/login' })
        }
      })
    },
    handleRegister() {
      const account = this.account.trim()
      const password = this.password
      const phone = this.phone.trim()

      if (!account) {
        this.showToastMsg('请输入登录账号')
        return
      }
      if (!password) {
        this.showToastMsg('请输入密码')
        return
      }
      if (password.length < 6) {
        this.showToastMsg('密码至少 6 位')
        return
      }
      if (password !== this.confirmPwd) {
        this.showToastMsg('两次输入的密码不一致')
        return
      }
      if (phone && !/^1\d{10}$/.test(phone)) {
        this.showToastMsg('手机号格式不正确')
        return
      }
      if (!this.agreed) {
        this.showToastMsg('请先同意用户协议')
        return
      }

      this.submitText = '提交中...'
      const usersObj = uniCloud.importObject('users', { customUI: true })
      usersObj.register({ account, password, name: this.name.trim(), phone })
        .then((r) => {
          r = r || {}
          if (r.errCode !== 0) {
            this.showToastMsg(r.errMsg || '注册失败')
            this.submitText = '注 册'
            return
          }
          this.showToastMsg('注册成功，请登录')
          setTimeout(() => {
            uni.redirectTo({ url: '/pages/login/login?account=' + encodeURIComponent(account) })
          }, 1200)
        })
        .catch((err) => {
          console.error('[register] users 云对象调用失败:', err)
          this.showToastMsg((err && err.errMsg) || '网络异常，请稍后重试')
          this.submitText = '注 册'
        })
    }
  }
}
</script>

<style scoped>
.page-wrap {
  --legal-primary-200: #bfdbfe;
  --legal-primary-300: #93c5fd;
  --legal-primary-500: #3b82f6;
  --legal-primary-700: #1d4ed8;
  min-height: 100vh;
  background: linear-gradient(165deg, #93c5fd 0%, #3b82f6 40%, #1d4ed8 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
page { min-height: 100vh; }

.status-bar { width: 100%; }

.orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}
.orb-1 {
  width: 600rpx;
  height: 600rpx;
  background: #bfdbfe;
  opacity: 0.15;
  top: -160rpx;
  right: -200rpx;
  animation: floatOrb1 10s ease-in-out infinite alternate;
}
.orb-2 {
  width: 420rpx;
  height: 420rpx;
  background: #dbeafe;
  opacity: 0.12;
  bottom: 8%;
  left: -160rpx;
  animation: floatOrb2 12s ease-in-out infinite alternate;
}
.orb-3 {
  width: 160rpx;
  height: 160rpx;
  background: #eff6ff;
  opacity: 0.18;
  top: 30%;
  left: 12%;
  animation: floatOrb3 8s ease-in-out infinite alternate;
}
@keyframes floatOrb1 {
  from { transform: translate(0, 0) scale(1); }
  to { transform: translate(-40rpx, 40rpx) scale(1.1); }
}
@keyframes floatOrb2 {
  from { transform: translate(0, 0) scale(1); }
  to { transform: translate(30rpx, -30rpx) scale(1.08); }
}
@keyframes floatOrb3 {
  from { transform: translate(0, 0); }
  to { transform: translate(20rpx, 20rpx); }
}

.screen {
  position: relative;
  z-index: 1;
  height: calc(100vh - 44px);
}

/* ============ 品牌区域 ============ */
.brand-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60rpx;
  margin-bottom: 48rpx;
}
.brand-logo {
  width: 136rpx;
  height: 136rpx;
  border-radius: 36rpx;
  background: rgba(255, 255, 255, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.15);
}
.brand-logo-icon {
  width: 72rpx;
  height: 72rpx;
  background: var(--legal-primary-700);
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/%3E%3Cpath d='M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/%3E%3Cpath d='M7 21h10'/%3E%3Cpath d='M12 3v18'/%3E%3Cpath d='M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2'/%3E%3C/svg%3E") center/contain no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/%3E%3Cpath d='M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/%3E%3Cpath d='M7 21h10'/%3E%3Cpath d='M12 3v18'/%3E%3Cpath d='M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2'/%3E%3C/svg%3E") center/contain no-repeat;
}
.brand-title {
  margin-top: 24rpx;
  font-size: 40rpx;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 2rpx;
}
.brand-subtitle {
  margin-top: 10rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

/* ============ 玻璃卡片 ============ */
.glass-card {
  width: 86%;
  max-width: 620rpx;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(40rpx);
  -webkit-backdrop-filter: blur(40rpx);
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 32rpx;
  box-shadow: 0 16rpx 64rpx rgba(0, 0, 0, 0.1);
  padding: 44rpx 40rpx 36rpx;
  box-sizing: border-box;
}
.card-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 32rpx;
}

.form-field {
  margin-bottom: 26rpx;
}
.form-label {
  display: block;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 12rpx;
}
.required {
  color: #FFE4A8;
}
.form-input {
  height: 88rpx;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 20rpx;
  padding: 0 28rpx;
  font-size: 28rpx;
  color: #0b2545;
  box-sizing: border-box;
}
.input-placeholder {
  color: #9db4d5;
}

.agree-row {
  display: flex;
  align-items: center;
  margin: 4rpx 0 30rpx;
}
.custom-checkbox {
  width: 34rpx;
  height: 34rpx;
  border: 2rpx solid #ffffff;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14rpx;
  flex-shrink: 0;
  box-sizing: border-box;
}
.custom-checkbox.checked {
  background: #ffffff;
  border-color: #ffffff;
}
.check-mark {
  color: #2563eb;
  font-size: 22rpx;
  font-weight: 700;
}
.agree-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.85);
}

.reg-btn {
  height: 92rpx;
  border-radius: 46rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12rpx 36rpx rgba(0, 0, 0, 0.15);
}
.reg-btn-active {
  transform: scale(0.98);
}
.reg-btn-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #2563eb;
  letter-spacing: 4rpx;
}

.back-row {
  display: flex;
  justify-content: center;
  margin-top: 30rpx;
}
.back-text {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.7);
}
.back-link {
  font-size: 26rpx;
  color: #ffffff;
  font-weight: 500;
}

/* ============ Toast ============ */
.toast-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  pointer-events: none;
}
.toast-box {
  background: rgba(0, 0, 0, 0.75);
  border-radius: 20rpx;
  padding: 36rpx 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 70%;
}
.toast-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18rpx;
}
.toast-icon text {
  color: #ffffff;
  font-size: 32rpx;
}
.toast-msg {
  color: #ffffff;
  font-size: 26rpx;
  text-align: center;
}
</style>
