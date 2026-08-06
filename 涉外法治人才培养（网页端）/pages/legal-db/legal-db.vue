<template>
  <view class="legal-shell">
    <!-- ===== Brand CSS Variables ===== -->
    <view class="css-vars" aria-hidden="true"></view>

    <!-- ===== App Shell (Sidebar + Main) ===== -->
    <view class="app-shell">
      <!-- ===== Left Sidebar ===== -->
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
          <text class="app-topbar-title">法律库</text>
          <text class="app-topbar-meta">{{ todayDateText }}</text>
        </header>

        <main class="app-content">
          <view class="ll-wrap">
            <!-- Search Bar -->
            <view class="search-bar" aria-label="法规搜索">
              <view class="search-input-wrap">
                <view class="search-icon-svg"></view>
                <input
                  class="search-input"
                  type="text"
                  v-model="searchKeyword"
                  placeholder="搜索法律法规、案例、条约..."
                  aria-label="搜索法律法规、案例、条约"
                  @confirm="handleSearch"
                />
              </view>
              <view class="btn btn-secondary" @tap="toggleFilterPanel">
                <view class="btn-icon-filter"></view>
                <text>筛选</text>
              </view>
              <view class="btn btn-primary" @tap="handleSearch">
                <text>搜索</text>
              </view>
            </view>

            <!-- Filter panel (expandable, matching the original filter logic) -->
            <view v-if="showFilterPanel" class="filter-panel">
              <view class="filter-row">
                <text class="filter-label">法律领域</text>
                <view class="filter-chips">
                  <view
                    class="filter-chip"
                    :class="{ active: selectedFields.includes(item) }"
                    v-for="item in legalFields"
                    :key="item"
                    @tap="toggleField(item)"
                  >{{ item }}</view>
                </view>
              </view>
              <view class="filter-row">
                <text class="filter-label">法域</text>
                <view class="filter-chips">
                  <view
                    class="filter-chip"
                    :class="{ active: selectedRegions.includes(item) }"
                    v-for="item in regions"
                    :key="item"
                    @tap="toggleRegion(item)"
                  >{{ item }}</view>
                </view>
              </view>
              <view class="filter-row">
                <text class="filter-label">文档类型</text>
                <view class="filter-chips">
                  <view
                    class="filter-chip"
                    :class="{ active: selectedTypes.includes(item) }"
                    v-for="item in docTypes"
                    :key="item"
                    @tap="toggleType(item)"
                  >{{ item }}</view>
                </view>
              </view>
              <view class="filter-actions">
                <text class="btn-filter-reset" @tap="resetFilters">重置筛选</text>
              </view>
            </view>

            <!-- Category Filter Tags -->
            <view class="tag-row" role="group" aria-label="法规分类筛选">
              <view
                class="tag-pill"
                :class="{ active: activeCategory === item.key }"
                v-for="item in categories"
                :key="item.key"
                @tap="activeCategory = item.key"
              >{{ item.name }}</view>
            </view>

            <!-- Document List Section -->
            <view class="doc-section-header">
              <text class="doc-section-title">法规文献</text>
              <text class="doc-section-meta">共 {{ filteredResults.length }} 条结果</text>
            </view>

            <view class="doc-grid">
              <view
                class="doc-card"
                v-for="(item, idx) in paginatedResults"
                :key="idx"
                @tap="viewDetail(item)"
              >
                <view class="doc-card-top">
                  <text class="doc-cat">{{ item.category || categoryName(item) }}</text>
                  <text class="doc-date">{{ item.date }}</text>
                </view>
                <view class="doc-title-row">
                  <view class="doc-icon-file"></view>
                  <text class="doc-title">{{ item.title }}</text>
                </view>
                <text class="doc-summary">{{ item.desc }}</text>
                <view class="doc-card-bottom">
                  <text class="doc-source">{{ item.source || item.region }}</text>
                  <view class="doc-link">
                    <text>查看详情</text>
                    <view class="doc-link-arrow"></view>
                  </view>
                </view>
              </view>
            </view>

            <!-- Pagination -->
            <nav v-if="totalPages > 1" class="pagination" aria-label="分页导航">
              <view
                class="page-btn page-nav"
                :class="{ disabled: currentPage <= 1 }"
                @tap="goPage(currentPage - 1)"
              >
                <view class="page-arrow-left"></view>
                <text>上一页</text>
              </view>
              <view
                class="page-btn"
                v-for="page in visiblePages"
                :key="page"
                :class="{ active: page === currentPage }"
                @tap="goPage(page)"
              >{{ page }}</view>
              <view
                class="page-btn page-nav"
                :class="{ disabled: currentPage >= totalPages }"
                @tap="goPage(currentPage + 1)"
              >
                <text>下一页</text>
                <view class="page-arrow-right"></view>
              </view>
            </nav>
          </view>
        </main>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { requireLogin, getDisplayName, getLevelText } from '@/utils/auth.js'

/* ============================================================
   Reactive State
   ============================================================ */
const searchKeyword = ref('')
const activeCategory = ref('all')
const selectedFields = ref([])
const selectedRegions = ref([])
const selectedTypes = ref([])
const currentPage = ref(1)
const showFilterPanel = ref(false)
const pageSize = 6

// User info (hardcoded demo)
const userInitial = computed(() => (userName.value || '用').slice(0, 1))
const userName = ref(getDisplayName())
const userRole = ref(getLevelText())

/* ============================================================
   Data
   ============================================================ */
const categories = [
  { key: 'all', name: '全部' },
  { key: 'treaty', name: '国际公法' },
  { key: 'private', name: '国际私法' },
  { key: 'civil', name: '涉外民商法' },
  { key: 'trade', name: '国际贸易法' },
  { key: 'invest', name: '国际投资法' },
  { key: 'maritime', name: '海商法' },
  { key: 'arbitration', name: '国际仲裁' }
]

const legalFields = ['国际贸易法', '国际私法', '国际仲裁', '反垄断法', '数据保护法', '知识产权法', '投资法', '税法']
const regions = ['中国', '欧盟', '美国', '英国', '新加坡', '国际']
const docTypes = ['法律', '行政法规', '部门规章', '司法解释', '国际条约', '案例']

const results = ref([
  {
    type: '法规', date: '2024-05-15',
    title: '《中华人民共和国反外国制裁法》全文及解读',
    desc: '本法旨在维护国家主权、安全和发展利益，反制外国干涉行为。本文详细解读了各条款的适用场景和实际影响。',
    tags: ['反制裁', '国家安全', '国际关系'],
    fields: ['国际贸易法'], region: '中国', docType: '法律',
    category: '国际贸易法', source: '全国人大常委会'
  },
  {
    type: '条约', date: '2024-04-20',
    title: '《联合国国际货物销售合同公约》(CISG) 最新适用指南',
    desc: 'CISG是国际商事交易中最广泛适用的国际公约之一。本指南总结了最新的适用经验和重要判例。',
    tags: ['CISG', '国际贸易', '合同法'],
    fields: ['国际贸易法'], region: '国际', docType: '国际条约',
    category: '国际贸易法', source: '联合国国际贸易法委员会'
  },
  {
    type: '案例', date: '2024-03-28',
    title: 'ICC仲裁案例精选：跨境合资企业争议解决实务',
    desc: '精选近期ICC仲裁庭处理的三起跨境合资企业争议案例，分析仲裁庭的裁判思路和策略建议。',
    tags: ['ICC仲裁', '合资企业', '争议解决'],
    fields: ['国际仲裁'], region: '国际', docType: '案例',
    category: '国际仲裁', source: 'ICC国际商会'
  },
  {
    type: '指南', date: '2024-03-10',
    title: 'GDPR跨境数据传输合规指南（2024版）',
    desc: '针对欧盟GDPR框架下的跨境数据传输机制进行系统性解读，涵盖标准合同条款(SCCs)和约束性企业规则(BCRs)的最新要求。',
    tags: ['GDPR', '数据保护', '跨境传输'],
    fields: ['数据保护法'], region: '欧盟', docType: '部门规章',
    category: '涉外民商法', source: '欧盟委员会'
  },
  {
    type: '法规', date: '2024-02-18',
    title: '欧盟《数字市场法》(DMA)核心条款分析与合规要点',
    desc: 'DMA针对"守门人"平台制定了严格的行为规范，本文梳理了核心义务条款及违规后果。',
    tags: ['DMA', '数字市场', '反垄断'],
    fields: ['反垄断法'], region: '欧盟', docType: '行政法规',
    category: '国际贸易法', source: '欧盟'
  },
  {
    type: '案例', date: '2024-01-25',
    title: 'SIAC新加坡国际仲裁中心2024年度十大典型案例',
    desc: '回顾SIAC在2024年裁决的十个具有代表性的仲裁案件，涵盖建设工程、能源、金融服务等多个领域。',
    tags: ['SIAC', '新加坡', '仲裁案例'],
    fields: ['国际仲裁'], region: '新加坡', docType: '案例',
    category: '国际仲裁', source: 'SIAC'
  },
  {
    type: '条约', date: '2024-06-01',
    title: '《承认及执行外国仲裁裁决公约》（纽约公约）',
    desc: '规定了缔约国承认和执行外国仲裁裁决的条件和程序，是国际仲裁执行的基石公约。',
    tags: ['纽约公约', '仲裁执行', '国际法'],
    fields: ['国际仲裁'], region: '国际', docType: '国际条约',
    category: '国际仲裁', source: '联合国国际商事仲裁会议'
  },
  {
    type: '法规', date: '2023-12-20',
    title: '最高人民法院关于适用涉外民事关系法律适用法若干问题的解释',
    desc: '对涉外民事关系法律适用法的具体适用问题进行了解释和明确，指导司法实践。',
    tags: ['司法解释', '涉外民事', '法律适用'],
    fields: ['国际私法'], region: '中国', docType: '司法解释',
    category: '国际私法', source: '最高人民法院'
  }
])

/* ============================================================
   Computed
   ============================================================ */
const todayDateText = computed(() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}年${m}月${d}日`
})

const filteredResults = computed(() => {
  let list = [...results.value]

  // Keyword search
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(item =>
      item.title.toLowerCase().includes(kw) ||
      item.desc.toLowerCase().includes(kw) ||
      item.tags.some(t => t.toLowerCase().includes(kw))
    )
  }

  // Category filter (tag-pill)
  if (activeCategory.value !== 'all') {
    const catMap = {
      treaty: '国际公法',
      private: '国际私法',
      civil: '涉外民商法',
      trade: '国际贸易法',
      invest: '国际投资法',
      maritime: '海商法',
      arbitration: '国际仲裁'
    }
    const targetCat = catMap[activeCategory.value]
    if (targetCat) {
      list = list.filter(item => (item.category || '') === targetCat)
    }
  }

  // Advanced filters
  if (selectedFields.value.length) {
    list = list.filter(item => item.fields.some(f => selectedFields.value.includes(f)))
  }
  if (selectedRegions.value.length) {
    list = list.filter(item => selectedRegions.value.includes(item.region))
  }
  if (selectedTypes.value.length) {
    list = list.filter(item => selectedTypes.value.includes(item.docType))
  }

  return list
})

const totalPages = computed(() => Math.ceil(filteredResults.value.length / pageSize) || 1)

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredResults.value.slice(start, start + pageSize)
})

const visiblePages = computed(() => {
  const pages = []
  const max = totalPages.value
  if (max <= 5) {
    for (let i = 1; i <= max; i++) pages.push(i)
  } else {
    for (let i = 1; i <= Math.min(5, max); i++) pages.push(i)
  }
  return pages
})

/* ============================================================
   Methods
   ============================================================ */
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
        uni.reLaunch({
          url: '/pages/login/login',
          fail: (err) => {
            console.error('跳转失败:', err)
            uni.showToast({ title: '退出失败，请重试', icon: 'none' })
          }
        })
      }
    }
  })
}

function handleSearch() {
  currentPage.value = 1
}

function toggleFilterPanel() {
  showFilterPanel.value = !showFilterPanel.value
}

function toggleField(field) {
  const idx = selectedFields.value.indexOf(field)
  if (idx > -1) selectedFields.value.splice(idx, 1)
  else selectedFields.value.push(field)
}

function toggleRegion(region) {
  const idx = selectedRegions.value.indexOf(region)
  if (idx > -1) selectedRegions.value.splice(idx, 1)
  else selectedRegions.value.push(region)
}

function toggleType(type) {
  const idx = selectedTypes.value.indexOf(type)
  if (idx > -1) selectedTypes.value.splice(idx, 1)
  else selectedTypes.value.push(type)
}

function resetFilters() {
  selectedFields.value = []
  selectedRegions.value = []
  selectedTypes.value = []
  searchKeyword.value = ''
  activeCategory.value = 'all'
  currentPage.value = 1
  showFilterPanel.value = false
}

function goPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

function viewDetail(item) {
  uni.showToast({ title: '详情页开发中', icon: 'none' })
}

function categoryName(item) {
  return item.type || '法规'
}

/* ============================================================
   Lifecycle
   ============================================================ */
onMounted(() => {
  // Initialization
})

onLoad(() => {
  // 登录鉴权：未登录跳转登录页
  if (!requireLogin()) return
})
</script>

<style scoped>
/* ============================================================
   Brand Design Tokens (from 法律库.html)
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
   Shell Layout
   ============================================================ */
.app-shell {
  display: flex;
  min-height: 100vh;
  background: var(--rule-background);
}

/* ===== Sidebar ===== */
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

.navi-icon-home {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M3 10.5 12 3l9 7.5'/><path d='M5 9.5V21h14V9.5'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M3 10.5 12 3l9 7.5'/><path d='M5 9.5V21h14V9.5'/></svg>") center/contain no-repeat;
}
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

/* ===== Sidebar User ===== */
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
.app-topbar-title {
  font-size: 18px; font-weight: 600;
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

/* ============================================================
   Law Library Page Styles (from 法律库.html)
   ============================================================ */
.ll-wrap {
  display: flex; flex-direction: column; gap: 20px;
  max-width: 1120px;
}

/* ---- Search Bar ---- */
.search-bar {
  display: flex; align-items: center; gap: 12px;
}
.search-input-wrap {
  position: relative; flex: 1; min-width: 0;
}
.search-icon-svg {
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  width: 18px; height: 18px; pointer-events: none;
  background: var(--rule-muted-foreground);
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='11' cy='11' r='8'/><path d='m21 21-4.3-4.3'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='11' cy='11' r='8'/><path d='m21 21-4.3-4.3'/></svg>") center/contain no-repeat;
}
.search-input {
  width: 100%; height: 48px; padding: 0 16px 0 44px;
  border-radius: 8px; border: 1px solid var(--rule-border);
  background: var(--rule-card); color: var(--rule-foreground);
  font-size: 14px; font-family: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.search-input::placeholder { color: var(--rule-muted-foreground); }
.search-input:focus {
  outline: none;
  border-color: var(--rule-primary);
  box-shadow: 0 0 0 3px var(--rule-primary-tint-1);
}

/* ---- Buttons ---- */
.btn {
  display: inline-flex; align-items: center; gap: 6px; height: 48px;
  font-weight: 500; white-space: nowrap; cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.15s;
}
.btn-secondary {
  padding: 0 16px; border-radius: 8px;
  border: 1px solid var(--rule-border);
  background: var(--rule-card); color: var(--rule-foreground);
  font-size: 14px;
}
.btn-secondary:hover { border-color: var(--rule-primary-tint-2); background: var(--rule-primary-tint-3); color: var(--rule-primary); }
.btn-secondary:active { opacity: 0.85; }

.btn-primary {
  padding: 0 22px; border-radius: 8px;
  border: 1px solid var(--rule-primary);
  background: var(--rule-primary); color: var(--rule-primary-foreground);
  font-size: 14px; font-weight: 600;
}
.btn-primary:hover { background: var(--rule-primary-hover); border-color: var(--rule-primary-hover); }
.btn-primary:active { transform: translateY(1px); }

.btn-icon-filter {
  width: 16px; height: 16px;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='21' x2='14' y1='4' y2='4'/><line x1='10' x2='3' y1='4' y2='4'/><line x1='21' x2='12' y1='12' y2='12'/><line x1='8' x2='3' y1='12' y2='12'/><line x1='21' x2='16' y1='20' y2='20'/><line x1='12' x2='3' y1='20' y2='20'/><line x1='14' x2='14' y1='2' y2='6'/><line x1='8' x2='8' y1='10' y2='14'/><line x1='16' x2='16' y1='18' y2='22'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='21' x2='14' y1='4' y2='4'/><line x1='10' x2='3' y1='4' y2='4'/><line x1='21' x2='12' y1='12' y2='12'/><line x1='8' x2='3' y1='12' y2='12'/><line x1='21' x2='16' y1='20' y2='20'/><line x1='12' x2='3' y1='20' y2='20'/><line x1='14' x2='14' y1='2' y2='6'/><line x1='8' x2='8' y1='10' y2='14'/><line x1='16' x2='16' y1='18' y2='22'/></svg>") center/contain no-repeat;
}

/* ---- Filter Panel (expandable) ---- */
.filter-panel {
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: var(--rule-radius-large);
  padding: 20px 24px;
  display: flex; flex-direction: column; gap: 16px;
}
.filter-row {
  display: flex; align-items: flex-start; gap: 12px;
}
.filter-label {
  font-size: 13px; font-weight: 600; color: var(--rule-muted-foreground);
  min-width: 64px; flex-shrink: 0; margin-top: 4px;
}
.filter-chips {
  display: flex; flex-wrap: wrap; gap: 6px; flex: 1;
}
.filter-chip {
  display: inline-flex; align-items: center;
  padding: 5px 12px; border-radius: var(--rule-radius-full);
  font-size: 13px; background: var(--rule-muted); color: var(--rule-ink-2);
  border: 1px solid transparent;
  cursor: pointer; white-space: nowrap;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.filter-chip:hover { border-color: var(--rule-primary); }
.filter-chip.active {
  background: var(--rule-primary-tint-1);
  color: var(--rule-primary);
  border-color: var(--rule-primary);
  font-weight: 500;
}
.filter-actions {
  display: flex; justify-content: flex-end; padding-top: 4px;
}
.btn-filter-reset {
  font-size: 13px; color: var(--rule-muted-foreground); cursor: pointer;
  transition: color 0.15s;
}
.btn-filter-reset:hover { color: var(--rule-primary); }
.btn-filter-reset:active { opacity: 0.8; }

/* ---- Category Filter Tags ---- */
.tag-row {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
}
.tag-pill {
  display: inline-flex; align-items: center;
  padding: 6px 14px; border-radius: 9999px;
  font-size: 13px; font-weight: 500;
  border: 1px solid transparent;
  background: var(--rule-muted); color: var(--rule-ink-2);
  cursor: pointer; white-space: nowrap;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.tag-pill:hover { border-color: var(--rule-primary); }
.tag-pill.active {
  background: var(--rule-primary);
  color: var(--rule-primary-foreground);
}
.tag-pill.active:hover { background: var(--rule-primary-hover); border-color: var(--rule-primary-hover); }

/* ---- Document Section Header ---- */
.doc-section-header {
  display: flex; align-items: baseline; justify-content: space-between; gap: 16px;
}
.doc-section-title {
  font-size: 18px; font-weight: 600;
  color: var(--rule-foreground);
}
.doc-section-meta {
  font-size: 13px;
  color: var(--rule-muted-foreground);
}

/* ---- Document Grid ---- */
.doc-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.doc-card {
  position: relative; display: flex; flex-direction: column; gap: 10px;
  padding: 20px; background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: 12px;
  color: inherit; cursor: pointer;
  transition: border-color 0.15s, transform 0.15s;
}
.doc-card:hover { border-color: var(--rule-primary-tint-2); transform: translateY(-1px); }
.doc-card:active { opacity: 0.9; }

.doc-card-top {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
}
.doc-cat {
  display: inline-flex; align-items: center;
  padding: 3px 10px; border-radius: 9999px;
  font-size: 13px; font-weight: 500;
  background: var(--rule-primary-tint-3);
  color: var(--rule-primary);
  white-space: nowrap;
}
.doc-date {
  font-size: 13px;
  color: var(--rule-muted-foreground);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.doc-title-row {
  display: flex; align-items: flex-start; gap: 8px;
}
.doc-icon-file {
  width: 16px; height: 16px; flex-shrink: 0; margin-top: 3px;
  background: var(--rule-ink-3);
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z'/><path d='M14 2v4a2 2 0 0 0 2 2h4'/><path d='M10 9H8'/><path d='M16 13H8'/><path d='M16 17H8'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z'/><path d='M14 2v4a2 2 0 0 0 2 2h4'/><path d='M10 9H8'/><path d='M16 13H8'/><path d='M16 17H8'/></svg>") center/contain no-repeat;
}
.doc-title {
  font-size: 16px; font-weight: 600; color: var(--rule-foreground);
  line-height: 1.4;
  display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden; word-break: keep-all; overflow-wrap: break-word;
}
.doc-summary {
  font-size: 14px; color: var(--rule-muted-foreground);
  line-height: 1.55;
  display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden;
}
.doc-card-bottom {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; margin-top: auto; padding-top: 4px;
}
.doc-source {
  font-size: 13px; color: var(--rule-ink-3);
}
.doc-link {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 13px; font-weight: 500; color: var(--rule-primary);
  white-space: nowrap;
  transition: color 0.15s, gap 0.15s;
}
.doc-card:hover .doc-link { color: var(--rule-primary-hover); gap: 6px; }
.doc-link-arrow {
  width: 14px; height: 14px;
  background: var(--rule-primary);
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m9 18 6-6-6-6'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m9 18 6-6-6-6'/></svg>") center/contain no-repeat;
}

/* ---- Pagination ---- */
.pagination {
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.page-btn {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 36px; height: 36px; padding: 0 10px;
  border-radius: 8px; border: 1px solid var(--rule-border);
  background: var(--rule-card); color: var(--rule-ink-2);
  font-size: 14px; font-weight: 500; cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.page-btn:hover { border-color: var(--rule-primary); color: var(--rule-primary); }
.page-btn.active {
  background: var(--rule-primary); border-color: var(--rule-primary);
  color: var(--rule-primary-foreground);
}
.page-btn.active:hover { background: var(--rule-primary-hover); border-color: var(--rule-primary-hover); color: var(--rule-primary-foreground); }
.page-btn.page-nav { gap: 4px; padding: 0 14px; }
.page-btn.disabled { opacity: 0.45; cursor: not-allowed; }
.page-btn.disabled:hover { border-color: var(--rule-border); color: var(--rule-ink-2); background: var(--rule-card); }

.page-arrow-left,
.page-arrow-right {
  width: 16px; height: 16px;
  background: currentColor;
}
.page-arrow-left {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m15 18-6-6 6-6'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m15 18-6-6 6-6'/></svg>") center/contain no-repeat;
}
.page-arrow-right {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m9 18 6-6-6-6'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m9 18 6-6-6-6'/></svg>") center/contain no-repeat;
}

/* ---- Responsive ---- */
@media (max-width: 768px) {
  .app-sidebar { transform: translateX(-100%); transition: transform 0.3s; }
  .app-main { margin-left: 0; }
  .app-content { padding: 16px; }
  .doc-grid { grid-template-columns: 1fr; }
  .search-bar { flex-wrap: wrap; }
  .btn { height: 44px; font-size: 13px; }
  .btn-primary { padding: 0 16px; }
  .btn-secondary { padding: 0 12px; }
  .pagination { gap: 4px; }
  .page-btn { min-width: 32px; height: 32px; font-size: 13px; }
}

@media (max-width: 480px) {
  .tag-row { gap: 4px; }
  .tag-pill { font-size: 12px; padding: 4px 10px; }
  .doc-card { padding: 14px; }
}
</style>
