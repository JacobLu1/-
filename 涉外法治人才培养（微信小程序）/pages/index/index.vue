<template>
  <view class="page-wrap">
    <view class="sticky-top">
      <!-- 状态栏安全区占位（iOS刘海屏 / 安卓挖孔屏适配，高度动态取自系统） -->
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
      <!-- 顶部搜索栏 -->
      <view class="topbar">
        <view class="search">
          <text class="search-ico ri-search-line"></text>
          <input class="search-input" type="text" placeholder="搜索课程、法规、案例" placeholder-class="search-placeholder" />
        </view>
        <view class="avatar-btn" hover-class="avatar-hover" @click="navTo('/pages/profile/profile')">{{ avatarText }}</view>
      </view>
    </view>

    <!-- 外部滚动区：整个页面随内容一起滚动（与 data.vue 保持一致） -->
    <view class="screen">
      
      <!-- 1) 英雄问候卡片 -->
      <view class="card hero reveal d1">
        <!-- 装饰图案：同心圆环 + 十字线（对齐设计稿 SVG） -->
        <view class="deco">
          <view class="deco-ring r1"></view>
          <view class="deco-ring r2"></view>
          <view class="deco-ring r3"></view>
        </view>
        <view class="deco2 ri-sparkling-2-line"></view>

        <view class="greet">
          <text>你好，{{ displayName }}</text>
          <text class="wave ri-emotion-happy-line"></text>
        </view>
        <view class="sub">今天也要为涉外法治精进加油</view>

        <view class="today">
          <view class="mins">
            <text class="num">{{ todayMinutes }}</text>
            <text class="unit"> 分钟</text>
            <text class="target"> / 目标 {{ todayTarget }} 分钟</text>
          </view>
          <view class="goal">{{ todayPercent }}%</view>
        </view>
        <view class="pbar">
          <view class="pbar-inner" :style="{ width: progressWidth + '%' }"></view>
        </view>

        <view class="cta">
          <button class="btn btn-primary btn-block" hover-class="btn-hover" @click="scrollToVideos">
            <text class="btn-ico ri-play-circle-line"></text>
            <text>继续学习</text>
          </button>
        </view>
      </view>


      <!-- 3) 视频学习 -->
      <view class="reveal d3" id="videos-section">
        <view class="sec-head">
          <view class="t">
            <view class="bar"></view>
            <text>视频学习</text>
          </view>
          <view class="more" @click="showAllVideos">
            <text>全部</text>
            <text class="more-arrow ri-arrow-right-s-line"></text>
          </view>
        </view>
        <scroll-view scroll-x class="vid-scroll" show-scrollbar="false">
          <view class="vcard" v-for="(video, idx) in videoList" :key="idx" hover-class="vcard-hover" @click="openVideo(video)">
            <view class="vthumb" :class="video.cover && !video.coverFail ? 'has-cover' : 'vthumb-' + (idx + 1)">
              <image v-if="video.cover && !video.coverFail" class="vthumb-img" :src="video.cover" mode="aspectFill" @error="onCoverError(video)"></image>
              <view v-if="video.cover && !video.coverFail" class="vthumb-mask"></view>
              <view class="vplay">
                <text class="vplay-ico ri-play-circle-line"></text>
              </view>
              <view class="dur">{{ video.duration }}</view>
            </view>
            <view class="vbody">
              <view class="vt">{{ video.title }}</view>
              <view class="vprog">
                <view class="vprog-inner" :style="{ width: video.progress + '%' }"></view>
              </view>
              <view class="vpct">已学习 {{ video.progress }}%</view>
            </view>
          </view>
        </scroll-view>
        <view v-if="!videoList.length" class="vcard-empty">暂无视频资源</view>
      </view>

      <!-- 4) 学习模块 -->
      <view class="reveal d4">
        <view class="sec-head">
          <view class="t">
            <view class="bar"></view>
            <text>学习模块</text>
          </view>
        </view>
        <view class="mod-grid">
          <view
            class="mod-card"
            v-for="(mod, idx) in modules"
            :key="idx"
            hover-class="mod-hover"
            @click="openModule(mod)"
          >
            <view class="mod-ico" :class="'mod-ico-' + (mod.tone || idx + 1)">
              <text :class="mod.icon"></text>
            </view>
            <view class="mod-name">{{ mod.name }}</view>
            <view class="mod-desc">{{ mod.desc }}</view>
          </view>
        </view>
      </view>

      <!-- 5) 为你推荐 -->
      <view class="reveal d5">
        <view class="sec-head">
          <view class="t">
            <view class="bar"></view>
            <text>为你推荐</text>
          </view>
          <view class="more" hover-class="more-hover" @click="refreshRecommendations">
            <text class="refresh-ico">↻</text>
            <text>刷新</text>
          </view>
        </view>
        <view class="rec-list">
          <view class="rcard" v-for="(rec, idx) in recList" :key="idx" hover-class="rcard-hover" @click="openRec(rec)">
            <view class="rinfo">
              <view class="rt">{{ rec.title }}</view>
              <view class="rm">
                <view class="tag tag-blue">{{ rec.tag1 }}</view>
                <view class="tag" :class="'tag-' + rec.tagColor">{{ rec.tag2 }}</view>
                <view class="dur">{{ rec.duration }}</view>
              </view>
            </view>
            <view class="rchev ri-arrow-right-s-line"></view>
          </view>
        </view>
        <view v-if="!recList.length" class="index-empty">暂无推荐资源</view>
      </view>
    </view>

    <!-- AI助手悬浮按钮（可拖动） -->
    <view
      class="ai-fab"
      :class="{ dragging: fabMoving, 'on-left': fabOnLeft }"
      :style="{ left: fabLeft + 'px', top: fabTop + 'px' }"
      hover-class="ai-fab-hover"
      @touchstart="fabTouchStart"
      @touchmove="fabTouchMove"
      @touchend="fabTouchEnd"
      @click="onFabClick"
    >
      <view class="ai-fab-ico"></view>
      <view class="ai-tip" v-if="!fabMoving">AI助手</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      progressWidth: 0,
      todayMinutes: '--',
      todayTarget: '--',
      todayPercent: '--',
      statusBarHeight: 0,
      displayName: '用户',
      avatarText: '用',
      // AI 悬浮按钮拖动状态
      fabLeft: 0,
      fabTop: 0,
      fabW: 56,
      winW: 375,
      winH: 667,
      fabStartX: 0,
      fabStartY: 0,
      fabBaseL: 0,
      fabBaseT: 0,
      fabMoved: false,
      fabMoving: false,
      fabOnLeft: false,
      resourceLoading: false,
      videoList: [],
      modules: [
        { name: '法律英语综合训练', icon: 'ri-question-answer-line', desc: '词汇、听力与实务训练，点击进入综合训练', url: '/pages/legal-english/legal-english', tone: 1 },
        { name: '法律文本阅读', icon: 'ri-file-list-3-line', desc: '涉外法律经典文献原文阅读，支持书签与注释', url: '/pages/legal-english/reading-list', tone: 2 },
        { name: '文书案例研究', icon: 'ri-scales-3-line', desc: '精选涉外法律文书与典型案例，拆解法律适用与裁判思路', url: '/pages/legal-english/case-study', tone: 3 },
        { name: '法律库', icon: 'ri-government-line', desc: '法规检索查询', url: '/pages/legal-db/legal-db', tone: 4 }
      ],
      recList: [],
      recPool: []
    }
  },
  onReady() {
    // 顶部安全区适配：动态获取系统状态栏高度（iOS刘海屏/安卓挖孔屏，横竖屏自动跟随）
    this.statusBarHeight = this.getStatusBarHeight()
    // AI 悬浮按钮初始位置（右下角，避开底部导航栏）
    const info = uni.getWindowInfo()
    this.winW = info.windowWidth
    this.winH = info.windowHeight
    const pr = this.winW / 750
    this.fabW = 112 * pr
    this.fabLeft = this.winW - 36 * pr - this.fabW
    this.fabTop = this.winH - 200 * pr - this.fabW
    this.fabOnLeft = this.fabLeft + this.fabW / 2 < this.winW / 2
  },
  onShow() {
    this.loadUserInfo()
    this.loadVideos()
    this.loadRecommendations()
  },
  methods: {
    loadUserInfo() {
      const app = getApp()
      const user = (app && app.globalData && app.globalData.userInfo) || uni.getStorageSync('userInfo') || {}
      const name = (user && (user.name || user.account)) || '用户'
      this.displayName = String(name).trim() || '用户'
      this.avatarText = (this.displayName || '用').slice(0, 1).toUpperCase()
    },
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
    async loadVideos() {
      if (this.resourceLoading) return
      this.resourceLoading = true
      try {
    const resourcesObj = uniCloud.importObject('resources', { customUI: true })
        const r = (await resourcesObj.listPublic({ type: 'video' })) || {}
        if (r.errCode !== 0) {
          uni.showToast({ title: r.errMsg || '视频加载失败', icon: 'none' })
          return
        }
        this.videoList = (r.list || []).map((d) => ({
          id: d._id,
          title: d.title || '未命名视频',
          duration: d.meta || '--:--',
          progress: 0,
          cover: d.cover || '',
          coverFail: false,
          fileUrl: d.fileUrl || '',
          description: d.description || ''
        }))
      } catch (e) {
        uni.showToast({ title: (e && e.errMsg) || '视频加载失败', icon: 'none' })
      } finally {
        this.resourceLoading = false
      }
    },
    async loadRecommendations() {
      try {
    const resourcesObj = uniCloud.importObject('resources', { customUI: true })
        const r = (await resourcesObj.listPublic({ type: 'all' })) || {}
        if (r.errCode !== 0) {
          uni.showToast({ title: r.errMsg || '推荐资源加载失败', icon: 'none' })
          return
        }
        this.recPool = (r.list || []).map((d, index) => ({
          id: d._id,
          type: d.type,
          title: d.title || '未命名资源',
          tag1: d.cat || (d.type === 'video' ? '视频资源' : d.type === 'vocabulary' ? '词汇' : d.type === 'reading' ? '文本阅读' : '听力训练'),
          tag2: d.type === 'video' ? '视频' : d.type === 'vocabulary' ? '词汇' : d.type === 'reading' ? '阅读' : '听力',
          tagColor: index % 2 ? 'amber' : 'violet',
          duration: d.meta || (d.type === 'video' ? '视频' : d.type === 'reading' ? '阅读' : d.type === 'listening' ? '听力' : '学习'),
          icon: d.type === 'video' ? 'ri-video-line' : d.type === 'listening' ? 'ri-mic-line' : 'ri-book-open-line',
          fileUrl: d.fileUrl || '',
          description: d.description || ''
        }))
        // 首次进入随机推荐一批（与网页端"换一批"行为一致）
        this.refreshRecommendations()
      } catch (e) {
        uni.showToast({ title: (e && e.errMsg) || '推荐资源加载失败', icon: 'none' })
      }
    },
    scrollToVideos() {
      // 外部滚动区：页面级滚动定位到“视频学习”区域
      const query = uni.createSelectorQuery().in(this)
      query.select('#videos-section').boundingClientRect((res) => {
        if (res) {
          uni.pageScrollTo({ scrollTop: res.top - 20, duration: 400 })
        }
      }).exec()
    },
    navTo(url) {
      uni.navigateTo({
        url: url,
        fail: () => {
          uni.switchTab({
            url: url,
            fail: () => {}
          })
        }
      })
    },
    // 刷新推荐：从推荐池随机抽取 3 条（排除当前展示项，避免与上次重复；池不足时补足）
    refreshRecommendations() {
      const pool = this.recPool
      if (!pool.length) return
      const currentIds = new Set(this.recList.map((item) => item.id))
      const otherItems = this.shuffleArr(pool.filter((item) => !currentIds.has(item.id)))
      let picked = otherItems.slice(0, 3)
      if (picked.length < 3) {
        const pickedIds = new Set(picked.map((item) => item.id))
        const fillItems = this.shuffleArr(pool.filter((item) => !pickedIds.has(item.id)))
        picked = picked.concat(fillItems.slice(0, 3 - picked.length))
      }
      this.recList = picked
    },
    // Fisher-Yates 洗牌（网页端同款，保证每次刷新内容都不同）
    shuffleArr(list) {
      const result = list.slice()
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const tmp = result[i]
        result[i] = result[j]
        result[j] = tmp
      }
      return result
    },
    openRec(rec) {
      if (rec.type === 'video' && rec.id) {
        uni.navigateTo({
          url: '/pages/video-detail/video-detail?id=' + encodeURIComponent(rec.id) + '&title=' + encodeURIComponent(rec.title || '')
        })
      } else if (['vocabulary', 'reading', 'listening'].includes(rec.type)) {
        uni.navigateTo({ url: '/pages/legal-english/legal-english' })
      }
    },
    // 点击视频卡片 -> 进入视频学习详情页（带防连点，避免路由竞争）
    openVideo(video) {
      if (this._navLocking) return
      this._navLocking = true
      setTimeout(() => { this._navLocking = false }, 600)
      uni.navigateTo({
        url: '/pages/video-detail/video-detail?id=' + encodeURIComponent(video.id || '') + '&title=' + encodeURIComponent(video.title || '') + '&duration=' + encodeURIComponent(video.duration || '')
      })
    },
    // 点击技能卡片 -> 有对应学习页则进入（带防连点，避免路由竞争）
    openModule(mod) {
      if (!mod.url) return
      if (this._navLocking) return
      this._navLocking = true
      setTimeout(() => { this._navLocking = false }, 600)
      uni.navigateTo({ url: mod.url })
    },
    // 点击"全部" -> 进入全部视频横向浏览页
    showAllVideos() {
      if (this._navLocking) return
      this._navLocking = true
      setTimeout(() => { this._navLocking = false }, 600)
      uni.navigateTo({ url: '/pages/video-list/video-list' })
    },
    // 封面图加载失败（域名未配置/地址失效）-> 标记后回退主题渐变，保证卡片完整美观
    onCoverError(video) {
      if (!video) return
      video.coverFail = true
    },
    // AI 悬浮按钮拖动
    fabTouchStart(e) {
      const t = e.touches[0]
      this.fabStartX = t.clientX
      this.fabStartY = t.clientY
      this.fabBaseL = this.fabLeft
      this.fabBaseT = this.fabTop
      this.fabMoved = false
      this.fabMoving = true
    },
    fabTouchMove(e) {
      const t = e.touches[0]
      const dx = t.clientX - this.fabStartX
      const dy = t.clientY - this.fabStartY
      if (Math.abs(dx) + Math.abs(dy) > 6) this.fabMoved = true
      const maxL = this.winW - this.fabW - 8
      const maxT = this.winH - this.fabW - 40
      this.fabLeft = Math.max(8, Math.min(maxL, this.fabBaseL + dx))
      this.fabTop = Math.max(this.statusBarHeight + 60, Math.min(maxT, this.fabBaseT + dy))
    },
    fabTouchEnd() {
      // 松手后吸附到最近的左/右边缘
      const gap = 36 * (this.winW / 750)
      const leftSnap = gap
      const rightSnap = this.winW - this.fabW - gap
      this.fabLeft = this.fabLeft + this.fabW / 2 < this.winW / 2 ? leftSnap : rightSnap
      this.fabOnLeft = this.fabLeft + this.fabW / 2 < this.winW / 2
      this.fabMoving = false
      // 延迟清除拖动标记，避免松手后的 tap 误触发跳转
      const self = this
      setTimeout(() => { self.fabMoved = false }, 60)
    },
    onFabClick() {
      if (this.fabMoved) return
      this.navTo('/pages/ai-assistant/ai-assistant')
    }
  }
}
</script>

<style>
/* 设计变量 */
page {
  /* 品牌蓝色系 */
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

  /* 墨色文字 */
  --ink: #16314F;
  --ink-2: #355580;
  --muted: #7A92B0;
  --muted-2: #9AAFC6;
  --line: rgba(120, 160, 210, 0.16);

  /* 毛玻璃表面 */
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

  /* 圆角 */
  --r-xs: 20rpx;
  --r-sm: 28rpx;
  --r-md: 36rpx;
  --r-lg: 48rpx;
  --r-xl: 60rpx;
  --r-pill: 999rpx;
}

.page-wrap {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(160deg, #EAF3FF 0%, #F4F9FF 45%, #E6F1FE 100%);
  position: relative;
}

/* 顶部固定区：状态栏 + 搜索栏，随页滚动时吸附在顶部 */
.sticky-top {
  position: sticky;
  top: 0;
  z-index: 100;
}

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
  width: 520rpx;
  height: 520rpx;
  background: radial-gradient(circle, rgba(91,157,249,0.40), transparent 70%);
  top: -120rpx;
  right: -100rpx;
}
.page-wrap::after {
  width: 600rpx;
  height: 600rpx;
  background: radial-gradient(circle, rgba(6,182,212,0.22), transparent 70%);
  bottom: 80rpx;
  left: -180rpx;
}

/* 状态栏安全区占位 */
.status-bar {
  width: 100%;
  flex-shrink: 0;
  background: transparent;
}

/* 顶部搜索栏 */
.topbar {
  position: relative;
  z-index: 45;
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 88rpx 36rpx 24rpx;
  flex-shrink: 0;
}
.search {
  flex: 1;
  height: 88rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 0 32rpx;
  border-radius: var(--r-pill);
  background: var(--glass);
  border: 2rpx solid var(--glass-border);
  box-shadow: var(--glass-shadow-sm);
}
.search-ico {
  font-size: 32rpx;
  flex-shrink: 0;
  line-height: 1;
}
.search-input {
  flex: 1;
  border: none;
  background: none;
  outline: none;
  font-size: 28rpx;
  color: var(--ink);
  height: 88rpx;
  line-height: 88rpx;
}
.search-placeholder {
  color: var(--muted-2);
}
.avatar-btn {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--blue-400), var(--blue-600));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  font-weight: 600;
  color: #fff;
  box-shadow: 0 12rpx 32rpx rgba(46,123,224,0.32);
  border: 4rpx solid rgba(255,255,255,0.8);
  flex-shrink: 0;
}

/* 可滚动内容区 */
.screen {
  position: relative;
  z-index: 5;
  box-sizing: border-box;
  padding: 16rpx 36rpx 220rpx;
}

/* 毛玻璃卡片 */
.card {
  position: relative;
  background: var(--glass);
  border: 2rpx solid var(--glass-border-soft);
  border-radius: var(--r-lg);
  box-shadow: var(--glass-shadow);
}
.card.solid { background: var(--glass-3); }
.card.pad { padding: 36rpx; }

/* 英雄问候卡片 */
.hero {
  position: relative;
  overflow: hidden;
  padding: 40rpx 36rpx 36rpx;
  margin-top: 8rpx;
}
.hero .greet {
  display: flex;
  align-items: center;
  gap: 16rpx;
  font-size: 42rpx;
  font-weight: 700;
  color: var(--ink);
}
.hero .greet .wave {
  font-size: 48rpx;
  animation: floaty 3s ease-in-out infinite;
}
.hero .sub {
  margin-top: 10rpx;
  font-size: 26rpx;
  color: var(--muted);
  letter-spacing: 0.4rpx;
}
.hero .deco {
  position: absolute;
  top: -36rpx;
  right: -44rpx;
  width: 260rpx;
  height: 260rpx;
  color: rgba(91,157,249,0.16);
  animation: floaty 6s ease-in-out infinite;
  pointer-events: none;
}
.deco-ring {
  position: absolute;
  border: 2rpx solid currentColor;
  border-radius: 50%;
  box-sizing: border-box;
}
.deco-ring.r1 { inset: 0; }
.deco-ring.r2 { inset: 30rpx; }
.deco-ring.r3 { inset: 60rpx; }
.hero .deco::before,
.hero .deco::after {
  content: "";
  position: absolute;
  background: currentColor;
}
.hero .deco::before {
  left: 50%; top: 0; bottom: 0;
  width: 2rpx;
  transform: translateX(-50%);
}
.hero .deco::after {
  top: 50%; left: 0; right: 0;
  height: 2rpx;
  transform: translateY(-50%);
}
.hero .deco2 {
  position: absolute;
  bottom: -52rpx;
  right: 80rpx;
  width: 140rpx;
  height: 140rpx;
  color: rgba(6,182,212,0.14);
  font-size: 100rpx;
  line-height: 140rpx;
  text-align: center;
  animation: floaty 7s ease-in-out infinite reverse;
  pointer-events: none;
}

/* 今日学习进度 */
.today {
  margin-top: 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 24rpx;
  color: var(--ink-2);
}
.today .mins .num {
  font-size: 44rpx;
  font-weight: 700;
  color: var(--brand-deep);
}
.today .mins .unit {
  font-size: 24rpx;
  color: var(--muted);
  font-weight: 500;
}
.today .mins .target {
  color: var(--muted-2);
}
.today .goal {
  color: var(--muted);
  font-weight: 600;
}
.pbar {
  margin-top: 20rpx;
  height: 18rpx;
  border-radius: var(--r-pill);
  background: rgba(120,160,210,0.18);
  overflow: hidden;
  position: relative;
}
.pbar > .pbar-inner {
  display: block;
  height: 100%;
  width: 0;
  border-radius: var(--r-pill);
  background: linear-gradient(90deg, var(--brand), var(--cyan));
  box-shadow: 0 0 24rpx rgba(91,157,249,0.6);
  transition: width 1.2s cubic-bezier(.22,1,.36,1);
  position: relative;
}
.pbar > .pbar-inner::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
  background-size: 200% 100%;
  animation: shimmer 2.4s linear infinite;
}
.hero .cta {
  margin-top: 32rpx;
}
.hero .btn-primary { height: 88rpx; line-height: 88rpx; }

/* 按钮 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  height: 92rpx;
  padding: 0 48rpx;
  border-radius: var(--r-pill);
  font-size: 30rpx;
  font-weight: 600;
  transition: transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .25s, opacity .25s;
  line-height: 92rpx;
}
.btn-hover { transform: scale(0.96); }
.btn-primary {
  background: linear-gradient(135deg, var(--brand), var(--blue-600));
  color: #fff;
  box-shadow: 0 20rpx 48rpx rgba(46,123,224,0.34);
}
.btn-block { width: 100%; }
.btn-ico {
  font-size: 24rpx;
}

/* 区块标题 */
.sec-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 44rpx 4rpx 24rpx;
}
.sec-head .t {
  font-size: 34rpx;
  font-weight: 700;
  color: var(--ink);
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.sec-head .t .bar {
  width: 8rpx;
  height: 32rpx;
  border-radius: 8rpx;
  background: linear-gradient(180deg, var(--brand), var(--blue-600));
}
.sec-head .more {
  font-size: 24rpx;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 4rpx;
}
.sec-head .more-arrow {
  font-size: 28rpx;
  line-height: 1;
}
.sec-head .more-hover { opacity: 0.6; }
.sec-head .refresh-ico {
  font-size: 30rpx;
  line-height: 1;
  display: inline-block;
  animation: spinRefresh 1.1s linear infinite;
}
@keyframes spinRefresh {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 视频横向滚动区 */
.vid-scroll {
  white-space: nowrap;
  overflow-x: auto;
  padding: 8rpx 4rpx 16rpx;
  margin: 0 -4rpx;
}
.vcard {
  display: inline-block;
  vertical-align: top; /* 顶部对齐，防止行内块与基线对齐导致卡片整体下沉 */
  width: 312rpx;
  margin-right: 24rpx; /* 横向卡片间距（原 flex gap 在无 enable-flex 时需手动补充） */
  border-radius: var(--r-md);
  background: var(--glass-2);
  border: 2rpx solid var(--glass-border-soft);
  box-shadow: var(--glass-shadow-sm);
  overflow: hidden;
  transition: transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s;
}
.vcard-hover {
  transform: scale(0.97);
}
.vcard-empty {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 312rpx;
  min-height: 220rpx;
  border-radius: var(--r-md);
  border: 2rpx dashed rgba(120, 160, 210, 0.35);
  background: var(--glass-2);
  color: var(--muted);
  font-size: 26rpx;
  white-space: normal;
}
.vthumb {
  position: relative;
  height: 150rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.vthumb.has-cover { background: #1E2A3B; }
.vthumb-img {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.vthumb-mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(14,26,43,0.18);
}
.vthumb-1 { background: linear-gradient(135deg, #5B9DF9, #2E7BE0); }
.vthumb-2 { background: linear-gradient(135deg, #8B5CF6, #6D28D9); }
.vthumb-3 { background: linear-gradient(135deg, #06B6D4, #0891B2); }
.vthumb-4 { background: linear-gradient(135deg, #F59E0B, #D97706); }
.vthumb-5 { background: linear-gradient(135deg, #22C55E, #16A34A); }
.vthumb .dur {
  position: absolute;
  right: 14rpx;
  bottom: 14rpx;
  height: 40rpx;
  padding: 0 14rpx;
  border-radius: var(--r-pill);
  background: rgba(14,26,43,0.62);
  color: #fff;
  font-size: 21rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  line-height: 40rpx;
}
.vplay {
  width: 76rpx;
  height: 76rpx;
  border-radius: 50%;
  background: rgba(255,255,255,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 28rpx rgba(14,26,43,0.28);
}
.vplay-ico {
  font-size: 24rpx;
  color: var(--brand-deep);
  margin-left: 4rpx;
  line-height: 1;
}
.vbody {
  padding: 12rpx 16rpx 16rpx;
}
.vbody .vt {
  font-size: 25rpx;
  font-weight: 600;
  color: var(--ink);
  line-height: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2; /* 标准属性，增强兼容性 */
}
.vprog {
  margin-top: 12rpx;
  height: 8rpx;
  border-radius: var(--r-pill);
  background: rgba(120,160,210,0.18);
  overflow: hidden;
}
.vprog > .vprog-inner {
  display: block;
  height: 100%;
  border-radius: var(--r-pill);
  background: linear-gradient(90deg, var(--brand), var(--blue-600));
}
.vbody .vpct {
  margin-top: 8rpx;
  font-size: 20rpx;
  color: var(--muted);
  font-weight: 600;
}

/* 能力技能网格 */
.mod-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
}
.mod-card {
  background: var(--glass);
  border: 2rpx solid var(--glass-border-soft);
  border-radius: var(--r-md);
  box-shadow: var(--glass-shadow-sm);
  padding: 28rpx 24rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14rpx;
  transition: transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .25s;
}
.mod-hover {
  transform: scale(0.96);
}
.mod-ico {
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mod-ico text {
  font-size: 34rpx;
  color: #ffffff;
  line-height: 1;
}
.mod-ico-1 { background: linear-gradient(135deg, #5B9DF9, #2E7BE0); }
.mod-ico-2 { background: linear-gradient(135deg, #8B5CF6, #6D28D9); }
.mod-ico-3 { background: linear-gradient(135deg, #06B6D4, #0891B2); }
.mod-ico-4 { background: linear-gradient(135deg, #F59E0B, #D97706); }
.mod-name {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--ink);
}
.mod-desc {
  font-size: 22rpx;
  color: var(--muted);
}
.index-empty {
  padding: 32rpx 8rpx;
  text-align: center;
  font-size: 24rpx;
  color: var(--muted);
}

/* 推荐列表 */
.rec-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.rcard {
  display: flex;
  align-items: center;
  gap: 26rpx;
  padding: 26rpx;
  border-radius: var(--r-md);
  background: var(--glass);
  border: 2rpx solid var(--glass-border-soft);
  box-shadow: var(--glass-shadow-sm);
  transition: transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .25s;
}
.rcard-hover {
  transform: scale(0.98);
}
.rthumb {
  width: 104rpx;
  height: 104rpx;
  border-radius: 28rpx;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rthumb-1 { background: linear-gradient(135deg, #5B9DF9, #2E7BE0); }
.rthumb-2 { background: linear-gradient(135deg, #8B5CF6, #6D28D9); }
.rthumb-3 { background: linear-gradient(135deg, #06B6D4, #0891B2); }
.rthumb-ico {
  font-size: 40rpx;
  line-height: 1;
}
.rinfo {
  flex: 1;
  min-width: 0;
}
.rinfo .rt {
  font-size: 27rpx;
  font-weight: 600;
  color: var(--ink);
  line-height: 1.35;
}
.rinfo .rm {
  margin-top: 12rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex-wrap: wrap;
}
.rinfo .rm .tag {
  font-size: 20rpx;
  font-weight: 600;
  padding: 4rpx 14rpx;
  border-radius: var(--r-pill);
  background: var(--blue-50);
  color: var(--brand-deep);
  border: 2rpx solid rgba(91,157,249,0.18);
  line-height: 1.5;
}
.tag-blue { background: var(--blue-50); color: var(--brand-deep); border-color: rgba(91,157,249,0.18); }
.tag-violet { background: var(--violet-soft); color: #6D28D9; border-color: rgba(139,92,246,0.2); }
.tag-amber { background: var(--amber-soft); color: #B45309; border-color: rgba(245,158,11,0.22); }
.rinfo .rm .dur {
  font-size: 21rpx;
  color: var(--muted);
  font-weight: 600;
}
.rchev {
  color: var(--muted-2);
  flex-shrink: 0;
  transition: transform .25s, color .25s;
  font-size: 36rpx;
  line-height: 1;
}

/* AI 助手悬浮按钮 */
.ai-fab {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 55;
  width: 112rpx;
  height: 112rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand), var(--blue-600));
  box-shadow: 0 16rpx 44rpx rgba(46,123,224,0.4);
  animation: breathe 3s ease-in-out infinite;
  transition: left .3s cubic-bezier(.22,1,.36,1), top .3s cubic-bezier(.22,1,.36,1);
  touch-action: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ai-fab.dragging {
  transition: none;
  animation: none;
  box-shadow: 0 24rpx 56rpx rgba(46,123,224,0.5);
}
.ai-fab::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 4rpx solid var(--brand);
  animation: pulseRing 2.4s ease-out infinite;
}
.ai-fab-ico {
  width: 48rpx;
  height: 48rpx;
  position: relative;
  z-index: 1;
  display: block;
  background: #fff;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8z' fill='black'/%3E%3Cpath d='M19 14l.7 1.9L21.6 16.6 19.7 17.3 19 19l-.7-1.7L16.4 16.6l1.9-.7z' fill='black' opacity='0.8'/%3E%3Ccircle cx='6' cy='17' r='1.3' fill='black'/%3E%3C/svg%3E") center/contain no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8z' fill='black'/%3E%3Cpath d='M19 14l.7 1.9L21.6 16.6 19.7 17.3 19 19l-.7-1.7L16.4 16.6l1.9-.7z' fill='black' opacity='0.8'/%3E%3Ccircle cx='6' cy='17' r='1.3' fill='black'/%3E%3C/svg%3E") center/contain no-repeat;
}
.ai-fab-hover {
  transform: scale(0.92);
}
.ai-tip {
  position: absolute;
  right: 132rpx;
  top: 50%;
  transform: translateY(-50%);
  white-space: nowrap;
  background: var(--ink);
  color: #fff;
  font-size: 24rpx;
  font-weight: 600;
  padding: 12rpx 24rpx;
  border-radius: var(--r-pill);
  box-shadow: 0 12rpx 32rpx rgba(14,26,43,0.3);
}
.ai-tip::after {
  content: "";
  position: absolute;
  right: -8rpx;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
  width: 16rpx;
  height: 16rpx;
  background: var(--ink);
}
/* 按钮在左侧时，文字显示在按钮右侧（箭头朝左指向按钮） */
.ai-fab.on-left .ai-tip {
  right: auto;
  left: 132rpx;
}
.ai-fab.on-left .ai-tip::after {
  right: auto;
  left: -8rpx;
}

/* 动画 */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(36rpx); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes floaty {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-16rpx); }
}
@keyframes pulseRing {
  0% { transform: scale(.9); opacity: .7; }
  70% { transform: scale(1.5); opacity: 0; }
  100% { opacity: 0; }
}
@keyframes breathe {
  0%,100% { box-shadow: 0 16rpx 44rpx rgba(46,123,224,0.35); }
  50% { box-shadow: 0 16rpx 68rpx rgba(46,123,224,0.6); }
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.reveal {
  opacity: 0;
  animation: fadeUp .6s cubic-bezier(.22,1,.36,1) forwards;
}
.reveal.d1 { animation-delay: .06s; }
.reveal.d2 { animation-delay: .12s; }
.reveal.d3 { animation-delay: .18s; }
.reveal.d4 { animation-delay: .24s; }
.reveal.d5 { animation-delay: .30s; }
.reveal.d6 { animation-delay: .36s; }
</style>
