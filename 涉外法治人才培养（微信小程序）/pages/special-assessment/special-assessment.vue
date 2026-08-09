<template>
  <view class="page-wrap">
    <!-- 状态栏安全区占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 顶部：返回 + 标题 -->
    <view class="sub-header">
      <view class="back" hover-class="bk-hover" @click="navBack" aria-label="返回">
        <text class="bk-ico">‹</text>
      </view>
      <text class="title">专项测评</text>
      <view class="spacer"></view>
    </view>

    <!-- 可滚动内容区 -->
    <scroll-view scroll-y class="screen" scroll-with-animation>
      <!-- 说明卡片 -->
      <view class="info-card reveal d1">
        <view class="info-content">
          <view class="info-icon">
            <text class="info-icon-text ri-scales-3-line"></text>
          </view>
          <view class="info-text">
            <view class="info-title">选择专项测评</view>
            <view class="info-desc">针对特定法律领域进行专项能力测评</view>
          </view>
        </view>
      </view>

      <!-- 专项列表 -->
      <view v-if="loading" class="special-empty">专项分类加载中...</view>
      <view v-else-if="!specialList.length" class="special-empty">暂无可用专项题目</view>
      <view v-else class="special-list reveal d2">
        <view 
          class="special-item" 
          v-for="(item, index) in specialList" 
          :key="index"
          hover-class="item-hover"
          @click="selectSpecial(item)"
        >
          <view class="item-icon" :style="{ background: item.bg }">
            <text class="item-icon-text" :class="item.icon"></text>
          </view>
          <view class="item-info">
            <view class="item-name">{{ item.name }}</view>
            <view class="item-desc">{{ item.desc }}</view>
            <view class="item-meta">
              <text class="meta-tag">预计 {{ item.time }}分钟</text>
            </view>
          </view>
          <text class="item-arrow ri-arrow-right-s-line"></text>
        </view>
      </view>

      <view style="height: 60rpx;"></view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 0,
      loading: true,
      specialList: []
    }
  },
  onReady() {
    this.statusBarHeight = this.getStatusBarHeight()
    this.loadSpecialList()
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
    navBack() {
      uni.navigateBack({ delta: 1 })
    },
    async loadSpecialList() {
      try {
        const questionsObj = uniCloud.importObject('questions', { customUI: true })
        const r = (await questionsObj.listPublic({ type: 'all', page: 1, pageSize: 200 })) || {}
        if (r.errCode !== 0) {
          uni.showToast({ title: r.errMsg || '专项分类加载失败', icon: 'none' })
          return
        }
        const counts = {}
        ;(r.list || []).forEach(q => {
          const name = (q.dimension || '综合').trim()
          if (!name) return
          counts[name] = (counts[name] || 0) + 1
        })
        const icons = [
          'ri-scales-3-line',
          'ri-shield-check-line',
          'ri-earth-line',
          'ri-file-list-3-line',
          'ri-book-open-line',
          'ri-gavel-line',
          'ri-global-line'
        ]
        const bgs = [
          'linear-gradient(135deg, #5B9DF9, #2E7BE0)',
          'linear-gradient(135deg, #8B5CF6, #6D28D9)',
          'linear-gradient(135deg, #06B6D4, #0891B2)',
          'linear-gradient(135deg, #F59E0B, #D97706)',
          'linear-gradient(135deg, #22C55E, #16A34A)',
          'linear-gradient(135deg, #FB7185, #E11D48)',
          'linear-gradient(135deg, #0EA5E9, #0369A1)'
        ]
        this.specialList = Object.keys(counts).map((name, index) => ({
          name,
          desc: `共 ${counts[name]} 道题目`,
          count: counts[name],
          time: Math.max(10, Math.ceil(counts[name] * 2)),
          icon: icons[index % icons.length],
          bg: bgs[index % bgs.length]
        }))
      } catch (e) {
        uni.showToast({ title: (e && e.errMsg) || '专项分类加载失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    selectSpecial(item) {
      uni.showModal({
        title: '开始专项测评',
        content: `即将开始"${item.name}"专项测评，共${item.count}题，预计${item.time}分钟。`,
        confirmText: '开始',
        success: (res) => {
          if (res.confirm) {
            // 跳转到答题页面，传递专项信息
            uni.navigateTo({
              url: `/pages/assessment/assessment?fromStart=true&special=${encodeURIComponent(item.name)}`
            })
          }
        }
      })
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
  --amber: #F59E0B;
  --rose: #FB7185;
  --violet: #8B5CF6;
  --cyan: #06B6D4;
  --r-xs: 20rpx;
  --r-sm: 28rpx;
  --r-md: 36rpx;
  --r-lg: 48rpx;
  --r-xl: 60rpx;
  --r-pill: 999rpx;
}

/* ---------- Page wrap ---------- */
.page-wrap {
  height: 100vh;
  background: linear-gradient(160deg, #EAF3FF 0%, #F4F9FF 45%, #E6F1FE 100%);
  position: relative;
  display: flex;
  flex-direction: column;
}
page { height: 100vh; }

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

/* ---------- Status bar ---------- */
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
  width: 80rpx; height: 80rpx; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: var(--glass);
  border: 2rpx solid var(--glass-border);
  color: var(--ink-2);
  box-shadow: var(--glass-shadow-sm);
  transition: transform .2s, color .2s;
  flex-shrink: 0;
}
.bk-hover { transform: scale(0.9); }
.bk-ico { font-size: 48rpx; font-weight: 700; color: var(--ink-2); line-height: 1; }

/* ---------- Screen ---------- */
.screen {
  position: relative; z-index: 5;
  flex: 1 1 auto;
  min-height: 0;
  height: 0;
  padding: 12rpx 36rpx 0;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
}
.special-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  padding: 60rpx 40rpx;
  text-align: center;
  color: var(--muted);
  font-size: 26rpx;
}

/* ---------- Info card ---------- */
.info-card {
  position: relative;
  padding: 32rpx;
  border-radius: var(--r-lg);
  background: var(--glass);
  border: 2rpx solid var(--glass-border-soft);
  box-shadow: var(--glass-shadow-sm);
  margin-top: 20rpx;
  margin-bottom: 24rpx;
}

.info-content {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.info-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand), var(--blue-600));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16rpx 40rpx rgba(46,123,224,0.30);
  flex-shrink: 0;
}
.info-icon-text {
  font-size: 48rpx;
  color: #fff;
}

.info-text {
  flex: 1;
}
.info-title {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 8rpx;
}
.info-desc {
  font-size: 26rpx;
  color: var(--muted);
  line-height: 1.5;
}

/* ---------- Special list ---------- */
.special-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.special-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 28rpx;
  border-radius: var(--r-lg);
  background: var(--glass);
  border: 2rpx solid var(--glass-border-soft);
  box-shadow: var(--glass-shadow-sm);
  transition: all .25s;
}

.item-hover {
  transform: scale(0.98);
  box-shadow: var(--glass-shadow);
}

.item-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 12rpx 32rpx rgba(46,123,224,0.20);
}
.item-icon-text {
  font-size: 44rpx;
  color: #fff;
}

.item-info {
  flex: 1;
  min-width: 0;
}
.item-name {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 8rpx;
}
.item-desc {
  font-size: 24rpx;
  color: var(--muted);
  margin-bottom: 12rpx;
  line-height: 1.4;
}
.item-meta {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.meta-tag {
  font-size: 22rpx;
  color: var(--brand-deep);
  font-weight: 600;
  padding: 4rpx 12rpx;
  background: var(--blue-50);
  border-radius: 12rpx;
}

.item-arrow {
  font-size: 36rpx;
  color: var(--muted);
  flex-shrink: 0;
}

/* ---------- Animations ---------- */
@keyframes fadeUp { from { opacity: 0; transform: translateY(36rpx); } to { opacity: 1; transform: translateY(0); } }

.reveal { opacity: 0; animation: fadeUp .6s cubic-bezier(.22,1,.36,1) forwards; }
.reveal.d1 { animation-delay: .06s; }
.reveal.d2 { animation-delay: .18s; }
</style>
