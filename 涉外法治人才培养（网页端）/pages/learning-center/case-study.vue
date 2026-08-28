<template>
  <view class="cs-shell">
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

      <view class="app-main">
        <header class="app-topbar">
          <view class="app-topbar-left">
            <view class="app-back-btn" @tap="goBack">
              <view class="back-arrow-icon"></view>
              <text>返回</text>
            </view>
            <text class="app-topbar-title">文书案例研究</text>
          </view>
          <text v-if="cases.length" class="app-topbar-meta">共 {{ cases.length }} 篇案例 / 文书</text>
        </header>

        <main class="app-content">
          <!-- 主题横幅 -->
          <view class="cs-banner">
            <view class="cs-banner-main">
              <view class="cs-banner-icon">
                <view class="cs-gavel-glyph"></view>
              </view>
              <view class="cs-banner-text">
                <text class="cs-banner-title">文书案例研究</text>
                <text class="cs-banner-desc">精选涉外法律文书与典型案例，研读裁判文书、仲裁裁决与实务文件，拆解法律适用与裁判思路</text>
              </view>
            </view>
            <view class="cs-banner-stats">
              <view class="cs-banner-stat">
                <text class="cs-banner-stat-num">{{ cases.length }}</text>
                <text class="cs-banner-stat-label">案例总数</text>
              </view>
              <view class="cs-banner-stat">
                <text class="cs-banner-stat-num">{{ categories.length }}</text>
                <text class="cs-banner-stat-label">案例分类</text>
              </view>
              <view class="cs-banner-stat">
                <text class="cs-banner-stat-num">{{ totalWords }}</text>
                <text class="cs-banner-stat-label">累计字数</text>
              </view>
            </view>
          </view>

          <!-- 工具栏 -->
          <view v-if="cases.length" class="cs-toolbar">
            <view class="cs-pills">
              <view class="cs-pill" :class="{ 'is-active': categoryFilter === 'all' }" @tap="categoryFilter = 'all'">全部（{{ cases.length }}）</view>
              <view
                v-for="c in categories"
                :key="c"
                class="cs-pill"
                :class="{ 'is-active': categoryFilter === c }"
                @tap="categoryFilter = c"
              >{{ c }}</view>
            </view>
            <view class="cs-search">
              <view class="cs-search-icon"></view>
              <input class="cs-search-input" v-model="searchText" placeholder="搜索文书 / 案例标题" />
            </view>
          </view>

          <!-- 加载 / 空状态 -->
          <view v-if="loading" class="cs-empty">
            <view class="cs-spinner"></view>
            <text class="cs-empty-title">正在加载案例资源...</text>
          </view>
          <view v-else-if="!cases.length" class="cs-empty">
            <view class="cs-empty-icon"></view>
            <text class="cs-empty-title">暂无文书案例资源</text>
            <text class="cs-empty-sub">请在管理端录入 case 类型资源并上线</text>
          </view>
          <view v-else-if="!filteredCases.length" class="cs-empty">
            <view class="cs-empty-icon"></view>
            <text class="cs-empty-title">未找到匹配的案例</text>
            <text class="cs-empty-sub">可尝试清空搜索关键词或切换分类</text>
          </view>

          <!-- 案例卡片列表 -->
          <view v-else class="cs-list">
            <view
              class="cs-card"
              v-for="item in filteredCases"
              :key="item.id"
              :class="{ 'is-open': expandedId === item.id }"
              @tap="toggleDetail(item)"
            >
              <view class="cs-card-head">
                <view v-if="item.cover" class="cs-card-cover" :style="{ backgroundImage: 'url(' + item.cover + ')' }">
                  <view class="cs-card-cover-mask"></view>
                  <view class="cs-gavel-badge"><view class="cs-gavel-mini"></view></view>
                </view>
                <view v-else class="cs-card-cover cs-card-cover-plain">
                  <view class="cs-gavel-badge"><view class="cs-gavel-mini"></view></view>
                </view>
                <view class="cs-card-main">
                  <view class="cs-card-tags">
                    <text class="cs-tag">{{ item.category || '未分类' }}</text>
                    <text v-if="item.meta" class="cs-tag cs-tag-soft">{{ item.meta }}</text>
                  </view>
                  <text class="cs-card-title">{{ item.title }}</text>
                  <view class="cs-card-meta">
                    <text v-if="item.wordCount" class="cs-meta-item">约 {{ item.wordCount }} 字</text>
                    <text v-if="item.description" class="cs-meta-item cs-meta-desc">{{ item.description }}</text>
                  </view>
                  <view class="cs-card-footer">
                    <view class="cs-read-btn">
                      <view class="cs-read-icon"></view>
                      <text>{{ expandedId === item.id ? '收起研读' : '研读案例' }}</text>
                    </view>
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
                    <view class="cs-original-btn" @tap.stop="openOriginal(item.fileUrl)">
                      <view class="cs-link-icon"></view>
                      <text>打开原文（PDF / 链接）</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </main>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { requireLogin, getDisplayName, getLevelText } from '@/utils/auth.js'

const cases = ref([])
const loading = ref(false)
const bodyLoading = ref(false)
const searchText = ref('')
const categoryFilter = ref('all')
const expandedId = ref('')
const bodyContent = ref('')
const caseBodies = {}

const userName = ref(getDisplayName())
const userRole = ref(getLevelText())
const userInitial = computed(() => (userName.value || '用').slice(0, 1))

const categories = computed(() => {
  return [...new Set(cases.value.map(c => c.category).filter(Boolean))]
})

const filteredCases = computed(() => {
  const q = searchText.value.trim().toLowerCase()
  return cases.value.filter(c => {
    const matchCategory = categoryFilter.value === 'all' || c.category === categoryFilter.value
    const matchQuery = !q || (c.title || '').toLowerCase().includes(q) || (c.category || '').toLowerCase().includes(q)
    return matchCategory && matchQuery
  })
})

const totalWords = computed(() => {
  const total = cases.value.reduce((sum, c) => sum + (Number(c.wordCount) || 0), 0)
  if (total >= 10000) return (total / 10000).toFixed(1) + 'w'
  if (total >= 1000) return (total / 1000).toFixed(1) + 'k'
  return String(total)
})

const CASE_CACHE_KEY = 'cs_cases_cache'
const CASE_CACHE_TTL = 5 * 60 * 1000

async function loadCases() {
  if (loading.value) return
  loading.value = true
  try {
    let cached = null
    try { cached = uni.getStorageSync(CASE_CACHE_KEY) } catch (e) {}
    if (cached && cached.expireAt > Date.now() && Array.isArray(cached.list)) {
      cases.value = cached.list
      return
    }
    const resourcesObj = uniCloud.importObject('resources', { customUI: true })
    const r = (await resourcesObj.listPublic({ type: 'case' })) || {}
    if (r.errCode === 0) {
      cases.value = (r.list || []).map(doc => ({
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
        uni.setStorageSync(CASE_CACHE_KEY, { expireAt: Date.now() + CASE_CACHE_TTL, list: cases.value })
      } catch (e) {}
    }
  } catch (e) {
    uni.showToast({ title: (e && e.errMsg) || '案例资源加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

async function toggleDetail(item) {
  if (expandedId.value === item.id) {
    expandedId.value = ''
    bodyContent.value = ''
    return
  }
  expandedId.value = item.id
  bodyContent.value = caseBodies[item.id] || ''
  if (caseBodies[item.id] === undefined) {
    bodyLoading.value = true
    try {
      const resourcesObj = uniCloud.importObject('resources', { customUI: true })
      const r = (await resourcesObj.get({ id: item.id })) || {}
      if (r.errCode === 0 && r.doc) {
        const content = String(r.doc.content || '')
        caseBodies[item.id] = content
        bodyContent.value = content
      } else {
        caseBodies[item.id] = ''
        bodyContent.value = ''
      }
    } catch (e) {
      caseBodies[item.id] = ''
      bodyContent.value = ''
    } finally {
      bodyLoading.value = false
    }
  }
}

function openOriginal(url) {
  if (!url) {
    uni.showToast({ title: '暂无原文链接', icon: 'none' })
    return
  }
  uni.setClipboardData({
    data: url,
    success: () => uni.showToast({ title: '原文地址已复制', icon: 'none' })
  })
}

function navigateTo(url) {
  uni.navigateTo({ url })
}

function goBack() {
  uni.navigateBack({
    fail: () => {
      uni.navigateTo({ url: '/pages/learning-center/learning-center' })
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
        } catch (e) {
          console.error('清除存储失败:', e)
        }
        uni.reLaunch({ url: '/pages/login/login' })
      }
    }
  })
}

onLoad(() => {
  if (!requireLogin()) return
  loadCases()
})
</script>

<style scoped>
.cs-shell {
  /* === 文书案例主题：暖色系（区别于文本阅读的蓝色） === */
  --cs-primary: #DC2626;
  --cs-primary-hover: #B91C1C;
  --cs-primary-tint-1: #FEE2E2;
  --cs-primary-tint-2: #FECACA;
  --cs-primary-tint-3: #FEF2F2;
  --cs-accent: #F59E0B;
  --cs-accent-deep: #D97706;
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
  background: #FAF8F5;
  color: #0F172A;
  font-family: "Inter", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ===== 左侧导航栏（与全站一致） ===== */
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
}

/* ===== 主题横幅 ===== */
.cs-banner {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  background: linear-gradient(120deg, #7F1D1D 0%, #DC2626 55%, #F97316 100%);
  color: #fff;
  padding: 32px 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
  box-shadow: 0 14px 34px rgba(220, 38, 38, 0.22);
}
.cs-banner::after {
  content: "";
  position: absolute;
  right: -80px;
  top: -80px;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.16), transparent 70%);
  pointer-events: none;
}
.cs-banner-main {
  display: flex;
  align-items: center;
  gap: 20px;
  min-width: 0;
}
.cs-banner-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.cs-gavel-glyph {
  width: 30px;
  height: 30px;
  background: #fff;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><path d='m14.5 15.5 3 3L19 17l-3-3'/><path d='m8 12 4.5 4.5'/><path d='M2 22 7.5 16.5'/><path d='M18.5 5.5a2 2 0 0 0-2.8 0L9.2 11.9a2 2 0 0 0 0 2.8l2.7 2.7a2 2 0 0 0 2.8 0l6.4-6.4a2 2 0 0 0 0-2.8l-2.7-2.7z'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><path d='m14.5 15.5 3 3L19 17l-3-3'/><path d='m8 12 4.5 4.5'/><path d='M2 22 7.5 16.5'/><path d='M18.5 5.5a2 2 0 0 0-2.8 0L9.2 11.9a2 2 0 0 0 0 2.8l2.7 2.7a2 2 0 0 0 2.8 0l6.4-6.4a2 2 0 0 0 0-2.8l-2.7-2.7z'/></svg>") center/contain no-repeat;
}
.cs-banner-text {
  min-width: 0;
}
.cs-banner-title {
  display: block;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.cs-banner-desc {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.88);
  max-width: 560px;
}
.cs-banner-stats {
  display: flex;
  gap: 28px;
  flex-shrink: 0;
  padding-left: 24px;
  border-left: 1px solid rgba(255, 255, 255, 0.25);
}
.cs-banner-stat {
  text-align: center;
}
.cs-banner-stat-num {
  display: block;
  font-size: 26px;
  font-weight: 800;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}
.cs-banner-stat-label {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

/* ===== 工具栏 ===== */
.cs-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 18px;
}
.cs-pills {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.cs-pill {
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  color: var(--rule-ink-2);
  background: #fff;
  border: 1px solid var(--rule-border);
  cursor: pointer;
  transition: all 0.15s ease;
}
.cs-pill:hover {
  border-color: var(--cs-accent);
  color: var(--cs-accent-deep);
}
.cs-pill.is-active {
  background: linear-gradient(135deg, #DC2626, #F97316);
  border-color: transparent;
  color: #fff;
}
.cs-search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid var(--rule-border);
  border-radius: 999px;
  padding: 0 16px;
  height: 38px;
  min-width: 240px;
  flex-shrink: 0;
}
.cs-search:focus-within {
  border-color: var(--cs-accent);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
}
.cs-search-icon {
  width: 15px;
  height: 15px;
  background: var(--rule-muted-foreground);
  flex-shrink: 0;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><circle cx='11' cy='11' r='8'/><path d='m21 21-4.35-4.35'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><circle cx='11' cy='11' r='8'/><path d='m21 21-4.35-4.35'/></svg>") center/contain no-repeat;
}
.cs-search-input {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  color: var(--rule-foreground);
  outline: none;
  border: none;
  background: transparent;
}

/* ===== 空 / 加载状态 ===== */
.cs-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}
.cs-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--cs-primary-tint-2);
  border-top-color: var(--cs-primary);
  border-radius: 50%;
  animation: cs-spin 0.8s linear infinite;
  margin-bottom: 14px;
}
.cs-spinner-sm {
  width: 18px;
  height: 18px;
  border-width: 2px;
  margin-bottom: 0;
}
@keyframes cs-spin {
  to { transform: rotate(360deg); }
}
.cs-empty-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: var(--cs-primary-tint-3);
  margin-bottom: 16px;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><path d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'/><polyline points='14 2 14 8 20 8'/><line x1='16' x2='8' y1='13' y2='13'/><line x1='16' x2='8' y1='17' y2='17'/><line x1='10' x2='8' y1='9' y2='9'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><path d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'/><polyline points='14 2 14 8 20 8'/><line x1='16' x2='8' y1='13' y2='13'/><line x1='16' x2='8' y1='17' y2='17'/><line x1='10' x2='8' y1='9' y2='9'/></svg>") center/contain no-repeat;
}
.cs-empty-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--rule-foreground);
}
.cs-empty-sub {
  margin-top: 6px;
  font-size: 13px;
  color: var(--rule-muted-foreground);
}

/* ===== 案例卡片 ===== */
.cs-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.cs-card {
  background: #fff;
  border: 1px solid var(--rule-border);
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}
.cs-card:hover {
  border-color: var(--cs-accent);
  box-shadow: 0 10px 26px rgba(220, 38, 38, 0.10);
  transform: translateY(-2px);
}
.cs-card.is-open {
  border-color: var(--cs-accent);
  box-shadow: 0 12px 30px rgba(220, 38, 38, 0.14);
}
.cs-card-head {
  display: flex;
  gap: 18px;
  padding: 20px;
}
.cs-card-cover {
  width: 132px;
  height: 172px;
  border-radius: 10px;
  background-size: cover;
  background-position: center;
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
}
.cs-card-cover-plain {
  background: linear-gradient(150deg, #7F1D1D 0%, #DC2626 55%, #F97316 100%);
}
.cs-card-cover-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.38), transparent 55%);
}
.cs-gavel-badge {
  position: absolute;
  left: 10px;
  top: 10px;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
}
.cs-gavel-mini {
  width: 16px;
  height: 16px;
  background: var(--cs-primary);
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m14.5 15.5 3 3L19 17l-3-3'/><path d='m8 12 4.5 4.5'/><path d='M2 22 7.5 16.5'/><path d='M18.5 5.5a2 2 0 0 0-2.8 0L9.2 11.9a2 2 0 0 0 0 2.8l2.7 2.7a2 2 0 0 0 2.8 0l6.4-6.4a2 2 0 0 0 0-2.8l-2.7-2.7z'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m14.5 15.5 3 3L19 17l-3-3'/><path d='m8 12 4.5 4.5'/><path d='M2 22 7.5 16.5'/><path d='M18.5 5.5a2 2 0 0 0-2.8 0L9.2 11.9a2 2 0 0 0 0 2.8l2.7 2.7a2 2 0 0 0 2.8 0l6.4-6.4a2 2 0 0 0 0-2.8l-2.7-2.7z'/></svg>") center/contain no-repeat;
}
.cs-card-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.cs-card-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.cs-tag {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--cs-primary-tint-3);
  color: var(--cs-primary);
}
.cs-tag-soft {
  background: #FFFBEB;
  color: var(--cs-accent-deep);
}
.cs-card-title {
  margin-top: 10px;
  font-size: 17px;
  font-weight: 700;
  color: var(--rule-foreground);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.cs-card-meta {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.cs-meta-item {
  font-size: 13px;
  color: var(--rule-muted-foreground);
  font-variant-numeric: tabular-nums;
}
.cs-meta-desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.6;
}
.cs-card-footer {
  margin-top: auto;
  padding-top: 14px;
}
.cs-read-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #DC2626, #F97316);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.24);
}
.cs-read-icon {
  width: 13px;
  height: 13px;
  background: #fff;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='m9 18 6-6-6-6'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='m9 18 6-6-6-6'/></svg>") center/contain no-repeat;
}

/* ===== 展开正文 ===== */
.cs-body {
  border-top: 1px dashed var(--rule-border);
  padding: 22px 24px 24px;
  background: #FDF9F3;
}
.cs-body-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--rule-muted-foreground);
}
.cs-body-text {
  display: block;
  font-size: 14.5px;
  line-height: 2;
  color: #334155;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 560px;
  overflow-y: auto;
}
.cs-body-empty {
  font-size: 13px;
  color: var(--rule-muted-foreground);
}
.cs-body-foot {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid var(--rule-border);
  display: flex;
  justify-content: flex-end;
}
.cs-original-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--cs-primary);
  background: #fff;
  border: 1px solid var(--cs-primary-tint-2);
  cursor: pointer;
  transition: all 0.15s ease;
}
.cs-original-btn:hover {
  background: var(--cs-primary-tint-3);
  border-color: var(--cs-primary);
}
.cs-link-icon {
  width: 14px;
  height: 14px;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71'/><path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71'/><path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'/></svg>") center/contain no-repeat;
}

/* ===== 响应式 ===== */
@media (max-width: 1100px) {
  .cs-banner {
    flex-direction: column;
    align-items: flex-start;
  }
  .cs-banner-stats {
    padding-left: 0;
    padding-top: 16px;
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.25);
    width: 100%;
    justify-content: space-between;
  }
  .cs-toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  .cs-search {
    min-width: 0;
  }
}
@media (max-width: 900px) {
  .app-sidebar {
    display: none;
  }
  .app-main {
    margin-left: 0;
  }
}
@media (max-width: 640px) {
  .app-content {
    padding: 20px 16px;
  }
  .cs-card-head {
    flex-direction: column;
  }
  .cs-card-cover {
    width: 100%;
    height: 120px;
  }
}
</style>
