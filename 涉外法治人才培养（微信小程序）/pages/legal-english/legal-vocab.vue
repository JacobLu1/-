<template>
  <view class="lvv-page">
    <view class="sticky-top">
      <!-- 状态栏安全区占位 -->
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
      <!-- 自定义导航栏 -->
      <view class="lvv-nav">
        <view class="lvv-back" hover-class="lvv-back-hover" @click="goBack">
          <text class="lvv-back-arrow">‹</text>
          <text>返回</text>
        </view>
        <text class="lvv-nav-title">词汇积累</text>
        <view class="lvv-nav-right">{{ currentLang }}</view>
      </view>

      <!-- 固定顶部区：语言切换 + 搜索（下滑不消失） -->
      <view class="lvv-fixed">
        <!-- 语言切换 -->
        <scroll-view scroll-x class="lvv-langs" show-scrollbar="false" :enable-flex="true">
          <view
            class="lvv-lang"
            :class="{ 'is-active': currentLang === lang }"
            v-for="lang in LANGUAGES"
            :key="lang"
            @click="switchLang(lang)"
          >{{ lang }}</view>
        </scroll-view>

        <!-- 搜索 -->
        <view class="lvv-search">
          <text class="ri-search-line lvv-search-ico"></text>
          <input
            class="lvv-search-input"
            type="text"
            v-model="searchText"
            placeholder="搜索词汇（外文/中文）"
            confirm-type="search"
          />
          <text v-if="searchText" class="ri-close-circle-fill lvv-search-clear" @click="searchText = ''"></text>
        </view>
      </view>
    </view>

    <view class="lvv-scroll">
      <!-- 统计卡 -->
      <view class="lvv-stats">
        <view class="lvv-stat" :class="{ 'is-active': activeCard === 'unlearned' }" @click="switchCard('unlearned')">
          <text class="lvv-stat-num">{{ stats.unlearned }}</text>
          <text class="lvv-stat-label">未学习词汇</text>
        </view>
        <view class="lvv-stat" :class="{ 'is-active': activeCard === 'review' }" @click="switchCard('review')">
          <text class="lvv-stat-num">{{ stats.review }}</text>
          <text class="lvv-stat-label">待复习词汇</text>
        </view>
        <view class="lvv-stat" :class="{ 'is-active': activeCard === 'starred' }" @click="switchCard('starred')">
          <text class="lvv-stat-num">{{ stats.starred }}</text>
          <text class="lvv-stat-label">收藏词汇</text>
        </view>
      </view>

      <!-- 词汇列表 -->
      <view class="lvv-list-head">
        <text class="lvv-list-title">{{ activeTitle }}</text>
        <text class="lvv-list-meta">{{ activeWords.length }} 词</text>
      </view>

      <view v-if="loading" class="lvv-state">正在加载词汇...</view>
      <view v-else-if="!activeWords.length" class="lvv-state">
        <view class="lvv-empty-title">{{ activeTitle }}</view>
        <view class="lvv-empty-desc">{{ emptyText }}</view>
      </view>
      <template v-else>
        <view class="lvv-list">
          <view class="lvv-card" v-for="word in displayedWords" :key="word.id" hover-class="lvv-card-hover">
            <view class="lvv-word">
              <text class="lvv-en">{{ word.en }}</text>
              <text class="lvv-phonetic" v-if="word.phonetic">{{ word.phonetic }}</text>
              <text class="lvv-cn">{{ word.cn }}</text>
            </view>
            <view class="lvv-actions">
              <view
                class="lvv-btn lvv-btn-star"
                :class="{ 'is-on': isStarredWord(word) }"
                @click="toggleStar(word)"
              >{{ isStarredWord(word) ? '已收藏' : '收藏' }}</view>
              <view v-if="activeCard !== 'starred'" class="lvv-btn lvv-btn-known" :class="{ 'is-on': isLearnedWord(word) }" @click="markWord(word, true)">
                {{ isLearnedWord(word) ? '已掌握' : '认识' }}
              </view>
              <view v-if="activeCard !== 'starred'" class="lvv-btn lvv-btn-again" @click="markWord(word, false)">
                {{ isLearnedWord(word) ? '再复习' : '不认识' }}
              </view>
            </view>
          </view>
        </view>

        <!-- 分页 -->
        <view v-if="totalPages > 1" class="lvv-pager">
          <view class="lvv-page-btn" :class="{ 'is-disabled': currentPage <= 1 }" @click="changePage(currentPage - 1)">上一页</view>
          <text class="lvv-page-info">{{ currentPage }} / {{ totalPages }}</text>
          <view class="lvv-page-btn" :class="{ 'is-disabled': currentPage >= totalPages }" @click="changePage(currentPage + 1)">下一页</view>
        </view>
      </template>
    </view>
  </view>
</template>

<script>
import {
  loadVocabProgress,
  saveVocabProgress,
  normalizeLang,
  mapWord,
  getVocabStats,
  isLearned,
  isDueReview,
  isStarred,
  markWordProgress,
  toggleWordStar
} from '@/utils/vocab.js'

const LANGUAGES = ['英语', '德语', '法语', '拉丁语', '西班牙语']
const PAGE_SIZE = 20
const VOCAB_CACHE_TTL = 10 * 60 * 1000

export default {
  data() {
    return {
      statusBarHeight: 0,
      LANGUAGES,
      currentLang: '英语',
      vocabPool: [],
      progressMap: {},
      activeCard: 'unlearned',
      searchText: '',
      currentPage: 1,
      loading: false
    }
  },
  computed: {
    stats() {
      return getVocabStats(this.vocabPool, this.progressMap)
    },
    activeWords() {
      const p = this.progressMap
      const kw = this.searchText.trim().toLowerCase()
      let base
      if (this.activeCard === 'review') {
        base = this.vocabPool
          .filter((w) => isDueReview(p[w.id]))
          .sort((a, b) => ((p[a.id] && p[a.id].reviewAt) || 0) - ((p[b.id] && p[b.id].reviewAt) || 0))
      } else if (this.activeCard === 'unlearned') {
        base = this.vocabPool.filter((w) => !isLearned(p[w.id]))
      } else if (this.activeCard === 'starred') {
        base = this.vocabPool.filter((w) => isStarred(p[w.id]))
      } else {
        base = []
      }
      if (kw) {
        base = base.filter((w) =>
          (w.en || '').toLowerCase().includes(kw) ||
          (w.cn || '').toLowerCase().includes(kw)
        )
      }
      return base
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.activeWords.length / PAGE_SIZE))
    },
    displayedWords() {
      const start = (this.currentPage - 1) * PAGE_SIZE
      return this.activeWords.slice(start, start + PAGE_SIZE)
    },
    activeTitle() {
      if (this.activeCard === 'review') return '待复习词汇'
      if (this.activeCard === 'unlearned') return '未学习词汇'
      return '收藏词汇'
    },
    emptyText() {
      if (!this.vocabPool.length) return `当前“${this.currentLang}”语言下还没有词汇内容，请在管理端维护后重试`
      if (this.activeCard === 'review') return '当前没有到期待复习的词汇，先学习未学习词汇吧'
      if (this.activeCard === 'unlearned') return '未学习词汇已全部完成'
      return '还没有收藏词汇，点击列表中的收藏即可加入'
    }
  },
  onLoad(options) {
    this.statusBarHeight = this.getStatusBarHeight()
    let lang = normalizeLang(options && options.lang)
    try {
      const last = uni.getStorageSync('lvv_last_lang')
      if (!['英语', '德语', '法语', '拉丁语', '西班牙语'].includes(lang) && last) lang = last
    } catch (e) {}
    this.currentLang = normalizeLang(lang)
    this.progressMap = loadVocabProgress()
    this.loadVocabResources()
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
        uni.navigateTo({ url: '/pages/legal-english/legal-english' })
      }
    },
    async loadVocabResources() {
      if (this.loading) return
      this.loading = true
      try {
        const cacheKey = `lvv_vocab_cache_${this.currentLang}`
        const now = Date.now()
        let words = null
        try {
          const cached = uni.getStorageSync(cacheKey)
          if (cached && cached.expireAt && cached.expireAt > now && Array.isArray(cached.data)) {
            words = cached.data
          }
        } catch (e) {}
        if (!words) {
          words = await this.fetchVocabByLang(this.currentLang)
          if (!words.length) {
            words = await this.fetchVocabByLang('')
          }
          try {
            uni.setStorageSync(cacheKey, { expireAt: now + VOCAB_CACHE_TTL, data: words })
          } catch (e) {}
        }
        this.vocabPool = words
        this.currentPage = 1
      } catch (e) {
        uni.showToast({ title: (e && e.errMsg) || '词汇资源加载失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    async fetchVocabByLang(lang) {
      const resourcesObj = uniCloud.importObject('resources', { customUI: true })
      const pageSize = 1000
      const all = []
      let page = 1
      let total = 0
      let fetched = 0
      do {
        const r = (await resourcesObj.listPublic({ type: 'vocabulary', lang, page, size: pageSize })) || {}
        if (r.errCode !== 0) break
        const batch = r.list || []
        all.push(...batch)
        fetched += batch.length
        total = Number(r.total) || fetched
        page += 1
      } while (fetched < total)
      return all
        .filter((d) => d.type === 'vocabulary' && normalizeLang(d.lang) === this.currentLang)
        .map(mapWord)
    },
    switchLang(lang) {
      if (this.currentLang === lang) return
      this.currentLang = lang
      try { uni.setStorageSync('lvv_last_lang', lang) } catch (e) {}
      this.vocabPool = []
      this.currentPage = 1
      this.loadVocabResources()
    },
    switchCard(card) {
      if (this.activeCard !== card) {
        this.activeCard = card
        this.currentPage = 1
      }
    },
    isStarredWord(word) {
      return isStarred(this.progressMap[word.id])
    },
    isLearnedWord(word) {
      return isLearned(this.progressMap[word.id])
    },
    toggleStar(word) {
      this.progressMap = toggleWordStar(this.progressMap, word)
      saveVocabProgress(this.progressMap)
    },
    markWord(word, known) {
      this.progressMap = markWordProgress(this.progressMap, word, known)
      saveVocabProgress(this.progressMap)
      uni.showToast({ title: known ? '已加入复习计划' : '已加入待复习', icon: 'none' })
    },
    changePage(page) {
      const next = Number(page)
      if (!Number.isInteger(next) || next < 1 || next > this.totalPages || next === this.currentPage) return
      this.currentPage = next
      uni.pageScrollTo({ scrollTop: 0, duration: 200 })
    }
  }
}
</script>

<style scoped>
page {
  --brand: #2E7BE0;
  --brand-deep: #1B5BB5;
  --ink: #1b2233;
  --ink-2: #5a6b82;
  --muted: #9aabc0;
  --line: #e8eef8;
  --bg: #f2f6fd;
  --gold: #E8A33D;
  background-color: var(--bg);
  color: var(--ink);
  font-size: 28rpx;
}

.lvv-page {
  /* 变量需定义在可被 scoped 匹配的元素上（page 上的变量在 scoped 下会失效） */
  --brand: #2E7BE0;
  --brand-deep: #1B5BB5;
  --ink: #1b2233;
  --ink-2: #5a6b82;
  --muted: #9aabc0;
  --line: #e8eef8;
  --bg: #f2f6fd;
  --gold: #E8A33D;
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
.lvv-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 24rpx;
  background: #ffffff;
  border-bottom: 1rpx solid var(--line);
}
.lvv-back {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: 12rpx 16rpx;
  margin-left: -16rpx;
  font-size: 28rpx;
  color: var(--brand);
}
.lvv-back-hover { opacity: 0.6; }
.lvv-back-arrow {
  font-size: 44rpx;
  line-height: 1;
  margin-top: -6rpx;
}
.lvv-nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--ink);
}
.lvv-nav-right {
  width: 120rpx;
  text-align: right;
  font-size: 26rpx;
  color: var(--brand);
}

/* 固定顶部区（语言切换 + 搜索吸顶） */
.lvv-fixed {
  flex-shrink: 0;
  padding: 20rpx 24rpx 4rpx;
  background: var(--bg);
  border-bottom: 1rpx solid var(--line);
  z-index: 10;
}

.lvv-scroll {
  box-sizing: border-box;
  padding: 20rpx 24rpx 24rpx;
}

/* 语言切换 */
.lvv-langs {
  white-space: nowrap;
  margin: 0 -24rpx 16rpx;
  padding: 0 24rpx;
  box-sizing: border-box;
}
.lvv-lang {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 60rpx;
  padding: 0 28rpx;
  margin-right: 14rpx;
  border-radius: 30rpx;
  background: #ffffff;
  border: 1rpx solid var(--line);
  color: var(--ink-2);
  font-size: 26rpx;
}
.lvv-lang.is-active {
  background: rgba(46, 123, 224, 0.12);
  border-color: #2E7BE0;
  color: #2E7BE0;
  font-weight: 600;
}

/* 统计卡 */
.lvv-stats {
  display: flex;
  gap: 16rpx;
  margin-bottom: 24rpx;
}
.lvv-stat {
  flex: 1;
  background: #ffffff;
  border-radius: 24rpx;
  padding: 24rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
  border: 2rpx solid transparent;
  box-shadow: 0 12rpx 36rpx rgba(46, 123, 224, 0.08);
}
.lvv-stat.is-active {
  border-color: var(--brand);
}
.lvv-stat-num {
  font-size: 40rpx;
  font-weight: 700;
  color: var(--brand);
}
.lvv-stat-label {
  font-size: 22rpx;
  color: var(--ink-2);
}

/* 搜索 */
.lvv-search {
  display: flex;
  align-items: center;
  gap: 12rpx;
  height: 76rpx;
  padding: 0 24rpx;
  margin-bottom: 12rpx;
  background: #ffffff;
  border-radius: 38rpx;
  border: 1rpx solid var(--line);
}
.lvv-search-ico {
  font-size: 30rpx;
  color: var(--muted);
}
.lvv-search-input {
  flex: 1;
  font-size: 27rpx;
  color: var(--ink);
}
.lvv-search-clear {
  font-size: 30rpx;
  color: var(--muted);
}

/* 列表头 */
.lvv-list-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 16rpx;
}
.lvv-list-title {
  font-size: 30rpx;
  font-weight: 600;
}
.lvv-list-meta {
  font-size: 24rpx;
  color: var(--muted);
}

/* 词汇卡片 */
.lvv-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.lvv-card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 26rpx;
  box-shadow: 0 12rpx 36rpx rgba(46, 123, 224, 0.08);
}
.lvv-card-hover { opacity: 0.88; }
.lvv-word {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin-bottom: 20rpx;
}
.lvv-en {
  font-size: 34rpx;
  font-weight: 600;
  color: var(--ink);
}
.lvv-phonetic {
  font-size: 24rpx;
  color: var(--muted);
}
.lvv-cn {
  font-size: 27rpx;
  color: var(--ink-2);
  line-height: 1.6;
}
.lvv-actions {
  display: flex;
  gap: 12rpx;
}
.lvv-btn {
  flex: 1;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18rpx;
  font-size: 25rpx;
  border: 1rpx solid var(--line);
  color: var(--ink-2);
  background: #ffffff;
}
.lvv-btn.is-on { border-color: transparent; }
.lvv-btn-star.is-on {
  background: rgba(232, 163, 61, 0.12);
  color: #B7791F;
  border-color: rgba(232, 163, 61, 0.4);
}
.lvv-btn-known {
  background: rgba(30, 158, 106, 0.08);
  border-color: rgba(30, 158, 106, 0.32);
  color: #1E9E6A;
}
.lvv-btn-known.is-on {
  background: #1E9E6A;
  color: #ffffff;
}
.lvv-btn-again {
  background: rgba(217, 83, 79, 0.07);
  border-color: rgba(217, 83, 79, 0.30);
  color: #D9534F;
}

/* 分页 */
.lvv-pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28rpx;
  padding: 32rpx 0;
}
.lvv-page-btn {
  padding: 12rpx 28rpx;
  border-radius: 30rpx;
  background: #ffffff;
  border: 1rpx solid var(--line);
  font-size: 25rpx;
  color: var(--ink-2);
}
.lvv-page-btn.is-disabled {
  opacity: 0.45;
}
.lvv-page-info {
  font-size: 26rpx;
  color: var(--muted);
}

/* 空状态 */
.lvv-state {
  padding: 90rpx 0;
  text-align: center;
  font-size: 26rpx;
  color: var(--muted);
}
.lvv-empty-title {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 12rpx;
}
.lvv-empty-desc {
  font-size: 25rpx;
  color: var(--muted);
  line-height: 1.6;
}
</style>
