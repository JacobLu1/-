<template>
  <view class="page-wrap">
    <!-- 状态栏安全区占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 可滚动内容区 -->
    <scroll-view scroll-y class="screen" scroll-with-animation>
      <!-- 测评信息卡片 -->
      <view class="info-card reveal d1">
        <view class="deco a"></view>
        <view class="deco b"></view>

        <view class="card-content">
          <view class="quiz-icon">
            <text class="quiz-icon-text ri-file-list-3-line"></text>
          </view>

          <view class="quiz-name">涉外法治综合测评</view>

          <view class="quiz-meta">
            <view class="meta-item">
              <text class="meta-ico ri-time-line"></text>
              <text class="meta-label">预计时长</text>
              <text class="meta-value">45 分钟</text>
            </view>
          </view>

          <view class="quiz-desc">
            <view class="desc-title">题型说明</view>
            <view class="desc-content">含单选、多选、判断、主观题</view>
          </view>
        </view>
      </view>

      <!-- 专项测评入口卡片 -->
      <view class="special-card reveal d2" hover-class="special-hover" @click="goSpecialAssessment">
        <view class="special-content">
          <view class="special-left">
            <view class="special-icon">
              <text class="special-icon-text ri-edit-2-line"></text>
            </view>
            <view class="special-info">
              <view class="special-name">专项测评</view>
              <view class="special-desc">选择特定领域进行针对性测评</view>
            </view>
          </view>
          <text class="special-arrow ri-arrow-right-s-line"></text>
        </view>
      </view>

      <!-- 底部按钮区域 -->
      <view class="footer">
        <view class="start-btn" hover-class="start-hover" @click="startAssessment">
          <text class="start-btn-text">开始测评</text>
          <text class="start-btn-ico ri-arrow-right-s-line"></text>
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
      statusBarHeight: 0
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
    navBack() {
      uni.navigateBack({ delta: 1 })
    },
    startAssessment() {
      // assessment 不再是 tabBar，可用 navigateTo 传参
      uni.navigateTo({
        url: '/pages/assessment/assessment?fromStart=true'
      })
    },
    goSpecialAssessment() {
      uni.navigateTo({
        url: '/pages/special-assessment/special-assessment'
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
  padding: 88rpx 20rpx 18rpx;
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
.bk-ico { font-size: 48rpx; font-weight: 700; color: var(--ink-2); line-height: 80rpx; display: block; text-align: center; width: 80rpx; height: 80rpx; transform: translate(4px, 0px); }

/* ---------- Screen ---------- */
.screen {
  position: relative; z-index: 5;
  flex: 1 1 auto;
  min-height: 0;
  height: 0;
  padding: 40rpx 36rpx 60rpx;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
}

/* ---------- Info card ---------- */
.info-card {
  position: relative;
  padding: 60rpx 44rpx 52rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  overflow: hidden;
  border-radius: var(--r-lg);
  background: var(--glass);
  border: 2rpx solid var(--glass-border-soft);
  box-shadow: var(--glass-shadow);
  margin-top: 40rpx;
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

.card-content {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.quiz-icon {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand) 0%, var(--blue-600) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 28rpx 64rpx rgba(46,123,224,0.42);
  margin-bottom: 36rpx;
}
.quiz-icon-text {
  font-size: 72rpx;
  color: #fff;
}

.quiz-name {
  font-size: 40rpx;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 40rpx;
  letter-spacing: .5rpx;
}

.quiz-meta {
  display: flex;
  align-items: center;
  gap: 32rpx;
  margin-bottom: 40rpx;
  padding: 32rpx 40rpx;
  background: var(--blue-50);
  border-radius: var(--r-md);
  border: 2rpx solid rgba(91,157,249,0.22);
  width: 100%;
}

.meta-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.meta-ico {
  font-size: 40rpx;
  color: var(--brand-deep);
}

.meta-label {
  font-size: 22rpx;
  color: var(--muted);
  font-weight: 500;
}

.meta-value {
  font-size: 28rpx;
  color: var(--ink);
  font-weight: 700;
}

.quiz-desc {
  width: 100%;
  padding: 28rpx 32rpx;
  background: rgba(120,160,210,0.08);
  border-radius: var(--r-md);
  border: 2rpx solid var(--line);
}

.desc-title {
  font-size: 24rpx;
  color: var(--muted);
  font-weight: 600;
  margin-bottom: 12rpx;
}

.desc-content {
  font-size: 28rpx;
  color: var(--ink);
  font-weight: 600;
  line-height: 1.5;
}

/* ---------- Footer ---------- */
.footer {
  margin-top: 40rpx;
  padding: 0 0 20rpx;
}

.start-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  height: 100rpx;
  border-radius: var(--r-pill);
  background: linear-gradient(135deg, var(--brand), var(--blue-600));
  color: #fff;
  box-shadow: 0 20rpx 48rpx rgba(46,123,224,0.34);
  transition: transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .25s;
}

.start-hover {
  transform: scale(0.96);
}

.start-btn-text {
  font-size: 32rpx;
  font-weight: 700;
  letter-spacing: .5rpx;
}

.start-btn-ico {
  font-size: 36rpx;
  line-height: 1;
}

/* ---------- Special card ---------- */
.special-card {
  margin-top: 24rpx;
  padding: 28rpx 32rpx;
  border-radius: var(--r-lg);
  background: var(--glass);
  border: 2rpx solid var(--glass-border-soft);
  box-shadow: var(--glass-shadow-sm);
  transition: all .25s;
}
.special-hover {
  transform: scale(0.98);
  box-shadow: var(--glass-shadow);
}
.special-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.special-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}
.special-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 28rpx;
  background: linear-gradient(135deg, var(--violet), #6D28D9);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16rpx 40rpx rgba(139,92,246,0.30);
  flex-shrink: 0;
}
.special-icon-text {
  font-size: 44rpx;
  color: #fff;
}
.special-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.special-name {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--ink);
}
.special-desc {
  font-size: 24rpx;
  color: var(--muted);
}
.special-arrow {
  font-size: 36rpx;
  color: var(--muted);
}

/* ---------- Animations ---------- */
@keyframes fadeUp { from { opacity: 0; transform: translateY(36rpx); } to { opacity: 1; transform: translateY(0); } }

.reveal { opacity: 0; animation: fadeUp .6s cubic-bezier(.22,1,.36,1) forwards; }
.reveal.d1 { animation-delay: .06s; }
.reveal.d2 { animation-delay: .18s; }
</style>
