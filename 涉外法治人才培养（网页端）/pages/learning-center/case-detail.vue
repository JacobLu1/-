<template>
  <view class="cd-shell">
    <view class="css-vars" aria-hidden="true"></view>

    <view class="app-shell">
      <aside class="app-sidebar">
        <view class="app-sidebar-logo">
          <view class="app-sidebar-logo-icon">
            <image class="ls-svg-img" src="/static/logo.png" mode="aspectFit"></image>
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
            <text class="app-topbar-title">案例分析</text>
          </view>
          <text class="app-topbar-meta">{{ topbarMeta }}</text>
        </header>

        <main class="app-content">
          <view v-if="loading" class="cd-loading">
            <view class="cd-spinner"></view>
            <text>正在加载案例正文...</text>
          </view>
          <view v-else-if="!book" class="cd-empty">
            <view class="cd-empty-icon"></view>
            <text class="cd-empty-title">未找到该案例</text>
            <text class="cd-empty-sub">案例可能已下线或不存在</text>
          </view>

          <view v-else class="cd-layout">
            <view class="cd-main-col">
              <!-- 案例头部 -->
              <view class="cd-book-head">
                <view class="cd-book-tags">
                  <text class="cd-tag">{{ book.category || '未分类' }}</text>
                  <text v-if="book.meta" class="cd-tag cd-tag-soft">{{ book.meta }}</text>
                  <text class="cd-tag cd-tag-soft">约 {{ totalWords }} 字</text>
                </view>
                <text class="cd-book-title">{{ book.title }}</text>
                <text v-if="book.description" class="cd-book-summary">{{ book.description }}</text>
              </view>

              <!-- 工具条 -->
              <view class="cd-toolbar">
                <view class="cd-tool-group">
                  <view class="cd-tool-btn cd-tool-btn-font" title="缩小字号" @tap="decreaseFont">
                    <text class="cd-font-op">A−</text>
                  </view>
                  <view class="cd-tool-btn cd-tool-btn-font" title="放大字号" @tap="increaseFont">
                    <text class="cd-font-op">A+</text>
                  </view>
                  <text class="cd-font-size">{{ fontSize }}px</text>
                  <view class="cd-tool-sep"></view>
                  <view v-if="book.fileUrl" class="cd-tool-btn" @tap="openOriginal">
                    <view class="cd-tool-icon cd-icon-link"></view>
                    <text>原文链接</text>
                  </view>
                </view>
              </view>

              <!-- 正文 -->
              <view class="cd-body" :style="{ '--cd-font': fontSize + 'px' }">
                <view class="cd-para" v-for="(p, pi) in paragraphs" :key="pi">
                  <text>{{ p }}</text>
                </view>
              </view>
            </view>

            <!-- 右侧目录 -->
            <aside class="cd-toc">
              <view class="cd-toc-card">
                <text class="cd-toc-title">案例信息</text>
                <view class="cd-toc-info">
                  <view class="cd-toc-info-row">
                    <text class="cd-toc-info-label">分类</text>
                    <text class="cd-toc-info-value">{{ book.category || '未分类' }}</text>
                  </view>
                  <view v-if="book.meta" class="cd-toc-info-row">
                    <text class="cd-toc-info-label">案号/来源</text>
                    <text class="cd-toc-info-value">{{ book.meta }}</text>
                  </view>
                  <view v-if="book.date" class="cd-toc-info-row">
                    <text class="cd-toc-info-label">发布时间</text>
                    <text class="cd-toc-info-value">{{ book.date }}</text>
                  </view>
                  <view class="cd-toc-info-row">
                    <text class="cd-toc-info-label">字数</text>
                    <text class="cd-toc-info-value">约 {{ totalWords }} 字</text>
                  </view>
                </view>
                <view v-if="sections.length" class="cd-toc-sections">
                  <text class="cd-toc-title cd-toc-title-sm">章节导航</text>
                  <view class="cd-toc-list">
                    <view
                      class="cd-toc-item"
                      v-for="(sec, i) in sections"
                      :key="i"
                      :class="{ 'is-active': currentSection === i }"
                      @tap="jumpToSection(i)"
                    >
                      <text class="cd-toc-text">{{ sec }}</text>
                    </view>
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
const paragraphs = ref([])
const sections = ref([])
const currentSection = ref(0)
const fontSize = ref(17)

const userName = ref(getDisplayName())
const userRole = ref(getLevelText())
const userInitial = computed(() => (userName.value || '用').slice(0, 1))

const topbarMeta = computed(() => {
  if (!book.value) return ''
  return `${sections.value.length} 节 · 约 ${totalWords.value} 字`
})

const totalWords = computed(() => (book.value && book.value.content ? book.value.content.replace(/\s/g, '').length : 0))

/* 正文解析：按空行分段落，识别章节标题 */
function parseContent(content) {
  const lines = String(content || '').split('\n')
  const paras = []
  const secs = []
  let buf = []

  // 常见裁判文书/案例章节标题模式
  const SEC_RE = /^(第[一二三四五六七八九十百]+[部分篇章编][、.\s]?|一[、.][^\n]{2,20}|二[、.][^\n]{2,20}|三[、.][^\n]{2,20}|四[、.][^\n]{2,20}|五[、.][^\n]{2,20}|六[、.][^\n]{2,20}|七[、.][^\n]{2,20}|八[、.][^\n]{2,20}|九[、.][^\n]{2,20}|十[、.][^\n]{2,20}|裁判要旨|裁判理由|法院认为|本院认为|经审理查明|案件事实|争议焦点|原告诉称|被告辩称|裁判结果|判决如下|裁定如下|综上所述|附[：:][^\n]{0,10})$/

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) {
      if (buf.length) { paras.push(buf.join('')); buf = [] }
      continue
    }
    // 短行（≤30字）且符合章节标题模式 → 作为章节
    if (line.length <= 30 && SEC_RE.test(line)) {
      if (buf.length) { paras.push(buf.join('')); buf = [] }
      secs.push(line)
      paras.push(line) // 标题也作为段落渲染
      continue
    }
    buf.push(line)
  }
  if (buf.length) paras.push(buf.join(''))
  return { paragraphs: paras, sections: secs }
}

/* 字号 */
function loadFontSize() {
  try {
    const v = uni.getStorageSync('cd_fs')
    if (v >= 14 && v <= 22) fontSize.value = v
  } catch (e) {}
}
function saveFontSize() {
  try { uni.setStorageSync('cd_fs', fontSize.value) } catch (e) {}
}
function increaseFont() {
  if (fontSize.value < 22) { fontSize.value += 1; saveFontSize() }
}
function decreaseFont() {
  if (fontSize.value > 14) { fontSize.value -= 1; saveFontSize() }
}

/* 章节跳转 */
function jumpToSection(i) {
  const title = sections.value[i]
  if (!title) return
  currentSection.value = i
  // 找到包含该标题的段落索引
  const pi = paragraphs.value.findIndex(p => p === title)
  if (pi < 0) return
  // #ifdef H5
  const el = document.getElementById('cdp' + pi)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  // #endif
  // #ifndef H5
  uni.pageScrollTo({ selector: '#cdp' + pi, duration: 300 })
  // #endif
}

function handleScroll() {
  if (!sections.value.length) return
  // #ifdef H5
  let cur = 0
  const vh = window.innerHeight || 600
  for (let i = 0; i < sections.value.length; i++) {
    const title = sections.value[i]
    const pi = paragraphs.value.findIndex(p => p === title)
    if (pi < 0) continue
    const el = document.getElementById('cdp' + pi)
    if (!el) continue
    const rect = el.getBoundingClientRect()
    if (rect.top <= vh * 0.35) cur = i
  }
  currentSection.value = cur
  // #endif
}

const CASE_CACHE_TTL = 7 * 24 * 60 * 60 * 1000

async function loadBook() {
  if (!bookId.value || loading.value) return
  loading.value = true
  try {
    // 本地缓存
    let cached = null
    try { cached = uni.getStorageSync('cd_cache_' + bookId.value) } catch (e) {}
    if (cached && cached.expireAt > Date.now() && cached.doc) {
      book.value = cached.doc
      const parsed = parseContent(cached.doc.content || '')
      paragraphs.value = parsed.paragraphs
      sections.value = parsed.sections
      return
    }

    const resourcesObj = uniCloud.importObject('resources', { customUI: true })
    const r = (await resourcesObj.get({ id: bookId.value })) || {}
    if (r.errCode === 0 && r.doc) {
      const doc = r.doc
      book.value = {
        id: doc._id,
        title: doc.title || '',
        category: doc.cat || '',
        meta: doc.meta || '',
        description: doc.description || '',
        content: doc.content || '',
        fileUrl: doc.fileUrl || '',
        date: doc.date || ''
      }
      const parsed = parseContent(doc.content || '')
      paragraphs.value = parsed.paragraphs
      sections.value = parsed.sections
      try {
        uni.setStorageSync('cd_cache_' + bookId.value, { expireAt: Date.now() + CASE_CACHE_TTL, doc: book.value })
      } catch (e) {}
    } else {
      book.value = null
    }
  } catch (e) {
    uni.showToast({ title: (e && e.errMsg) || '案例加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function openOriginal() {
  const url = book.value && book.value.fileUrl
  if (!url) {
    uni.showToast({ title: '暂无原文链接', icon: 'none' })
    return
  }
  // #ifdef H5
  window.open(url, '_blank')
  // #endif
  // #ifndef H5
  uni.setClipboardData({ data: url, success: () => uni.showToast({ title: '链接已复制', icon: 'none' }) })
  // #endif
}

function navigateTo(url) {
  uni.navigateTo({ url })
}

function goBack() {
  uni.navigateBack({
    fail: () => {
      uni.navigateTo({ url: '/pages/learning-center/case-study' })
    }
  })
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
        } catch (e) {}
        uni.reLaunch({ url: '/pages/login/login' })
      }
    }
  })
}

onLoad((query) => {
  if (!requireLogin()) return
  if (query && query.id) bookId.value = query.id
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
.cd-shell {
  --cd-primary: #2563EB;
  --cd-primary-hover: #1D4ED8;
  --cd-primary-tint-1: #DBEAFE;
  --cd-primary-tint-2: #BFDBFE;
  --cd-primary-tint-3: #EFF6FF;
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
  --rule-shadow-2: 0 12px 28px rgba(15, 23, 42, 0.10);
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: #F6F8FB;
  color: #0F172A;
  font-family: "Inter", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

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
}

.app-sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 18px;
  border-bottom: 1px solid var(--rule-border);
}

.app-sidebar-logo-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--rule-primary-tint-1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.ls-svg-img {
  width: 22px;
  height: 22px;
}

.app-sidebar-logo-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--rule-foreground);
}

.app-sidebar-nav {
  flex: 1;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.app-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--rule-ink-2);
  transition: background .15s ease, color .15s ease;
}

.app-nav-item:hover {
  background: var(--rule-muted);
  color: var(--rule-foreground);
}

.app-nav-item.is-active {
  background: var(--rule-primary-tint-1);
  color: var(--rule-primary);
  font-weight: 600;
}

.navi-icon {
  width: 18px;
  height: 18px;
  display: inline-block;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.navi-icon-survey { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 11l3 3L22 4'/%3E%3Cpath d='M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11'/%3E%3C/svg%3E"); }
.app-nav-item.is-active .navi-icon-survey { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232563EB' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 11l3 3L22 4'/%3E%3Cpath d='M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11'/%3E%3C/svg%3E"); }

.navi-icon-chart { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='20' x2='18' y2='10'/%3E%3Cline x1='12' y1='20' x2='12' y2='4'/%3E%3Cline x1='6' y1='20' x2='6' y2='14'/%3E%3C/svg%3E"); }
.app-nav-item.is-active .navi-icon-chart { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232563EB' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='20' x2='18' y2='10'/%3E%3Cline x1='12' y1='20' x2='12' y2='4'/%3E%3Cline x1='6' y1='20' x2='6' y2='14'/%3E%3C/svg%3E"); }

.navi-icon-book { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 19.5A2.5 2.5 0 016.5 17H20'/%3E%3Cpath d='M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z'/%3E%3C/svg%3E"); }
.app-nav-item.is-active .navi-icon-book { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232563EB' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 19.5A2.5 2.5 0 016.5 17H20'/%3E%3Cpath d='M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z'/%3E%3C/svg%3E"); }

.navi-icon-bot { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='11' width='18' height='10' rx='2'/%3E%3Ccircle cx='12' cy='5' r='2'/%3E%3Cpath d='M12 7v4'/%3E%3Cline x1='8' y1='16' x2='8' y2='16'/%3E%3Cline x1='16' y1='16' x2='16' y2='16'/%3E%3C/svg%3E"); }
.app-nav-item.is-active .navi-icon-bot { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232563EB' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='11' width='18' height='10' rx='2'/%3E%3Ccircle cx='12' cy='5' r='2'/%3E%3Cpath d='M12 7v4'/%3E%3C/svg%3E"); }

.navi-icon-book-open { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z'/%3E%3Cpath d='M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z'/%3E%3C/svg%3E"); }
.app-nav-item.is-active .navi-icon-book-open { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232563EB' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z'/%3E%3Cpath d='M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z'/%3E%3C/svg%3E"); }

.app-sidebar-user {
  padding: 14px 10px;
  border-top: 1px solid var(--rule-border);
}

.app-sidebar-user-inner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.app-sidebar-user-inner:hover {
  background: var(--rule-muted);
}

.app-sidebar-user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--rule-primary);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.app-sidebar-user-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--rule-foreground);
  display: block;
}

.app-sidebar-user-role {
  font-size: 11px;
  color: var(--rule-muted-foreground);
  display: block;
}

.app-sidebar-logout {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  margin-top: 4px;
  border-radius: 8px;
  cursor: pointer;
}

.app-sidebar-logout:hover {
  background: var(--state-error-tint);
}

.app-sidebar-logout-icon {
  width: 16px;
  height: 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4'/%3E%3Cpolyline points='16 17 21 12 16 7'/%3E%3Cline x1='21' y1='12' x2='9' y2='12'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
}

.app-sidebar-logout:hover .app-sidebar-logout-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23DC2626' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4'/%3E%3Cpolyline points='16 17 21 12 16 7'/%3E%3Cline x1='21' y1='12' x2='9' y2='12'/%3E%3C/svg%3E");
}

.app-sidebar-logout-text {
  font-size: 13px;
  color: var(--rule-muted-foreground);
}

.app-sidebar-logout:hover .app-sidebar-logout-text {
  color: var(--state-error);
}

.app-main {
  margin-left: 240px;
  flex: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 32px;
  background: #fff;
  border-bottom: 1px solid var(--rule-border);
}

.app-topbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.app-back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  color: var(--rule-ink-2);
  transition: background .15s ease;
}

.app-back-btn:hover {
  background: var(--rule-muted);
  color: var(--rule-foreground);
}

.back-arrow-icon {
  width: 16px;
  height: 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='19' y1='12' x2='5' y2='12'/%3E%3Cpolyline points='12 19 5 12 12 5'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
}

.app-back-btn:hover .back-arrow-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230F172A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='19' y1='12' x2='5' y2='12'/%3E%3Cpolyline points='12 19 5 12 12 5'/%3E%3C/svg%3E");
}

.app-topbar-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--rule-foreground);
}

.app-topbar-meta {
  font-size: 13px;
  color: var(--rule-muted-foreground);
}

.app-content {
  flex: 1;
  padding: 32px;
}

/* 加载/空状态 */
.cd-loading, .cd-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 16px;
}

.cd-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--rule-border);
  border-top-color: var(--rule-primary);
  border-radius: 50%;
  animation: cd-spin .8s linear infinite;
}

@keyframes cd-spin { to { transform: rotate(360deg); } }

.cd-empty-icon {
  width: 64px;
  height: 64px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23CBD5E1' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z'/%3E%3Cpolyline points='14 2 14 8 20 8'/%3E%3Cline x1='16' y1='13' x2='8' y2='13'/%3E%3Cline x1='16' y1='17' x2='8' y2='17'/%3E%3Cpolyline points='10 9 9 9 8 9'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
}

.cd-empty-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--rule-foreground);
}

.cd-empty-sub {
  font-size: 13px;
  color: var(--rule-muted-foreground);
}

/* 布局 */
.cd-layout {
  display: flex;
  gap: 28px;
  max-width: 1200px;
  margin: 0 auto;
}

.cd-main-col {
  flex: 1;
  min-width: 0;
}

/* 案例头部 */
.cd-book-head {
  background: #fff;
  border-radius: 12px;
  padding: 28px 32px;
  border: 1px solid var(--rule-border);
  margin-bottom: 20px;
}

.cd-book-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.cd-tag {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: var(--rule-primary-tint-1);
  color: var(--rule-primary);
}

.cd-tag-soft {
  background: var(--rule-muted);
  color: var(--rule-muted-foreground);
}

.cd-book-title {
  display: block;
  font-size: 22px;
  font-weight: 700;
  color: var(--rule-foreground);
  line-height: 1.45;
  margin-bottom: 10px;
}

.cd-book-summary {
  display: block;
  font-size: 14px;
  color: var(--rule-ink-2);
  line-height: 1.65;
}

/* 工具条 */
.cd-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  margin-bottom: 16px;
}

.cd-tool-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cd-tool-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 13px;
  color: var(--rule-ink-2);
  cursor: pointer;
  transition: background .15s ease;
}

.cd-tool-btn:hover {
  background: var(--rule-muted);
  color: var(--rule-foreground);
}

.cd-tool-btn-font {
  font-weight: 600;
}

.cd-font-op {
  font-size: 14px;
}

.cd-font-size {
  font-size: 12px;
  color: var(--rule-muted-foreground);
  min-width: 36px;
  text-align: center;
}

.cd-tool-sep {
  width: 1px;
  height: 18px;
  background: var(--rule-border);
  margin: 0 4px;
}

.cd-tool-icon {
  width: 14px;
  height: 14px;
  background-size: contain;
  background-repeat: no-repeat;
}

.cd-icon-link {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6'/%3E%3Cpolyline points='15 3 21 3 21 9'/%3E%3Cline x1='10' y1='14' x2='21' y2='3'/%3E%3C/svg%3E");
}

/* 正文 */
.cd-body {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  border: 1px solid var(--rule-border);
  font-size: var(--cd-font, 17px);
  line-height: 1.85;
  color: var(--rule-foreground);
}

.cd-para {
  margin-bottom: 16px;
  text-indent: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.cd-para:last-child {
  margin-bottom: 0;
}

/* 右侧信息栏 */
.cd-toc {
  width: 260px;
  flex-shrink: 0;
}

.cd-toc-card {
  position: sticky;
  top: 96px;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--rule-border);
}

.cd-toc-title {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--rule-foreground);
  margin-bottom: 6px;
}

.cd-toc-title-sm {
  font-size: 13px;
  margin-top: 16px;
  margin-bottom: 8px;
}

.cd-toc-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cd-toc-info-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cd-toc-info-label {
  font-size: 11px;
  color: var(--rule-muted-foreground);
  text-transform: uppercase;
  letter-spacing: .5px;
}

.cd-toc-info-value {
  font-size: 13px;
  color: var(--rule-foreground);
  font-weight: 500;
}

.cd-toc-sections {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--rule-border);
}

.cd-toc-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 400px;
  overflow-y: auto;
}

.cd-toc-item {
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: var(--rule-ink-2);
  transition: background .15s ease;
}

.cd-toc-item:hover {
  background: var(--rule-muted);
  color: var(--rule-foreground);
}

.cd-toc-item.is-active {
  background: var(--rule-primary-tint-1);
  color: var(--rule-primary);
  font-weight: 500;
}

.cd-toc-text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 响应式 */
@media (max-width: 900px) {
  .app-sidebar { display: none; }
  .app-main { margin-left: 0; }
  .app-content { padding: 20px 16px; }
  .cd-layout { flex-direction: column; }
  .cd-toc { width: 100%; }
  .cd-toc-card { position: static; }
}
</style>
