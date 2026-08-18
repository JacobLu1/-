<template>
  <view class="rd-shell">
    <!-- ===== Brand CSS Variables ===== -->
    <view class="css-vars" aria-hidden="true"></view>

    <!-- ===== App Shell (Sidebar + Main) ===== -->
    <view class="app-shell">
      <!-- ===== Left Sidebar (与学习中心一致) ===== -->
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

      <!-- ===== Main Content Area ===== -->
      <view class="app-main">
        <header class="app-topbar">
          <view class="app-topbar-left">
            <view class="app-back-btn" @tap="goBack">
              <view class="back-arrow-icon"></view>
              <text>返回</text>
            </view>
            <text class="app-topbar-title">法律文本阅读</text>
          </view>
          <text class="app-topbar-meta">{{ topbarMeta }}</text>
        </header>

        <main class="app-content">
          <view v-if="loading" class="rd-loading">
            <view class="rd-spinner"></view>
            <text>正在加载阅读内容...</text>
          </view>
          <view v-else-if="!book" class="rd-empty">
            <view class="rd-empty-icon"></view>
            <text class="rd-empty-title">未找到该文本</text>
            <text class="rd-empty-sub">文献可能已下线或不存在</text>
          </view>

          <view v-else class="rd-layout">
            <!-- 左侧：正文 -->
            <view class="rd-main-col">
              <!-- 书头部 -->
              <view class="rd-book-head">
                <view class="rd-book-tags">
                  <text class="rd-tag">{{ book.category || '未分类' }}</text>
                  <text class="rd-tag rd-tag-soft">约 {{ totalWords }} 字</text>
                </view>
                <text class="rd-book-title">{{ book.title }}</text>
                <text v-if="book.meta" class="rd-book-meta">{{ book.meta }}</text>
                <text v-if="book.description" class="rd-book-summary">{{ book.description }}</text>
              </view>

              <!-- 阅读工具条 -->
              <view class="rd-toolbar">
                <view class="rd-tool-group">
                  <view
                    class="rd-tool-btn"
                    :class="{ 'is-active': bookmarked }"
                    :title="bookmarked ? '取消书签' : '添加书签'"
                    @tap="toggleBookmark"
                  >
                    <view class="rd-tool-icon rd-icon-bookmark"></view>
                    <text>{{ bookmarked ? '已书签' : '书签' }}</text>
                  </view>
                  <view class="rd-tool-sep"></view>
                  <view class="rd-tool-btn rd-tool-btn-font" title="缩小字号" @tap="decreaseFont">
                    <text class="rd-font-op">A−</text>
                  </view>
                  <view class="rd-tool-btn rd-tool-btn-font" title="放大字号" @tap="increaseFont">
                    <text class="rd-font-op">A+</text>
                  </view>
                  <text class="rd-font-size">{{ fontSize }}px</text>
                </view>
              </view>

              <!-- 正文 -->
              <view class="rd-body" :style="{ '--rd-font': fontSize + 'px' }">
                <view class="rd-chapter" v-for="(ch, ci) in chapters" :key="ci" :id="'rdc' + ci">
                  <view class="rd-chapter-head" :class="{ 'is-front': ch.isFront }">
                    <text class="rd-chapter-head-text">{{ ch.title }}</text>
                  </view>
                  <view class="rd-para" v-for="(p, pi) in ch.paragraphs" :key="pi">
                    <text v-for="(seg, si) in splitParagraph(p)" :key="si" :class="{ 'rd-note': seg.n }">{{ seg.t }}</text>
                  </view>
                </view>
              </view>
            </view>

            <!-- 右侧：目录（宽屏 sticky） -->
            <aside class="rd-toc">
              <view class="rd-toc-card">
                <text class="rd-toc-title">目录</text>
                <text class="rd-toc-sub">共 {{ chapters.length }} 章 · 点击跳转</text>
                <view class="rd-toc-list">
                  <view
                    class="rd-toc-item"
                    v-for="(ch, i) in chapters"
                    :key="i"
                    :class="{ 'is-active': currentChapter === i }"
                    @tap="jumpToChapter(i)"
                  >
                    <text class="rd-toc-text">{{ ch.title }}</text>
                    <view v-if="hasBookmark(i)" class="rd-bm-dot"></view>
                  </view>
                </view>
              </view>
            </aside>
          </view>
        </main>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { requireLogin, getDisplayName, getLevelText } from '@/utils/auth.js'

const bookId = ref('')
const book = ref(null)
const loading = ref(false)
const chapters = ref([])
const currentChapter = ref(0)
const bookmarks = ref([])
const fontSize = ref(17)

const userName = ref(getDisplayName())
const userRole = ref(getLevelText())
const userInitial = computed(() => (userName.value || '用').slice(0, 1))

const topbarMeta = computed(() => {
  if (!book.value) return ''
  return `${chapters.value.length} 章 · 约 ${totalWords.value} 字`
})

const totalWords = computed(() => (book.value && book.value.content ? book.value.content.replace(/\s/g, '').length : 0))

const bookmarked = computed(() => bookmarks.value.includes(currentChapter.value))

/* ===== 章节解析 ===== */
function splitChapters(content) {
  const lines = String(content || '').split('\n')
  const list = []
  let cur = null
  const TITLE_RE = /^(导论|后记|第[一二三四五六七八九十]+章.*)$/
  for (const raw of lines) {
    const line = raw.trim()
    if (TITLE_RE.test(line)) {
      if (cur && (cur.title || cur.paragraphs.length)) list.push(cur)
      cur = { title: line, num: (line.match(/第([一二三四五六七八九十]+)章/) || [])[1] || '', isFront: line === '导论' || line === '后记', paragraphLines: [] }
      continue
    }
    if (!cur) {
      if (!line) continue
      cur = { title: '正文', num: '', isFront: true, paragraphLines: [] }
    }
    if (!line) {
      cur.paragraphLines.push('')
      continue
    }
    cur.paragraphLines.push(line)
  }
  if (cur && (cur.title || cur.paragraphLines.length)) list.push(cur)

  // 按空行合并为段落
  return list.map(ch => {
    const paras = []
    let buf = []
    for (const l of ch.paragraphLines) {
      if (!l) {
        if (buf.length) { paras.push(buf.join('')); buf = [] }
        continue
      }
      buf.push(l)
    }
    if (buf.length) paras.push(buf.join(''))
    return { title: ch.title, num: ch.num, isFront: ch.isFront, paragraphs: paras }
  })
}

/* ===== 注释识别（小字显示） ===== */
const NOTE_MARK_RE = /[\{\[【〔]\d{1,3}[\}\〕】\]]?|[(\（]\d{1,3}[\〕】\}]/g
function splitParagraph(text) {
  if (!text) return [{ t: text || '', n: false }]
  const pos = []
  let m
  NOTE_MARK_RE.lastIndex = 0
  while ((m = NOTE_MARK_RE.exec(text))) {
    pos.push(m.index)
  }
  // 星号注释：* 后跟汉字，且 * 前是句读或段首（排除“职业化*的程度”这类行内注标）
  for (let i = 0; i < text.length; i++) {
    if (text[i] !== '*') continue
    const next = text[i + 1] || ''
    const prev = text[i - 1] || ''
    if (/[\u4e00-\u9fff]/.test(next) && (!prev || /[。！？；;：:」”』]/.test(prev))) pos.push(i)
  }
  if (!pos.length) return [{ t: text, n: false }]
  const start = Math.min.apply(null, pos)
  if (start <= 0) return [{ t: text, n: true }]
  return [
    { t: text.slice(0, start), n: false },
    { t: text.slice(start), n: true }
  ]
}

/* ===== 书签 ===== */
function loadBookmarks() {
  try { bookmarks.value = uni.getStorageSync('rd_bm_' + bookId.value) || [] } catch (e) { bookmarks.value = [] }
  if (!Array.isArray(bookmarks.value)) bookmarks.value = []
}
function saveBookmarks() {
  try { uni.setStorageSync('rd_bm_' + bookId.value, bookmarks.value) } catch (e) {}
}
function toggleBookmark() {
  if (!chapters.value.length) return
  const ci = currentChapter.value
  const i = bookmarks.value.indexOf(ci)
  if (i >= 0) bookmarks.value.splice(i, 1)
  else bookmarks.value.push(ci)
  saveBookmarks()
}
function hasBookmark(i) {
  return bookmarks.value.includes(i)
}

/* ===== 字号 ===== */
function loadFontSize() {
  try {
    const v = uni.getStorageSync('rd_fs')
    if (v >= 14 && v <= 22) fontSize.value = v
  } catch (e) {}
}
function saveFontSize() {
  try { uni.setStorageSync('rd_fs', fontSize.value) } catch (e) {}
}
function increaseFont() {
  if (fontSize.value < 22) { fontSize.value += 1; saveFontSize() }
}
function decreaseFont() {
  if (fontSize.value > 14) { fontSize.value -= 1; saveFontSize() }
}

/* ===== 跳转章节 ===== */
function jumpToChapter(i) {
  if (!chapters.value[i]) return
  currentChapter.value = i
  // #ifdef H5
  const el = document.getElementById('rdc' + i)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  // #endif
  // #ifndef H5
  uni.pageScrollTo({ selector: '#rdc' + i, duration: 300 })
  // #endif
}

/* ===== 滚动定位当前章节（H5） ===== */
function handleScroll() {
  if (!chapters.value.length) return
  // #ifdef H5
  let cur = 0
  const vh = window.innerHeight || 600
  for (let i = 0; i < chapters.value.length; i++) {
    const el = document.getElementById('rdc' + i)
    if (!el) continue
    const rect = el.getBoundingClientRect()
    if (rect.top <= vh * 0.35) cur = i
  }
  currentChapter.value = cur
  // #endif
}

/* ===== 数据加载 ===== */
const BOOK_CACHE_TTL = 7 * 24 * 60 * 60 * 1000

async function loadBook() {
  if (!bookId.value || loading.value) return
  loading.value = true
  try {
    // 本地缓存：书籍正文为静态大文本（数百 KB），缓存 7 天避免每次重复下载
    const cacheKey = 'rd_book_' + bookId.value
    let cached = null
    try { cached = uni.getStorageSync(cacheKey) } catch (e) {}
    let doc = null
    if (cached && cached.expireAt > Date.now() && cached.doc) {
      doc = cached.doc
    } else {
      const resourcesObj = uniCloud.importObject('resources', { customUI: true })
      const r = (await resourcesObj.get({ id: bookId.value })) || {}
      if (r.errCode !== 0 || !r.doc) {
        uni.showToast({ title: (r && r.errMsg) || '文献不存在或已下线', icon: 'none' })
        return
      }
      doc = r.doc
      try {
        uni.setStorageSync(cacheKey, { expireAt: Date.now() + BOOK_CACHE_TTL, doc })
      } catch (e) {}
    }
    book.value = {
      id: doc._id,
      title: doc.title || '',
      category: doc.cat || '',
      meta: doc.meta || '',
      description: doc.description || '',
      content: doc.content || '',
      fileUrl: doc.fileUrl || ''
    }
    chapters.value = splitChapters(book.value.content)
    loadBookmarks()
  } catch (e) {
    uni.showToast({ title: (e && e.errMsg) || '阅读内容加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function navigateTo(url) {
  uni.navigateTo({ url })
}

function goBack() {
  uni.navigateBack({
    fail: () => {
      uni.navigateTo({ url: '/pages/learning-center/legal-english' })
    }
  })
}

function handleLogout() {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出当前账号吗？',
    success: (res) => {
      if (res.confirm) {
        try {
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
  bookId.value = (options && options.id) || ''
  loadFontSize()
  loadBook()
  // #ifdef H5
  window.addEventListener('scroll', handleScroll, { passive: true })
  // #endif
})

onUnload(() => {
  // #ifdef H5
  window.removeEventListener('scroll', handleScroll)
  // #endif
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

/* ===== 左侧导航栏（与学习中心一致） ===== */
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
  gap: 4px;
  height: 30px;
  padding: 0 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--rule-muted-foreground);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  flex-shrink: 0;
}

.app-back-btn:hover {
  background: var(--rule-primary-tint-3);
  color: var(--rule-primary);
}

.back-arrow-icon {
  width: 14px;
  height: 14px;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M19 12H5'/><path d='m12 5-7 7 7 7'/></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M19 12H5'/><path d='m12 5-7 7 7 7'/></svg>") center/contain no-repeat;
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

/* ===== 加载与空态 ===== */
.rd-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 90px 20px;
  color: var(--rule-muted-foreground);
  font-size: 14px;
}

.rd-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--rule-primary-tint-2);
  border-top-color: var(--rule-primary);
  border-radius: 50%;
  animation: rd-spin .8s linear infinite;
}

@keyframes rd-spin { to { transform: rotate(360deg); } }

.rd-empty {
  margin-top: 40px;
  padding: 70px 20px;
  text-align: center;
  background: #fff;
  border: 1px dashed var(--rule-border);
  border-radius: 16px;
}

.rd-empty-icon {
  width: 44px;
  height: 44px;
  margin: 0 auto 14px;
  background: var(--rule-muted-foreground);
  opacity: .7;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>") center/contain no-repeat;
}

.rd-empty-title {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: var(--rule-foreground);
}

.rd-empty-sub {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  color: var(--rule-muted-foreground);
}

/* ===== 阅读布局 ===== */
.rd-layout {
  display: flex;
  align-items: flex-start;
  gap: 24px;
}

.rd-main-col {
  flex: 1;
  min-width: 0;
  max-width: 860px;
  margin: 0 auto;
}

/* 书头部 */
.rd-book-head {
  background: #fff;
  border: 1px solid var(--rule-border);
  border-radius: 16px;
  padding: 28px 32px 22px;
  margin-bottom: 18px;
}

.rd-book-tags {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rd-tag {
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: var(--rule-primary);
  background: var(--rule-primary-tint-3);
  border: 1px solid var(--rule-primary-tint-2);
}

.rd-tag-soft {
  color: var(--rule-muted-foreground);
  background: var(--rule-muted);
  border-color: var(--rule-border);
}

.rd-book-title {
  display: block;
  margin-top: 12px;
  font-size: 26px;
  font-weight: 800;
  line-height: 1.4;
  color: var(--rule-foreground);
  letter-spacing: .5px;
}

.rd-book-meta {
  display: block;
  margin-top: 8px;
  font-size: 13px;
  color: var(--rule-muted-foreground);
}

.rd-book-summary {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--rule-border);
  font-size: 13.5px;
  line-height: 1.8;
  color: var(--rule-ink-2);
}

/* 阅读工具条 */
.rd-toolbar {
  position: sticky;
  top: 82px;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #fff;
  border: 1px solid var(--rule-border);
  border-radius: 12px;
  padding: 8px 12px;
  margin-bottom: 20px;
  box-shadow: 0 8px 20px -12px rgba(15, 23, 42, .12);
}

.rd-tool-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rd-tool-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 11px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--rule-ink-2);
  cursor: pointer;
  transition: background .15s ease, color .15s ease;
  user-select: none;
}

.rd-tool-btn:hover {
  background: var(--rule-muted);
  color: var(--rule-primary);
}

.rd-tool-btn.is-active {
  background: var(--rule-primary-tint-3);
  color: var(--rule-primary);
}

.rd-tool-btn.is-on {
  background: var(--rule-primary);
  color: #fff;
}

.rd-tool-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  background: currentColor;
}

.rd-icon-bookmark {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z'/></svg>") center/contain no-repeat;
}

.rd-tool-sep {
  width: 1px;
  height: 18px;
  margin: 0 4px;
  background: var(--rule-border);
}

.rd-tool-btn-font { padding: 0 8px; }
.rd-font-op { font-size: 14px; font-weight: 700; letter-spacing: 0; }

.rd-font-size {
  min-width: 34px;
  text-align: center;
  font-size: 11.5px;
  color: var(--rule-muted-foreground);
  font-variant-numeric: tabular-nums;
}

.rd-bm-dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #F59E0B;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, .18);
}

/* 正文 */
.rd-body {
  background: #fff;
  border: 1px solid var(--rule-border);
  border-radius: 16px;
  padding: 36px 40px 48px;
}

.rd-chapter {
  scroll-margin-top: 96px;
}

.rd-chapter + .rd-chapter {
  margin-top: 34px;
  padding-top: 34px;
  border-top: 1px dashed var(--rule-border);
}

.rd-chapter-head {
  position: relative;
  margin-bottom: 18px;
  padding-left: 14px;
}

.rd-chapter-head::before {
  content: "";
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 4px;
  border-radius: 4px;
  background: var(--rule-primary);
}

.rd-chapter-head.is-front::before {
  background: linear-gradient(180deg, #8B5CF6, #6366F1);
}

.rd-chapter-head-text {
  font-size: 20px;
  font-weight: 800;
  color: var(--rule-foreground);
  line-height: 1.5;
  letter-spacing: .5px;
}

.rd-para {
  font-size: var(--rd-font, 17px);
  line-height: 2.05;
  color: var(--rule-foreground);
  text-align: justify;
  letter-spacing: .3px;
  padding: 4px 0;
  border-radius: 6px;
  transition: background .15s ease;
}

.rd-para + .rd-para {
  margin-top: 10px;
}

/* 注释：小字灰显 */
.rd-note {
  display: block;
  margin-top: 8px;
  padding: 8px 12px 8px 14px;
  font-size: calc(var(--rd-font, 17px) * .8);
  line-height: 1.75;
  color: var(--rule-muted-foreground, #64748B);
  background: rgba(37, 99, 235, .06);
  border-left: 2px solid rgba(37, 99, 235, .3);
  border-radius: 0 6px 6px 0;
  letter-spacing: .2px;
}

.rd-para:hover {
  background: rgba(37, 99, 235, .04);
}

/* 右侧目录 */
.rd-toc {
  position: sticky;
  top: 88px;
  max-height: calc(100vh - 104px);
  width: 240px;
  flex-shrink: 0;
}

.rd-toc-card {
  background: #fff;
  border: 1px solid var(--rule-border);
  border-radius: 14px;
  padding: 16px 14px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 6px 20px rgba(15, 23, 42, .05);
}

.rd-toc-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--rule-foreground);
}

.rd-toc-sub {
  font-size: 12px;
  color: var(--rule-muted-foreground);
  margin-top: -6px;
}

.rd-toc-list {
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
}

.rd-toc-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 8px;
  font-size: 13px;
  color: var(--rule-ink-2);
  cursor: pointer;
  transition: background .15s ease, color .15s ease;
}

.rd-toc-item:hover {
  background: var(--rule-muted);
  color: var(--rule-primary);
}

.rd-toc-item.is-active {
  background: var(--rule-primary-tint-3);
  color: var(--rule-primary);
  font-weight: 600;
}

.rd-toc-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ===== 响应式 ===== */
@media (max-width: 1200px) {
  .rd-toc { display: none; }
}

@media (max-width: 768px) {
  .app-sidebar { transform: translateX(-100%); }
  .app-main { margin-left: 0; }
  .app-topbar { padding: 0 20px; }
  .app-content { padding: 20px; }
  .rd-book-head { padding: 20px; }
  .rd-body { padding: 24px 20px 32px; }
  .rd-toolbar { flex-wrap: wrap; }
  .rd-chapter-head-text { font-size: 18px; }
}
</style>
