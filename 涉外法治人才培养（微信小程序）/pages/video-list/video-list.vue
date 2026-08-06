<template>
  <view class="vl-page">
    <!-- 状态栏安全区占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    <!-- 自定义导航栏 -->
    <view class="vl-nav">
      <view class="vl-back" hover-class="vl-back-hover" @click="goBack">
        <text class="vl-back-arrow">‹</text>
        <text>返回</text>
      </view>
      <text class="vl-nav-title">全部视频</text>
      <view class="vl-nav-right"></view>
    </view>

    <!-- 全部视频竖向列表 -->
    <scroll-view scroll-y class="vl-scroll" show-scrollbar="false">
      <view
        class="vrow"
        v-for="(video, idx) in videoList"
        :key="idx"
        hover-class="vrow-hover"
        @click="openVideo(video)"
      >
        <view class="vthumb" :class="'vthumb-' + (idx + 1)">
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

    <!-- 底部提示 -->
    <view class="vl-tip">
      <text class="vl-tip-ico ri-arrow-right-s-line"></text>
      <text>选择一个视频开始学习</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 0,
      videoList: [
        { title: '国际商事仲裁实务', duration: '24:18', progress: 75 },
        { title: '跨境合规与出口管制', duration: '31:05', progress: 40 },
        { title: 'WTO争端解决机制', duration: '18:42', progress: 90 },
        { title: '涉外合同起草要点', duration: '27:33', progress: 15 },
        { title: '法律英语写作进阶', duration: '22:09', progress: 60 }
      ]
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
          uni.switchTab({ url: '/pages/index/index' })
        }
      })
    },
    // 选择视频 -> 进入视频学习详情页（带防连点，避免路由竞争）
    openVideo(video) {
      if (this._navLocking) return
      this._navLocking = true
      setTimeout(() => { this._navLocking = false }, 600)
      uni.navigateTo({
        url: '/pages/video-detail/video-detail?title=' + encodeURIComponent(video.title) + '&duration=' + encodeURIComponent(video.duration)
      })
    }
  }
}
</script>

<style>
/* ============ Design Tokens ============ */
page {
  --brand-deep: #2E7BE0;
  --ink: #16314F;
  --muted: #7A92B0;
  --glass-2: rgba(255, 255, 255, 0.68);
  --glass-border-soft: rgba(255, 255, 255, 0.45);
  --glass-shadow-sm: 0 12rpx 36rpx rgba(46, 123, 224, 0.10);
  --r-md: 36rpx;
  --r-pill: 999rpx;
  background-color: #f2f6fd;
}

/* ============ 页面 ============ */
.vl-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.status-bar {
  width: 100%;
  background: #ffffff;
}

/* ===== 导航栏 ===== */
.vl-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 24rpx;
  background: #ffffff;
  border-bottom: 1rpx solid #e8eef8;
}

.vl-back {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: 12rpx 16rpx;
  margin-left: -16rpx;
  font-size: 28rpx;
  color: #2E7BE0;
}

.vl-back-hover {
  opacity: 0.6;
}

.vl-back-arrow {
  font-size: 44rpx;
  line-height: 1;
  margin-top: -6rpx;
}

.vl-nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1b2233;
}

.vl-nav-right {
  width: 120rpx;
}

/* ===== 全部视频竖向列表 ===== */
.vl-scroll {
  flex: 1;
  height: 0;
  padding: 24rpx 32rpx;
  box-sizing: border-box;
}

.vrow {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  border-radius: 28rpx;
  background: var(--glass-2);
  border: 2rpx solid var(--glass-border-soft);
  box-shadow: var(--glass-shadow-sm);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.vrow-hover {
  transform: scale(0.97);
}

/* ===== 小缩略图 ===== */
.vthumb {
  position: relative;
  width: 200rpx;
  height: 128rpx;
  flex-shrink: 0;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.vthumb-1 { background: linear-gradient(135deg, #5B9DF9, #2E7BE0); }
.vthumb-2 { background: linear-gradient(135deg, #8B5CF6, #6D28D9); }
.vthumb-3 { background: linear-gradient(135deg, #06B6D4, #0891B2); }
.vthumb-4 { background: linear-gradient(135deg, #F59E0B, #D97706); }
.vthumb-5 { background: linear-gradient(135deg, #22C55E, #16A34A); }

.vplay {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.18);
}

.vplay-ico {
  font-size: 22rpx;
  color: var(--brand-deep);
  margin-left: 3rpx;
  line-height: 1;
}

.dur {
  position: absolute;
  right: 10rpx;
  bottom: 10rpx;
  height: 32rpx;
  padding: 0 10rpx;
  border-radius: var(--r-pill);
  background: rgba(8, 14, 30, 0.55);
  color: #ffffff;
  font-size: 20rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
}

/* ===== 行内容 ===== */
.vbody {
  flex: 1;
  min-width: 0;
}

.vbody .vt {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--ink);
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2; /* 标准属性，增强兼容性 */
  -webkit-box-orient: vertical;
}

.vprog {
  margin-top: 14rpx;
  height: 8rpx;
  border-radius: var(--r-pill);
  background: rgba(120, 160, 210, 0.18);
  overflow: hidden;
}

.vprog > .vprog-inner {
  display: block;
  height: 100%;
  border-radius: var(--r-pill);
  background: linear-gradient(90deg, #5B9DF9, #2563EB);
}

.vbody .vpct {
  margin-top: 8rpx;
  font-size: 22rpx;
  color: var(--muted);
  font-weight: 600;
}

/* ===== 底部提示 ===== */
.vl-tip {
  margin: 8rpx 0 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  color: var(--muted);
  font-size: 24rpx;
}

.vl-tip-ico {
  font-size: 26rpx;
  color: #2E7BE0;
}
</style>
