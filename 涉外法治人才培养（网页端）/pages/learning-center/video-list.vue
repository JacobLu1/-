<template>
  <view class="vl-shell">
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
            <text class="app-topbar-title">全部视频</text>
          </view>
          <text class="app-topbar-meta">{{ todayDateText }}</text>
        </header>

        <main class="app-content">
          <section class="vl-hero">
            <view class="vl-hero-copy">
              <text class="vl-hero-title">全部视频课程</text>
              <text class="vl-hero-subtitle">共 {{ videos.length }} 个视频资源，按发布时间倒序展示</text>
            </view>
            <view class="vl-search">
              <view class="vl-search-icon"></view>
              <input class="vl-search-input" v-model="searchText" placeholder="搜索视频标题" />
            </view>
          </section>

          <view class="vl-toolbar">
            <view class="qb-pills">
              <view class="qb-pill" :class="{ 'is-active': categoryFilter === 'all' }" @tap="categoryFilter = 'all'">全部</view>
              <view
                v-for="c in categories"
                :key="c"
                class="qb-pill"
                :class="{ 'is-active': categoryFilter === c }"
                @tap="categoryFilter = c"
              >{{ c }}</view>
            </view>
          </view>

          <view class="video-grid" v-if="filteredVideos.length">
            <view class="video-card" v-for="(video, vIdx) in filteredVideos" :key="video.id" @tap="playVideo(video)">
              <view class="video-thumb">
                <view class="video-thumb-gradient" :style="videoThumbStyle(video)"></view>
                <view class="video-play-overlay">
                  <view class="video-play-btn">
                    <view class="play-icon"></view>
                  </view>
                </view>
                <text class="video-duration">{{ video.duration }}</text>
              </view>
              <view class="video-info">
                <text class="video-title">{{ video.title }}</text>
                <view class="video-meta">
                  <text class="video-meta-item">
                    <view class="user-icon-sm"></view>
                    <text>{{ video.category }}</text>
                  </text>
                  <text class="video-meta-item">
                    <view class="eye-icon-sm"></view>
                    <text>{{ video.date || '已上线' }}</text>
                  </text>
                </view>
              </view>
            </view>
          </view>
          <view v-else class="vl-empty">
            <text class="vl-empty-title">{{ loading ? '视频加载中...' : '暂无符合条件的视频' }}</text>
            <text v-if="!loading" class="vl-empty-sub">可尝试清空搜索关键词或切换分类</text>
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

const userName = ref(getDisplayName())
const userRole = ref(getLevelText())
const userInitial = computed(() => (userName.value || '用').slice(0, 1))
const todayDateText = computed(() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}年${m}月${d}日`
})

const videos = ref([])
const loading = ref(false)
const searchText = ref('')
const categoryFilter = ref('all')

const videoGradients = [
  'linear-gradient(135deg, #1E40AF, #3B82F6)',
  'linear-gradient(135deg, #0F766E, #14B8A6)',
  'linear-gradient(135deg, #7C3AED, #A78BFA)',
  'linear-gradient(135deg, #B45309, #F59E0B)',
  'linear-gradient(135deg, #DB2777, #F472B6)',
  'linear-gradient(135deg, #2563EB, #0EA5E9)'
]

const categories = computed(() => {
  return [...new Set(videos.value.map(v => v.category).filter(Boolean))]
})

const filteredVideos = computed(() => {
  const q = searchText.value.trim().toLowerCase()
  return videos.value.filter(v => {
    const matchCategory = categoryFilter.value === 'all' || v.category === categoryFilter.value
    const matchQuery = !q || v.title.toLowerCase().includes(q) || v.category.toLowerCase().includes(q)
    return matchCategory && matchQuery
  })
})

function mapVideo(doc, index) {
  return {
    id: doc._id,
    title: doc.title,
    category: doc.cat || '未分类',
    duration: doc.meta || '--:--',
    status: doc.status || '已上线',
    date: doc.date || '',
    fileUrl: doc.fileUrl || '',
    cover: doc.cover || '',
    description: doc.description || '',
    gradient: videoGradients[index % videoGradients.length]
  }
}

function videoThumbStyle(video) {
  if (video.cover) {
    return {
      backgroundImage: `linear-gradient(rgba(15,23,42,.06), rgba(15,23,42,.38)), url("${video.cover}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }
  }
  return { background: video.gradient }
}

async function loadVideos() {
  if (loading.value) return
  loading.value = true
  try {
    const resourcesObj = uniCloud.importObject('resources', { customUI: true })
    const r = (await resourcesObj.listPublic({ type: 'video' })) || {}
    if (r.errCode !== 0) {
      uni.showToast({ title: r.errMsg || '视频加载失败', icon: 'none' })
      return
    }
    const list = (r.list || [])
      .filter(d => d.type === 'video')
      .sort((a, b) => (b.createDate || 0) - (a.createDate || 0))
    videos.value = list.map(mapVideo)
  } catch (e) {
    uni.showToast({ title: (e && e.errMsg) || '视频加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function playVideo(video) {
  uni.navigateTo({ url: `/pages/learning-center/video-detail?id=${video.id}` })
}

function goBack() {
  uni.navigateBack({
    delta: 1,
    fail: () => uni.reLaunch({ url: '/pages/learning-center/learning-center' })
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
  try {
    const info = uni.getStorageSync('userInfo')
    if (info && info.name) {
      userName.value = info.name
    }
  } catch (e) {}
  loadVideos()
})
</script>

<style scoped>
.vl-shell {
  --rule-primary: #2563EB;
  --rule-primary-hover: #1D4ED8;
  --rule-primary-active: #1E40AF;
  --rule-primary-foreground: #FFFFFF;
  --rule-primary-tint-1: #DBEAFE;
  --rule-primary-tint-2: #BFDBFE;
  --rule-primary-tint-3: #EFF6FF;
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
  --rule-radius-small: 4px;
  --rule-radius-medium: 8px;
  --rule-radius-large: 16px;
  --rule-radius-full: 9999px;
  --state-success: #16A34A;
  --state-success-tint: #DCFCE7;
  --state-warning: #D97706;
  --state-warning-tint: #FEF3C7;
  --state-error: #DC2626;
  --state-error-tint: #FEE2E2;
  --rule-ink: #0F172A;
  --rule-ink-2: #475569;
  --rule-ink-3: #94A3B8;
  --rule-shadow-1: 0 1px 2px rgba(15,23,42,.04), 0 1px 1px rgba(15,23,42,.02);
  --rule-shadow-2: 0 8px 24px -8px rgba(15,23,42,.12);
  --rule-shadow-3: 0 24px 60px -20px rgba(15,23,42,.20);
  --rule-font-mono: "JetBrains Mono", "SF Mono", "Consolas", monospace;
  display: flex;
  min-height: 100vh;
  background: var(--rule-background);
  color: var(--rule-foreground);
  font-family: "Inter", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-shell {
  display: flex;
  min-height: 100vh;
  width: 100%;
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
  background: linear-gradient(135deg, var(--rule-primary), var(--rule-primary-active));
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
  background: linear-gradient(135deg, var(--rule-primary), var(--rule-primary-active));
  color: #fff;
  box-shadow: 0 6px 14px -4px rgba(37,99,235,.45);
}

.navi-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  background: currentColor;
  display: inline-block;
}

.navi-icon-survey {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M8 6h13'/><path d='M8 12h13'/><path d='M8 18h13'/><path d='M3 6h.01'/><path d='M3 12h.01'/><path d='M3 18h.01'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M8 6h13'/><path d='M8 12h13'/><path d='M8 18h13'/><path d='M3 6h.01'/><path d='M3 12h.01'/><path d='M3 18h.01'/></svg>") center/contain no-repeat;
}

.navi-icon-chart {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M3 3v18h18'/><path d='m19 9-5 5-4-4-3 3'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M3 3v18h18'/><path d='m19 9-5 5-4-4-3 3'/></svg>") center/contain no-repeat;
}

.navi-icon-book {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>") center/contain no-repeat;
}

.navi-icon-bot {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><rect width='16' height='12' x='4' y='8' rx='2'/><path d='M12 4v4'/><circle cx='8' cy='13' r='1'/><circle cx='16' cy='13' r='1'/><path d='M8 17h8'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><rect width='16' height='12' x='4' y='8' rx='2'/><path d='M12 4v4'/><circle cx='8' cy='13' r='1'/><circle cx='16' cy='13' r='1'/><path d='M8 17h8'/></svg>") center/contain no-repeat;
}

.navi-icon-book-open {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>") center/contain no-repeat;
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
  background: linear-gradient(135deg, var(--rule-primary), var(--rule-primary-active));
  color: #fff;
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
  color: var(--rule-muted-foreground);
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

.vl-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  padding: 28px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #fff, #EFF6FF);
  border: 1px solid #E2E8F0;
  border-radius: 16px;
}

.vl-hero-copy {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.vl-hero-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--rule-foreground);
}

.vl-hero-subtitle {
  font-size: 14px;
  color: var(--rule-muted-foreground);
}

.vl-search {
  position: relative;
  width: min(360px, 100%);
}

.vl-search-input {
  width: 100%;
  height: 44px;
  padding: 0 16px 0 42px;
  border-radius: 9999px;
  border: 1px solid var(--rule-border);
  background: var(--rule-card);
  color: var(--rule-foreground);
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.vl-search-input:focus {
  border-color: var(--rule-primary);
  box-shadow: 0 0 0 3px rgba(37,99,235,.18);
}

.vl-search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  width: 18px;
  height: 18px;
  transform: translateY(-50%);
  background: var(--rule-muted-foreground);
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='11' cy='11' r='8'/><path d='m21 21-4.3-4.3'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='11' cy='11' r='8'/><path d='m21 21-4.3-4.3'/></svg>") center/contain no-repeat;
}

.vl-toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.qb-pills {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
  background: var(--rule-muted);
  padding: 4px;
  border-radius: 9999px;
}

.qb-pill {
  font-size: 13px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 9999px;
  cursor: pointer;
  color: var(--rule-muted-foreground);
  background: transparent;
  white-space: nowrap;
  transition: background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
}

.qb-pill:hover {
  color: var(--rule-foreground);
}

.qb-pill.is-active {
  background: linear-gradient(135deg, var(--rule-primary), var(--rule-primary-active));
  color: #fff;
  box-shadow: 0 4px 10px -2px rgba(37,99,235,.42);
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.video-card {
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.video-card:hover {
  transform: translateY(-6px);
  border-color: rgba(37,99,235,.3);
  box-shadow: 0 20px 40px -18px rgba(37,99,235,.35);
}

.video-thumb {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.video-thumb-gradient {
  position: absolute;
  inset: 0;
}

.video-play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15,23,42,.22);
}

.video-play-btn {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: rgba(255,255,255,.92);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 24px -8px rgba(15,23,42,.35);
}

.play-icon {
  width: 0;
  height: 0;
  border-top: 9px solid transparent;
  border-bottom: 9px solid transparent;
  border-left: 14px solid var(--rule-primary);
  margin-left: 3px;
}

.video-duration {
  position: absolute;
  right: 10px;
  bottom: 10px;
  padding: 3px 8px;
  border-radius: 9999px;
  background: rgba(15,23,42,.78);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}

.video-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.video-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--rule-foreground);
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-meta {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.video-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--rule-muted-foreground);
}

.user-icon-sm,
.eye-icon-sm {
  width: 14px;
  height: 14px;
  background: currentColor;
}

.user-icon-sm {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>") center/contain no-repeat;
}

.eye-icon-sm {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z'/><circle cx='12' cy='12' r='3'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z'/><circle cx='12' cy='12' r='3'/></svg>") center/contain no-repeat;
}

.vl-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 72px 24px;
  background: var(--rule-card);
  border: 1px dashed var(--rule-border);
  border-radius: 16px;
}

.vl-empty-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--rule-ink-2);
}

.vl-empty-sub {
  font-size: 13px;
  color: var(--rule-muted-foreground);
}

@media (max-width: 1100px) {
  .video-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .app-sidebar {
    transform: translateX(-100%);
  }
  .app-main {
    margin-left: 0;
  }
  .app-content {
    padding: 20px;
  }
  .vl-hero {
    flex-direction: column;
    align-items: stretch;
    padding: 22px;
  }
  .vl-search {
    width: 100%;
  }
  .video-grid {
    grid-template-columns: 1fr;
  }
}
</style>
