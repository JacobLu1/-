<template>
  <view class="ep-page">
    <view class="sticky-top">
      <!-- 状态栏安全区占位 -->
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
      <!-- 自定义导航栏 -->
      <view class="ep-nav">
        <view class="ep-back" hover-class="ep-back-hover" @click="goBack">
          <text class="ep-back-arrow">‹</text>
          <text>返回</text>
        </view>
        <text class="ep-nav-title">编辑资料</text>
        <view class="ep-nav-right"></view>
      </view>
    </view>

    <view class="ep-scroll">
      <!-- 账号信息卡（只读） -->
      <view class="ep-card">
        <view class="ep-avatar">
          <text>{{ avatarText }}</text>
        </view>
        <view class="ep-account-info">
          <view class="ep-account">{{ account || '未登录' }}</view>
          <view class="ep-level">{{ levelText || level || '暂无等级' }}</view>
        </view>
      </view>

      <!-- 资料表单卡 -->
      <view class="ep-form">
        <view class="ep-field">
          <text class="ep-label">姓名</text>
          <input class="ep-input" v-model="form.name" placeholder="请输入姓名" placeholder-class="ep-placeholder" />
        </view>

        <view class="ep-field">
          <text class="ep-label">性别</text>
          <view class="ep-gender-row">
            <view
              class="ep-chip"
              :class="{ 'is-active': form.gender === g }"
              v-for="g in GENDERS"
              :key="g"
              hover-class="ep-chip-hover"
              @click="form.gender = g"
            >{{ g }}</view>
          </view>
        </view>

        <view class="ep-field">
          <text class="ep-label">手机号</text>
          <input class="ep-input" type="number" v-model="form.phone" maxlength="11" placeholder="请输入手机号" placeholder-class="ep-placeholder" />
        </view>

        <view class="ep-field">
          <text class="ep-label">邮箱</text>
          <input class="ep-input" type="text" v-model="form.email" placeholder="请输入邮箱（选填）" placeholder-class="ep-placeholder" />
        </view>

        <view class="ep-field">
          <text class="ep-label">所在地区</text>
          <input class="ep-input" type="text" v-model="form.region" placeholder="如：北京市 / 上海市（选填）" placeholder-class="ep-placeholder" />
        </view>

        <view class="ep-field">
          <text class="ep-label">职业/职位</text>
          <input class="ep-input" type="text" v-model="form.position" placeholder="如：法学研究生 / 执业律师（选填）" placeholder-class="ep-placeholder" />
        </view>
      </view>

      <!-- 保存按钮 -->
      <view class="ep-save" hover-class="ep-save-hover" :class="{ 'is-saving': saving }" @click="saveProfile">
        <text>{{ saving ? '保存中...' : '保存修改' }}</text>
      </view>
      <view style="height: 60rpx;"></view>
    </view>

    <!-- 轻提示浮层 -->
    <view class="toast" :class="{ show: showToast }">
      <text>{{ toastText }}</text>
    </view>
  </view>
</template>

<script>
const GENDERS = ['男', '女', '保密']

export default {
  data() {
    const user = uni.getStorageSync('userInfo') || {}
    return {
      statusBarHeight: 0,
      GENDERS,
      account: user.account || '',
      level: user.level || 'Lv.1',
      levelText: user.levelText || '',
      avatarText: (user.name || user.account || '用').slice(0, 1).toUpperCase(),
      form: {
        name: user.name || '',
        gender: user.gender || '',
        phone: user.phone || '',
        email: user.email || '',
        region: user.region || '',
        position: user.position || ''
      },
      saving: false,
      showToast: false,
      toastText: ''
    }
  },
  onLoad() {
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
    goBack() {
      uni.navigateBack({
        fail: () => {
          uni.switchTab({ url: '/pages/profile/profile' })
        }
      })
    },
    async saveProfile() {
      if (this.saving) return
      const token = uni.getStorageSync('token')
      if (!token) {
        this.showToastMsg('请先登录')
        return
      }
      if (this.form.phone && !/^1\d{10}$/.test(this.form.phone)) {
        this.showToastMsg('手机号格式不正确')
        return
      }
      if (this.form.email && !/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(this.form.email)) {
        this.showToastMsg('邮箱格式不正确')
        return
      }
      this.saving = true
      try {
        const usersObj = uniCloud.importObject('users', { customUI: true })
        const r = (await usersObj.updateProfile({ token, data: this.form })) || {}
        if (r.errCode !== 0) {
          this.showToastMsg(r.errMsg || '保存失败')
          return
        }
        // 同步到本地登录信息（globalData + storage），保持与网页端账号资料一致
        const app = getApp()
        if (r.userInfo) {
          const merged = { ...(uni.getStorageSync('userInfo') || {}), ...r.userInfo }
          app.setLogin(merged, uni.getStorageSync('loginMethod') || 'account')
        }
        this.showToastMsg('保存成功')
        setTimeout(() => {
          uni.navigateBack()
        }, 700)
      } catch (e) {
        this.showToastMsg((e && e.errMsg) || '保存失败，请稍后重试')
      } finally {
        this.saving = false
      }
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
page {
  --brand: #2E7BE0;
  --brand-deep: #1B5BB5;
  --ink: #1b2233;
  --ink-2: #5a6b82;
  --muted: #9aabc0;
  --line: #e8eef8;
  --bg: #f2f6fd;
  background-color: var(--bg);
  color: var(--ink);
  font-size: 28rpx;
}

.ep-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.sticky-top {
  position: sticky;
  top: 0;
  z-index: 100;
}

.status-bar {
  width: 100%;
  background: #ffffff;
}

/* 导航栏 */
.ep-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 24rpx;
  background: #ffffff;
  border-bottom: 1rpx solid var(--line);
}
.ep-back {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: 12rpx 16rpx;
  margin-left: -16rpx;
  font-size: 28rpx;
  color: var(--brand);
}
.ep-back-hover { opacity: 0.6; }
.ep-back-arrow {
  font-size: 44rpx;
  line-height: 1;
  margin-top: -6rpx;
}
.ep-nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--ink);
}
.ep-nav-right { width: 120rpx; }

.ep-scroll {
  box-sizing: border-box;
  padding: 24rpx;
}

/* 账号信息卡 */
.ep-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  background: #ffffff;
  border-radius: 28rpx;
  padding: 32rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 12rpx 36rpx rgba(46, 123, 224, 0.08);
}
.ep-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #5B9DF9, #2E7BE0);
  color: #ffffff;
  font-size: 40rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ep-account-info {
  flex: 1;
  min-width: 0;
}
.ep-account {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 8rpx;
}
.ep-level {
  font-size: 24rpx;
  color: var(--muted);
}

/* 表单卡 */
.ep-form {
  background: #ffffff;
  border-radius: 28rpx;
  padding: 8rpx 28rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 12rpx 36rpx rgba(46, 123, 224, 0.08);
}
.ep-field {
  display: flex;
  align-items: center;
  min-height: 104rpx;
  border-bottom: 1rpx solid var(--line);
}
.ep-field:last-child {
  border-bottom: none;
}
.ep-label {
  width: 160rpx;
  flex-shrink: 0;
  font-size: 28rpx;
  color: var(--ink);
  font-weight: 500;
}
.ep-input {
  flex: 1;
  font-size: 28rpx;
  color: var(--ink);
  text-align: right;
}
.ep-placeholder {
  color: var(--muted);
}
.ep-gender-row {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
}
.ep-chip {
  min-width: 96rpx;
  height: 60rpx;
  padding: 0 24rpx;
  border-radius: 30rpx;
  background: #f5f8fd;
  border: 1rpx solid var(--line);
  color: var(--ink-2);
  font-size: 26rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ep-chip.is-active {
  background: var(--brand);
  border-color: var(--brand);
  color: #ffffff;
  font-weight: 500;
}
.ep-chip-hover { opacity: 0.8; }

/* 保存按钮 */
.ep-save {
  height: 92rpx;
  border-radius: 46rpx;
  background: var(--brand);
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12rpx 32rpx rgba(46, 123, 224, 0.28);
}
.ep-save-hover { opacity: 0.88; }
.ep-save.is-saving { opacity: 0.7; }

/* 轻提示浮层 */
.toast {
  position: fixed;
  left: 50%;
  bottom: 240rpx;
  transform: translateX(-50%) translateY(56rpx);
  background: rgba(22, 49, 79, 0.93);
  color: #fff;
  padding: 22rpx 40rpx;
  border-radius: 999rpx;
  font-size: 26rpx;
  font-weight: 500;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.22s, transform 0.22s;
  z-index: 80;
  box-shadow: 0 40rpx 104rpx rgba(0, 0, 0, 0.28);
  white-space: nowrap;
  max-width: 84%;
}
.toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
</style>
