<template>
  <view class="rd-page">
    <view class="sticky-top">
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
      <view class="rd-nav">
        <view class="rd-back" hover-class="rd-back-hover" @click="goBack">
          <text class="rd-back-arrow">‹</text>
          <text>返回</text>
        </view>
        <text class="rd-nav-title">文本阅读</text>
        <text class="rd-count">{{ filteredReadings.length }} 篇</text>
      </view>

      <!-- 固定筛选：分类 + 搜索（不随滚动消失） -->
      <view class="rd-filter">
        <scroll-view scroll-x class="rd-pills" show-scrollbar="false">
          <view
            class="rd-pill"
            :class="{ 'is-active': categoryFilter === 'all' }"
            @click="categoryFilter = 'all'"
          >全部（{{ readings.length }}）</view>
          <view
            class="rd-pill"
            :class="{ 'is-active': categoryFilter === c }"
            v-for="(c, i) in categories"
            :key="i"
            @click="categoryFilter = c"
          >{{ c }}</view>
        </scroll-view>
        <view class="rd-search">
          <text class="ri-search-line rd-search-ico"></text>
          <input
            class="rd-search-input"
            type="text"
            v-model="searchText"
            placeholder="搜索标题 / 分类 / 简介"
            confirm-type="search"
          />
          <text v-if="searchText" class="ri-close-fill rd-search-clear" @click="searchText = ''"></text>
        </view>
      </view>
    </view>

    <view class="rd-scroll">
      <view v-if="!readings.length" class="rd-empty">暂无文本阅读资源</view>
      <view v-else-if="!filteredReadings.length" class="rd-empty">未找到匹配的阅读内容</view>
      <view
        v-else
        class="rd-card"
        v-for="item in filteredReadings"
        :key="item.id"
        hover-class="rd-card-hover"
        @click="openDetail(item)"
      >
        <view class="rd-card-head">
          <text class="rd-title">{{ item.title }}</text>
          <text class="rd-meta">{{ item.category || '未分类' }} · {{ item.meta || '未设置难度' }}</text>
        </view>
        <text v-if="item.description" class="rd-summary">{{ item.description }}</text>
        <view class="rd-foot">
          <text class="rd-read-btn">阅读全文</text>
          <text class="ri-arrow-right-s-line rd-read-arrow"></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 0,
      readings: [],
      searchText: '',
      categoryFilter: 'all'
    }
  },
  computed: {
    categories() {
      return [...new Set(this.readings.map((r) => r.category).filter(Boolean))]
    },
    filteredReadings() {
      const q = (this.searchText || '').trim().toLowerCase()
      return this.readings.filter((r) => {
        const matchCategory = this.categoryFilter === 'all' || r.category === this.categoryFilter
        const matchQuery =
          !q ||
          (r.title || '').toLowerCase().includes(q) ||
          (r.category || '').toLowerCase().includes(q) ||
          (r.description || '').toLowerCase().includes(q)
        return matchCategory && matchQuery
      })
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
    openDetail(item) {
      uni.navigateTo({
        url: '/pages/legal-english/reading-detail?id=' + encodeURIComponent(item.id || '')
      })
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

.sticky-top {
  position: sticky;
  top: 0;
  z-index: 100;
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

/* 固定筛选：分类 + 搜索 */
.rd-filter {
  padding: 20rpx 24rpx 16rpx;
  background: #F4F7FC;
  border-bottom: 1rpx solid rgba(120,160,210,.14);
}

.rd-pills {
  white-space: nowrap;
}

.rd-pill {
  display: inline-block;
  height: 56rpx;
  padding: 0 26rpx;
  margin-right: 14rpx;
  border-radius: 999rpx;
  background: #FFFFFF;
  border: 1rpx solid rgba(120,160,210,.26);
  color: #7A92B0;
  font-size: 24rpx;
  font-weight: 500;
  line-height: 54rpx;
  vertical-align: top;
}

.rd-pill.is-active {
  background: #2E7BE0;
  border-color: #2E7BE0;
  color: #FFFFFF;
}

.rd-search {
  margin-top: 18rpx;
  display: flex;
  align-items: center;
  height: 76rpx;
  padding: 0 24rpx;
  border-radius: 999rpx;
  background: #FFFFFF;
  border: 1rpx solid rgba(120,160,210,.18);
}

.rd-search-ico {
  font-size: 30rpx;
  color: #7A92B0;
  margin-right: 12rpx;
}

.rd-search-input {
  flex: 1;
  min-width: 0;
  font-size: 26rpx;
  color: #16314F;
}

.rd-search-clear {
  font-size: 30rpx;
  color: #A9BAD1;
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

.rd-card-hover { opacity: 0.88; }

.rd-foot {
  display: flex;
  align-items: center;
  margin-top: 22rpx;
  padding-top: 22rpx;
  border-top: 1rpx solid rgba(120,160,210,.16);
}
.rd-read-btn {
  font-size: 26rpx;
  font-weight: 600;
  color: #2E7BE0;
}
.rd-read-arrow {
  font-size: 32rpx;
  color: #2E7BE0;
  margin-top: -2rpx;
}

.rd-empty {
  padding: 160rpx 40rpx;
  text-align: center;
  color: #7A92B0;
  font-size: 28rpx;
}
</style>
