<template>
  <view class="app-shell">
    <aside class="app-sidebar">
      <view class="app-sidebar-logo">
        <view class="app-sidebar-logo-icon">
          <view class="ls-svg-glyph" aria-hidden="true"></view>
        </view>
        <text class="app-sidebar-logo-text">涉外法治人才培养</text>
      </view>

      <nav class="app-sidebar-nav">
        <view class="app-nav-item" @tap="navigateTo('/pages/survey/survey')">
          <view class="navi-icon navi-icon-survey"></view>
          <text>问卷测评</text>
        </view>
        <view class="app-nav-item" @tap="navigateTo('/pages/report/report')">
          <view class="navi-icon navi-icon-chart"></view>
          <text>数据中心</text>
        </view>
        <view class="app-nav-item" @tap="navigateTo('/pages/legal-db/legal-db')">
          <view class="navi-icon navi-icon-book"></view>
          <text>法律库</text>
        </view>
        <view class="app-nav-item" @tap="navigateTo('/pages/ai-assistant/ai-assistant')">
          <view class="navi-icon navi-icon-bot"></view>
          <text>AI助手</text>
        </view>
        <view class="app-nav-item is-active" data-nav-key="learning-center" @tap="navigateTo('/pages/learning-center/learning-center')">
          <view class="navi-icon navi-icon-book-open"></view>
          <text>学习中心</text>
        </view>
      </nav>

      <view class="app-sidebar-user">
        <view class="app-sidebar-user-inner" @tap="navigateTo('/pages/profile/profile')">
          <view class="app-sidebar-user-avatar">{{ userInitial }}</view>
          <view style="min-width:0;flex:1">
            <text class="app-sidebar-user-name">{{ userName }}</text>
            <text class="app-sidebar-user-role">{{ userRole }}</text>
          </view>
        </view>
        <view class="app-sidebar-logout" @tap="handleLogout">
          <view class="app-sidebar-logout-icon"></view>
          <text class="app-sidebar-logout-text">退出登录</text>
        </view>
      </view>
    </aside>

    <view class="app-main">
      <header class="app-topbar">
        <view class="app-topbar-left">
          <view class="app-back-btn" @tap="goBack">
            <view class="back-arrow-icon"></view>
            <text>返回</text>
          </view>
          <text class="app-topbar-title">词汇积累</text>
        </view>
        <text class="app-topbar-meta">{{ currentLang }} · 共 {{ vocabTotal }} 词</text>
      </header>

      <main class="app-content">
        <view class="lang-switch">
          <view
            class="lang-chip"
            :class="{ 'is-active': currentLang === lang }"
            v-for="lang in LANGUAGES"
            :key="lang"
            @tap="switchLang(lang)"
          >{{ lang }}</view>
        </view>

        <view class="vocab-cards">
          <view class="vocab-card unlearned" :class="{ active: activeCard === 'unlearned' }" @tap="switchCard('unlearned')">
            <view class="card-num">{{ stats.unlearned }}</view>
            <view class="card-label">未学习词汇</view>
            <view class="card-desc">尚未开始学习</view>
          </view>
          <view class="vocab-card review" :class="{ active: activeCard === 'review' }" @tap="switchCard('review')">
            <view class="card-num">{{ stats.review }}</view>
            <view class="card-label">待复习词汇</view>
            <view class="card-desc">到期需要巩固</view>
          </view>
          <view class="vocab-card starred" :class="{ active: activeCard === 'starred' }" @tap="switchCard('starred')">
            <view class="card-num">{{ stats.starred }}</view>
            <view class="card-label">收藏词汇</view>
            <view class="card-desc">我的重点收藏</view>
          </view>
        </view>

        <view class="list-head">
          <text class="list-title">{{ activeTitle }}</text>
          <text class="list-count">{{ activeWords.length }} 词</text>
          <view class="vocab-search">
            <view class="vocab-search-icon"></view>
            <input class="vocab-search-input" v-model="searchText" placeholder="搜索词汇" confirm-type="search" />
            <view v-if="searchText" class="vocab-search-clear" @tap="searchText = ''">×</view>
          </view>
        </view>

        <view v-if="activeWords.length">
          <view class="word-grid">
            <view class="word-card" v-for="word in displayedWords" :key="word.id" @tap="onWordTap(word)">
              <text class="word-en">{{ word.en }}</text>
              <text class="word-cn">{{ word.cn }}</text>
              <view class="word-actions">
                <view class="action-btn star-btn" :class="{ active: isStarredWord(word) }" @tap.stop="toggleStar(word)">
                  {{ isStarredWord(word) ? '已收藏' : '收藏' }}
                </view>
                <view v-if="activeCard !== 'starred'" class="action-btn known-btn" @tap.stop="markWord(word, true)">
                  {{ isLearnedWord(word) ? '已掌握' : '认识' }}
                </view>
                <view v-if="activeCard !== 'starred'" class="action-btn again-btn" @tap.stop="markWord(word, false)">
                  {{ isLearnedWord(word) ? '再复习' : '不认识' }}
                </view>
              </view>
            </view>
          </view>
          <view v-if="activeWords.length > PAGE_SIZE" class="vocab-pagination">
            <view class="vocab-pagination-info">
              共 {{ activeWords.length }} 词，每页 51 条，当前第 {{ currentPage }} / {{ totalPages }} 页
            </view>
            <view class="vocab-pagination-buttons">
              <view
                class="vocab-page-btn"
                :class="{ 'is-disabled': currentPage <= 1 }"
                @tap="changePage(currentPage - 1)"
              >上一页</view>
              <view
                class="vocab-page-item"
                v-for="page in visiblePageNumbers"
                :key="page"
              >
                <view v-if="page === '...'" class="vocab-page-ellipsis" @tap="jumpToPage">...</view>
                <view
                  v-else
                  class="vocab-page-btn"
                  :class="{ 'is-active': page === currentPage }"
                  @tap="changePage(page)"
                >{{ page }}</view>
              </view>
              <view
                class="vocab-page-btn"
                :class="{ 'is-disabled': currentPage >= totalPages }"
                @tap="changePage(currentPage + 1)"
              >下一页</view>
            </view>
          </view>
        </view>
        <view v-else class="empty-state">
          <view class="empty-title">{{ activeTitle }}</view>
          <view class="empty-desc">{{ emptyText }}</view>
        </view>
      </main>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { requireLogin, getDisplayName, getLevelText } from '@/utils/auth.js'
import {
  loadVocabProgress,
  saveVocabProgress,
  mapWord,
  getVocabStats,
  isLearned,
  isDueReview,
  isStarred,
  markWordProgress,
  toggleWordStar,
  normalizeLang
} from '@/utils/vocab.js'

const LANGUAGES = ['英语', '德语', '法语', '拉丁语', '西班牙语']
const vocabPool = ref([])
const progressMap = ref({})
const activeCard = ref('unlearned')
const loading = ref(false)
const currentLang = ref('英语')
const PAGE_SIZE = 51
const VOCAB_CACHE_TTL = 10 * 60 * 1000
const currentPage = ref(1)

const userName = ref(getDisplayName())
const userRole = ref(getLevelText())
const userInitial = computed(() => (userName.value || '用').slice(0, 1))

const stats = computed(() => getVocabStats(vocabPool.value, progressMap.value))
const vocabTotal = computed(() => stats.value.total)

const searchText = ref('')

const activeWords = computed(() => {
  const p = progressMap.value
  const kw = searchText.value.trim().toLowerCase()
  let base
  if (activeCard.value === 'review') {
    base = vocabPool.value
      .filter(w => isDueReview(p[w.id]))
      .sort((a, b) => ((p[a.id] && p[a.id].reviewAt) || 0) - ((p[b.id] && p[b.id].reviewAt) || 0))
  } else if (activeCard.value === 'unlearned') {
    base = vocabPool.value.filter(w => !isLearned(p[w.id]))
  } else if (activeCard.value === 'starred') {
    base = vocabPool.value.filter(w => isStarred(p[w.id]))
  } else {
    base = []
  }
  // 双向搜索：同时匹配外语词条与中文释义
  if (kw) {
    base = base.filter(w =>
      (w.en || '').toLowerCase().includes(kw) ||
      (w.cn || '').toLowerCase().includes(kw)
    )
  }
  return base
})

const totalPages = computed(() => Math.max(1, Math.ceil(activeWords.value.length / PAGE_SIZE)))

const displayedWords = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return activeWords.value.slice(start, start + PAGE_SIZE)
})

const visiblePageNumbers = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages = []
  if (current > 3) pages.push(1, '...')
  const start = Math.max(1, current - 1)
  const end = Math.min(total, current + 1)
  for (let i = start; i <= end; i += 1) pages.push(i)
  if (current < total - 2) pages.push('...', total)
  return pages
})

function changePage(page) {
  const next = Number(page)
  if (!Number.isInteger(next) || next < 1 || next > totalPages.value || next === currentPage.value) return
  currentPage.value = next
  uni.pageScrollTo({ scrollTop: 0, duration: 200 })
}

// 点击省略号"..."弹出输入框，直接跳转到指定页码
function jumpToPage() {
  uni.showModal({
    title: '跳转到指定页',
    editable: true,
    placeholderText: `请输入 1-${totalPages.value} 之间的页码`,
    success: (res) => {
      if (!res.confirm) return
      const n = parseInt(res.content, 10)
      if (Number.isNaN(n)) {
        uni.showToast({ title: '请输入有效页码', icon: 'none' })
        return
      }
      changePage(n)
    }
  })
}

watch(totalPages, (total) => {
  if (currentPage.value > total) currentPage.value = total
})

const activeTitle = computed(() => {
  if (activeCard.value === 'review') return '待复习词汇'
  if (activeCard.value === 'unlearned') return '未学习词汇'
  return '收藏词汇'
})

const emptyText = computed(() => {
  if (!vocabPool.value.length) return `当前“${currentLang.value}”语言下还没有词汇内容，请在管理端维护后重试`
  if (activeCard.value === 'review') return '当前没有到期待复习的词汇，先学习未学习词汇吧'
  if (activeCard.value === 'unlearned') return '未学习词汇已全部完成'
  return '还没有收藏词汇，点击列表中的收藏即可加入'
})

function switchLang(lang) {
  if (currentLang.value === lang) return
  currentLang.value = lang
  try { uni.setStorageSync('lv_last_lang', lang) } catch (e) {}
  vocabPool.value = []
  currentPage.value = 1
  loadVocabResources()
}

function parseLang(value) {
  let raw = String(value || '')
  try {
    raw = decodeURIComponent(raw)
  } catch (e) {}
  return normalizeLang(raw)
}

function switchCard(card) {
  if (activeCard.value !== card) {
    activeCard.value = card
    currentPage.value = 1
  }
}

function isStarredWord(word) {
  return isStarred(progressMap.value[word.id])
}

function isLearnedWord(word) {
  return isLearned(progressMap.value[word.id])
}

function toggleStar(word) {
  progressMap.value = toggleWordStar(progressMap.value, word)
  saveVocabProgress(progressMap.value)
}

function markWord(word, known) {
  progressMap.value = markWordProgress(progressMap.value, word, known)
  saveVocabProgress(progressMap.value)
  uni.showToast({ title: known ? '已加入复习计划' : '已加入待复习', icon: 'none' })
}

function onWordTap(word) {
  uni.showToast({ title: `${word.en}：${word.cn}`, icon: 'none' })
}

async function fetchVocabByLang(lang) {
  const resourcesObj = uniCloud.importObject('resources', { customUI: true })
  // 云数据库单次 get 有 100 条上限，翻页拉全，避免词量大时被截断
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
    page++
  } while (fetched < total)
  return all
    .filter(d => d.type === 'vocabulary' && normalizeLang(d.lang) === currentLang.value)
    .map(mapWord)
}

async function loadVocabResources() {
  if (loading.value) return
  loading.value = true
  try {
    // 词库变动不频繁：本地缓存 10 分钟，避免每次进入都重复拉取全量词汇
    const cacheKey = `lv_vocab_cache_${currentLang.value}`
    const now = Date.now()
    let words = null
    try {
      const cached = uni.getStorageSync(cacheKey)
      if (cached && cached.expireAt && cached.expireAt > now && Array.isArray(cached.data)) {
        words = cached.data
      }
    } catch (e) {}
    if (!words) {
      // 云函数端按语言过滤，减少传输量；返回空时兼容旧数据（无 lang 字段）回退拉全量再过滤
      words = await fetchVocabByLang(currentLang.value)
      if (!words.length) {
        words = await fetchVocabByLang('')
      }
      try {
        uni.setStorageSync(cacheKey, { expireAt: now + VOCAB_CACHE_TTL, data: words })
      } catch (e) {}
    }
    vocabPool.value = words
    currentPage.value = 1
  } catch (e) {
    uni.showToast({ title: (e && e.errMsg) || '词汇资源加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function goBack() {
  uni.navigateBack({
    fail: () => {
      uni.navigateTo({ url: '/pages/learning-center/legal-english' })
    }
  })
}

function navigateTo(url) {
  uni.navigateTo({ url })
}

function handleLogout() {
  uni.showModal({
    title: '确认退出',
    content: '您确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        try {
          uni.removeStorageSync('token')
          uni.removeStorageSync('userInfo')
          uni.removeStorageSync('adminToken')
          uni.removeStorageSync('adminInfo')
        } catch (e) {
          console.error('清除存储失败:', e)
        }
        uni.reLaunch({ url: '/pages/login/login' })
      }
    }
  })
}

onLoad((options) => {
  if (!requireLogin()) return
  let lang = parseLang(options && options.lang)
  if (!['英语', '德语', '法语', '拉丁语', '西班牙语'].includes(lang)) {
    try { lang = uni.getStorageSync('lv_last_lang') || '英语' } catch (e) { lang = '英语' }
  }
  currentLang.value = parseLang(lang)
  progressMap.value = loadVocabProgress()
  loadVocabResources()
})
</script>

<style scoped>
.app-shell {
  /* === Brand Primary === */
  --rule-primary: #2563EB;
  --rule-primary-hover: #1D4ED8;
  --rule-primary-active: #1E40AF;
  --rule-primary-tint-1: #DBEAFE;
  --rule-primary-tint-2: #BFDBFE;
  --rule-primary-tint-3: #EFF6FF;
  --rule-foreground: #0F172A;
  --rule-card: #FFFFFF;
  --rule-muted: #F1F5F9;
  --rule-muted-foreground: #64748B;
  --rule-ink-2: #475569;
  --rule-border: #E2E8F0;
  --state-error: #DC2626;
  --state-error-tint: #FEE2E2;
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: #F8FAFC;
  color: #0F172A;
  font-family: "Inter", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ===== 左侧导航栏 ===== */
.app-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 240px;
  display: flex;
  flex-direction: column;
  background: var(--rule-card);
  border-right: 1px solid var(--rule-border);
  z-index: 40;
  flex-shrink: 0;
}

.app-sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 24px;
  border-bottom: 1px solid var(--rule-border);
}

.app-sidebar-logo-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--rule-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.ls-svg-glyph {
  width: 20px;
  height: 20px;
  background: #fff;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M7 21h10'/><path d='M12 3v18'/><path d='M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M7 21h10'/><path d='M12 3v18'/><path d='M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2'/></svg>") center/contain no-repeat;
}

.app-sidebar-logo-text {
  font-size: 15px;
  font-weight: 600;
  color: var(--rule-foreground);
  white-space: nowrap;
}

.app-sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
}

.app-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--rule-ink-2);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.app-nav-item:hover {
  background: var(--rule-muted);
  color: var(--rule-foreground);
}

.app-nav-item.is-active {
  background: var(--rule-primary);
  color: #FFFFFF;
}

.app-nav-item.is-active:hover {
  background: var(--rule-primary-hover);
  color: #fff;
}

.navi-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  background: currentColor;
  display: inline-block;
}

.app-nav-item.is-active .navi-icon { background: #fff; }

.navi-icon-survey {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><rect width='8' height='4' x='8' y='2' rx='1'/><path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'/><path d='M12 11h4'/><path d='M12 16h4'/><circle cx='9' cy='11' r='1.2'/><circle cx='9' cy='16' r='1.2'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><rect width='8' height='4' x='8' y='2' rx='1'/><path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'/><path d='M12 11h4'/><path d='M12 16h4'/><circle cx='9' cy='11' r='1.2'/><circle cx='9' cy='16' r='1.2'/></svg>") center/contain no-repeat;
}

.navi-icon-chart {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M3 3v18h18'/><path d='M18 17V9'/><path d='M13 17V5'/><path d='M8 17v-3'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M3 3v18h18'/><path d='M18 17V9'/><path d='M13 17V5'/><path d='M8 17v-3'/></svg>") center/contain no-repeat;
}

.navi-icon-book {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>") center/contain no-repeat;
}

.navi-icon-bot {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M12 8V4H8'/><rect width='16' height='12' x='4' y='8' rx='2'/><path d='M2 14h2'/><path d='M20 14h2'/><path d='M15 13v2'/><path d='M9 13v2'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M12 8V4H8'/><rect width='16' height='12' x='4' y='8' rx='2'/><path d='M2 14h2'/><path d='M20 14h2'/><path d='M15 13v2'/><path d='M9 13v2'/></svg>") center/contain no-repeat;
}

.navi-icon-book-open {
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/%3E%3Cpath d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/%3E%3C/svg%3E") center/contain no-repeat;
          mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/%3E%3Cpath d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/%3E%3C/svg%3E") center/contain no-repeat;
}

.app-sidebar-user {
  padding: 16px 12px;
  border-top: 1px solid var(--rule-border);
}

.app-sidebar-user-inner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 8px;
}

.app-sidebar-user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  background: var(--rule-primary-tint-1);
  color: var(--rule-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.app-sidebar-user-name {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--rule-foreground);
}

.app-sidebar-user-role {
  display: block;
  font-size: 12px;
  color: var(--rule-muted-foreground);
}

.app-sidebar-logout {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  color: var(--rule-ink-2);
  font-size: 13px;
  cursor: pointer;
}

.app-sidebar-logout:hover {
  background: var(--state-error-tint);
  color: var(--state-error);
}

.app-sidebar-logout-icon {
  width: 16px;
  height: 16px;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>") center/contain no-repeat;
}

/* ===== 主区域与顶栏 ===== */
.app-main {
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 0;
}

.app-topbar {
  height: 64px;
  border-bottom: 1px solid var(--rule-border);
  background: var(--rule-card);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 30;
}

.app-topbar-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.app-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--rule-muted-foreground);
  cursor: pointer;
  transition: color 0.2s ease;
}

.app-back-btn:hover {
  color: var(--rule-primary);
}

.back-arrow-icon {
  width: 16px;
  height: 16px;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='m15 18-6-6 6-6'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='m15 18-6-6 6-6'/></svg>") center/contain no-repeat;
}

.app-topbar-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--rule-foreground);
}

.app-topbar-meta {
  font-size: 13px;
  color: var(--rule-muted-foreground);
  font-variant-numeric: tabular-nums;
}

.app-content {
  flex: 1;
  padding: 28px 32px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.lang-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.lang-chip {
  height: 34px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  border: 1px solid #E2E8F0;
  border-radius: 9999px;
  background: #FFFFFF;
  font-size: 13px;
  font-weight: 600;
  color: #64748B;
  cursor: pointer;
  transition: border-color .15s ease, background .15s ease, color .15s ease;
}

.lang-chip:hover {
  border-color: #BFDBFE;
  color: #2563EB;
}

.lang-chip.is-active {
  background: #2563EB;
  border-color: #2563EB;
  color: #FFFFFF;
}

.lang-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.lang-chip {
  height: 34px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  border: 1px solid #E2E8F0;
  border-radius: 9999px;
  background: #FFFFFF;
  font-size: 13px;
  font-weight: 600;
  color: #64748B;
  cursor: pointer;
  transition: border-color .15s ease, background .15s ease, color .15s ease;
}

.lang-chip:hover {
  border-color: #BFDBFE;
  color: #2563EB;
}

.lang-chip.is-active {
  background: #2563EB;
  border-color: #2563EB;
  color: #FFFFFF;
}

.vocab-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.vocab-card {
  padding: 20px;
  border: 1px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: transform .15s ease, border-color .15s ease, box-shadow .15s ease;
}

.vocab-card:hover {
  transform: translateY(-2px);
}

.vocab-card.review {
  background: #FFFBEB;
  border-color: #FDE68A;
}

.vocab-card.unlearned {
  background: #EFF6FF;
  border-color: #BFDBFE;
}

.vocab-card.starred {
  background: #F0FDFA;
  border-color: #99F6E4;
}

.vocab-card.active {
  box-shadow: 0 12px 32px -12px rgba(15, 23, 42, .18);
}

.vocab-card.active.review {
  border-color: #D97706;
}

.vocab-card.active.unlearned {
  border-color: #2563EB;
}

.vocab-card.active.starred {
  border-color: #0F766E;
}

.card-num {
  font-size: 32px;
  line-height: 1.1;
  font-weight: 800;
}

.review .card-num { color: #D97706; }
.unlearned .card-num { color: #2563EB; }
.starred .card-num { color: #0F766E; }

.card-label {
  margin-top: 12px;
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
}

.card-desc {
  margin-top: 6px;
  font-size: 13px;
  color: #64748B;
}

.vocab-search {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 5px 10px;
  width: 200px;
  flex-shrink: 0;
  transition: border-color .15s ease, box-shadow .15s ease;
}

.vocab-search:focus-within {
  border-color: var(--rule-primary, #2563EB);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, .12);
}

.vocab-search-icon {
  width: 13px;
  height: 13px;
  border: 2px solid #94A3B8;
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
}

.vocab-search-icon::after {
  content: '';
  position: absolute;
  width: 6px;
  height: 2px;
  background: #94A3B8;
  border-radius: 2px;
  transform: rotate(45deg);
  right: -4px;
  bottom: -2px;
}

.vocab-search-input {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  color: #0F172A;
}

.vocab-search-clear {
  width: 18px;
  height: 18px;
  line-height: 16px;
  text-align: center;
  border-radius: 50%;
  background: #F1F5F9;
  color: #64748B;
  font-size: 13px;
  cursor: pointer;
  flex-shrink: 0;
  user-select: none;
}

.vocab-search-clear:hover {
  background: #E2E8F0;
  color: #334155;
}

.list-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 0 12px;
}

.list-title {
  font-size: 18px;
  font-weight: 700;
  color: #0F172A;
  white-space: nowrap;
}

.list-count {
  font-size: 13px;
  color: #64748B;
  white-space: nowrap;
}

.vocab-search {
  margin-left: auto;
}

.word-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.word-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: border-color .15s ease, box-shadow .15s ease, transform .15s ease;
}

.word-card:hover {
  border-color: #BFDBFE;
  box-shadow: 0 2px 10px rgba(15, 23, 42, .06);
  transform: translateY(-1px);
}

.word-en {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: #0F172A;
  line-height: 1.4;
  overflow-wrap: break-word;
}

.word-cn {
  display: block;
  font-size: 15px;
  line-height: 1.6;
  font-weight: 600;
  color: var(--rule-primary, #2563EB);
  flex: 1;
  min-height: 48px;
}

.word-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  padding-top: 8px;
  border-top: 1px dashed #E2E8F0;
}

.action-btn {
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: opacity .15s ease, transform .15s ease;
}

.action-btn:hover {
  opacity: .88;
  transform: translateY(-1px);
}

.star-btn {
  color: #92400E;
  background: #FEF3C7;
  border: 1px solid #FCD34D;
}

.star-btn:hover {
  background: #FDE68A;
}

.star-btn.active {
  color: #FFFFFF;
  background: #D97706;
  border-color: #D97706;
}

.known-btn {
  color: #FFFFFF;
  background: #2563EB;
}

.known-btn:hover {
  background: #1D4ED8;
}

.again-btn {
  color: #E11D48;
  background: #FFF1F2;
  border: 1px solid #FECDD3;
}

.again-btn:hover {
  background: #FFE4E6;
}

.vocab-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 18px;
}
.vocab-pagination-info {
  font-size: 13px;
  color: #64748B;
  font-variant-numeric: tabular-nums;
}
.vocab-pagination-buttons {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.vocab-page-item {
  display: inline-flex;
}
.vocab-page-btn,
.vocab-page-ellipsis {
  min-width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  background: #FFFFFF;
  color: #475569;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease, opacity 0.15s ease;
}
.vocab-page-ellipsis {
  border-color: transparent;
  background: transparent;
  cursor: pointer;
  color: #64748B;
  user-select: none;
}

.vocab-page-ellipsis:hover {
  color: #2563EB;
}
.vocab-page-btn:hover:not(.is-disabled):not(.is-active) {
  border-color: #2563EB;
  color: #2563EB;
}
.vocab-page-btn.is-active {
  background: #2563EB;
  border-color: #2563EB;
  color: #FFFFFF;
}
.vocab-page-btn.is-disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.empty-state {
  margin-top: 16px;
  padding: 40px 24px;
  border: 1px dashed #CBD5E1;
  border-radius: 12px;
  text-align: center;
}

.empty-title {
  font-size: 16px;
  font-weight: 700;
  color: #334155;
}

.empty-desc {
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.7;
  color: #64748B;
}

@media (max-width: 1024px) {
  .word-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .app-sidebar {
    transform: translateX(-100%);
  }
  .app-main {
    margin-left: 0;
  }
  .app-topbar {
    padding: 0 20px;
  }
  .app-content {
    padding: 20px;
  }
  .vocab-cards {
    grid-template-columns: 1fr;
  }
  .word-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .app-topbar-meta {
    min-width: auto;
  }
  .card-num {
    font-size: 28px;
  }
  .list-head {
    flex-wrap: wrap;
    gap: 8px;
  }
  .vocab-search {
    width: 100%;
    margin-left: 0;
  }
  .word-grid {
    grid-template-columns: 1fr;
  }
}
</style>
