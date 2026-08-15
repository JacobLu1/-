<template>
  <view class="rd-page">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    <view class="rd-nav">
      <view class="rd-back" hover-class="rd-back-hover" @click="goBack">
        <text class="rd-back-arrow">‹</text>
        <text>返回</text>
      </view>
      <text class="rd-nav-title">文本阅读</text>
      <text class="rd-count">{{ readings.length }} 篇</text>
    </view>

    <scroll-view scroll-y class="rd-scroll" show-scrollbar="false">
      <view v-if="!readings.length" class="rd-empty">暂无文本阅读资源</view>
      <view
        class="rd-card"
        v-for="item in readings"
        :key="item.id"
        @click="toggleDetail(item.id)"
      >
        <view class="rd-card-head">
          <text class="rd-title">{{ item.title }}</text>
          <text class="rd-meta">{{ item.category || '未分类' }} · {{ item.meta || '未设置难度' }}</text>
        </view>
        <text v-if="item.description" class="rd-summary">{{ item.description }}</text>
        <view v-if="currentId === item.id" class="rd-body">
          <text class="rd-content">{{ item.content || '暂无正文，请打开原文链接。' }}</text>
          <view v-if="item.fileUrl" class="rd-link" @click.stop="openOriginal(item.fileUrl)">打开原文</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 0,
      readings: [],
      currentId: ''
    }
  },
  onLoad() {
    this.statusBarHeight = this.getStatusBarHeight()
    this.loadReadings()
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
    async loadReadings() {
      try {
        const resourcesObj = uniCloud.importObject('resources', { customUI: true })
        const r = (await resourcesObj.listPublic({ type: 'reading' })) || {}
        if (r.errCode === 0) {
          this.readings = (r.list || []).map(doc => ({
            id: doc._id,
            title: doc.title || '',
            category: doc.cat || '',
            meta: doc.meta || '',
            description: doc.description || '',
            content: doc.content || '',
            fileUrl: doc.fileUrl || ''
          }))
        }
      } catch (e) {
        uni.showToast({ title: (e && e.errMsg) || '阅读资源加载失败', icon: 'none' })
      }
    },
    toggleDetail(id) {
      this.currentId = this.currentId === id ? '' : id
    },
    openOriginal(url) {
      if (!url) {
        uni.showToast({ title: '暂无原文链接', icon: 'none' })
        return
      }
      uni.setClipboardData({
        data: url,
        success: () => uni.showToast({ title: '原文地址已复制', icon: 'none' })
      })
    },
    goBack() {
      uni.navigateBack({
        fail: () => {
          uni.navigateTo({ url: '/pages/legal-english/legal-english' })
        }
      })
    }
  }
}
</script>

<style>
page {
  background: #F4F7FC;
}

.rd-page {
  min-height: 100vh;
  background: #F4F7FC;
  color: #16314F;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.status-bar {
  background: #FFFFFF;
}

.rd-nav {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  height: 88rpx;
  padding: 0 28rpx;
  background: rgba(255,255,255,.94);
  border-bottom: 1rpx solid rgba(120,160,210,.16);
}

.rd-back {
  display: flex;
  align-items: center;
  gap: 6rpx;
  color: #2E7BE0;
  font-size: 28rpx;
  font-weight: 600;
}

.rd-back-arrow {
  font-size: 40rpx;
  line-height: 1;
}

.rd-nav-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 700;
}

.rd-count {
  width: 120rpx;
  text-align: right;
  color: #7A92B0;
  font-size: 24rpx;
}

.rd-scroll {
  height: calc(100vh - 88rpx);
}

.rd-card {
  margin: 24rpx;
  padding: 30rpx;
  background: #FFFFFF;
  border: 1rpx solid rgba(120,160,210,.16);
  border-radius: 28rpx;
  box-shadow: 0 16rpx 44rpx rgba(46,123,224,.10);
}

.rd-title {
  display: block;
  font-size: 34rpx;
  font-weight: 700;
  line-height: 1.5;
}

.rd-meta {
  display: block;
  margin-top: 12rpx;
  color: #7A92B0;
  font-size: 24rpx;
}

.rd-summary {
  display: block;
  margin-top: 20rpx;
  color: #355580;
  font-size: 27rpx;
  line-height: 1.7;
}

.rd-body {
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid rgba(120,160,210,.16);
}

.rd-content {
  display: block;
  color: #16314F;
  font-size: 28rpx;
  line-height: 1.9;
  white-space: pre-wrap;
  word-break: break-all;
}

.rd-link {
  display: inline-flex;
  margin-top: 24rpx;
  padding: 14rpx 28rpx;
  color: #2E7BE0;
  background: #EEF5FF;
  border: 1rpx solid rgba(46,123,224,.24);
  border-radius: 999rpx;
  font-size: 26rpx;
  font-weight: 600;
}

.rd-empty {
  padding: 160rpx 40rpx;
  text-align: center;
  color: #7A92B0;
  font-size: 28rpx;
}
</style>
