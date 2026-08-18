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
            <text class="app-topbar-title">文本阅读</text>
          </view>
        </header>

      <main class="app-content">
        <!-- 工具栏 -->
        <view v-if="readings.length" class="rl-toolbar">
          <view class="rl-pills">
            <view class="rl-pill" :class="{ 'is-active': categoryFilter === 'all' }" @tap="categoryFilter = 'all'">全部（{{ readings.length }}）</view>
            <view
              v-for="c in categories"
              :key="c"
              class="rl-pill"
              :class="{ 'is-active': categoryFilter === c }"
              @tap="categoryFilter = c"
            >{{ c }}</view>
          </view>
          <view class="rl-search">
            <view class="rl-search-icon"></view>
            <input class="rl-search-input" v-model="searchText" placeholder="搜索篇目标题" />
          </view>
        </view>

        <!-- 列表 -->
        <view v-if="loading" class="rl-empty">
          <view class="rl-spinner"></view>
          <text class="rl-empty-title">正在加载阅读资源...</text>
        </view>
        <view v-else-if="!readings.length" class="rl-empty">
          <view class="rl-empty-icon"></view>
          <text class="rl-empty-title">暂无文本阅读资源</text>
          <text class="rl-empty-sub">请在管理端录入 reading 类型资源并上线</text>
        </view>
        <view v-else-if="!filteredReadings.length" class="rl-empty">
          <view class="rl-empty-icon"></view>
          <text class="rl-empty-title">没有符合条件的篇目</text>
          <text class="rl-empty-sub">可尝试清空搜索关键词或切换分类</text>
        </view>
        <view v-else class="rl-list">
          <view
            class="rl-card"
            v-for="item in filteredReadings"
            :key="item.id"
            @tap="openDetail(item)"
          >
            <view class="rl-card-main">
              <view class="rl-card-head">
                <text class="rl-card-title">{{ item.title }}</text>
                <view class="rl-go-icon"></view>
              </view>
              <view class="rl-card-meta">
                <text class="rl-tag">{{ item.category || '未分类' }}</text>
                <text class="rl-level" :class="levelInfo(item.meta).cls">{{ levelInfo(item.meta).text }}</text>
                <text class="rl-words">{{ wordCountText(item.wordCount) }}</text>
              </view>
              <text v-if="item.description" class="rl-card-summary">{{ item.description }}</text>

              <view class="rl-card-footer">
                <text class="rl-read-more">开始阅读</text>
              </view>
            </view>
          </view>
        </view>
      </main>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { requireLogin, getDisplayName, getLevelText } from '@/utils/auth.js'

const readings = ref([])
const loading = ref(false)
const searchText = ref('')
const categoryFilter = ref('all')

const userName = ref(getDisplayName())
const userRole = ref(getLevelText())
const userInitial = computed(() => (userName.value || '用').slice(0, 1))

const categories = computed(() => {
  return [...new Set(readings.value.map(r => r.category).filter(Boolean))]
})

const filteredReadings = computed(() => {
  const q = searchText.value.trim().toLowerCase()
  return readings.value.filter(r => {
    const matchCategory = categoryFilter.value === 'all' || r.category === categoryFilter.value
    const matchQuery = !q || (r.title || '').toLowerCase().includes(q) || (r.category || '').toLowerCase().includes(q)
    return matchCategory && matchQuery
  })
})

function wordCountText(count) {
  const n = Number(count) || 0
  return n ? `约 ${n} 字` : ''
}

function levelInfo(meta) {
  const m = meta || ''
  if (m.includes('初')) return { text: '初级', cls: 'rl-level-easy' }
  if (m.includes('中')) return { text: '中级', cls: 'rl-level-mid' }
  if (m.includes('高')) return { text: '高级', cls: 'rl-level-hard' }
  return { text: m || '未设置', cls: 'rl-level-none' }
}

const READING_CACHE_KEY = 'rd_readings_cache'
const READING_CACHE_TTL = 5 * 60 * 1000

async function loadReadings() {
  if (loading.value) return
  loading.value = true
  try {
    // 本地缓存：5 分钟内避免重复全量拉取
    let cached = null
    try { cached = uni.getStorageSync(READING_CACHE_KEY) } catch (e) {}
    if (cached && cached.expireAt > Date.now() && Array.isArray(cached.list)) {
      readings.value = cached.list
      return
    }
    const resourcesObj = uniCloud.importObject('resources', { customUI: true })
    const r = (await resourcesObj.listPublic({ type: 'reading' })) || {}
    if (r.errCode === 0) {
      readings.value = (r.list || []).map(doc => ({
        id: doc._id,
        title: doc.title || '',
        category: doc.cat || '',
        meta: doc.meta || '',
        description: doc.description || '',
        wordCount: doc.wordCount || 0,
        fileUrl: doc.fileUrl || ''
      }))
      try {
        uni.setStorageSync(READING_CACHE_KEY, { expireAt: Date.now() + READING_CACHE_TTL, list: readings.value })
      } catch (e) {}
    }
  } catch (e) {
    uni.showToast({ title: (e && e.errMsg) || '阅读资源加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function openDetail(item) {
  uni.navigateTo({ url: `/pages/learning-center/reading-detail?id=${item.id}` })
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

onLoad(() => {
  if (!requireLogin()) return
  loadReadings()
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

/* ===== Hero 头部 ===== */
.rl-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  background: linear-gradient(120deg, #0F2E6B 0%, #1D4ED8 55%, #2563EB 100%);
  border-radius: 20px;
  padding: 36px 40px;
  color: #fff;
  position: relative;
  overflow: hidden;
  box-shadow: 0 24px 48px -24px rgba(29,78,216,.55);
}

.rl-hero::before {
  content: "";
  position: absolute;
  right: -80px;
  top: -120px;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,.14), transparent 65%);
}

.rl-hero::after {
  content: "";
  position: absolute;
  left: -60px;
  bottom: -140px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,.08), transparent 65%);
}

.rl-hero-main {
  position: relative;
  z-index: 1;
  min-width: 0;
}

.rl-hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: rgba(255,255,255,.16);
  border: 1px solid rgba(255,255,255,.28);
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.rl-hero-tag-icon {
  width: 12px;
  height: 12px;
  background: #fff;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 2v4'/><path d='m16.2 7.8 2.9-2.9'/><path d='M18 12h4'/><path d='m16.2 16.2 2.9 2.9'/><path d='M12 18v4'/><path d='m4.9 19.1 2.9-2.9'/><path d='M2 12h4'/><path d='m4.9 4.9 2.9 2.9'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 2v4'/><path d='m16.2 7.8 2.9-2.9'/><path d='M18 12h4'/><path d='m16.2 16.2 2.9 2.9'/><path d='M12 18v4'/><path d='m4.9 19.1 2.9-2.9'/><path d='M2 12h4'/><path d='m4.9 4.9 2.9 2.9'/></svg>") center/contain no-repeat;
}

.rl-hero-title {
  display: block;
  margin-top: 16px;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: 1px;
}

.rl-hero-sub {
  display: block;
  margin-top: 8px;
  font-size: 14px;
  color: rgba(255,255,255,.82);
}

.rl-hero-stats {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-top: 24px;
}

.rl-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rl-stat-num {
  font-size: 24px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.rl-stat-label {
  font-size: 12px;
  color: rgba(255,255,255,.7);
}

.rl-stat-sep {
  width: 1px;
  height: 32px;
  background: rgba(255,255,255,.25);
}

/* 书本装饰 */
.rl-hero-art {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 200px;
}

.rl-book {
  position: relative;
  width: 132px;
  height: 168px;
  filter: drop-shadow(0 22px 28px rgba(2,20,70,.45));
  animation: rl-float 4.5s ease-in-out infinite;
}

@keyframes rl-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.rl-book-spine {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 14px;
  background: linear-gradient(180deg, #172C6B, #1E3A8A);
  border-radius: 6px 0 0 6px;
  box-shadow: inset -2px 0 3px rgba(0,0,0,.25);
}

.rl-book-cover {
  position: absolute;
  left: 14px;
  top: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(160deg, #3B82F6, #1D4ED8);
  border-radius: 2px 10px 10px 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #fff;
  padding: 0 14px;
}

.rl-book-icon {
  width: 34px;
  height: 34px;
  background: rgba(255,255,255,.92);
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/%3E%3Cpath d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/%3E%3C/svg%3E") center/contain no-repeat;
          mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/%3E%3Cpath d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/%3E%3C/svg%3E") center/contain no-repeat;
}

.rl-book-title {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 2px;
}

.rl-book-sub {
  font-size: 9px;
  letter-spacing: 1.6px;
  color: rgba(255,255,255,.75);
  text-transform: uppercase;
}

.rl-art-dot {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,.18);
}

.rl-art-dot-1 { width: 46px; height: 46px; top: 12px; right: 0; }
.rl-art-dot-2 { width: 26px; height: 26px; bottom: 18px; left: 6px; background: rgba(255,255,255,.12); }

/* ===== 工具栏 ===== */
.rl-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 24px;
  padding: 14px 18px;
  background: #fff;
  border: 1px solid var(--rule-border);
  border-radius: 14px;
}

.rl-pills {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  flex-wrap: nowrap;
  min-width: 0;
}

.rl-pills::-webkit-scrollbar { display: none; }

.rl-pill {
  flex-shrink: 0;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  color: var(--rule-ink-2);
  background: var(--rule-muted);
  cursor: pointer;
  transition: all .2s ease;
}

.rl-pill:hover { color: var(--rule-primary); }

.rl-pill.is-active {
  background: var(--rule-primary);
  color: #fff;
  box-shadow: 0 6px 14px -6px rgba(37,99,235,.55);
}

.rl-search {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  width: 260px;
  padding: 8px 14px;
  border: 1px solid var(--rule-border);
  border-radius: 10px;
  background: #fff;
  transition: border-color .2s ease;
}

.rl-search:focus-within { border-color: var(--rule-primary); }

.rl-search-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  background: var(--rule-muted-foreground);
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><circle cx='11' cy='11' r='8'/><path d='m21 21-4.3-4.3'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><circle cx='11' cy='11' r='8'/><path d='m21 21-4.3-4.3'/></svg>") center/contain no-repeat;
}

.rl-search-input {
  flex: 1;
  font-size: 13px;
  border: none;
  outline: none;
  min-width: 0;
}

/* ===== 阅读卡片 ===== */
.rl-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
}

.rl-card {
  display: flex;
  gap: 18px;
  background: #fff;
  border: 1px solid var(--rule-border);
  border-radius: 16px;
  padding: 22px;
  cursor: pointer;
  box-shadow: 0 10px 28px -18px rgba(15,23,42,.16);
  transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease;
}

.rl-card:hover {
  border-color: var(--rule-primary-tint-2);
  box-shadow: 0 18px 36px -20px rgba(37,99,235,.35);
  transform: translateY(-2px);
}

.rl-card-main {
  flex: 1;
  min-width: 0;
}

.rl-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.rl-card-title {
  font-size: 17px;
  font-weight: 700;
  line-height: 1.5;
  color: var(--rule-foreground);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rl-go-icon {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
  margin-top: 4px;
  background: var(--rule-muted-foreground);
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'><path d='M9 18l6-6-6-6'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'><path d='M9 18l6-6-6-6'/></svg>") center/contain no-repeat;
  transition: transform .25s ease, background .25s ease;
}

.rl-card:hover .rl-go-icon {
  transform: translateX(3px);
  background: var(--rule-primary);
}

.rl-card-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.rl-tag {
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: var(--rule-primary);
  background: var(--rule-primary-tint-3);
  border: 1px solid var(--rule-primary-tint-2);
}

.rl-level {
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.rl-level-easy { color: #047857; background: #ECFDF5; border: 1px solid #A7F3D0; }
.rl-level-mid { color: #B45309; background: #FFFBEB; border: 1px solid #FDE68A; }
.rl-level-hard { color: #B91C1C; background: #FEF2F2; border: 1px solid #FECACA; }
.rl-level-none { color: var(--rule-muted-foreground); background: var(--rule-muted); border: 1px solid var(--rule-border); }

.rl-words {
  font-size: 12px;
  color: var(--rule-muted-foreground);
  font-variant-numeric: tabular-nums;
}

.rl-card-summary {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 10px;
  font-size: 13.5px;
  line-height: 1.75;
  color: var(--rule-ink-2);
}

.rl-card-footer {
  margin-top: 14px;
}

.rl-read-more {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--rule-muted-foreground);
  transition: color .2s ease;
}

.rl-card:hover .rl-read-more { color: var(--rule-primary); }

/* 空状态与加载 */
.rl-empty {
  margin-top: 40px;
  padding: 70px 20px;
  text-align: center;
  background: #fff;
  border: 1px dashed var(--rule-border);
  border-radius: 16px;
}

.rl-empty-icon {
  width: 44px;
  height: 44px;
  margin: 0 auto 14px;
  background: var(--rule-muted-foreground);
  opacity: .7;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>") center/contain no-repeat;
}

.rl-spinner {
  width: 30px;
  height: 30px;
  margin: 0 auto 14px;
  border: 3px solid var(--rule-primary-tint-2);
  border-top-color: var(--rule-primary);
  border-radius: 50%;
  animation: rl-spin .8s linear infinite;
}

@keyframes rl-spin { to { transform: rotate(360deg); } }

.rl-empty-title {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: var(--rule-foreground);
}

.rl-empty-sub {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  color: var(--rule-muted-foreground);
}

@media (max-width: 768px) {
  .app-sidebar { transform: translateX(-100%); }
  .app-main { margin-left: 0; }
  .app-topbar { padding: 0 20px; }
  .app-content { padding: 20px; }
  .rl-toolbar { flex-direction: column; align-items: stretch; gap: 12px; }
  .rl-search { width: 100%; }
  .rl-card { padding: 16px; gap: 14px; }
}
</style>
