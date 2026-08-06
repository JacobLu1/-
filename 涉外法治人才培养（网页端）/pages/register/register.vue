<template>
  <view class="register-page">
    <view class="stage">
      <!-- 背景层 -->
      <view class="bg-mesh"></view>
      <view class="bg-grid"></view>
      <view class="bg-blob blob-a"></view>
      <view class="bg-blob blob-b"></view>

      <!-- 顶部品牌 -->
      <view class="brand-row">
        <view class="brand-mark">
          <view class="brand-icon"></view>
        </view>
        <view class="brand-name">
          <text class="brand-name-cn">涉外法治人才培养平台</text>
          <text class="brand-name-en">Rule of Law · Global Talent Cultivation</text>
        </view>
      </view>

      <!-- 注册卡片 -->
      <main class="panel">
        <view class="card">
          <view class="c-head">
            <text class="c-head-title">创建账号</text>
            <text class="c-head-sub">注册后即可开始涉外法治胜任力测评</text>
          </view>

          <view class="c-form">
            <view class="c-field">
              <text class="c-label">登录账号 <text class="c-required">*</text></text>
              <input class="c-input" v-model="account" placeholder="请输入登录账号" />
            </view>
            <view class="c-field">
              <text class="c-label">姓名</text>
              <input class="c-input" v-model="name" placeholder="请输入姓名（选填）" />
            </view>
            <view class="c-field">
              <text class="c-label">手机号</text>
              <input class="c-input" type="number" v-model="phone" placeholder="选填，可用手机号登录" maxlength="11" />
            </view>
            <view class="c-field">
              <text class="c-label">密码 <text class="c-required">*</text></text>
              <input class="c-input" :type="showPwd ? 'text' : 'password'" v-model="password" placeholder="至少 6 位" />
            </view>
            <view class="c-field">
              <text class="c-label">确认密码 <text class="c-required">*</text></text>
              <input class="c-input" :type="showPwd ? 'text' : 'password'" v-model="confirmPwd" placeholder="再次输入密码" />
            </view>

            <view class="c-row">
              <view class="c-check" :class="{ 'is-checked': agreed }" @tap="agreed = !agreed">
                <text v-if="agreed" class="c-check-mark">✓</text>
              </view>
              <text class="c-row-text">我已阅读并同意《用户协议》和《隐私政策》</text>
            </view>

            <view class="c-btn" @tap="handleRegister">
              <text>{{ submitText }}</text>
            </view>

            <view class="c-foot">
              <text class="c-foot-text">已有账号？</text>
              <text class="c-foot-link" @tap="goLogin">返回登录</text>
            </view>
          </view>
        </view>
      </main>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      account: '',
      name: '',
      phone: '',
      password: '',
      confirmPwd: '',
      showPwd: false,
      agreed: false,
      submitText: '注 册'
    }
  },
  methods: {
    goLogin() {
      uni.navigateBack({
        fail: () => { uni.redirectTo({ url: '/pages/login/login' }) }
      })
    },
    handleRegister() {
      const account = this.account.trim()
      const password = this.password
      const phone = this.phone.trim()

      if (!account) {
        uni.showToast({ title: '请输入登录账号', icon: 'none' })
        return
      }
      if (!password) {
        uni.showToast({ title: '请输入密码', icon: 'none' })
        return
      }
      if (password.length < 6) {
        uni.showToast({ title: '密码至少 6 位', icon: 'none' })
        return
      }
      if (password !== this.confirmPwd) {
        uni.showToast({ title: '两次输入的密码不一致', icon: 'none' })
        return
      }
      if (phone && !/^1\d{10}$/.test(phone)) {
        uni.showToast({ title: '手机号格式不正确', icon: 'none' })
        return
      }
      if (!this.agreed) {
        uni.showToast({ title: '请先同意用户协议', icon: 'none' })
        return
      }

      this.submitText = '提交中...'
      const usersObj = uniCloud.importObject('users')
      usersObj.register({ account, password, name: this.name.trim(), phone })
        .then((r) => {
          r = r || {}
          if (r.errCode !== 0) {
            uni.showToast({ title: r.errMsg || '注册失败', icon: 'none' })
            this.submitText = '注 册'
            return
          }
          uni.showToast({ title: '注册成功，请登录', icon: 'success' })
          setTimeout(() => {
            uni.redirectTo({ url: '/pages/login/login?account=' + encodeURIComponent(account) })
          }, 900)
        })
        .catch((err) => {
          console.error('[register] users 云对象调用失败:', err)
          uni.showToast({ title: (err && err.errMsg) || '网络异常，请稍后重试', icon: 'none' })
          this.submitText = '注 册'
        })
    }
  }
}
</script>

<style scoped>
/* ============ 设计令牌 ============ */
.register-page {
  --blue-500: #3B82F6;
  --blue-600: #2563EB;
  --blue-700: #1D4ED8;
  --blue-900: #0B2545;
  --blue-tint: #DBEAFE;
  --line: #CBD9EF;
  --ink-400: #5B7BA8;
  --ink-500: #3E5C84;
  --card: #FFFFFF;
  --danger: #DC2626;
}

.stage {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(160deg, #F2F8FF 0%, #E3EFFD 45%, #D4E6FB 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 56px 24px 48px;
}

/* ============ 背景层 ============ */
.bg-mesh {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(37, 99, 235, 0.08) 1px, transparent 1px);
  background-size: 26px 26px;
  pointer-events: none;
}
.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(37, 99, 235, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37, 99, 235, 0.05) 1px, transparent 1px);
  background-size: 64px 64px;
  pointer-events: none;
}
.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
}
.blob-a {
  width: 480px;
  height: 480px;
  left: -140px;
  top: -140px;
  background: rgba(59, 130, 246, 0.35);
}
.blob-b {
  width: 420px;
  height: 420px;
  right: -120px;
  bottom: -120px;
  background: rgba(96, 165, 250, 0.30);
}

/* ============ 顶部品牌 ============ */
.brand-row {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 40px;
}
.brand-mark {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--blue-500), var(--blue-700));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.35);
}
.brand-icon {
  width: 24px;
  height: 24px;
  border: 2px solid #fff;
  border-radius: 50%;
  position: relative;
}
.brand-icon::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
}
.brand-name {
  display: flex;
  flex-direction: column;
}
.brand-name-cn {
  font-size: 20px;
  font-weight: 700;
  color: var(--blue-900);
  letter-spacing: 1px;
}
.brand-name-en {
  font-size: 12px;
  color: var(--ink-400);
  letter-spacing: 0.5px;
  margin-top: 2px;
}

/* ============ 注册卡片 ============ */
.panel {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 460px;
}
.card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 36px 40px 32px;
  box-shadow: 0 20px 60px rgba(11, 37, 69, 0.10);
}
.c-head {
  margin-bottom: 28px;
}
.c-head-title {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: var(--blue-900);
}
.c-head-sub {
  display: block;
  margin-top: 8px;
  font-size: 13px;
  color: var(--ink-500);
}

.c-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.c-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.c-label {
  font-size: 13px;
  color: var(--ink-500);
  font-weight: 500;
}
.c-required {
  color: var(--danger);
}
.c-input {
  height: 44px;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 0 14px;
  font-size: 14px;
  color: var(--blue-900);
  background: #FBFDFF;
  outline: none;
}
.c-input:focus {
  border-color: var(--blue-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
}

.c-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
}
.c-check {
  width: 16px;
  height: 16px;
  border: 1px solid var(--blue-500);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}
.c-check.is-checked {
  background: var(--blue-600);
  border-color: var(--blue-600);
}
.c-check-mark {
  color: #fff;
  font-size: 11px;
  line-height: 1;
}
.c-row-text {
  font-size: 12px;
  color: var(--ink-400);
}

.c-btn {
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--blue-500), var(--blue-700));
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.35);
  margin-top: 4px;
}
.c-btn text {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 4px;
}
.c-btn:active {
  transform: translateY(1px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.30);
}

.c-foot {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-top: 20px;
  font-size: 13px;
}
.c-foot-text {
  color: var(--ink-400);
}
.c-foot-link {
  color: var(--blue-600);
  font-weight: 500;
  cursor: pointer;
}
</style>
