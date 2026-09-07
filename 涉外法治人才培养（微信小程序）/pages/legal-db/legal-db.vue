<template>
  <view class="ldb-page">
    <view class="sticky-top">
      <!-- 状态栏安全区占位 -->
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
      <!-- 自定义导航栏 -->
      <view class="ldb-nav">
        <view class="ldb-back" hover-class="ldb-back-hover" @click="goBack">
          <text class="ldb-back-arrow">‹</text>
          <text>返回</text>
        </view>
        <text class="ldb-nav-title">法律库</text>
        <view class="ldb-nav-right"></view>
      </view>

      <!-- 固定顶部区：搜索 + 分类筛选（下滑不消失） -->
      <view class="ldb-fixed">
        <view class="ldb-search">
          <view class="ldb-search-box">
            <text class="ri-search-line ldb-search-ico"></text>
            <input
              class="ldb-search-input"
              type="text"
              v-model="searchKeyword"
              placeholder="搜索法律法规、案例、条约"
              confirm-type="search"
              @confirm="onSearch"
            />
            <text v-if="searchKeyword" class="ri-close-circle-fill ldb-search-clear" @click="clearSearch"></text>
          </view>
        </view>

        <scroll-view scroll-x class="ldb-cats" show-scrollbar="false" :enable-flex="true">
          <view
            class="ldb-cat"
            :class="{ 'is-active': activeCategory === item }"
            v-for="item in categories"
            :key="item"
            @click="activeCategory = item"
          >{{ item }}</view>
        </scroll-view>
      </view>
    </view>

    <view class="ldb-scroll">
      <!-- 文档列表 -->
      <view class="ldb-list-head">
        <text class="ldb-list-title">法规文献</text>
        <text class="ldb-list-meta">共 {{ filteredResults.length }} 条</text>
      </view>

      <view v-if="loading" class="ldb-state">正在加载知识库...</view>
      <view v-else-if="!filteredResults.length" class="ldb-state">暂无知识条目</view>
      <view v-else class="ldb-list">
        <view
          class="ldb-card"
          v-for="(item, idx) in filteredResults"
          :key="idx"
          hover-class="ldb-card-hover"
          @click="viewDetail(item)"
        >
          <view class="ldb-card-top">
            <text class="ldb-cat-tag">{{ item.category || '综合' }}</text>
            <text class="ldb-date">{{ item.date }}</text>
          </view>
          <view class="ldb-card-title">{{ item.title }}</view>
          <text v-if="item.summary" class="ldb-card-summary">{{ item.summary }}</text>
          <view class="ldb-card-foot">
            <text class="ldb-source">{{ item.source || item.region || '涉外法治' }}</text>
            <view class="ldb-go">
              <text>查看详情</text>
              <text class="ri-arrow-right-s-line"></text>
            </view>
          </view>
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
      searchKeyword: '',
      activeCategory: '全部',
      categories: ['全部'],
      results: [],
      loading: false
    }
  },
  onLoad() {
    this.statusBarHeight = this.getStatusBarHeight()
    this.loadDocs()
  },
  computed: {
    filteredResults() {
      let list = this.results
      if (this.activeCategory !== '全部') {
        list = list.filter((item) => (item.category || '综合') === this.activeCategory)
      }
      if (this.searchKeyword) {
        const kw = this.searchKeyword.toLowerCase()
        list = list.filter((item) =>
          item.title.toLowerCase().includes(kw) ||
          (item.summary || '').toLowerCase().includes(kw) ||
          (item.tags || []).some((t) => t.toLowerCase().includes(kw))
        )
      }
      return list
    }
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
      const pages = getCurrentPages()
      if (pages.length > 1) {
        uni.navigateBack()
      } else {
        uni.switchTab({ url: '/pages/index/index' })
      }
    },
    async loadDocs() {
      this.loading = true
      try {
        const knowledgeObj = uniCloud.importObject('knowledge', { customUI: true })
        const r = (await knowledgeObj.listPublic({ category: 'all', keyword: '', page: 1, pageSize: 500 })) || {}
        if (r.errCode !== 0) {
          uni.showToast({ title: r.errMsg || '知识库加载失败', icon: 'none' })
          return
        }
        this.results = (r.list || []).map((doc) => ({
          id: doc._id,
          title: doc.title || '',
          summary: doc.summary || '',
          category: doc.category || '综合',
          docType: doc.docType || '',
          fields: Array.isArray(doc.fields) ? doc.fields : [],
          regions: Array.isArray(doc.regions) ? doc.regions : [],
          region: Array.isArray(doc.regions) && doc.regions.length ? doc.regions[0] : '',
          tags: Array.isArray(doc.tags) ? doc.tags : [],
          source: doc.source || '',
          date: doc.date || ''
        }))
        const cats = new Set(this.results.map((x) => x.category || '综合'))
        this.categories = ['全部', ...[...cats].sort((a, b) => a.localeCompare(b, 'zh-CN'))]
      } catch (e) {
        uni.showToast({ title: (e && e.errMsg) || '知识库加载失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    onSearch() {
      // 本地过滤即时生效，回车仅收起键盘
      uni.hideKeyboard && uni.hideKeyboard()
    },
    clearSearch() {
      this.searchKeyword = ''
    },
    viewDetail(item) {
      uni.navigateTo({
        url: '/pages/legal-db/doc-detail?id=' + encodeURIComponent(item.id || '')
      })
    }
  }
}
</script>

<style scoped>
page {
  --brand: #2E7BE0;
  --brand-deep: #1B5BB5;
  --ink: #1b2233;
  --ink-2: #455569;
  --muted: #6B7A93;
  --line: #e8eef8;
  --bg: #f2f6fd;
  background-color: var(--bg);
  color: var(--ink);
  font-size: 28rpx;
}

.ldb-page {
  /* 变量需定义在可被 scoped 匹配的元素上（page 上的变量在 scoped 下会失效） */
  --brand: #2E7BE0;
  --brand-deep: #1B5BB5;
  --ink: #1b2233;
  --ink-2: #455569;
  --muted: #6B7A93;
  --line: #e8eef8;
  --bg: #f2f6fd;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg);
  color: var(--ink);
  font-size: 28rpx;
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
.ldb-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 24rpx;
  background: #ffffff;
  border-bottom: 1rpx solid var(--line);
}
.ldb-back {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: 12rpx 16rpx;
  margin-left: -16rpx;
  font-size: 28rpx;
  color: var(--brand);
}
.ldb-back-hover { opacity: 0.6; }
.ldb-back-arrow {
  font-size: 44rpx;
  line-height: 1;
  margin-top: -6rpx;
}
.ldb-nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--ink);
}
.ldb-nav-right { width: 120rpx; }

/* 固定顶部区（搜索 + 分类吸顶） */
.ldb-fixed {
  flex-shrink: 0;
  padding: 24rpx 24rpx 4rpx;
  background: var(--bg);
  border-bottom: 1rpx solid var(--line);
  z-index: 10;
}

.ldb-scroll {
  box-sizing: border-box;
  padding: 20rpx 24rpx 24rpx;
}

/* 搜索栏 */
.ldb-search { margin-bottom: 20rpx; }
.ldb-search-box {
  display: flex;
  align-items: center;
  gap: 12rpx;
  height: 80rpx;
  padding: 0 24rpx;
  background: #ffffff;
  border-radius: 40rpx;
  border: 1rpx solid var(--line);
}
.ldb-search-ico {
  font-size: 32rpx;
  color: var(--muted);
}
.ldb-search-input {
  flex: 1;
  font-size: 28rpx;
  color: var(--ink);
}
.ldb-search-clear {
  font-size: 30rpx;
  color: var(--muted);
}

/* 分类筛选 */
.ldb-cats {
  white-space: nowrap;
  margin-bottom: 28rpx;
  margin-left: -24rpx;
  margin-right: -24rpx;
  padding: 0 24rpx;
  box-sizing: border-box;
}
.ldb-cat {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 60rpx;
  padding: 0 26rpx;
  margin-right: 14rpx;
  border-radius: 30rpx;
  background: #ffffff;
  border: 1rpx solid var(--line);
  color: var(--ink-2);
  font-size: 26rpx;
}
.ldb-cat.is-active {
  background: rgba(46, 123, 224, 0.12);
  border-color: #2E7BE0;
  color: #2E7BE0;
  font-weight: 600;
}

/* 列表头 */
.ldb-list-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 16rpx;
}
.ldb-list-title {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--ink);
}
.ldb-list-meta {
  font-size: 24rpx;
  color: var(--muted);
}

/* 文档卡片 */
.ldb-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.ldb-card {
  background: #ffffff;
  border-radius: 28rpx;
  padding: 26rpx;
  box-shadow: 0 12rpx 36rpx rgba(46, 123, 224, 0.08);
}
.ldb-card-hover { opacity: 0.88; }
.ldb-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14rpx;
}
.ldb-cat-tag {
  font-size: 22rpx;
  color: var(--brand);
  background: rgba(46, 123, 224, 0.10);
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
}
.ldb-date {
  font-size: 22rpx;
  color: var(--muted);
}
.ldb-card-title {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--ink);
  line-height: 1.4;
  margin-bottom: 10rpx;
}
.ldb-card-summary {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 25rpx;
  color: var(--ink-2);
  line-height: 1.6;
  margin-bottom: 16rpx;
}
.ldb-card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ldb-source {
  font-size: 24rpx;
  color: var(--muted);
}
.ldb-go {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: var(--brand);
}
.ldb-go .ri-arrow-right-s-line {
  font-size: 30rpx;
  margin-top: -2rpx;
}

.ldb-state {
  padding: 80rpx 0;
  text-align: center;
  font-size: 26rpx;
  color: var(--muted);
}
</style>
