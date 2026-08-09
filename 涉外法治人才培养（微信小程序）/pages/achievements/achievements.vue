<template>
  <view class="page-wrap">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <view class="sub-header">
      <view class="back" hover-class="bk-hover" @click="navBack" aria-label="返回">
        <text class="bk-ico">‹</text>
      </view>
      <text class="title">全部成就</text>
      <view class="spacer"></view>
    </view>

    <scroll-view scroll-y class="screen" scroll-with-animation>
      <view v-if="!achievements.length" class="ach-empty">暂无成就</view>
      <view class="ach-grid">
        <view
          class="ach-badge"
          v-for="(b, i) in achievements"
          :key="i"
          :style="{ animationDelay: (0.06 + 0.1 * i) + 's' }"
        >
          <view class="sq" :style="{ background: b.bg }">
            <text class="sq-ico" :class="b.ico"></text>
          </view>
          <view class="n">{{ b.name }}</view>
          <view class="d">{{ b.date }}</view>
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
      achievements: []
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
    navBack() { uni.navigateBack({ delta: 1 }) }
  }
}
</script>

<style>
page {
  --brand: #5B9DF9;
  --brand-deep: #2E7BE0;
  --ink: #16314F;
  --ink-2: #355580;
  --muted: #7A92B0;
  --r-sm: 28rpx;
  --r-md: 36rpx;
  --r-lg: 48rpx;
}

.page-wrap {
  height: 100vh;
  background: linear-gradient(160deg, #EAF3FF 0%, #F4F9FF 45%, #E6F1FE 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
page { height: 100vh; overflow: hidden; }

.page-wrap::before {
  content: "";
  position: absolute;
  width: 520rpx; height: 520rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(91,157,249,0.38), transparent 70%);
  filter: blur(140rpx);
  top: -120rpx; left: -100rpx;
  z-index: 0;
  pointer-events: none;
}

.status-bar {
  width: 100%;
  flex-shrink: 0;
  background: transparent;
}

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
  background: rgba(255,255,255,0.55);
  border: 2rpx solid rgba(255,255,255,0.75);
  color: var(--ink-2);
  box-shadow: 0 12rpx 36rpx rgba(46,123,224,0.10);
  transition: transform .2s;
  flex-shrink: 0;
}
.bk-hover { transform: scale(0.9); }
.bk-ico { font-size: 48rpx; font-weight: 700; color: var(--ink-2); line-height: 1; }

.screen {
  position: relative; z-index: 5;
  flex: 1 1 auto;
  min-height: 0;
  height: 0;
  padding: 12rpx 36rpx 76rpx;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
}

.ach-empty {
  padding: 80rpx 40rpx;
  text-align: center;
  font-size: 26rpx;
  color: var(--muted);
}
.ach-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28rpx;
  padding: 12rpx 0;
}

.ach-badge {
  animation: pop .55s cubic-bezier(.34,1.56,.64,1) both;
}
.ach-badge .sq {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  box-shadow: 0 20rpx 44rpx rgba(46,123,224,0.22);
  position: relative;
  overflow: hidden;
  transition: transform .25s cubic-bezier(.34,1.56,.64,1);
}
.ach-badge:active .sq { transform: scale(0.93); }
.ach-badge .sq::after {
  content: ""; position: absolute; top: -30%; left: -20%;
  width: 80%; height: 80%;
  background: radial-gradient(circle, rgba(255,255,255,0.32), transparent 70%);
  pointer-events: none;
}
.ach-badge .sq-ico { font-size: 84rpx; position: relative; z-index: 1; line-height: 1; }
.ach-badge .n {
  font-size: 26rpx; font-weight: 600; color: var(--ink);
  margin-top: 18rpx; text-align: center;
}
.ach-badge .d {
  font-size: 20rpx; color: var(--muted);
  text-align: center; margin-top: 6rpx;
}

@keyframes pop { 0% { transform: scale(.6); opacity: 0; } 60% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }
</style>
