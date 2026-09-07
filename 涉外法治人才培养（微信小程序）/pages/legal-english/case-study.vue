<template>
  <view class="cs-page">
    <!-- 状态栏安全区占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    <!-- 自定义导航栏 -->
    <view class="cs-nav">
      <view class="cs-back" hover-class="cs-back-hover" @click="goBack">
        <text class="cs-back-arrow">‹</text>
        <text>返回</text>
      </view>
      <text class="cs-nav-title">文书案例研究</text>
      <view class="cs-nav-right"></view>
    </view>

    <!-- 固定工具栏：分类 + 搜索（不随滚动消失） -->
    <view class="cs-fixed">
      <scroll-view scroll-x class="cs-pills" show-scrollbar="false">
        <view
          class="cs-pill"
          :class="{ 'is-active': categoryFilter === 'all' }"
          @click="categoryFilter = 'all'"
        >全部（{{ cases.length }}）</view>
        <view
          class="cs-pill"
          :class="{ 'is-active': categoryFilter === c }"
          v-for="(c, i) in categories"
          :key="i"
          @click="categoryFilter = c"
        >{{ c }}</view>
      </scroll-view>
      <view class="cs-search">
        <text class="ri-search-line cs-search-ico"></text>
        <input
          class="cs-search-input"
          type="text"
          v-model="searchText"
          placeholder="搜索文书 / 案例标题"
          confirm-type="search"
        />
        <text v-if="searchText" class="ri-close-fill cs-search-clear" @click="searchText = ''"></text>
      </view>
    </view>

    <scroll-view scroll-y class="cs-scroll" show-scrollbar="false">
      <!-- 概览横幅 -->
      <view class="hero">
        <view class="hero-top">
          <view class="hero-ico"><text class="ri-scales-3-line"></text></view>
          <view class="hero-info">
            <view class="hero-title">文书案例研究</view>
            <view class="hero-sub">研读裁判文书、仲裁裁决与实务文件，拆解法律适用与裁判思路</view>
          </view>
        </view>
        <view class="hero-stats">
          <view class="hero-stat">
            <text class="hero-stat-num">{{ cases.length }}</text>
            <text class="hero-stat-label">案例总数</text>
          </view>
          <view class="hero-stat">
            <text class="hero-stat-num">{{ categories.length }}</text>
            <text class="hero-stat-label">案例分类</text>
          </view>
          <view class="hero-stat">
            <text class="hero-stat-num">{{ totalWords }}</text>
            <text class="hero-stat-label">累计字数</text>
          </view>
        </view>
      </view>

      <!-- 加载 / 空状态 -->
      <view v-if="loading" class="cs-empty">
        <view class="cs-spinner"></view>
        <text class="cs-empty-title">正在加载案例资源...</text>
      </view>
      <view v-else-if="!cases.length" class="cs-empty">
        <text class="ri-inbox-archive-line cs-empty-ico"></text>
        <text class="cs-empty-title">暂无文书案例资源</text>
        <text class="cs-empty-sub">请在管理端录入 case 类型资源并上线</text>
      </view>
      <view v-else-if="!filteredCases.length" class="cs-empty">
        <text class="ri-search-line cs-empty-ico"></text>
        <text class="cs-empty-title">未找到匹配的案例</text>
        <text class="cs-empty-sub">可尝试清空搜索关键词或切换分类</text>
      </view>

      <!-- 案例卡片列表 -->
      <view v-else class="cs-list">
        <view
          class="cs-card"
          :class="{ 'is-open': expandedId === item.id }"
          v-for="(item, idx) in filteredCases"
          :key="item.id"
          hover-class="cs-card-hover"
          @click="toggleDetail(item)"
        >
          <view class="cs-card-head">
            <view class="cs-card-top">
              <view class="cs-tags">
                <text class="cs-tag">{{ item.category || '未分类' }}</text>
                <text v-if="item.meta" class="cs-tag cs-tag-soft">{{ item.meta }}</text>
              </view>
              <text class="ri-arrow-down-s-line cs-fold-ico" :class="{ 'is-open': expandedId === item.id }"></text>
            </view>
            <text class="cs-card-title">{{ item.title }}</text>
            <view class="cs-card-meta">
              <text v-if="item.wordCount" class="cs-meta-item">约 {{ item.wordCount }} 字</text>
              <text v-if="item.description" class="cs-meta-item cs-meta-desc">{{ item.description }}</text>
            </view>
            <view class="cs-card-footer">
              <view class="cs-read-btn">
                <text class="ri-book-open-line cs-read-ico"></text>
                <text>{{ expandedId === item.id ? '收起研读' : '研读案例' }}</text>
              </view>
            </view>
          </view>

          <!-- 展开的正文 -->
          <view v-if="expandedId === item.id" class="cs-body">
            <view v-if="bodyLoading" class="cs-body-loading">
              <view class="cs-spinner cs-spinner-sm"></view>
              <text>正在加载正文...</text>
            </view>
            <view v-else>
              <text v-if="bodyContent" class="cs-body-text">{{ bodyContent }}</text>
              <text v-else class="cs-body-empty">暂无正文内容</text>
              <view v-if="item.fileUrl" class="cs-body-foot">
                <view class="cs-original-btn" @click.stop="openOriginal(item.fileUrl)">
                  <text class="ri-earth-line cs-original-ico"></text>
                  <text>打开原文（PDF / 链接）</text>
                </view>
              </view>
            </view>
          </view>
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
      cases: [],
      loading: false,
      bodyLoading: false,
      searchText: '',
      categoryFilter: 'all',
      expandedId: '',
      bodyContent: '',
      caseBodies: {}
    }
  },
  computed: {
    categories() {
      return [...new Set(this.cases.map((c) => c.category).filter(Boolean))]
    },
    filteredCases() {
      const q = (this.searchText || '').trim().toLowerCase()
      return this.cases.filter((c) => {
        const matchCategory = this.categoryFilter === 'all' || c.category === this.categoryFilter
        const matchQuery =
          !q ||
          (c.title || '').toLowerCase().includes(q) ||
          (c.category || '').toLowerCase().includes(q)
        return matchCategory && matchQuery
      })
    },
    totalWords() {
      const total = this.cases.reduce((sum, c) => sum + (Number(c.wordCount) || 0), 0)
      if (total >= 10000) return (total / 10000).toFixed(1) + 'w'
      if (total >= 1000) return (total / 1000).toFixed(1) + 'k'
      return String(total)
    }
  },
  onLoad() {
    this.statusBarHeight = this.getStatusBarHeight()
    this.loadCases()
  },
  methods: {
    async loadCases() {
      if (this.loading) return
      this.loading = true
      try {
        const CACHE_KEY = 'cs_cases_cache'
        const now = Date.now()
        try {
          const cached = uni.getStorageSync(CACHE_KEY)
          if (cached && cached.expireAt > now && Array.isArray(cached.list)) {
            this.cases = cached.list
            return
          }
        } catch (e) {}
        const resourcesObj = uniCloud.importObject('resources', { customUI: true })
        const r = (await resourcesObj.listPublic({ type: 'case' })) || {}
        if (r.errCode === 0) {
          this.cases = (r.list || []).map((doc) => ({
            id: doc._id,
            title: doc.title || '',
            category: doc.cat || '',
            meta: doc.meta || '',
            description: doc.description || '',
            wordCount: doc.wordCount || 0,
            cover: doc.cover || '',
            fileUrl: doc.fileUrl || ''
          }))
          try {
            uni.setStorageSync(CACHE_KEY, { expireAt: now + 5 * 60 * 1000, list: this.cases })
          } catch (e) {}
        }
      } catch (e) {
        uni.showToast({ title: (e && e.errMsg) || '案例资源加载失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    async toggleDetail(item) {
      if (this.expandedId === item.id) {
        this.expandedId = ''
        this.bodyContent = ''
        return
      }
      this.expandedId = item.id
      this.bodyContent = this.caseBodies[item.id] || ''
      if (this.caseBodies[item.id] === undefined) {
        this.bodyLoading = true
        try {
          const resourcesObj = uniCloud.importObject('resources', { customUI: true })
          const r = (await resourcesObj.get({ id: item.id })) || {}
          if (r.errCode === 0 && r.doc) {
            const content = String(r.doc.content || '')
            this.caseBodies[item.id] = content
            this.bodyContent = content
          } else {
            this.caseBodies[item.id] = ''
            this.bodyContent = ''
          }
        } catch (e) {
          this.caseBodies[item.id] = ''
          this.bodyContent = ''
        } finally {
          this.bodyLoading = false
        }
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
    }
  }
}
</script>

<style>
page {
  --brand: #2E7BE0;
  --ink: #16314F;
  --muted: #7A92B0;
  --line: rgba(120, 160, 210, 0.14);
  --bg: #f2f6fd;
  background-color: var(--bg);
}

.cs-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
}

.status-bar {
  width: 100%;
  background: #ffffff;
}

/* 导航栏 */
.cs-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 24rpx;
  background: #ffffff;
  border-bottom: 1rpx solid var(--line);
  position: relative;
  z-index: 20;
}

.cs-back {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: 12rpx 16rpx;
  margin-left: -16rpx;
  font-size: 28rpx;
  color: var(--brand);
}

.cs-back-hover {
  opacity: 0.6;
}

.cs-back-arrow {
  font-size: 44rpx;
  line-height: 1;
  margin-top: -6rpx;
}

.cs-nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1b2233;
}

.cs-nav-right {
  width: 120rpx;
}

/* 滚动区 */
.cs-scroll {
  flex: 1;
  height: 0;
  box-sizing: border-box;
}

/* 概览横幅 */
.hero {
  margin: 24rpx 24rpx 0;
  border-radius: 36rpx;
  padding: 32rpx 30rpx 28rpx;
  background: linear-gradient(135deg, #E11D48, #F97316);
  box-shadow: 0 20rpx 50rpx rgba(225, 29, 72, 0.26);
  position: relative;
  overflow: hidden;
}

.hero::after {
  content: "";
  position: absolute;
  right: -60rpx;
  top: -60rpx;
  width: 240rpx;
  height: 240rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.hero-top {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  position: relative;
  z-index: 1;
}

.hero-ico {
  width: 76rpx;
  height: 76rpx;
  flex-shrink: 0;
  border-radius: 22rpx;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  color: #ffffff;
}

.hero-info {
  flex: 1;
  min-width: 0;
}

.hero-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #ffffff;
}

.hero-sub {
  margin-top: 8rpx;
  font-size: 22rpx;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.85);
}

.hero-stats {
  margin-top: 28rpx;
  display: flex;
  position: relative;
  z-index: 1;
}

.hero-stat {
  flex: 1;
  text-align: center;
  border-right: 1rpx solid rgba(255, 255, 255, 0.2);
}

.hero-stat:last-child {
  border-right: none;
}

.hero-stat-num {
  display: block;
  font-size: 36rpx;
  font-weight: 800;
  color: #ffffff;
}

.hero-stat-label {
  margin-top: 4rpx;
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.75);
}

/* 固定工具栏 */
.cs-fixed {
  flex-shrink: 0;
  padding: 24rpx 24rpx 12rpx;
  background: var(--bg);
  border-bottom: 1rpx solid var(--line);
  z-index: 10;
}

.cs-pills {
  white-space: nowrap;
}

.cs-pill {
  display: inline-block;
  height: 56rpx;
  padding: 0 26rpx;
  margin-right: 14rpx;
  border-radius: 999rpx;
  background: #ffffff;
  border: 1rpx solid rgba(120, 160, 210, 0.24);
  color: var(--muted);
  font-size: 24rpx;
  font-weight: 500;
  line-height: 54rpx;
  vertical-align: top;
}

.cs-pill.is-active {
  background: var(--brand);
  border-color: var(--brand);
  color: #ffffff;
}

.cs-search {
  margin-top: 18rpx;
  display: flex;
  align-items: center;
  height: 76rpx;
  padding: 0 24rpx;
  border-radius: 999rpx;
  background: #ffffff;
  border: 1rpx solid rgba(120, 160, 210, 0.18);
}

.cs-search-ico {
  font-size: 30rpx;
  color: var(--muted);
  margin-right: 12rpx;
}

.cs-search-input {
  flex: 1;
  min-width: 0;
  font-size: 26rpx;
  color: var(--ink);
}

.cs-search-clear {
  font-size: 30rpx;
  color: #a9bad1;
}

/* 列表 */
.cs-list {
  padding: 20rpx 24rpx 40rpx;
}

.cs-card {
  border-radius: 28rpx;
  background: #ffffff;
  border: 1rpx solid rgba(120, 160, 210, 0.14);
  box-shadow: 0 12rpx 36rpx rgba(46, 123, 224, 0.06);
  padding: 28rpx 26rpx;
  margin-bottom: 20rpx;
  transition: border-color 0.2s ease;
}

.cs-card.is-open {
  border-color: rgba(46, 123, 224, 0.45);
}

.cs-card-hover {
  opacity: 0.85;
}

.cs-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cs-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10rpx;
}

.cs-tag {
  height: 40rpx;
  padding: 0 16rpx;
  border-radius: 10rpx;
  background: rgba(46, 123, 224, 0.1);
  color: var(--brand);
  font-size: 20rpx;
  font-weight: 600;
  line-height: 40rpx;
}

.cs-tag-soft {
  background: rgba(148, 163, 184, 0.12);
  color: #64748b;
}

.cs-fold-ico {
  font-size: 30rpx;
  color: #a9bad1;
  transition: transform 0.25s ease;
}

.cs-fold-ico.is-open {
  transform: rotate(180deg);
}

.cs-card-title {
  display: block;
  margin-top: 18rpx;
  font-size: 30rpx;
  font-weight: 700;
  color: var(--ink);
  line-height: 1.4;
}

.cs-card-meta {
  margin-top: 10rpx;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
}

.cs-meta-item {
  font-size: 22rpx;
  color: var(--muted);
  margin-right: 20rpx;
}

.cs-meta-desc {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.cs-card-footer {
  margin-top: 18rpx;
  display: flex;
  justify-content: flex-end;
}

.cs-read-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  height: 56rpx;
  padding: 0 26rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #E11D48, #F97316);
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 600;
}

.cs-read-ico {
  font-size: 26rpx;
}

/* 展开正文 */
.cs-body {
  margin-top: 22rpx;
  padding-top: 22rpx;
  border-top: 1rpx dashed rgba(120, 160, 210, 0.25);
}

.cs-body-loading {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 24rpx 0;
  color: var(--muted);
  font-size: 24rpx;
}

.cs-body-text {
  display: block;
  font-size: 26rpx;
  line-height: 1.8;
  color: #33455c;
  white-space: pre-wrap;
  word-break: break-word;
}

.cs-body-empty {
  display: block;
  padding: 24rpx 0;
  color: var(--muted);
  font-size: 24rpx;
  text-align: center;
}

.cs-body-foot {
  margin-top: 20rpx;
  display: flex;
  justify-content: flex-end;
}

.cs-original-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  height: 56rpx;
  padding: 0 24rpx;
  border-radius: 999rpx;
  background: rgba(46, 123, 224, 0.08);
  border: 1rpx solid rgba(46, 123, 224, 0.25);
  color: var(--brand);
  font-size: 24rpx;
  font-weight: 500;
}

.cs-original-ico {
  font-size: 26rpx;
}

/* 空状态 / 加载 */
.cs-empty {
  margin: 24rpx;
  padding: 80rpx 24rpx;
  border-radius: 28rpx;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cs-empty-ico {
  font-size: 72rpx;
  color: #c3d0e4;
  margin-bottom: 20rpx;
}

.cs-empty-title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--ink);
}

.cs-empty-sub {
  margin-top: 10rpx;
  font-size: 22rpx;
  color: var(--muted);
}

.cs-spinner {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(46, 123, 224, 0.2);
  border-top-color: var(--brand);
  animation: cs-rotate 0.8s linear infinite;
}

.cs-spinner-sm {
  width: 28rpx;
  height: 28rpx;
  border-width: 3rpx;
}

@keyframes cs-rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
