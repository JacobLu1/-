<template>
  <view class="vl-page">
    <view class="sticky-top">
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

      <!-- 固定顶部区：视频数 + 搜索（下滑不消失） -->
      <view class="vl-hero">
        <text class="vl-hero-text">共 <text class="vl-hero-num">{{ videoList.length }}</text> 个视频资源</text>
        <view class="vl-hero-search">
          <text class="ri-search-line vl-hero-search-ico"></text>
          <input
            class="vl-hero-input"
            type="text"
            v-model="searchText"
            placeholder="搜索视频标题"
            confirm-type="search"
          />
          <text v-if="searchText" class="ri-close-line vl-hero-clear" @click="searchText = ''"></text>
        </view>
      </view>

      <!-- 分类筛选（下滑不消失） -->
      <scroll-view scroll-x class="vl-cats" show-scrollbar="false" :enable-flex="true">
        <view class="vl-cat" :class="{ 'is-active': categoryFilter === '全部' }" @click="categoryFilter = '全部'">全部</view>
        <view
          class="vl-cat"
          :class="{ 'is-active': categoryFilter === c }"
          v-for="c in categories"
          :key="c"
          @click="categoryFilter = c"
        >{{ c }}</view>
      </scroll-view>
    </view>

    <!-- 全部视频竖向列表 -->
    <view class="vl-scroll">
      <view
        class="vrow"
        v-for="(video, idx) in filteredVideos"
        :key="idx"
        hover-class="vrow-hover"
        @click="openVideo(video)"
      >
        <view class="vthumb" :class="video.cover ? 'has-cover' : 'vthumb-' + (idx + 1)">
          <image v-if="video.cover" class="vthumb-img" :src="video.cover" mode="aspectFill"></image>
          <view class="vthumb-mask"></view>
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
    </view>

    <view v-if="!videoList.length" class="vl-empty">暂无视频资源</view>

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
      resourceLoading: false,
      searchText: '',
      categoryFilter: '全部',
      videoList: []
    }
  },
  computed: {
    categories() {
      const set = new Set()
      this.videoList.forEach((v) => {
        if (v.category) set.add(v.category)
      })
      return [...set].sort((a, b) => a.localeCompare(b, 'zh-CN'))
    },
    filteredVideos() {
      const q = (this.searchText || '').trim().toLowerCase()
      return this.videoList.filter((video) => {
        const matchCat = this.categoryFilter === '全部' || video.category === this.categoryFilter
        if (!matchCat) return false
        if (!q) return true
        return (video.title || '').toLowerCase().includes(q)
      })
    }
  },
  onLoad() {
    this.statusBarHeight = this.getStatusBarHeight()
    this.loadVideos()
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
          category: d.cat || '未分类',
          duration: d.meta || '--:--',
          progress: 0,
          cover: d.cover || '',
          fileUrl: d.fileUrl || '',
          description: d.description || ''
        }))
      } catch (e) {
        uni.showToast({ title: (e && e.errMsg) || '视频加载失败', icon: 'none' })
      } finally {
        this.resourceLoading = false
      }
    },
    // 选择视频 -> 进入视频学习详情页（带防连点，避免路由竞争）
    openVideo(video) {
      if (this._navLocking) return
      this._navLocking = true
      setTimeout(() => { this._navLocking = false }, 600)
      uni.navigateTo({
        url: '/pages/video-detail/video-detail?id=' + encodeURIComponent(video.id || '') + '&title=' + encodeURIComponent(video.title || '') + '&duration=' + encodeURIComponent(video.duration || '')
      })
    }
  }
}
</script>

<style>
/* 设计变量 */
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

.vl-page {
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

/* 固定顶部区：视频数 + 搜索（下滑不消失） */
.vl-hero {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  padding: 20rpx 24rpx;
  background: #f2f6fd;
  border-bottom: 1rpx solid rgba(120, 160, 210, 0.10);
  z-index: 10;
}

.vl-hero-text {
  font-size: 24rpx;
  color: var(--muted);
  flex-shrink: 0;
}

.vl-hero-num {
  font-weight: 700;
  color: #2E7BE0;
  font-size: 30rpx;
  margin: 0 4rpx;
}

.vl-hero-search {
  position: relative;
  flex: 1;
  min-width: 0;
  height: 68rpx;
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 2rpx solid rgba(120, 160, 210, 0.20);
  border-radius: var(--r-pill);
  padding: 0 24rpx;
}

.vl-hero-search-ico {
  font-size: 28rpx;
  color: var(--muted);
  margin-right: 12rpx;
  flex-shrink: 0;
}

.vl-hero-input {
  flex: 1;
  min-width: 0;
  font-size: 25rpx;
  color: var(--ink);
}

.vl-hero-clear {
  font-size: 28rpx;
  color: #9AAFC6;
  flex-shrink: 0;
}

/* 分类筛选 */
.vl-cats {
  flex-shrink: 0;
  white-space: nowrap;
  padding: 0 24rpx 16rpx;
  background: #f2f6fd;
  border-bottom: 1rpx solid rgba(120, 160, 210, 0.10);
  box-sizing: border-box;
}

.vl-cat {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 60rpx;
  padding: 0 26rpx;
  margin-right: 14rpx;
  border-radius: 30rpx;
  background: #ffffff;
  border: 1rpx solid #e8eef8;
  color: #455569;
  font-size: 26rpx;
}

.vl-cat.is-active {
  background: rgba(46, 123, 224, 0.12);
  border-color: #2E7BE0;
  color: #2E7BE0;
  font-weight: 600;
}

/* 全部视频竖向列表 */
.vl-scroll {
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

/* 小缩略图 */
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

/* 行内容 */
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

/* 底部提示 */
.vl-empty {
  padding: 48rpx 32rpx;
  margin: 0 32rpx 24rpx;
  border-radius: 28rpx;
  background: var(--glass-2);
  border: 2rpx dashed rgba(120, 160, 210, 0.35);
  color: var(--muted);
  font-size: 26rpx;
  text-align: center;
}

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
