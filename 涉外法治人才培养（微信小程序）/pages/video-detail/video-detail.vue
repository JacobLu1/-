<template>
  <view class="vd-page">
    <!-- 状态栏安全区占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    <!-- 自定义导航栏 -->
    <view class="vd-nav">
      <view class="vd-back" hover-class="vd-back-hover" @click="goBack">
        <text class="vd-back-arrow">‹</text>
        <text>返回</text>
      </view>
      <text class="vd-nav-title">视频学习</text>
      <view class="vd-nav-right"></view>
    </view>

    <scroll-view scroll-y class="vd-scroll">
      <!-- 视频播放器（小程序原生 video 组件：自带播放/暂停、可拖动进度条、音量、全屏等控件） -->
      <view class="vd-player-wrap">
        <video
          id="mainVideo"
          class="vd-video"
          :src="videoSrc"
          :controls="true"
          :show-center-play-btn="false"
          :enable-progress-gesture="true"
          :enable-play-gesture="true"
          :show-mute-btn="true"
          :show-fullscreen-btn="true"
          :object-fit="'contain'"
          @play="onPlay"
          @pause="onPause"
          @ended="onEnded"
          @error="onError"
          @timeupdate="onTimeUpdate"
          @fullscreenchange="onFullscreenChange"
        ></video>
        <!-- 进入页面不自动播放，显示开始播放图标，点击后才开始播放 -->
        <view v-if="!started" class="vd-start-mask" @click="startPlay">
          <text class="ri-play-circle-fill vd-start-icon"></text>
        </view>
      </view>

      <!-- 视频信息 -->
      <view class="vd-info">
        <text class="vd-info-title">{{ videoTitle }}</text>
        <view class="vd-info-meta">
          <text class="vd-meta-item">时长 {{ videoDuration }}</text>
          <text class="vd-meta-dot">·</text>
          <text class="vd-meta-item">涉外法治人才系列</text>
        </view>
      </view>

      <!-- 播放速度控制 -->
      <view class="vd-section">
        <view class="vd-sec-head">
          <text class="vd-sec-title">播放速度</text>
          <text class="vd-sec-sub">当前 {{ playbackRate }}x</text>
        </view>
        <view class="vd-speed-row">
          <view
            v-for="r in speedOptions"
            :key="r"
            class="vd-speed-chip"
            :class="{ active: playbackRate === r }"
            hover-class="vd-speed-chip-hover"
            @click="setSpeed(r)"
          >{{ r }}x</view>
        </view>
      </view>

      <!-- 课程简介 -->
      <view class="vd-section">
        <view class="vd-sec-head">
          <text class="vd-sec-title">课程简介</text>
        </view>
        <text class="vd-desc">{{ videoDesc }}</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { resolveResourceUrl } from '@/utils/video-config.js'

export default {
  data() {
    return {
      statusBarHeight: 0,
      // 视频地址由 utils/video-config.js 统一提供：
      // 本地开发默认走 scripts/serve-video.js（localhost:8972）
      // 上线时在 video-config.js 填 VIDEO_BASE_ONLINE 云存储地址即可
      // 视频体积大，不能打进小程序包（主包上限 2MB），否则会报 MEDIA_ERR_SRC_NOT_SUPPORTED
      // 开发者工具：勾选“不校验合法域名”
      videoSrc: '',
      videoTitle: '暂无视频',
      videoDuration: '--:--',
      videoDesc: '请从视频列表选择真实资源',
      speedOptions: [0.5, 0.75, 1, 1.25, 1.5, 2],
      playbackRate: 1,
      isPlaying: false,
      // 是否已点击开始播放（未开始时显示开始按钮，不自动播放）
      started: false
    }
  },
  onLoad(options) {
    // 读取列表页传入的视频标题 / 时长参数
    if (options && options.title) {
      try {
        this.videoTitle = decodeURIComponent(options.title)
      } catch (e) {
        this.videoTitle = options.title
      }
    }
    if (options && options.duration) {
      try {
        this.videoDuration = decodeURIComponent(options.duration)
      } catch (e) {
        this.videoDuration = options.duration
      }
    }
    this.statusBarHeight = this.getStatusBarHeight()
    if (options && options.id) {
      this.loadResource(options.id)
    }
  },
  onReady() {
    // 创建 VideoContext 用于倍速等 API 控制
    this.videoContext = uni.createVideoContext('mainVideo', this)
  },
  onUnload() {
    // 退出页面时停止播放
    if (this.videoContext) {
      try {
        this.videoContext.pause()
        this.videoContext.stop()
      } catch (e) {}
    }
  },
  methods: {
    async loadResource(id) {
      try {
        const resourcesObj = uniCloud.importObject('resources')
        const r = (await resourcesObj.get({ id })) || {}
        if (r.errCode !== 0) {
          uni.showToast({ title: r.errMsg || '视频加载失败', icon: 'none' })
          return
        }
        const doc = r.doc
        this.videoTitle = doc.title || this.videoTitle
        this.videoDuration = doc.meta || this.videoDuration
        this.videoDesc = doc.description || this.videoDesc
        const resolved = resolveResourceUrl(doc.fileUrl)
        this.videoSrc = resolved
        if (!resolved) {
          uni.showToast({ title: '该资源暂未配置文件地址', icon: 'none' })
        }
      } catch (e) {
        uni.showToast({ title: (e && e.errMsg) || '视频加载失败', icon: 'none' })
      }
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
    goBack() {
      if (this.videoContext) {
        try {
          this.videoContext.stop()
        } catch (e) {}
      }
      uni.navigateBack({
        fail: () => {
          uni.switchTab({ url: '/pages/index/index' })
        }
      })
    },
    // 点击开始播放按钮，正式启动视频
    startPlay() {
      this.started = true
      if (this.videoContext) {
        try {
          this.videoContext.play()
        } catch (e) {}
      }
    },
    // 切换播放速度（小程序原生播放器底层加速，不改变进度）
    setSpeed(rate) {
      this.playbackRate = rate
      if (this.videoContext) {
        try {
          this.videoContext.playbackRate(rate)
        } catch (e) {}
      }
    },
    onPlay() {
      this.isPlaying = true
    },
    onPause() {
      this.isPlaying = false
    },
    onEnded() {
      this.isPlaying = false
    },
    onError(e) {
      // 输出真实错误信息，便于排查（如 MEDIA_ERR_SRC_NOT_SUPPORTED 等）
      const detail = (e && e.detail) ? e.detail : null
      const errMsg = (detail && detail.errMsg) ? detail.errMsg : (e && e.errMsg ? e.errMsg : '')
      console.error('[video-detail] video error:', errMsg, detail)
      uni.showToast({ title: '视频加载失败' + (errMsg ? '（' + errMsg + '）' : ''), icon: 'none', duration: 3000 })
    },
    onTimeUpdate(e) {
      // 进度条等交互由小程序原生控件完成，此处无需额外处理
    },
    onFullscreenChange(e) {}
  }
}
</script>

<style scoped>
.vd-page {
  min-height: 100vh;
  background: #faf8ff;
  display: flex;
  flex-direction: column;
}

.status-bar {
  width: 100%;
  background: #ffffff;
}

/* ===== 导航栏 ===== */
.vd-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 24rpx;
  background: #ffffff;
  border-bottom: 1rpx solid #f0edf7;
}

.vd-back {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: 12rpx 16rpx;
  margin-left: -16rpx;
  font-size: 28rpx;
  color: #2E7BE0;
}

.vd-back-hover {
  opacity: 0.6;
}

.vd-back-arrow {
  font-size: 44rpx;
  line-height: 1;
  margin-top: -6rpx;
}

.vd-nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1b2233;
}

.vd-nav-right {
  width: 120rpx;
}

/* ===== 滚动内容 ===== */
.vd-scroll {
  flex: 1;
}

/* ===== 播放器 ===== */
.vd-player-wrap {
  position: relative;
  width: 100%;
  background: #000;
}

.vd-video {
  width: 100%;
  height: 422rpx;
}

/* ===== 开始播放图标（透明遮罩，只显示图标） ===== */
.vd-start-mask {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 透明：不遮挡视频画面，仅承接点击 */
  z-index: 10;
}

.vd-start-icon {
  font-size: 128rpx;
  color: #ffffff;
  /* 微弱投影，保证在浅色画面下也清晰可见 */
  text-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.45);
  line-height: 1;
}

/* ===== 视频信息 ===== */
.vd-info {
  background: #ffffff;
  padding: 28rpx 32rpx 12rpx;
}

.vd-info-title {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #1b2233;
  line-height: 1.4;
}

.vd-info-meta {
  display: flex;
  align-items: center;
  margin-top: 14rpx;
}

.vd-meta-item {
  font-size: 24rpx;
  color: #8a94a6;
}

.vd-meta-dot {
  margin: 0 12rpx;
  color: #c7cede;
}

/* ===== 区块 ===== */
.vd-section {
  margin-top: 20rpx;
  background: #ffffff;
  padding: 28rpx 32rpx;
}

.vd-sec-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.vd-sec-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1b2233;
}

.vd-sec-sub {
  font-size: 24rpx;
  color: #8a94a6;
}

/* ===== 倍速选项 ===== */
.vd-speed-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-top: 22rpx;
}

.vd-speed-chip {
  min-width: 120rpx;
  text-align: center;
  padding: 16rpx 8rpx;
  border-radius: 16rpx;
  background: #f3f1fa;
  color: #4a5265;
  font-size: 28rpx;
  font-weight: 500;
}

.vd-speed-chip.active {
  background: #2E7BE0;
  color: #ffffff;
  font-weight: 600;
}

.vd-speed-chip-hover {
  opacity: 0.7;
}

/* ===== 课程简介 ===== */
.vd-desc {
  display: block;
  margin-top: 20rpx;
  font-size: 28rpx;
  line-height: 1.8;
  color: #4a5265;
}
</style>
