<template>
  <view class="cs-page">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    <view class="cs-nav">
      <view class="cs-back" hover-class="cs-back-hover" @click="goBack">
        <text class="cs-back-arrow">‹</text>
        <text>返回</text>
      </view>
      <text class="cs-nav-title">文书案例研究</text>
      <text class="cs-count">{{ cases.length }} 篇</text>
    </view>

    <!-- 主题横幅 -->
    <view class="cs-banner">
      <view class="cs-banner-ico">
        <text class="cs-banner-glyph"></text>
      </view>
      <view class="cs-banner-info">
        <text class="cs-banner-title">文书案例研究</text>
        <text class="cs-banner-desc">研读涉外法律文书与典型案例，拆解裁判思路</text>
      </view>
    </view>

    <!-- 分类筛选 -->
    <scroll-view v-if="categories.length" scroll-x class="cs-cats" show-scrollbar="false">
      <view class="cs-cat" :class="{ 'is-active': categoryFilter === 'all' }" @click="categoryFilter = 'all'">全部（{{ cases.length }}）</view>
      <view
        v-for="c in categories"
        :key="c"
        class="cs-cat"
        :class="{ 'is-active': categoryFilter === c }"
        @click="categoryFilter = c"
      >{{ c }}</view>
    </scroll-view>

    <scroll-view scroll-y class="cs-scroll" show-scrollbar="false">
      <view v-if="loading" class="cs-empty">
        <view class="cs-spinner"></view>
        <text>正在加载案例资源...</text>
      </view>
      <view v-else-if="!cases.length" class="cs-empty">
        <view class="cs-empty-ico"></view>
        <text class="cs-empty-title">暂无文书案例资源</text>
        <text class="cs-empty-sub">请在管理端录入 case 类型资源并上线</text>
      </view>
      <view v-else-if="!filteredCases.length" class="cs-empty">
        <view class="cs-empty-ico"></view>
        <text class="cs-empty-title">未找到匹配的案例</text>
      </view>
      <template v-else>
        <view
          class="cs-card"
          v-for="item in filteredCases"
          :key="item.id"
          :class="{ 'is-open': currentId === item.id }"
          @click="toggleDetail(item)"
        >
          <view class="cs-card-head">
            <view v-if="item.cover" class="cs-cover" :style="{ backgroundImage: 'url(' + item.cover + ')' }"></view>
            <view v-else class="cs-cover cs-cover-plain"></view>
            <view class="cs-card-info">
              <view class="cs-tags">
                <text class="cs-tag">{{ item.category || '未分类' }}</text>
                <text v-if="item.meta" class="cs-tag cs-tag-soft">{{ item.meta }}</text>
              </view>
              <text class="cs-title">{{ item.title }}</text>
              <text v-if="item.wordCount" class="cs-words">约 {{ item.wordCount }} 字</text>
              <text v-if="item.description" class="cs-summary">{{ item.description }}</text>
            </view>
          </view>

          <!-- 展开正文 -->
          <view v-if="currentId === item.id" class="cs-body">
            <view v-if="bodyLoading" class="cs-body-loading">
              <view class="cs-spinner cs-spinner-sm"></view>
              <text>正在加载正文...</text>
            </view>
            <template v-else>
              <text v-if="bodyContent" class="cs-content">{{ bodyContent }}</text>
              <text v-else class="cs-body-empty">暂无正文内容</text>
              <view v-if="item.fileUrl" class="cs-link" @click.stop="openOriginal(item.fileUrl)">打开原文（PDF / 链接）</view>
            </template>
          </view>
        </view>
      </template>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 0,
      loading: false,
      resourceLoading: false,
      caseBodies: {},
      cases: [],
      currentId: '',
      bodyLoading: false,
      bodyContent: '',
      categoryFilter: 'all'
    }
  },
  computed: {
    categories() {
      return [...new Set(this.cases.map(c => c.category).filter(Boolean))]
    },
    filteredCases() {
      return this.cases.filter(c => {
        const matchCategory = this.categoryFilter === 'all' || c.category === this.categoryFilter
        return matchCategory
      })
    }
  },
  onLoad() {
    this.statusBarHeight = this.getStatusBarHeight()
    this.loadCases()
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
    async loadCases() {
      if (this.resourceLoading) return
      this.resourceLoading = true
      this.loading = true
      try {
        const resourcesObj = uniCloud.importObject('resources', { customUI: true })
        const r = (await resourcesObj.listPublic({ type: 'case' })) || {}
        if (r.errCode === 0) {
          this.cases = (r.list || []).map(doc => ({
            id: doc._id,
            title: doc.title || '',
            category: doc.cat || '',
            meta: doc.meta || '',
            description: doc.description || '',
            wordCount: doc.wordCount || 0,
            cover: doc.cover || '',
            fileUrl: doc.fileUrl || ''
          }))
        }
      } catch (e) {
        uni.showToast({ title: (e && e.errMsg) || '案例资源加载失败', icon: 'none' })
      } finally {
        this.resourceLoading = false
        this.loading = false
      }
    },
    async toggleDetail(item) {
      if (this.currentId === item.id) {
        this.currentId = ''
        this.bodyContent = ''
        return
      }
      this.currentId = item.id
      if (this.caseBodies && this.caseBodies[item.id] !== undefined) {
        this.bodyContent = this.caseBodies[item.id]
        return
      }
      this.caseBodies = this.caseBodies || {}
      this.bodyLoading = true
      try {
        const resourcesObj = uniCloud.importObject('resources', { customUI: true })
        const r = (await resourcesObj.get({ id: item.id })) || {}
        if (r.errCode === 0 && r.doc) {
          this.bodyContent = String(r.doc.content || '')
        } else {
          this.bodyContent = ''
        }
      } catch (e) {
        this.bodyContent = ''
      } finally {
        this.caseBodies[item.id] = this.bodyContent
        this.bodyLoading = false
      }
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
  background: #FDF8F3;
}

.cs-page {
  min-height: 100vh;
  background: #FDF8F3;
  color: #3A2416;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  display: flex;
  flex-direction: column;
}

.status-bar {
  background: #FFFFFF;
}

.cs-nav {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 32rpx;
  background: #FFFFFF;
  border-bottom: 1rpx solid rgba(180, 100, 60, 0.10);
}

.cs-back {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 16rpx 8rpx 8rpx;
  font-size: 27rpx;
  color: #B45309;
}

.cs-back-hover {
  opacity: 0.6;
}

.cs-back-arrow {
  font-size: 36rpx;
  line-height: 1;
}

.cs-nav-title {
  font-size: 31rpx;
  font-weight: 700;
  color: #7F1D1D;
}

.cs-count {
  font-size: 24rpx;
  color: #B45309;
  font-weight: 600;
}

/* 横幅 */
.cs-banner {
  margin: 24rpx 32rpx 0;
  padding: 34rpx 30rpx;
  border-radius: 30rpx;
  background: linear-gradient(120deg, #7F1D1D 0%, #DC2626 60%, #F97316 100%);
  display: flex;
  align-items: center;
  gap: 22rpx;
  box-shadow: 0 16rpx 40rpx rgba(220, 38, 38, 0.22);
}

.cs-banner-ico {
  width: 76rpx;
  height: 76rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cs-banner-glyph {
  width: 38rpx;
  height: 38rpx;
  background: #fff;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><path d='m14.5 15.5 3 3L19 17l-3-3'/><path d='m8 12 4.5 4.5'/><path d='M2 22 7.5 16.5'/><path d='M18.5 5.5a2 2 0 0 0-2.8 0L9.2 11.9a2 2 0 0 0 0 2.8l2.7 2.7a2 2 0 0 0 2.8 0l6.4-6.4a2 2 0 0 0 0-2.8l-2.7-2.7z'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><path d='m14.5 15.5 3 3L19 17l-3-3'/><path d='m8 12 4.5 4.5'/><path d='M2 22 7.5 16.5'/><path d='M18.5 5.5a2 2 0 0 0-2.8 0L9.2 11.9a2 2 0 0 0 0 2.8l2.7 2.7a2 2 0 0 0 2.8 0l6.4-6.4a2 2 0 0 0 0-2.8l-2.7-2.7z'/></svg>") center/contain no-repeat;
}

.cs-banner-info {
  flex: 1;
  min-width: 0;
}

.cs-banner-title {
  display: block;
  font-size: 33rpx;
  font-weight: 800;
  color: #fff;
  letter-spacing: 1rpx;
}

.cs-banner-desc {
  display: block;
  margin-top: 6rpx;
  font-size: 22rpx;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.88);
}

/* 分类筛选 */
.cs-cats {
  margin-top: 22rpx;
  white-space: nowrap;
  padding: 0 32rpx;
  box-sizing: border-box;
}

.cs-cat {
  display: inline-block;
  margin-right: 14rpx;
  padding: 10rpx 26rpx;
  border-radius: 999rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: #8A5A44;
  background: #FFFFFF;
  border: 1rpx solid rgba(180, 100, 60, 0.18);
}

.cs-cat.is-active {
  background: linear-gradient(135deg, #DC2626, #F97316);
  color: #fff;
  border-color: transparent;
}

/* 滚动列表 */
.cs-scroll {
  flex: 1;
  height: 0;
  padding: 24rpx 32rpx 60rpx;
  box-sizing: border-box;
}

/* 卡片 */
.cs-card {
  background: #FFFFFF;
  border-radius: 26rpx;
  margin-bottom: 22rpx;
  overflow: hidden;
  border: 1rpx solid rgba(180, 100, 60, 0.12);
  box-shadow: 0 10rpx 30rpx rgba(140, 60, 30, 0.06);
  transition: border-color .2s;
}

.cs-card.is-open {
  border-color: #F59E0B;
}

.cs-card-head {
  display: flex;
  gap: 20rpx;
  padding: 26rpx;
}

.cs-cover {
  width: 150rpx;
  height: 190rpx;
  border-radius: 16rpx;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
}

.cs-cover-plain {
  background: linear-gradient(150deg, #7F1D1D 0%, #DC2626 55%, #F97316 100%);
}

.cs-card-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.cs-tags {
  display: flex;
  align-items: center;
  gap: 10rpx;
  flex-wrap: wrap;
}

.cs-tag {
  font-size: 20rpx;
  font-weight: 600;
  padding: 4rpx 14rpx;
  border-radius: 999rpx;
  background: #FEF2F2;
  color: #DC2626;
}

.cs-tag-soft {
  background: #FFFBEB;
  color: #D97706;
}

.cs-title {
  margin-top: 12rpx;
  font-size: 29rpx;
  font-weight: 700;
  color: #3A2416;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cs-words {
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #A07A5F;
}

.cs-summary {
  margin-top: 6rpx;
  font-size: 22rpx;
  color: #8A7A6A;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 展开正文 */
.cs-body {
  border-top: 1rpx dashed rgba(180, 100, 60, 0.20);
  padding: 26rpx;
  background: #FDF6EE;
}

.cs-body-loading {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 24rpx;
  color: #A07A5F;
}

.cs-content {
  display: block;
  font-size: 27rpx;
  line-height: 1.9;
  color: #4A3326;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 800rpx;
  overflow-y: auto;
}

.cs-body-empty {
  font-size: 24rpx;
  color: #A07A5F;
}

.cs-link {
  margin-top: 22rpx;
  display: inline-flex;
  align-items: center;
  padding: 14rpx 30rpx;
  border-radius: 999rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: #DC2626;
  background: #FFFFFF;
  border: 1rpx solid #FECACA;
}

/* 空 / 加载 */
.cs-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 140rpx 40rpx;
  text-align: center;
}

.cs-empty-ico {
  width: 90rpx;
  height: 90rpx;
  border-radius: 24rpx;
  background: #FEF2F2;
  margin-bottom: 22rpx;
}

.cs-empty-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #3A2416;
}

.cs-empty-sub {
  margin-top: 10rpx;
  font-size: 23rpx;
  color: #A07A5F;
}

.cs-spinner {
  width: 44rpx;
  height: 44rpx;
  border: 4rpx solid #FECACA;
  border-top-color: #DC2626;
  border-radius: 50%;
  animation: cs-spin 0.8s linear infinite;
  margin-bottom: 16rpx;
}

.cs-spinner-sm {
  width: 26rpx;
  height: 26rpx;
  border-width: 3rpx;
  margin-bottom: 0;
}

@keyframes cs-spin {
  to { transform: rotate(360deg); }
}
</style>
