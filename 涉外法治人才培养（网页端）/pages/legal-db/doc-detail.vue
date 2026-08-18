<template>
  <view class="legal-shell">
    <!-- ===== Brand CSS Variables ===== -->
    <view class="css-vars" aria-hidden="true"></view>

    <!-- ===== App Shell (Sidebar + Main) ===== -->
    <view class="app-shell">
      <!-- ===== Left Sidebar（与法律库完全一致） ===== -->
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
          <view class="app-nav-item is-active" data-nav-key="law-library">
            <view class="navi-icon navi-icon-book"></view>
            <text>法律库</text>
          </view>
          <view class="app-nav-item" @tap="navigateTo('/pages/ai-assistant/ai-assistant')">
            <view class="navi-icon navi-icon-bot"></view>
            <text>AI助手</text>
          </view>
          <view class="app-nav-item" @tap="navigateTo('/pages/learning-center/learning-center')">
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
              <text>返回法律库</text>
            </view>
            <text class="app-topbar-title">法规详情</text>
          </view>
          <text class="app-topbar-meta">{{ doc.title }}</text>
        </header>

        <main class="app-content">
          <view v-if="loading" class="list-state">正在加载法规全文...</view>
          <template v-else-if="doc.title">
            <view class="doc-wrap">
              <!-- ===== 主内容列 ===== -->
              <view class="doc-main-col">
                <!-- ===== 文献头 ===== -->
                <view class="doc-head">
                  <view class="doc-head-meta">
                    <text class="doc-cat">{{ doc.category }}</text>
                    <text class="doc-type" v-if="doc.docType">{{ doc.docType }}</text>
                    <text class="doc-region" v-for="r in (doc.regions || [])" :key="r">{{ r }}</text>
                  </view>
                  <text class="doc-title">{{ doc.title }}</text>
                  <view class="doc-head-sub">
                    <text v-if="doc.source">来源：{{ doc.source }}</text>
                    <text class="doc-head-dot" v-if="doc.source && doc.date">·</text>
                    <text v-if="doc.date">{{ doc.date }} 施行</text>
                  </view>
                  <view class="doc-tags" v-if="doc.tags && doc.tags.length">
                    <text class="doc-tag" v-for="tag in doc.tags" :key="tag">{{ tag }}</text>
                  </view>
                  <text class="doc-summary" v-if="doc.summary">{{ doc.summary }}</text>
                </view>

                <!-- ===== 窄屏内联目录 ===== -->
                <view class="doc-toc doc-toc-inline" v-if="tocItems.length">
                  <view class="doc-toc-head">
                    <text class="doc-toc-title">目录</text>
                    <text class="doc-toc-count">{{ articleCount }} 条</text>
                  </view>
                  <scroll-view class="doc-toc-scroll" scroll-x="true" :show-scrollbar="false">
                    <view class="doc-toc-list">
                      <view
                        class="doc-toc-item"
                        v-for="(item, idx) in tocItems"
                        :key="idx"
                        @tap="scrollToArticle(item.index)"
                      >
                        <template v-if="item.num && item.title && item.title !== '正文'">
                          <text class="doc-toc-item-num">{{ item.num }}</text>
                          <text class="doc-toc-item-dot">·</text>
                          <text class="doc-toc-item-name">{{ item.title }}</text>
                        </template>
                        <template v-else>
                          <text class="doc-toc-item-num" v-if="item.num">{{ item.num }}</text>
                          <text class="doc-toc-item-name">{{ item.title || '正文' }}</text>
                        </template>
                      </view>
                    </view>
                  </scroll-view>
                </view>

                <!-- ===== 条文列表 ===== -->
                <view class="doc-articles">
                  <view
                    v-for="(art, idx) in articles"
                    :key="idx"
                    :id="'doc-art-' + idx"
                    class="doc-article"
                    :class="{ 'is-chapter': art.type === 'chapter', 'is-preface': art.type === 'preface' }"
                  >
                    <template v-if="art.type === 'chapter'">
                      <text class="chapter-title">{{ art.num }}<text v-if="art.title" class="chapter-title-name"> · {{ art.title }}</text></text>
                    </template>
                    <template v-else-if="art.type === 'preface'">
                      <text class="preface-title">{{ art.title }}</text>
                    </template>
                    <template v-else>
                      <text class="article-num">{{ art.num }}</text>
                      <text class="article-title" v-if="art.title">{{ art.title }}</text>
                    </template>
                    <text class="article-text" v-if="art.text">{{ art.text }}</text>
                  </view>
                </view>
              </view>

              <!-- ===== 宽屏右侧竖向目录 ===== -->
              <aside class="doc-toc doc-toc-side" v-if="tocItems.length">
                <view class="doc-toc-side-head">
                  <text class="doc-toc-title">目录</text>
                  <text class="doc-toc-count">{{ articleCount }} 条</text>
                </view>
                <view class="doc-toc-side-scroll">
                  <view
                    class="doc-toc-side-item"
                    v-for="(item, idx) in tocItems"
                    :key="idx"
                    @tap="scrollToArticle(item.index)"
                  >
                    <text class="doc-toc-side-num" v-if="item.num">{{ item.num }}</text>
                    <text class="doc-toc-side-title" v-if="item.title && item.title !== '正文'">{{ item.title }}</text>
                    <text class="doc-toc-side-title" v-else>{{ item.num || '正文' }}</text>
                  </view>
                </view>
              </aside>
            </view>
          </template>
          <view v-else class="list-state">法规不存在或未上线</view>
        </main>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { requireLogin, getDisplayName, getLevelText } from '@/utils/auth.js'

const doc = ref({})
const articles = ref([])
const loading = ref(true)

const userInitial = computed(() => (userName.value || '用').slice(0, 1))
const userName = ref(getDisplayName())
const userRole = ref(getLevelText())

const tocItems = computed(() => {
  return articles.value
    .map((a, i) => ({ ...a, index: i }))
    .filter(a => a.type !== 'article')
})

const articleCount = computed(() => articles.value.filter(a => a.type === 'article').length)

/**
 * 将法规全文解析为结构化条文列表：
 * 「第X章」识别为章节，「第X条」识别为条文，其余段落并入当前条目；
 * 无编号的「前言」等作为前言条目。
 *
 * 序号支持：
 *  - 大写中文：一二三四五六七八九十百千万亿兆零两
 *  - 特殊数字：廿（20）、卅（30）、卌（40）
 *  - 阿拉伯数字：0-9
 *  - 分隔符：、 ， 。 ： : . · 空格（均可有/无）
 */
function parseArticles(content) {
  const lines = String(content || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean)
  // 统一中文符号 → 允许最宽泛匹配
  const CN_NUM = '一二三四五六七八九十百千万亿兆零两廿卅卌'
  const NUM = `${CN_NUM}\\d`
  const SEP = '[、，,\\.。：:·\\s]*'
  const chapterRegex = new RegExp(`^第([${NUM}]+)章${SEP}(.*)$`)
  const articleRegex = new RegExp(`^第([${NUM}]+)条${SEP}(.*)$`)

  const items = []
  let cur = null
  for (const line of lines) {
    const chapterM = line.match(chapterRegex)
    const articleM = line.match(articleRegex)
    if (chapterM) {
      cur = { type: 'chapter', num: '第' + chapterM[1] + '章', title: (chapterM[2] || '').trim(), text: '' }
      items.push(cur)
    } else if (articleM) {
      cur = { type: 'article', num: '第' + articleM[1] + '条', title: (articleM[2] || '').trim(), text: '' }
      items.push(cur)
    } else if (cur) {
      cur.text += (cur.text ? '\n' : '') + line
    } else {
      // 文档起始的「前言/序言/序/凡例/说明」等无编号标题独立一条
      const firstLine = line
      cur = { type: 'preface', num: '', title: firstLine, text: '' }
      items.push(cur)
    }
  }
  return items
}

async function loadDetail(id) {
  loading.value = true
  try {
    const knowledgeObj = uniCloud.importObject('knowledge', { customUI: true })
    const r = (await knowledgeObj.get({ id })) || {}
    if (r.errCode === 0) {
      doc.value = {
        title: r.doc.title || '',
        category: r.doc.category || '综合',
        docType: r.doc.docType || '',
        regions: Array.isArray(r.doc.regions) ? r.doc.regions : [],
        tags: Array.isArray(r.doc.tags) ? r.doc.tags : [],
        source: r.doc.source || '',
        date: r.doc.date || '',
        summary: r.doc.summary || ''
      }
      const rawContent = r.doc.content || r.doc.summary || ''
      const parsed = parseArticles(rawContent)
      articles.value = parsed

      // 自检：若 summary 里写了「共 X 章 Y 条」，但实际解析结果不够，提示管理员可能需要重新导入
      const summary = doc.value.summary
      const chM = summary && summary.match(/共\s*([一二三四五六七八九十百千万亿兆零两廿卅卌\d]+)\s*章/)
      const arM = summary && summary.match(/([一二三四五六七八九十百千万亿兆零两廿卅卌\d]+)\s*条[，。]?$/)
      const expectChapter = chM ? chM[1] : null
      const expectArticle = arM ? arM[1] : null
      const actualChapter = parsed.filter(p => p.type === 'chapter').length
      const actualArticle = parsed.filter(p => p.type === 'article').length
      if (expectChapter || expectArticle) {
        const notMatch =
          (expectChapter && String(actualChapter) !== String(cn2num(expectChapter))) ||
          (expectArticle && String(actualArticle) !== String(cn2num(expectArticle)))
        if (notMatch) {
          // 非阻塞地给一个轻度 toast 提示：可能 DB 里存的 content 不是完整的，需要重新导入
          setTimeout(() => {
            uni.showToast({
              title: `解析自检：共识别 ${actualChapter} 章 / ${actualArticle} 条。与概述数字不符，请在后台重新导入完整文本以获得完整目录。`,
              icon: 'none',
              duration: 4500
            })
          }, 600)
        }
      }
    } else {
      uni.showToast({ title: r.errMsg || '法规加载失败', icon: 'none' })
    }
  } catch (e) {
    uni.showToast({ title: (e && e.errMsg) || '法规加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 简易中文 → 阿拉伯数字转换（仅用于数量自检，不参与实际解析；支持亿/万/千/百/十/零+廿/卅/卌+阿拉伯直通）
function cn2num(str) {
  if (str == null) return NaN
  const s = String(str).trim()
  if (!s) return NaN
  if (/^\d+$/.test(s)) return parseInt(s, 10)
  const specials = { '廿': 20, '卅': 30, '卌': 40 }
  const digits = { '零': 0, '〇': 0, '一': 1, '二': 2, '两': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9 }
  const units = { '十': 10, '百': 100, '千': 1000, '万': 10000, '亿': 100000000 }
  let total = 0, section = 0, current = 0
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (specials[ch] !== undefined) { section += specials[ch]; continue }
    if (digits[ch] !== undefined) { current = digits[ch]; continue }
    const u = units[ch]
    if (u === undefined) continue
    if (u >= 10000) {
      section = (section + (current || (ch === '十' ? 1 : 0))) * (ch === '十' ? 1 : 1)
      // 十 之前没数的情况："十一" => current 为 0，按 1*10 算；需要回溯
      section += current
      if (current === 0 && ch === '十') section += 1 * 10
      else section = section * 1 // already added
      total += section
      section = 0; current = 0
    } else {
      // 十/百/千
      if (current === 0 && ch === '十') current = 1 // "十一" = 11
      section += current * u
      current = 0
    }
  }
  return total + section + current
}

function scrollToArticle(index) {
  uni.pageScrollTo({ selector: '#doc-art-' + index, duration: 300 })
}

const goBack = () => uni.navigateBack({ delta: 1 })
const navigateTo = (url) => uni.navigateTo({ url })

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.clearStorageSync()
        uni.reLaunch({ url: '/pages/login/login' })
      }
    }
  })
}

onLoad((options) => {
  if (!requireLogin()) return
  if (options && options.id) {
    loadDetail(options.id)
  } else {
    loading.value = false
  }
})
</script>

<style scoped>
/* ============================================================
   Brand Design Tokens（与法律库完全一致，定义在根元素以全局继承）
   ============================================================ */
.legal-shell {
  /* === Brand Primary === */
  --rule-primary: #2563EB;
  --rule-primary-hover: #1D4ED8;
  --rule-primary-active: #1E40AF;
  --rule-primary-foreground: #FFFFFF;
  --rule-primary-tint-1: #DBEAFE;
  --rule-primary-tint-2: #BFDBFE;
  --rule-primary-tint-3: #EFF6FF;

  /* === Semantic === */
  --rule-background: #F8FAFC;
  --rule-foreground: #0F172A;
  --rule-card: #FFFFFF;
  --rule-card-foreground: #0F172A;
  --rule-popover: #FFFFFF;
  --rule-popover-foreground: #0F172A;
  --rule-muted: #F1F5F9;
  --rule-muted-foreground: #64748B;
  --rule-border: #E2E8F0;
  --rule-input: #E2E8F0;
  --rule-ring: #2563EB;

  /* === Radius === */
  --rule-radius-small: 4px;
  --rule-radius-medium: 8px;
  --rule-radius-large: 16px;
  --rule-radius-full: 9999px;

  /* === State Colors === */
  --state-success: #16A34A;
  --state-success-tint: #DCFCE7;
  --state-warning: #D97706;
  --state-warning-tint: #FEF3C7;
  --state-error: #DC2626;
  --state-error-tint: #FEE2E2;
  --state-info: #2563EB;
  --state-info-tint: #DBEAFE;

  /* === Neutrals === */
  --rule-ink: #0F172A;
  --rule-ink-2: #475569;
  --rule-ink-3: #94A3B8;
  --rule-line: #E2E8F0;
  --rule-surface: #FFFFFF;
  --rule-surface-2: #F8FAFC;

  /* === Shadows === */
  --rule-shadow-1: 0 1px 2px rgba(15,23,42,.04), 0 1px 1px rgba(15,23,42,.02);
  --rule-shadow-2: 0 8px 24px -8px rgba(15,23,42,.12);
  --rule-shadow-3: 0 24px 60px -20px rgba(15,23,42,.20);

  min-height: 100vh;
  background: var(--rule-background);
  color: var(--rule-foreground);
  font-family: "Inter", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ============================================================
   Shell Layout（与法律库一致）
   ============================================================ */
.app-shell {
  display: flex;
  min-height: 100vh;
  background: var(--rule-background);
}

/* ===== Sidebar（与法律库一致） ===== */
.app-sidebar {
  position: fixed; left: 0; top: 0; height: 100vh; width: 240px;
  display: flex; flex-direction: column;
  background: var(--rule-card);
  border-right: 1px solid var(--rule-border);
  z-index: 40; flex-shrink: 0;
}

.app-sidebar-logo {
  display: flex; align-items: center; gap: 10px;
  padding: 20px 24px;
  border-bottom: 1px solid var(--rule-border);
  color: inherit;
}

.app-sidebar-logo-icon {
  width: 36px; height: 36px; border-radius: 8px;
  background: var(--rule-primary);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.ls-svg-glyph {
  width: 20px; height: 20px;
  background: #fff;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M7 21h10'/><path d='M12 3v18'/><path d='M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M7 21h10'/><path d='M12 3v18'/><path d='M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2'/></svg>") center/contain no-repeat;
}

.app-sidebar-logo-text {
  font-size: 15px; font-weight: 600;
  color: var(--rule-foreground);
  white-space: nowrap;
}

.app-sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  display: flex; flex-direction: column;
  gap: 4px;
  overflow-y: auto;
}

.app-nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px; font-weight: 500;
  color: var(--rule-ink-2);
  transition: background 0.15s ease, color 0.15s ease;
  cursor: pointer;
}
.app-nav-item:hover { background: var(--rule-muted); color: var(--rule-foreground); }
.app-nav-item.is-active {
  background: var(--rule-primary);
  color: #FFFFFF;
}
.app-nav-item.is-active:hover { background: var(--rule-primary-hover); color: #fff; }

/* Nav icons (mask-based SVGs) */
.navi-icon {
  width: 20px; height: 20px; flex-shrink: 0;
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

/* ===== Sidebar User（与法律库一致） ===== */
.app-sidebar-user {
  padding: 16px 12px;
  border-top: 1px solid var(--rule-border);
}
.app-sidebar-user-inner {
  display: flex; align-items: center; gap: 12px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.15s ease;
}
.app-sidebar-user-inner:hover { background: var(--rule-muted); }
.app-sidebar-user-avatar {
  width: 32px; height: 32px; border-radius: 9999px;
  background: var(--rule-primary-tint-1); color: var(--rule-primary);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 600; flex-shrink: 0;
}
.app-sidebar-user-name {
  font-size: 13px; font-weight: 500;
  color: var(--rule-foreground);
  display: block;
}
.app-sidebar-user-role {
  font-size: 12px; color: var(--rule-muted-foreground);
  display: block;
}

.app-sidebar-logout {
  display: flex; align-items: center; gap: 8px;
  margin: 8px 12px 0; padding: 10px 12px;
  border-radius: 8px; cursor: pointer;
  color: var(--rule-ink-2); font-size: 13px;
  transition: background 0.15s ease, color 0.15s ease;
}
.app-sidebar-logout:hover {
  background: var(--state-error-tint);
  color: var(--state-error);
}
.app-sidebar-logout-icon {
  width: 16px; height: 16px; flex-shrink: 0;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>") center/contain no-repeat;
}
.app-sidebar-logout-text {
  font-size: 13px;
  font-weight: 500;
}

/* ===== Main ===== */
.app-main {
  flex: 1; margin-left: 240px;
  display: flex; flex-direction: column;
  min-height: 100vh; min-width: 0;
}

.app-topbar {
  height: 64px;
  border-bottom: 1px solid var(--rule-border);
  background: var(--rule-card);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 32px; flex-shrink: 0;
}

.app-topbar-left {
  display: flex; align-items: center; gap: 16px;
  min-width: 0;
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
  font-size: 18px; font-weight: 600;
  color: var(--rule-foreground);
  white-space: nowrap;
}

.app-topbar-meta {
  font-size: 13px;
  color: var(--rule-muted-foreground);
  max-width: 40%;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

.app-content {
  flex: 1;
  padding: 32px;
  max-width: 1240px;
  width: 100%;
  box-sizing: border-box;
}

/* 宽屏：主内容 + 右侧竖向目录 两栏布局 */
.doc-wrap {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 48px;
  align-items: start;
}
.doc-main-col { min-width: 0; }
.doc-toc-inline { display: none; }
.doc-toc-side { display: block; }

/* ===== 右侧竖向目录 ===== */
.doc-toc-side {
  position: sticky;
  top: 88px;
  max-height: calc(100vh - 104px);
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: 14px;
  padding: 14px 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.05);
}
.doc-toc-side-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 6px 6px;
  border-bottom: 1px dashed var(--rule-border);
}
.doc-toc-side-scroll {
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
}
.doc-toc-side-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 8px;
  border-left: 2px solid transparent;
  cursor: pointer;
  transition: all 0.18s ease;
  margin-bottom: 2px;
}
.doc-toc-side-item:hover {
  background: var(--rule-primary-tint-3);
  border-left-color: var(--rule-primary-tint-2);
}
.doc-toc-side-item:hover .doc-toc-side-num {
  color: var(--rule-primary);
}
.doc-toc-side-num {
  font-size: 12px;
  font-weight: 700;
  color: var(--rule-primary);
  letter-spacing: 0.2px;
  flex-shrink: 0;
}
.doc-toc-side-title {
  font-size: 13px;
  color: var(--rule-ink-2);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-state {
  padding: 80px 20px;
  text-align: center;
  color: var(--rule-muted-foreground);
  font-size: 14px;
}

/* ============================================================
   文献头（简约）
   ============================================================ */
.doc-head {
  padding: 8px 4px 24px;
  border-bottom: 1px solid var(--rule-border);
}

.doc-head-meta {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  margin-bottom: 12px;
}

.doc-cat, .doc-type, .doc-region {
  font-size: 12px; font-weight: 600;
  padding: 3px 11px;
  border-radius: var(--rule-radius-full);
}
.doc-cat { color: var(--rule-primary); background: var(--rule-primary-tint-1); }
.doc-type { color: #7C3AED; background: #EDE9FE; }
.doc-region { color: var(--state-success); background: var(--state-success-tint); }

.doc-title {
  display: block;
  font-size: 26px; font-weight: 700;
  color: var(--rule-foreground);
  line-height: 1.4;
  letter-spacing: 0.5px;
}

.doc-head-sub {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  margin-top: 10px;
  font-size: 13px;
  color: var(--rule-muted-foreground);
}
.doc-head-dot { color: var(--rule-border); }

.doc-tags {
  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
  margin-top: 12px;
}
.doc-tag {
  font-size: 12px;
  color: var(--rule-ink-2);
  background: var(--rule-muted);
  border: 1px solid var(--rule-border);
  padding: 2px 10px;
  border-radius: var(--rule-radius-full);
}

.doc-summary {
  display: block;
  margin-top: 14px;
  font-size: 14px; line-height: 1.9;
  color: var(--rule-ink-2);
}

/* ============================================================
   条目录：窄屏内联横滑版（仅作用于非侧边栏容器）
   ============================================================ */
.doc-toc-inline {
  margin: 24px 0 28px;
  padding: 16px 18px 14px;
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: 14px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, .03);
}

.doc-toc-inline .doc-toc-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 10px;
}
.doc-toc-inline .doc-toc-title,
.doc-toc-side-head .doc-toc-title {
  font-size: 15px; font-weight: 600;
  color: var(--rule-foreground);
  letter-spacing: 0.3px;
  display: inline-flex; align-items: center; gap: 8px;
}
.doc-toc-inline .doc-toc-title::before,
.doc-toc-side-head .doc-toc-title::before {
  content: '';
  display: inline-block;
  width: 3px; height: 16px;
  background: var(--rule-primary);
  border-radius: 2px;
}
.doc-toc-inline .doc-toc-count,
.doc-toc-side-head .doc-toc-count {
  font-size: 12px;
  color: var(--rule-muted-foreground);
  padding: 3px 10px;
  background: var(--rule-surface-2);
  border-radius: 9999px;
}

.doc-toc-inline .doc-toc-scroll {
  width: 100%;
  white-space: nowrap;
}
.doc-toc-inline .doc-toc-list {
  display: inline-flex; gap: 6px;
  padding: 4px 2px 6px;
}
.doc-toc-inline .doc-toc-item {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 14px;
  border-radius: 10px;
  background: var(--rule-surface-2);
  font-size: 13px;
  color: var(--rule-ink-2);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.18s ease;
  border: 1px solid transparent;
  flex-shrink: 0;
}
.doc-toc-inline .doc-toc-item:hover {
  background: #fff;
  border-color: var(--rule-primary-tint-2);
  color: var(--rule-primary);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08);
}
.doc-toc-inline .doc-toc-item-num {
  font-weight: 600;
  color: var(--rule-primary);
}
.doc-toc-inline .doc-toc-item-dot {
  color: var(--rule-muted-foreground);
  opacity: 0.6;
}
.doc-toc-inline .doc-toc-item-name {
  color: inherit;
}
.doc-toc-inline .doc-toc-item:hover .doc-toc-item-dot {
  opacity: 1;
  color: var(--rule-primary-tint-2);
}

/* ============================================================
   条文列表（简约）
   ============================================================ */
.doc-articles {
  display: flex; flex-direction: column; gap: 14px;
}

.doc-article {
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: var(--rule-radius-medium);
  padding: 20px 24px;
  transition: box-shadow 0.16s ease, border-color 0.16s ease;
  scroll-margin-top: 84px;
}
.doc-article:hover {
  box-shadow: var(--rule-shadow-1);
  border-color: var(--rule-primary-tint-2);
}

/* 章节：无卡片感，仅左线 + 浅色底 */
.doc-article.is-chapter {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 24px;
  background: var(--rule-primary-tint-3);
  border: none;
  border-radius: var(--rule-radius-medium);
  border-left: 4px solid var(--rule-primary);
}
.doc-article.is-chapter:hover {
  box-shadow: none;
  border-color: transparent;
  border-left-color: var(--rule-primary-hover);
}
.chapter-title {
  font-size: 16px; font-weight: 700;
  color: var(--rule-primary);
  letter-spacing: 0.5px;
}
.chapter-title-name {
  color: var(--rule-foreground);
  font-weight: 600;
}

/* 前言：紫色左线 */
.doc-article.is-preface {
  border-left: 4px solid #7C3AED;
  background: #FAF5FF;
}
.preface-title {
  display: block;
  font-size: 16px; font-weight: 700;
  color: #7C3AED;
  margin-bottom: 8px;
}

/* 条文 */
.article-num {
  display: block;
  font-size: 13px; font-weight: 600;
  color: var(--rule-primary);
  letter-spacing: 1px;
  margin-bottom: 8px;
}
.article-title {
  display: block;
  font-size: 15px; font-weight: 600;
  color: var(--rule-foreground);
  margin-bottom: 6px;
}
.article-text {
  display: block;
  font-size: 15px; line-height: 2;
  color: var(--rule-ink-2);
  white-space: pre-wrap;
}

/* ============================================================
   响应式
   ============================================================ */
@media (max-width: 1100px) {
  .doc-wrap {
    display: block;
  }
  .doc-toc-side { display: none; }
  .doc-toc-inline { display: block; }
  .app-content { max-width: 920px; }
}

@media (max-width: 900px) {
  .app-content { padding: 20px 16px 48px; }
  .app-topbar { padding: 0 16px; }
  .app-topbar-meta { display: none; }
  .doc-title { font-size: 22px; }
  .doc-toc-inline { margin: 20px 0; padding: 14px; }
}

@media (max-width: 640px) {
  .doc-article { padding: 16px; }
  .doc-article.is-chapter { padding: 10px 16px; }
  .article-text { font-size: 14px; line-height: 1.9; }
  .doc-toc-inline { margin: 16px 0; padding: 12px; }
  .doc-toc-inline .doc-toc-item { padding: 7px 12px; font-size: 12px; }
}
</style>
