<template>
  <view class="page-wrap">
    <!-- 状态栏安全区占位（iOS刘海屏 / 安卓挖孔屏适配） -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 顶部：返回 + 标题 -->
    <view class="sub-header">
      <view class="back" hover-class="bk-hover" @click="navBack" aria-label="返回">
        <view class="bk-ico"></view>
      </view>
      <text class="title">个人中心</text>
      <view class="spacer"></view>
    </view>

    <!-- 可滚动内容区 -->
    <scroll-view scroll-y class="screen" scroll-with-animation>

      <!-- 1) 个人资料卡 -->
      <view class="profile-card reveal d1">
        <view class="deco a"></view>
        <view class="deco b"></view>

        <view class="avatar-wrap">
          <view class="avatar-glow"></view>
          <view class="avatar">
            <text>{{ userName.slice(0, 1) }}</text>
          </view>
        </view>

        <view class="name">{{ userName }}</view>
        <view class="role-chip">
          <view class="dot"></view>
          <text>{{ role }}</text>
        </view>

        <view class="level-row">
          <view class="lv-badge">{{ level }}</view>
          <text class="level-text">{{ levelText }}</text>
        </view>

        <view class="level-bar">
          <view class="level-fill" :style="{ width: levelFill + '%' }"></view>
        </view>

        <view class="edit-btn" hover-class="edit-hover" @click="onMenuClick('编辑资料')">
          <text class="edit-ico">✎</text>
          <text>编辑资料</text>
        </view>
      </view>

      <!-- 2) 数据统计 -->
      <view class="stats reveal d2">
        <view class="stat-tile" v-for="(s, i) in stats" :key="i" hover-class="tile-hover">
          <view class="v">
            <text v-if="s.prefix" class="pre">{{ s.prefix }}</text>
            <text class="num">{{ animStats[i] }}</text>
            <text v-if="s.unit" class="unit">{{ s.unit }}</text>
            <text v-if="s.suffix" class="suf">{{ s.suffix }}</text>
          </view>
          <view class="l">{{ s.label }}</view>
        </view>
      </view>

      <!-- 3) 我的成就 -->
      <view class="ach-card reveal d2">
        <view class="ach-head">
          <view class="t">
            <view class="bar"></view>
            <text>我的成就</text>
          </view>
          <view class="more" hover-class="more-hover" @click="goAllAchievements">
            <text>全部</text>
            <text class="more-arrow">›</text>
          </view>
        </view>
        <view v-if="!achievements.length" class="ach-empty">暂无成就</view>
        <view v-else class="ach-row">
          <view
            class="ach-badge"
            v-for="(b, i) in achievements.slice(0, 2)"
            :key="i"
            :style="{ animationDelay: (0.38 + 0.12 * i) + 's' }"
          >
            <view class="sq" :style="{ background: b.bg }">
              <text class="sq-ico" :class="b.ico"></text>
            </view>
            <view class="ach-info">
              <view class="n">{{ b.name }}</view>
              <view class="d">{{ b.date }}</view>
            </view>
          </view>
        </view>
      </view>

      <!-- 4) 菜单组：学习 -->
      <view class="grp-label">
        <view class="bar"></view>
        <text>学习</text>
      </view>
      <view class="menu-card reveal d3">
        <view
          class="menu-row"
          v-for="(m, i) in learnMenus"
          :key="'l' + i"
          hover-class="row-hover"
          @click="onMenuClick(m.name)"
        >
          <view class="m-ico" :style="{ background: m.bg }">
            <text class="m-ico-text" :class="m.ico"></text>
          </view>
          <text class="m-label">{{ m.name }}</text>
          <text v-if="m.meta" class="m-meta">{{ m.meta }}</text>
          <text class="m-chev ri-arrow-right-s-line"></text>
        </view>
      </view>

      <!-- 5) 菜单组：通用 -->
      <view class="grp-label">
        <view class="bar"></view>
        <text>通用</text>
      </view>
      <view class="menu-card reveal d3">
        <view
          class="menu-row"
          v-for="(m, i) in generalMenus"
          :key="'g' + i"
          hover-class="row-hover"
          @click="onMenuClick(m.name)"
        >
          <view class="m-ico" :style="{ background: m.bg }">
            <text class="m-ico-text" :class="m.ico"></text>
          </view>
          <text class="m-label">{{ m.name }}</text>
          <view v-if="m.badge" class="m-badge">{{ m.badge }}</view>
          <text class="m-chev ri-arrow-right-s-line"></text>
        </view>
      </view>

      <!-- 6) 退出登录 -->
      <view class="footer">
        <view class="logout-btn" hover-class="logout-hover" @click="openLogout">
          <text class="logout-ico">⏻</text>
          <text>退出登录</text>
        </view>
      </view>

      <view style="height: 60rpx;"></view>
    </scroll-view>

    <!-- 退出确认弹层 -->
    <view class="modal-backdrop" :class="{ show: showModal }" @click.self="closeLogout">
      <view class="modal">
        <view class="modal-ico">
          <text class="modal-ico-t">⏻</text>
        </view>
        <view class="modal-title">退出登录</view>
        <view class="modal-desc">退出后需重新登录，你的学习记录将完整保留。</view>
        <view class="modal-actions">
          <view class="btn btn-ghost" hover-class="btn-hover" @click="closeLogout">取消</view>
          <view class="btn btn-rose" hover-class="btn-hover" @click="confirmLogout">确认退出</view>
        </view>
      </view>
    </view>

    <!-- Toast -->
    <view class="toast" :class="{ show: showToast }">
      <text>{{ toastText }}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    const cachedUser = uni.getStorageSync('userInfo') || {}
    return {
      statusBarHeight: 0,
      userName: cachedUser.name || cachedUser.account || '用户',
      role: cachedUser.role === 'admin' ? '涉外法治 · 管理员' : '涉外法治 · 学员',
      level: cachedUser.level || 'Lv.1',
      levelText: cachedUser.levelText || '暂无成长数据',
      levelPct: 0,
      levelFill: 0,
      stats: [
        { prefix: '', num: 0, unit: '次', suffix: '', label: '测评次数' },
        { prefix: '', num: 0, unit: '分', suffix: '', label: '平均得分' },
        { prefix: '', num: 0, unit: '分', suffix: '', label: '最高得分' },
        { prefix: 'Top ', num: 0, unit: '', suffix: '%', label: '学习排名' }
      ],
      animStats: [0, 0, 0, 0],
      achievements: [],
      learnMenus: [
        { name: '我的证书', meta: '', ico: 'ri-medal-line', bg: 'linear-gradient(135deg, #F59E0B, #D97706)' },
        { name: '我的错题', meta: '', ico: 'ri-bookmark-3-line', bg: 'linear-gradient(135deg, #FB7185, #E11D48)' },
        { name: '学习报告', meta: '', ico: 'ri-bar-chart-2-line', bg: 'linear-gradient(135deg, #5B9DF9, #2E7BE0)' },
        { name: '测评历史', meta: '', ico: 'ri-file-list-3-line', bg: 'linear-gradient(135deg, #8B5CF6, #6D28D9)' },
        { name: '我的收藏', meta: '', ico: 'ri-star-line', bg: 'linear-gradient(135deg, #22C55E, #16A34A)' }
      ],
      generalMenus: [
        { name: '消息通知', badge: '', ico: 'ri-notification-3-line', bg: 'linear-gradient(135deg, #FB7185, #E11D48)' },
        { name: '账号设置', badge: '', ico: 'ri-settings-3-line', bg: 'linear-gradient(135deg, #5B9DF9, #2E7BE0)' },
        { name: '帮助与反馈', badge: '', ico: 'ri-chat-3-line', bg: 'linear-gradient(135deg, #06B6D4, #0891B2)' }
      ],
      showModal: false,
      showToast: false,
      toastText: '',
      toastTimer: null,
      statsTimer: null
    }
  },
  onShow() {
    // 读取登录用户信息（每次进入页面都刷新）
    const app = getApp()
    const ui = (app && app.globalData && app.globalData.userInfo) || uni.getStorageSync('userInfo') || {}
    if (ui && Object.keys(ui).length) {
      this.userName = ui.name || ui.account || '用户'
      this.role = ui.role === 'admin' ? '涉外法治 · 管理员' : '涉外法治 · 学员'
      this.level = ui.level || 'Lv.1'
      this.levelText = ui.levelText || '暂无成长数据'
    }
    this.loadSurveyStats()
  },
  onReady() {
    this.statusBarHeight = this.getStatusBarHeight()
    setTimeout(() => {
      this.levelFill = this.levelPct
    }, 350)
    this.animateStats()
  },
  onUnload() {
    if (this.statsTimer) clearInterval(this.statsTimer)
    if (this.toastTimer) clearTimeout(this.toastTimer)
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
    navBack() { uni.navigateBack({ delta: 1 }) },
    goAllAchievements() {
      uni.navigateTo({ url: '/pages/achievements/achievements' })
    },
    async loadSurveyStats() {
      const token = uni.getStorageSync('token')
      if (!token) return
      try {
    const surveyObj = uniCloud.importObject('survey', { customUI: true })
        const r = await surveyObj.myResults({ token, page: 1, pageSize: 100 })
        if (r.errCode !== 0) return
        const list = r.list || []
        const scores = list.map(item => Number(item.score) || 0)
        this.stats[0].num = list.length
        this.stats[1].num = scores.length ? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)) : 0
        this.stats[2].num = scores.length ? Math.max(...scores) : 0
        this.animateStats()
      } catch (e) {
        console.warn('[profile] 测评统计加载失败:', e)
      }
    },
    animateStats() {
      const targets = this.stats.map(s => s.num)
      const duration = 900
      const start = Date.now()
      const self = this
      this.statsTimer = setInterval(() => {
        const p = Math.min((Date.now() - start) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        self.animStats = targets.map(t => Math.round(t * eased))
        if (p >= 1) clearInterval(self.statsTimer)
      }, 30)
    },
    onMenuClick(name) {
      this.showToastMsg('即将进入「' + name + '」')
    },
    openLogout() {
      this.showModal = true
    },
    closeLogout() {
      this.showModal = false
    },
    confirmLogout() {
      this.showModal = false
      const app = getApp()
      app.logout()
      this.showToastMsg('已退出登录')
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/login/login'
        })
      }, 800)
    },
    showToastMsg(text) {
      this.toastText = text
      this.showToast = true
      if (this.toastTimer) clearTimeout(this.toastTimer)
      this.toastTimer = setTimeout(() => {
        this.showToast = false
      }, 2200)
    }
  }
}
</script>

<style>
page {
  --brand: #5B9DF9;
  --brand-deep: #2E7BE0;
  --brand-soft: #8FB8F5;
  --blue-50: #EFF6FF;
  --blue-100: #DBEAFE;
  --blue-200: #BFDBFE;
  --blue-300: #93C5FD;
  --blue-400: #60A5FA;
  --blue-500: #4A90E2;
  --blue-600: #2563EB;
  --blue-700: #1D4ED8;
  --ink: #16314F;
  --ink-2: #355580;
  --muted: #7A92B0;
  --muted-2: #9AAFC6;
  --line: rgba(120, 160, 210, 0.16);
  --glass: rgba(255, 255, 255, 0.55);
  --glass-2: rgba(255, 255, 255, 0.68);
  --glass-3: rgba(255, 255, 255, 0.82);
  --glass-border: rgba(255, 255, 255, 0.75);
  --glass-border-soft: rgba(255, 255, 255, 0.45);
  --glass-shadow: 0 20rpx 68rpx rgba(46, 123, 224, 0.14);
  --glass-shadow-sm: 0 12rpx 36rpx rgba(46, 123, 224, 0.10);
  --green: #22C55E;
  --green-soft: rgba(34, 197, 94, 0.14);
  --amber: #F59E0B;
  --amber-soft: rgba(245, 158, 11, 0.16);
  --rose: #FB7185;
  --rose-soft: rgba(251, 113, 133, 0.14);
  --violet: #8B5CF6;
  --violet-soft: rgba(139, 92, 246, 0.14);
  --cyan: #06B6D4;
  --r-xs: 20rpx;
  --r-sm: 28rpx;
  --r-md: 36rpx;
  --r-lg: 48rpx;
  --r-xl: 60rpx;
  --r-pill: 999rpx;
}

/* ---------- Page wrap (Flex column：固定头 + 滚动区) ---------- */
.page-wrap {
  height: 100vh;
  background: linear-gradient(160deg, #EAF3FF 0%, #F4F9FF 45%, #E6F1FE 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
page { height: 100vh; overflow: hidden; }

.page-wrap::before,
.page-wrap::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  filter: blur(140rpx);
  z-index: 0;
  pointer-events: none;
}
.page-wrap::before {
  width: 520rpx; height: 520rpx;
  background: radial-gradient(circle, rgba(91,157,249,0.38), transparent 70%);
  top: -120rpx; left: -100rpx;
}
.page-wrap::after {
  width: 600rpx; height: 600rpx;
  background: radial-gradient(circle, rgba(6,182,212,0.20), transparent 70%);
  bottom: 60rpx; right: -180rpx;
}

/* ---------- Status bar safe-area ---------- */
.status-bar {
  width: 100%;
  flex-shrink: 0;
  background: transparent;
}

/* ---------- Sub-header ---------- */
.sub-header {
  position: relative; z-index: 45;
  flex: 0 0 auto;
  flex-shrink: 0;
  display: flex; align-items: center;
  padding: 20rpx 20rpx 18rpx;
  margin: 0 16rpx;
  gap: 10rpx;
  background: linear-gradient(180deg, rgba(234,243,255,0.96) 0%, rgba(244,249,255,0.90) 78%, rgba(244,249,255,0) 100%);
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
}
.sub-header .title {
  font-size: 34rpx; font-weight: 700; color: var(--ink);
  letter-spacing: .5rpx;
}
.sub-header .spacer { flex: 1; }

.back {
  display: flex; align-items: center; justify-content: center;
  width: 80rpx; height: 80rpx;
  color: var(--ink-2);
  transition: opacity .2s;
  flex-shrink: 0;
}
.bk-hover { opacity: 0.55; }
.bk-ico {
  width: 40rpx; height: 40rpx;
  background: var(--ink-2);
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='19' y1='12' x2='5' y2='12'/%3E%3Cpolyline points='12 19 5 12 12 5'/%3E%3C/svg%3E") center/contain no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='19' y1='12' x2='5' y2='12'/%3E%3Cpolyline points='12 19 5 12 12 5'/%3E%3C/svg%3E") center/contain no-repeat;
}

/* ---------- Screen ---------- */
.screen {
  position: relative; z-index: 5;
  flex: 1 1 auto;
  min-height: 0;
  height: 0;
  padding: 12rpx 36rpx 76rpx;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
}

/* ---------- 1) Profile header card ---------- */
.profile-card {
  position: relative;
  padding: 28rpx 28rpx 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  overflow: hidden;
  border-radius: var(--r-lg);
  background: var(--glass);
  border: 2rpx solid var(--glass-border-soft);
  box-shadow: var(--glass-shadow);
}
.deco {
  position: absolute;
  border-radius: 50%;
  filter: blur(8px);
  pointer-events: none;
  z-index: 0;
}
.deco.a {
  width: 300rpx; height: 300rpx; top: -92rpx; right: -88rpx;
  background: radial-gradient(circle, rgba(139,92,246,0.22), transparent 70%);
}
.deco.b {
  width: 260rpx; height: 260rpx; bottom: -100rpx; left: -80rpx;
  background: radial-gradient(circle, rgba(6,182,212,0.18), transparent 70%);
}
.profile-card .avatar-wrap,
.profile-card .name,
.profile-card .role-chip,
.profile-card .level-row,
.profile-card .level-bar,
.profile-card .edit-btn {
  position: relative;
  z-index: 1;
}

.avatar-wrap {
  position: relative;
  width: 120rpx; height: 120rpx;
  display: flex; align-items: center; justify-content: center;
}
.avatar-glow {
  position: absolute; inset: -20rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(91,157,249,0.55), transparent 70%);
  filter: blur(20rpx);
  animation: breathe 3.6s ease-in-out infinite;
}
.avatar {
  position: relative;
  width: 120rpx; height: 120rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand) 0%, var(--blue-600) 100%);
  display: flex; align-items: center; justify-content: center;
  font-size: 52rpx; font-weight: 700; color: #fff;
  border: 4rpx solid rgba(255,255,255,0.88);
  box-shadow: 0 20rpx 48rpx rgba(46,123,224,0.42), inset 0 4rpx 12rpx rgba(255,255,255,0.4);
  animation: floaty 4.2s ease-in-out infinite;
}
.name {
  font-size: 32rpx; font-weight: 700; color: var(--ink);
  margin-top: 16rpx; letter-spacing: .5px;
}
.role-chip {
  margin-top: 10rpx;
  height: 42rpx; padding: 0 20rpx;
  display: inline-flex; align-items: center; gap: 8rpx;
  border-radius: var(--r-pill);
  font-size: 20rpx; font-weight: 600;
  background: var(--blue-50);
  color: var(--brand-deep);
  border: 2rpx solid rgba(91,157,249,0.22);
}
.role-chip .dot { width: 10rpx; height: 10rpx; border-radius: 50%; background: var(--brand); }

.level-row {
  display: flex; align-items: center; gap: 12rpx;
  margin-top: 18rpx;
}
.lv-badge {
  background: linear-gradient(135deg, var(--amber), #FB923C);
  color: #fff; font-size: 24rpx; font-weight: 700;
  padding: 6rpx 22rpx; border-radius: var(--r-pill);
  box-shadow: 0 8rpx 22rpx rgba(245,158,11,0.38);
  letter-spacing: .3px;
}
.level-text { font-size: 26rpx; color: var(--muted); }
.level-text b { color: var(--ink); font-weight: 700; }
.level-bar {
  width: 100%; height: 12rpx; margin-top: 12rpx;
  border-radius: var(--r-pill);
  background: rgba(91,157,249,0.16);
  overflow: hidden;
  position: relative;
}
.level-fill {
  height: 100%; width: 0;
  border-radius: var(--r-pill);
  background: linear-gradient(90deg, var(--brand), var(--cyan));
  box-shadow: 0 4rpx 16rpx rgba(46,123,224,0.45);
  transition: width 1.25s cubic-bezier(.22,1,.36,1);
  position: relative;
}
.level-fill::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
  background-size: 200% 100%;
  animation: shimmer 2.4s linear infinite;
}

.edit-btn {
  display: inline-flex; align-items: center; gap: 6rpx;
  height: 56rpx; padding: 0 28rpx; margin-top: 18rpx;
  border-radius: var(--r-pill);
  font-size: 22rpx; font-weight: 600;
  background: linear-gradient(135deg, var(--brand), var(--blue-600));
  color: #fff;
  box-shadow: 0 12rpx 28rpx rgba(46,123,224,0.34);
  transition: transform .2s;
}
.edit-hover { transform: scale(0.95); }
.edit-ico { font-size: 30rpx; line-height: 1; }

/* ---------- 2) Stats strip ---------- */
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
  margin-top: 20rpx;
}
.stat-tile {
  background: var(--glass-2);
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  border: 2rpx solid var(--glass-border-soft);
  border-radius: var(--r-md);
  padding: 16rpx 4rpx 14rpx;
  text-align: center;
  box-shadow: var(--glass-shadow-sm);
  transition: transform .25s cubic-bezier(.34,1.56,.64,1);
}
.tile-hover { transform: scale(0.94); }
.stat-tile .v {
  display: flex; align-items: baseline; justify-content: center; gap: 1px;
  line-height: 1;
}
.stat-tile .v .num {
  font-size: 32rpx; font-weight: 700; color: var(--ink);
  font-feature-settings: "tnum";
}
.stat-tile .v .pre, .stat-tile .v .unit, .stat-tile .v .suf {
  font-size: 22rpx; font-weight: 600; color: var(--ink-2);
}
.stat-tile .l {
  font-size: 18rpx; color: var(--muted);
  margin-top: 8rpx; letter-spacing: .2px;
}

/* ---------- 3) Achievements ---------- */
.ach-card {
  padding: 22rpx 24rpx 18rpx;
  margin-top: 24rpx;
  border-radius: var(--r-lg);
  background: var(--glass);
  border: 2rpx solid var(--glass-border-soft);
  box-shadow: var(--glass-shadow);
}
.ach-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16rpx;
}
.ach-head .t {
  font-size: 28rpx; font-weight: 700; color: var(--ink);
  display: flex; align-items: center; gap: 12rpx;
}
.ach-head .t .bar {
  width: 8rpx; height: 26rpx; border-radius: 4px;
  background: linear-gradient(180deg, var(--brand), var(--blue-600));
}
.ach-head .more {
  font-size: 22rpx; color: var(--muted);
  display: flex; align-items: center; gap: 2rpx;
}
.more-hover { opacity: .7; }
.more-arrow { font-size: 26rpx; line-height: 1; }

.ach-empty {
  padding: 40rpx 8rpx;
  text-align: center;
  font-size: 24rpx;
  color: var(--muted);
}
.ach-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
  padding: 0 2rpx 4rpx;
}
.ach-badge {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 18rpx;
  border-radius: var(--r-sm);
  background: var(--glass-2);
  border: 2rpx solid var(--glass-border-soft);
  box-shadow: var(--glass-shadow-sm);
  animation: pop .55s cubic-bezier(.34,1.56,.64,1) both;
}
.ach-badge .sq {
  width: 76rpx;
  height: 76rpx;
  border-radius: 22rpx;
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  box-shadow: 0 12rpx 28rpx rgba(46,123,224,0.22);
  position: relative;
  overflow: hidden;
  transition: transform .25s cubic-bezier(.34,1.56,.64,1);
}
.ach-badge:active .sq { transform: scale(0.9); }
.ach-badge .sq::after {
  content: ""; position: absolute; top: -30%; left: -20%;
  width: 80%; height: 80%;
  background: radial-gradient(circle, rgba(255,255,255,0.32), transparent 70%);
  pointer-events: none;
}
.ach-badge .sq-ico { font-size: 36rpx; position: relative; z-index: 1; }
.ach-info {
  flex: 1;
  min-width: 0;
}
.ach-badge .n {
  font-size: 22rpx; font-weight: 600; color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ach-badge .d {
  font-size: 18rpx; color: var(--muted);
  margin-top: 4rpx;
}

/* ---------- 4) Menu groups ---------- */
.grp-label {
  font-size: 26rpx; font-weight: 700; color: var(--ink);
  padding: 28rpx 32rpx 12rpx;
  display: flex; align-items: center; gap: 16rpx;
}
.grp-label .bar {
  width: 8rpx; height: 28rpx; border-radius: 4px;
  background: linear-gradient(180deg, var(--brand), var(--blue-600));
}
.menu-card {
  padding: 8rpx 16rpx 12rpx;
  border-radius: var(--r-lg);
  background: var(--glass);
  border: 2rpx solid var(--glass-border-soft);
  box-shadow: var(--glass-shadow-sm);
}
.menu-row {
  position: relative;
  width: 100%;
  display: flex; align-items: center; gap: 24rpx;
  padding: 26rpx 24rpx;
  border-radius: var(--r-sm);
  transition: background .2s, transform .15s;
}
.menu-row + .menu-row::before {
  content: ""; position: absolute;
  top: 0; left: 116rpx; right: 32rpx;
  height: 2rpx; background: var(--line);
}
.row-hover {
  background: rgba(91,157,249,0.10);
  transform: scale(0.99);
}
.m-ico {
  width: 76rpx; height: 76rpx;
  border-radius: var(--r-xs);
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: transform .25s cubic-bezier(.34,1.56,.64,1);
  box-shadow: 0 10rpx 24rpx rgba(46,123,224,0.20);
}
.menu-row:active .m-ico { transform: scale(0.9) rotate(-4deg); }
.m-ico-text { font-size: 40rpx; line-height: 1; }
.m-label {
  flex: 1; text-align: left;
  font-size: 30rpx; font-weight: 500; color: var(--ink);
}
.m-meta { font-size: 24rpx; color: var(--muted); }
.m-badge {
  min-width: 36rpx; height: 36rpx; padding: 0 10rpx;
  border-radius: var(--r-pill);
  background: var(--rose); color: #fff;
  font-size: 22rpx; font-weight: 700;
  display: inline-flex; align-items: center; justify-content: center;
  box-shadow: 0 4rpx 14rpx rgba(251,113,133,0.45);
}
.m-chev {
  color: var(--muted-2);
  font-size: 36rpx; line-height: 1;
  transition: transform .2s;
  flex-shrink: 0;
}
.menu-row:active .m-chev { transform: translateX(6rpx); color: var(--brand); }

/* ---------- 5) Footer / logout ---------- */
.footer { text-align: center; margin-top: 48rpx; padding-bottom: 8rpx; }
.logout-btn {
  display: inline-flex; align-items: center; gap: 14rpx;
  padding: 20rpx 52rpx;
  border-radius: var(--r-pill);
  font-size: 28rpx; font-weight: 600;
  color: var(--rose);
  background: var(--rose-soft);
  border: 2rpx solid rgba(251,113,133,0.22);
  transition: transform .2s, background .2s;
}
.logout-hover { transform: scale(0.96); background: rgba(251,113,133,0.22); }
.logout-ico { font-size: 32rpx; }

/* ---------- Toast ---------- */
.toast {
  position: fixed;
  left: 50%; bottom: 168rpx;
  transform: translateX(-50%) translateY(28rpx);
  background: rgba(22,49,79,0.93);
  color: #fff;
  padding: 22rpx 40rpx;
  border-radius: var(--r-pill);
  font-size: 26rpx; font-weight: 500;
  opacity: 0; pointer-events: none;
  transition: opacity .22s, transform .22s;
  z-index: 80;
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 20rpx 52rpx rgba(0,0,0,0.28);
  white-space: nowrap;
  max-width: 84%;
}
.toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

/* ---------- Logout modal ---------- */
.modal-backdrop {
  position: fixed; inset: 0; z-index: 90;
  background: rgba(14,26,43,0.46);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  padding: 52rpx;
  opacity: 0; pointer-events: none;
  transition: opacity .24s;
}
.modal-backdrop.show { opacity: 1; pointer-events: auto; }
.modal {
  width: 100%; max-width: 592rpx;
  background: rgba(255,255,255,0.94);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border: 2rpx solid var(--glass-border);
  border-radius: var(--r-lg);
  padding: 48rpx 44rpx 40rpx;
  text-align: center;
  box-shadow: 0 44rpx 108rpx rgba(0,0,0,0.32);
  transform: scale(.84); opacity: 0;
  transition: transform .3s cubic-bezier(.34,1.56,.64,1), opacity .22s;
}
.modal-backdrop.show .modal { transform: scale(1); opacity: 1; }
.modal-ico {
  width: 112rpx; height: 112rpx; border-radius: 50%;
  margin: 0 auto 28rpx;
  background: var(--rose-soft); color: var(--rose);
  display: flex; align-items: center; justify-content: center;
}
.modal-ico-t { font-size: 54rpx; line-height: 1; }
.modal-title { font-size: 34rpx; font-weight: 700; color: var(--ink); }
.modal-desc { font-size: 26rpx; color: var(--muted); margin-top: 16rpx; line-height: 1.55; }
.modal-actions { display: flex; gap: 20rpx; margin-top: 40rpx; }
.modal-actions .btn { flex: 1; height: 84rpx; font-size: 28rpx; }
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: var(--r-pill);
  font-weight: 600;
  transition: transform .2s;
}
.btn-hover { transform: scale(0.96); }
.btn-ghost {
  background: rgba(120,160,210,0.12);
  color: var(--ink-2);
  border: 2rpx solid var(--glass-border-soft);
}
.btn-rose {
  background: linear-gradient(135deg, var(--rose), #E11D48);
  color: #fff;
  box-shadow: 0 16rpx 40rpx rgba(251,113,133,0.42);
}

/* ---------- Animations ---------- */
@keyframes fadeUp { from { opacity: 0; transform: translateY(36rpx); } to { opacity: 1; transform: translateY(0); } }
@keyframes pop { 0% { transform: scale(.6); opacity: 0; } 60% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes breathe { 0%,100% { opacity: .5; } 50% { opacity: .9; } }
@keyframes floaty { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14rpx); } }

.reveal { opacity: 0; animation: fadeUp .6s cubic-bezier(.22,1,.36,1) forwards; }
.reveal.d1 { animation-delay: .06s; }
.reveal.d2 { animation-delay: .12s; }
.reveal.d3 { animation-delay: .18s; }
</style>
