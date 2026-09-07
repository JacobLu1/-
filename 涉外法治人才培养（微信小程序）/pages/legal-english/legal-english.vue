<template>
  <view class="le-page">
    <view class="sticky-top">
      <!-- 状态栏安全区占位 -->
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
      <!-- 自定义导航栏 -->
      <view class="le-nav">
        <view class="le-back" hover-class="le-back-hover" @click="goBack">
          <text class="le-back-arrow">‹</text>
          <text>返回</text>
        </view>
        <text class="le-nav-title">法律英语综合训练</text>
        <view class="le-nav-right"></view>
      </view>
    </view>

    <view class="le-scroll">
      <!-- 能力概览卡 -->
      <view class="hero">
        <view class="hero-top">
          <view class="hero-info">
            <view class="hero-title">法律英语</view>
            <view class="hero-sub">涉外法律人才核心语言能力</view>
          </view>
          <view class="hero-lvl">L3</view>
        </view>
        <view class="hero-pct-row">
          <text class="hero-pct-label">掌握度</text>
          <text class="hero-pct-val">{{ overallPercent }}%</text>
        </view>
        <view class="hero-prog">
          <view class="hero-prog-inner" :style="{ width: overallPercent + '%' }"></view>
        </view>
        <view class="hero-stats">
          <view class="hero-stat" v-for="(stat, i) in stats" :key="i">
            <text class="hero-stat-ico" :class="stat.icon"></text>
            <view>
              <view class="hero-stat-val">{{ stat.val }}</view>
              <view class="hero-stat-label">{{ stat.label }}</view>
            </view>
          </view>
        </view>
      </view>

      <!-- 学习模块 -->
      <view class="sec">
        <view class="sec-head">
          <view class="t">
            <view class="bar"></view>
            <text>学习模块</text>
          </view>
          <view class="sec-more">
            <text>共 {{ modules.length }} 个模块</text>
          </view>
        </view>
        <view v-if="!modules.length" class="res-empty">暂无学习模块</view>
        <view class="mod-grid">
          <view
            class="mod-card"
            v-for="(mod, idx) in modules"
            :key="idx"
            hover-class="mod-hover"
            @click="onModule(mod)"
          >
            <view class="mod-ico" :class="'mod-ico-' + mod.tone">
              <text :class="mod.icon"></text>
            </view>
            <view class="mod-name">{{ mod.name }}</view>
            <view class="mod-lv">{{ mod.level }}</view>
            <view class="mod-prog">
              <view class="mod-prog-inner" :style="{ width: mod.percent + '%' }"></view>
            </view>
            <view class="mod-foot">
              <text class="mod-pct">{{ mod.percent }}% 完成</text>
              <text class="mod-go ri-arrow-right-s-line"></text>
            </view>
          </view>
        </view>
      </view>

      <!-- 今日词汇 -->
      <view class="sec">
        <view class="sec-head">
          <view class="t">
            <view class="bar"></view>
            <text>今日词汇</text>
          </view>
          <view class="sec-more" @click="onMoreWords">
            <text>更多</text>
            <text class="ri-arrow-right-s-line"></text>
          </view>
        </view>
        <view v-if="vocabPool.length" class="vocab-tabs">
          <view
            class="vocab-tab"
            :class="{ 'is-active': vocabTab === 'new' }"
            @click="switchVocabTab('new')"
          >今日新词 {{ newWords.length }}</view>
          <view
            class="vocab-tab"
            :class="{ 'is-active': vocabTab === 'review' }"
            @click="switchVocabTab('review')"
          >待复习 {{ reviewWords.length }}</view>
        </view>
        <view v-if="words.length" class="word-card">
          <view
            class="word-row"
            v-for="(word, idx) in displayWords"
            :key="idx"
          >
            <view class="word-top">
              <text class="word-en">{{ word.en }}</text>
              <text v-if="word.phonetic" class="word-phon">/{{ word.phonetic }}/</text>
            </view>
            <view class="word-bottom">
              <text class="word-cn">{{ word.cn }}</text>
              <view class="word-actions">
                <view class="word-btn word-btn-known" @click="markWord(word, true)">认识</view>
                <view class="word-btn word-btn-again" @click="markWord(word, false)">不认识</view>
              </view>
            </view>
          </view>
        </view>
        <view v-else class="res-empty">今日词汇暂未安排，请先维护“词汇积累”资源</view>
      </view>

      <!-- 底部提示 -->
      <view class="le-tip">
        <text class="ri-sparkling-2-line"></text>
        <text>坚持每日学习，法律英语稳步提升</text>
      </view>
    </view>
  </view>
</template>

<script>
import {
  DAILY_WORD_COUNT,
  loadVocabProgress,
  saveVocabProgress,
  normalizeLang,
  mapWord,
  isLearned,
  isDueReview,
  markWordProgress,
  getDateKey,
  hashString,
  seededShuffle
} from '@/utils/vocab.js'

const ROTATION_SEED = 'legal-vocab-daily-rotation'

export default {
  data() {
    return {
      statusBarHeight: 0,
      resourceLoading: false,
      overallPercent: 0,
      stats: [],
      modules: [],
      vocabPool: [],
      progressMap: {},
      words: [],
      vocabTab: 'new'
    }
  },
  computed: {
    newWords() {
      return this.words.filter((w) => !isLearned(this.progressMap[w.id]))
    },
    reviewWords() {
      return this.words.filter((w) => {
        const p = this.progressMap[w.id]
        return isLearned(p) && isDueReview(p)
      })
    },
    displayWords() {
      return this.vocabTab === 'new' ? this.newWords : this.reviewWords
    }
  },
  onLoad() {
    this.statusBarHeight = this.getStatusBarHeight()
    this.progressMap = loadVocabProgress()
    this.loadEnglishResources()
  },
  methods: {
    async loadEnglishResources() {
      if (this.resourceLoading) return
      this.resourceLoading = true
      try {
        const resourcesObj = uniCloud.importObject('resources', { customUI: true })
        const [vocabList, listenRes] = await Promise.all([
          this.fetchVocab(resourcesObj, '英语'),
          resourcesObj.listPublic({ type: 'listening', page: 1, size: 1000 })
        ])
        this.vocabPool = vocabList
        this.buildTodayWords()
        this.stats = [
          { icon: 'ri-book-open-line', val: String(this.vocabPool.length), label: '英语词汇' },
          { icon: 'ri-mic-line', val: String((listenRes && listenRes.list ? listenRes.list : []).length), label: '听力' }
        ]
        this.modules = [
          {
            name: '词汇积累',
            level: 'L1',
            percent: 0,
            icon: 'ri-book-open-line',
            tone: 1,
            url: '/pages/legal-english/legal-vocab'
          },
          {
            name: '听力训练',
            level: 'L2',
            percent: 0,
            icon: 'ri-mic-line',
            tone: 3,
            url: '/pages/legal-english/listening-training'
          }
        ]
      } catch (e) {
        uni.showToast({ title: (e && e.errMsg) || '法律英语资源加载失败', icon: 'none' })
      } finally {
        this.resourceLoading = false
      }
    },
    async fetchVocab(resourcesObj, lang) {
      // 本地缓存 10 分钟，减少重复加载
      const cacheKey = 'le_vocab_english_cache'
      const now = Date.now()
      try {
        const cached = uni.getStorageSync(cacheKey)
        if (cached && cached.expireAt && cached.expireAt > now && Array.isArray(cached.data)) {
          return cached.data
        }
      } catch (e) {}
      const all = []
      let page = 1
      let total = 0
      let fetched = 0
      do {
        const r = (await resourcesObj.listPublic({ type: 'vocabulary', lang, page, size: 1000 })) || {}
        if (r.errCode !== 0) break
        const batch = r.list || []
        all.push(...batch)
        fetched += batch.length
        total = Number(r.total) || fetched
        page += 1
      } while (fetched < total)
      const words = all
        .filter((d) => d.type === 'vocabulary' && normalizeLang(d.lang) === '英语')
        .map(mapWord)
      if (!words.length) {
        // 兼容旧数据（无 lang 字段）：回退拉全量再过滤
        const fallback = []
        let p = 1
        let t = 0
        let f = 0
        do {
          const r = (await resourcesObj.listPublic({ type: 'vocabulary', page: p, size: 1000 })) || {}
          if (r.errCode !== 0) break
          const batch = r.list || []
          fallback.push(...batch)
          f += batch.length
          t = Number(r.total) || f
          p += 1
        } while (f < t)
        const fbWords = fallback.filter((d) => d.type === 'vocabulary').map(mapWord)
        try {
          uni.setStorageSync(cacheKey, { expireAt: now + 10 * 60 * 1000, data: fbWords })
        } catch (e) {}
        return fbWords
      }
      try {
        uni.setStorageSync(cacheKey, { expireAt: now + 10 * 60 * 1000, data: words })
      } catch (e) {}
      return words
    },
    getPlanKey(dateKey) {
      const user = uni.getStorageSync('userInfo') || {}
      return `legal_vocab_${user.account || 'guest'}_plan_${dateKey}`
    },
    buildTodayWords() {
      const pool = this.vocabPool
      if (!pool.length) {
        this.words = []
        return
      }
      const dateKey = getDateKey()
      let savedPlan = []
      try {
        savedPlan = uni.getStorageSync(this.getPlanKey(dateKey)) || []
      } catch (e) {}
      if (savedPlan.length) {
        const poolMap = new Map(pool.map((w) => [w.id, w]))
        const planned = savedPlan.map((id) => poolMap.get(id)).filter(Boolean)
        if (planned.length >= 10) {
          this.words = planned
          this.syncVocabTab()
          return
        }
      }
      const selected = this.buildDailyRotation(dateKey)
      this.words = selected
      try {
        uni.setStorageSync(this.getPlanKey(dateKey), selected.map((w) => w.id))
      } catch (e) {}
      this.syncVocabTab()
    },
    // 按天轮换选取今日词汇：固定种子稳定队列 + 每天滑动窗口，优先未学词，不足时补已学词
    buildDailyRotation(dateKey) {
      const pool = this.vocabPool
      if (!pool.length) return []
      const poolMap = new Map(pool.map((w) => [w.id, w]))
      const queue = seededShuffle(pool.map((w) => w.id), hashString(ROTATION_SEED))
      const learnedSet = new Set(
        Object.keys(this.progressMap).filter((id) => this.progressMap[id] && this.progressMap[id].learnedAt)
      )
      const dayIndex = Math.floor(new Date(`${dateKey}T00:00:00`).getTime() / 86400000)
      const start = (dayIndex * DAILY_WORD_COUNT) % queue.length
      const ids = []
      let cursor = start
      let scanned = 0
      while (ids.length < DAILY_WORD_COUNT && scanned < queue.length * 2) {
        const id = queue[cursor % queue.length]
        if (!learnedSet.has(id) && !ids.includes(id)) ids.push(id)
        cursor += 1
        scanned += 1
      }
      cursor = start
      while (ids.length < DAILY_WORD_COUNT && ids.length < queue.length) {
        const id = queue[cursor % queue.length]
        if (!ids.includes(id)) ids.push(id)
        cursor += 1
      }
      return ids.map((id) => poolMap.get(id)).filter(Boolean)
    },
    syncVocabTab() {
      if (this.vocabTab === 'new' && !this.newWords.length && this.reviewWords.length) {
        this.vocabTab = 'review'
        return
      }
      if (this.vocabTab === 'review' && !this.reviewWords.length && this.newWords.length) {
        this.vocabTab = 'new'
      }
    },
    switchVocabTab(tab) {
      this.vocabTab = tab
    },
    markWord(word, known) {
      this.progressMap = markWordProgress(this.progressMap, word, known)
      saveVocabProgress(this.progressMap)
      uni.showToast({ title: known ? '已加入复习计划' : '已加入待复习', icon: 'none' })
      this.syncVocabTab()
    },
    onModule(mod) {
      if (mod.url) {
        uni.navigateTo({ url: mod.url })
        return
      }
      uni.showToast({ title: `「${mod.name}」建设中，敬请期待`, icon: 'none' })
    },
    onMoreWords() {
      if (!this.vocabPool.length) {
        uni.showToast({ title: '暂无词汇数据', icon: 'none' })
        return
      }
      uni.showToast({
        title: `今日 ${this.words.length} 词：新词 ${this.newWords.length}，复习 ${this.reviewWords.length}`,
        icon: 'none'
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
/* 设计变量 */
page {
  --brand: #2E7BE0;
  --brand-deep: #2E7BE0;
  --blue-600: #2563EB;
  --ink: #16314F;
  --muted: #7A92B0;
  --glass-2: rgba(255, 255, 255, 0.68);
  --glass-border-soft: rgba(255, 255, 255, 0.45);
  --glass-shadow-sm: 0 12rpx 36rpx rgba(46, 123, 224, 0.10);
  --r-md: 36rpx;
  --r-pill: 999rpx;
  background-color: #f2f6fd;
}

.le-page {
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
.le-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 24rpx;
  background: #ffffff;
  border-bottom: 1rpx solid #e8eef8;
}

.le-back {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: 12rpx 16rpx;
  margin-left: -16rpx;
  font-size: 28rpx;
  color: #2E7BE0;
}

.le-back-hover {
  opacity: 0.6;
}

.le-back-arrow {
  font-size: 44rpx;
  line-height: 1;
  margin-top: -6rpx;
}

.le-nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1b2233;
}

.le-nav-right {
  width: 120rpx;
}

/* 滚动区 */
.le-scroll {
  padding: 24rpx 32rpx 40rpx;
  box-sizing: border-box;
}

/* 能力概览卡 */
.hero {
  border-radius: 40rpx;
  padding: 36rpx 32rpx 32rpx;
  background: linear-gradient(135deg, #3B82F6, #1E40AF);
  box-shadow: 0 20rpx 50rpx rgba(37, 99, 235, 0.30);
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
  background: rgba(255, 255, 255, 0.08);
}

.hero-top {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
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
  margin-top: 6rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.78);
}

.hero-lvl {
  height: 48rpx;
  padding: 0 20rpx;
  border-radius: var(--r-pill);
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
}

.hero-pct-row {
  margin-top: 28rpx;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.hero-pct-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.hero-pct-val {
  font-size: 44rpx;
  font-weight: 800;
  color: #ffffff;
}

.hero-prog {
  margin-top: 12rpx;
  height: 12rpx;
  border-radius: var(--r-pill);
  background: rgba(255, 255, 255, 0.22);
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.hero-prog-inner {
  display: block;
  height: 100%;
  border-radius: var(--r-pill);
  background: linear-gradient(90deg, #FDE68A, #F59E0B);
}

.hero-stats {
  margin-top: 28rpx;
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.hero-stat {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.hero-stat-ico {
  font-size: 36rpx;
  color: rgba(255, 255, 255, 0.9);
}

.hero-stat-val {
  font-size: 28rpx;
  font-weight: 700;
  color: #ffffff;
}

.hero-stat-label {
  margin-top: 2rpx;
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.7);
}

/* 区块标题 */
.sec {
  margin-top: 36rpx;
}

.sec-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.sec-head .t {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.sec-head .t .bar {
  width: 8rpx;
  height: 30rpx;
  border-radius: 4rpx;
  background: linear-gradient(180deg, #5B9DF9, #2563EB);
}

.sec-head .t text {
  font-size: 30rpx;
  font-weight: 700;
  color: #16314F;
}

.sec-more {
  display: flex;
  align-items: center;
  gap: 2rpx;
  font-size: 24rpx;
  color: #7A92B0;
}

/* 学习模块 */
.mod-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.mod-card {
  border-radius: 28rpx;
  background: var(--glass-2);
  border: 2rpx solid var(--glass-border-soft);
  box-shadow: var(--glass-shadow-sm);
  padding: 24rpx;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.mod-hover {
  transform: scale(0.96);
}

.mod-ico {
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  color: #ffffff;
}

.mod-ico-1 { background: linear-gradient(135deg, #5B9DF9, #2E7BE0); }
.mod-ico-2 { background: linear-gradient(135deg, #8B5CF6, #6D28D9); }
.mod-ico-3 { background: linear-gradient(135deg, #06B6D4, #0891B2); }
.mod-ico-4 { background: linear-gradient(135deg, #F59E0B, #D97706); }

.mod-name {
  margin-top: 16rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #16314F;
}

.mod-lv {
  margin-top: 4rpx;
  font-size: 20rpx;
  color: #7A92B0;
}

.mod-prog {
  margin-top: 14rpx;
  height: 8rpx;
  border-radius: var(--r-pill);
  background: rgba(120, 160, 210, 0.18);
  overflow: hidden;
}

.mod-prog-inner {
  display: block;
  height: 100%;
  border-radius: var(--r-pill);
  background: linear-gradient(90deg, #5B9DF9, #2563EB);
}

.mod-foot {
  margin-top: 10rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mod-pct {
  font-size: 22rpx;
  color: #7A92B0;
  font-weight: 600;
}

.mod-go {
  font-size: 28rpx;
  color: #2E7BE0;
}

.mod-desc {
  display: -webkit-box;
  margin-top: 12rpx;
  font-size: 22rpx;
  line-height: 1.5;
  color: #7A92B0;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.res-empty {
  padding: 40rpx 24rpx;
  border-radius: 28rpx;
  border: 2rpx dashed rgba(120, 160, 210, 0.35);
  background: var(--glass-2);
  color: #7A92B0;
  font-size: 24rpx;
  text-align: center;
}

/* 今日词汇 */
.vocab-tabs {
  display: flex;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.vocab-tab {
  height: 56rpx;
  padding: 0 24rpx;
  border-radius: var(--r-pill);
  border: 2rpx solid rgba(120, 160, 210, 0.3);
  background: var(--glass-2);
  color: #7A92B0;
  font-size: 24rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.vocab-tab.is-active {
  border-color: #2E7BE0;
  background: #2E7BE0;
  color: #ffffff;
}

.word-card {
  border-radius: 28rpx;
  background: var(--glass-2);
  border: 2rpx solid var(--glass-border-soft);
  box-shadow: var(--glass-shadow-sm);
  padding: 8rpx 24rpx;
}

.word-row {
  padding: 22rpx 0;
  border-bottom: 2rpx solid rgba(120, 160, 210, 0.12);
}

.word-row:last-child {
  border-bottom: none;
}

.word-top {
  display: flex;
  align-items: baseline;
  gap: 12rpx;
  min-width: 0;
}

.word-en {
  font-size: 32rpx;
  font-weight: 700;
  color: #16314F;
  word-break: break-word;
}

.word-phon {
  font-size: 22rpx;
  color: #7A92B0;
  flex-shrink: 0;
}

.word-bottom {
  margin-top: 10rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}

.word-cn {
  flex: 1;
  min-width: 0;
  font-size: 26rpx;
  color: #2E7BE0;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.word-actions {
  display: flex;
  align-items: center;
  gap: 10rpx;
  flex-shrink: 0;
}

.word-btn {
  height: 52rpx;
  padding: 0 20rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.word-btn-known {
  color: #ffffff;
  background: linear-gradient(135deg, #16A34A, #15803D);
}

.word-btn-again {
  color: #DC2626;
  background: #FEE2E2;
  border: 2rpx solid #FECACA;
}

/* 底部提示 */
.le-tip {
  margin-top: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  color: #7A92B0;
  font-size: 24rpx;
}

.le-tip text:first-child {
  font-size: 26rpx;
  color: #2E7BE0;
}
</style>
