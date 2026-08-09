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
          <view class="app-nav-item" @tap="navigateTo('/pages/legal-db/legal-db')">
            <view class="navi-icon navi-icon-book"></view>
            <text>法律库</text>
          </view>
          <view class="app-nav-item" @tap="navigateTo('/pages/ai-assistant/ai-assistant')">
            <view class="navi-icon navi-icon-bot"></view>
            <text>AI助手</text>
          </view>
          <view class="app-nav-item is-active" @tap="navigateTo('/pages/learning-center/learning-center')">
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
            <text class="app-topbar-title">法律英语综合训练</text>
          </view>
          <text class="app-topbar-meta">{{ todayDateText }}</text>
        </header>

        <main class="app-content">
          <view class="le-wrap">
            <!-- ===== Overview Card ===== -->
            <view class="overview-card">
              <view class="overview-main">
                <view class="overview-head">
                  <view class="overview-icon">
                    <view class="overview-earth-icon"></view>
                  </view>
                  <view class="overview-info">
                    <text class="overview-title">法律英语</text>
                    <text class="overview-subtitle">涉外法律人才核心语言能力</text>
                  </view>
                  <view class="overview-level">{{ overallLevel }}</view>
                </view>
                <view class="overview-progress-row">
                  <text class="overview-progress-label">掌握度</text>
                  <text class="overview-progress-value">{{ overallPercent }}%</text>
                </view>
                <view class="overview-progress">
                  <view class="overview-progress-fill" :style="{ width: overallPercent + '%' }"></view>
                </view>
              </view>
              <view class="overview-stats">
                <view class="overview-stat" v-for="(stat, i) in stats" :key="i">
                  <view class="overview-stat-icon" :class="stat.iconClass"></view>
                  <view class="overview-stat-info">
                    <text class="overview-stat-value">{{ stat.val }}</text>
                    <text class="overview-stat-label">{{ stat.label }}</text>
                  </view>
                </view>
              </view>
            </view>

            <!-- ===== Learning Modules ===== -->
            <view class="doc-section-header">
              <text class="doc-section-title">学习模块</text>
              <text class="doc-section-meta">共 {{ modules.length }} 个模块</text>
            </view>
            <view class="mod-grid">
              <view
                class="mod-card"
                v-for="(mod, idx) in modules"
                :key="idx"
                @tap="onModuleTap(mod)"
              >
                <view class="mod-card-top">
                  <view class="mod-icon" :class="'mod-icon-' + (idx + 1)">
                    <view :class="mod.iconClass"></view>
                  </view>
                  <view class="mod-level">{{ mod.level }}</view>
                </view>
                <text class="mod-name">{{ mod.name }}</text>
                <view class="mod-progress">
                  <view class="mod-progress-fill" :style="{ width: mod.percent + '%' }"></view>
                </view>
                <view class="mod-footer">
                  <text class="mod-percent">{{ mod.percent }}% 完成</text>
                  <view class="mod-arrow"></view>
                </view>
              </view>
            </view>
            <view v-if="!modules.length" class="le-empty">暂无学习模块</view>

            <!-- ===== Today's Vocabulary ===== -->
            <view class="doc-section-header">
              <text class="doc-section-title">今日词汇</text>
              <view class="doc-section-meta">
                <text>{{ starredCount }} 词已收藏</text>
                <text class="vocab-more" @tap="onMoreWords">更多 ›</text>
              </view>
            </view>
            <view class="vocab-card">
              <view
                class="vocab-row"
                v-for="(word, idx) in words"
                :key="idx"
                @tap="onWordTap(word)"
              >
                <text class="vocab-phonetic">{{ word.phonetic }}</text>
                <text class="vocab-en">{{ word.en }}</text>
                <text class="vocab-cn">{{ word.cn }}</text>
                <view
                  class="vocab-star"
                  :class="{ 'is-starred': word.starred }"
                  @tap.stop="toggleStar(word)"
                >
                  <view class="star-icon"></view>
                </view>
              </view>
            </view>
            <view v-if="!words.length" class="le-empty">暂无词汇数据</view>

            <!-- ===== Bottom Tip ===== -->
            <view class="le-tip">
              <view class="le-tip-icon"></view>
              <text>坚持每日学习，法律英语稳步提升</text>
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

/* ============================================================
   User Data
   ============================================================ */
const userName = ref(getDisplayName())
const userRole = ref(getLevelText())
const userInitial = computed(() => (userName.value || '用').slice(0, 1))

/* ============================================================
   Page Data
   ============================================================ */
const overallPercent = ref(0)
const overallLevel = ref('暂无')
const stats = ref([])
const modules = ref([])
const words = ref([])

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

const starredCount = computed(() => words.value.filter(w => w.starred).length)

/* ============================================================
   Event Handlers
   ============================================================ */
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

function onModuleTap(mod) {
  if (mod.route) {
    uni.navigateTo({ url: mod.route })
    return
  }
  uni.showToast({ title: `「${mod.name}」建设中，敬请期待`, icon: 'none' })
}

function onMoreWords() {
  uni.showToast({ title: '更多词汇即将上线', icon: 'none' })
}

function onWordTap(word) {
  uni.showToast({ title: `${word.en}：${word.cn}`, icon: 'none' })
}

function toggleStar(word) {
  word.starred = !word.starred
}

async function loadEnglishResources() {
  try {
    const resourcesObj = uniCloud.importObject('resources', { customUI: true })
    const r = (await resourcesObj.listPublic({ type: 'english' })) || {}
    if (r.errCode !== 0) {
      uni.showToast({ title: r.errMsg || '法律英语资源加载失败', icon: 'none' })
      return
    }
    const list = r.list || []
    stats.value = [
      { iconClass: 'stat-bookmark-icon', val: String(list.length), label: '法律英语资源' }
    ]
    const map = {}
    const icons = ['mod-book-icon', 'mod-file-icon', 'mod-mic-icon', 'mod-chat-icon']
    list.forEach((item, idx) => {
      const name = item.cat || '未分类'
      if (!map[name]) {
        map[name] = {
          name,
          level: `L${Math.min(3, Object.keys(map).length + 1)}`,
          percent: 0,
          iconClass: icons[idx % icons.length],
          route: name === '听力训练' ? '/pages/learning-center/listening-training' : ''
        }
      }
    })
    modules.value = Object.values(map)
  } catch (e) {
    uni.showToast({ title: (e && e.errMsg) || '法律英语资源加载失败', icon: 'none' })
  }
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

/* ============================================================
   Lifecycle
   ============================================================ */
onLoad(() => {
  // 登录鉴权：未登录跳转登录页
  if (!requireLogin()) return
  try {
    const info = uni.getStorageSync('userInfo')
    if (info && info.name) {
      userName.value = info.name
    }
  } catch (e) {}
  loadEnglishResources()
})
</script>

<style scoped>
/* =========================================================
   Brand Design Tokens (aligned with legal-db)
   ========================================================= */
.legal-shell {
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
  --rule-muted: #F1F5F9;
  --rule-muted-foreground: #64748B;
  --rule-border: #E2E8F0;

  --rule-ink: #0F172A;
  --rule-ink-2: #475569;
  --rule-ink-3: #94A3B8;
  --rule-line: #E2E8F0;
  --rule-surface: #FFFFFF;
  --rule-surface-2: #F8FAFC;

  --rule-shadow-1: 0 1px 2px rgba(15,23,42,.04), 0 1px 1px rgba(15,23,42,.02);
  --rule-shadow-2: 0 8px 24px -8px rgba(15,23,42,.12);
  --rule-shadow-3: 0 24px 60px -20px rgba(15,23,42,.20);

  --state-success: #16A34A;
  --state-warning: #D97706;
  --state-error: #DC2626;

  min-height: 100vh;
  background: var(--rule-background);
  color: var(--rule-foreground);
  font-family: "Inter", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* =========================================================
   Shell Layout
   ========================================================= */
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

/* Nav icons */
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
  font-size: 13px; font-weight: 600;
  flex-shrink: 0;
}
.app-sidebar-user-name {
  display: block;
  font-size: 13px; font-weight: 500;
  color: var(--rule-foreground);
}
.app-sidebar-user-role {
  display: block;
  font-size: 12px; color: var(--rule-muted-foreground);
}

.app-sidebar-logout {
  display: flex; align-items: center; gap: 8px;
  margin: 8px 12px 0; padding: 10px 12px;
  border-radius: 8px; cursor: pointer;
  color: var(--rule-ink-2); font-size: 13px;
  transition: background 0.15s ease, color 0.15s ease;
}
.app-sidebar-logout:hover {
  background: #FEE2E2;
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
  display: inline-flex; align-items: center; gap: 4px;
  height: 30px; padding: 0 12px;
  border-radius: 6px;
  font-size: 13px; font-weight: 500;
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
  width: 14px; height: 14px;
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
  white-space: nowrap;
}

.app-content {
  flex: 1;
  padding: 32px;
}

/* =========================================================
   Page Styles (minimal, aligned with legal-db)
   ========================================================= */
.le-wrap {
  display: flex; flex-direction: column; gap: 20px;
  max-width: 1120px;
}

/* ---- Overview Card ---- */
.overview-card {
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  gap: 32px;
  box-shadow: var(--rule-shadow-1);
}
.overview-main {
  flex: 1; min-width: 0;
}
.overview-head {
  display: flex; align-items: center; gap: 14px;
}
.overview-icon {
  width: 44px; height: 44px;
  border-radius: 10px;
  background: var(--rule-primary-tint-1);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.overview-earth-icon {
  width: 22px; height: 22px;
  background: var(--rule-primary);
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20'/><path d='M2 12h20'/></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20'/><path d='M2 12h20'/></svg>") center/contain no-repeat;
}
.overview-info {
  flex: 1; min-width: 0;
}
.overview-title {
  display: block;
  font-size: 20px; font-weight: 700;
  color: var(--rule-foreground);
}
.overview-subtitle {
  display: block;
  margin-top: 2px;
  font-size: 13px;
  color: var(--rule-muted-foreground);
}
.overview-level {
  height: 28px; padding: 0 12px;
  border-radius: 9999px;
  background: var(--rule-primary-tint-1);
  color: var(--rule-primary);
  font-size: 13px; font-weight: 600;
  display: flex; align-items: center;
  flex-shrink: 0;
}
.overview-progress-row {
  margin-top: 20px;
  display: flex; align-items: baseline; justify-content: space-between;
}
.overview-progress-label {
  font-size: 13px;
  color: var(--rule-muted-foreground);
}
.overview-progress-value {
  font-size: 24px; font-weight: 700;
  color: var(--rule-primary);
}
.overview-progress {
  margin-top: 8px;
  height: 8px;
  border-radius: 9999px;
  background: var(--rule-muted);
  overflow: hidden;
}
.overview-progress-fill {
  height: 100%;
  border-radius: 9999px;
  background: linear-gradient(90deg, var(--rule-primary), var(--rule-primary-hover));
  transition: width 1s cubic-bezier(.2,.8,.2,1);
}
.overview-stats {
  display: flex; align-items: center; gap: 40px;
  padding-left: 32px;
  border-left: 1px solid var(--rule-border);
}
.overview-stat {
  display: flex; align-items: center; gap: 10px;
}
.overview-stat-icon {
  width: 24px; height: 24px;
  background: var(--rule-muted-foreground);
  flex-shrink: 0;
}
.stat-medal-icon {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15'/><path d='M11 12 5.12 2.2'/><path d='m13 12 5.88-9.8'/><path d='M8 7h8'/><circle cx='12' cy='17' r='5'/><path d='M12 18v-2h-.5'/></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15'/><path d='M11 12 5.12 2.2'/><path d='m13 12 5.88-9.8'/><path d='M8 7h8'/><circle cx='12' cy='17' r='5'/><path d='M12 18v-2h-.5'/></svg>") center/contain no-repeat;
}
.stat-bookmark-icon {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z'/></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z'/></svg>") center/contain no-repeat;
}
.stat-time-icon {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><polyline points='12 6 12 12 16 14'/></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><polyline points='12 6 12 12 16 14'/></svg>") center/contain no-repeat;
}
.overview-stat-info {
  display: flex; flex-direction: column;
}
.overview-stat-value {
  font-size: 16px; font-weight: 700;
  color: var(--rule-foreground);
}
.overview-stat-label {
  margin-top: 2px;
  font-size: 12px;
  color: var(--rule-muted-foreground);
}

/* ---- Section Header (aligned with legal-db) ---- */
.doc-section-header {
  display: flex; align-items: baseline; justify-content: space-between; gap: 16px;
  margin-top: 8px;
}
.doc-section-title {
  font-size: 18px; font-weight: 600;
  color: var(--rule-foreground);
}
.doc-section-meta {
  display: inline-flex; align-items: center; gap: 12px;
  font-size: 13px;
  color: var(--rule-muted-foreground);
}
.vocab-more {
  cursor: pointer;
  color: var(--rule-primary);
  transition: color 0.15s ease;
}
.vocab-more:hover { color: var(--rule-primary-hover); }

/* ---- Learning Modules ---- */
.mod-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.mod-card {
  display: flex; flex-direction: column; gap: 12px;
  padding: 20px;
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: 12px;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.15s;
}
.mod-card:hover { border-color: var(--rule-primary-tint-2); transform: translateY(-1px); }
.mod-card:active { opacity: 0.9; }

.mod-card-top {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
}
.mod-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: var(--rule-primary-tint-3);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.mod-icon > view {
  width: 20px; height: 20px;
  background: var(--rule-primary);
}
.mod-book-icon {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>") center/contain no-repeat;
}
.mod-file-icon {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'/><polyline points='14 2 14 8 20 8'/><line x1='16' x2='8' y1='13' y2='13'/><line x1='16' x2='8' y1='17' y2='17'/><line x1='10' x2='8' y1='9' y2='9'/></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'/><polyline points='14 2 14 8 20 8'/><line x1='16' x2='8' y1='13' y2='13'/><line x1='16' x2='8' y1='17' y2='17'/><line x1='10' x2='8' y1='9' y2='9'/></svg>") center/contain no-repeat;
}
.mod-mic-icon {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z'/><path d='M19 10v2a7 7 0 0 1-14 0v-2'/><line x1='12' x2='12' y1='19' y2='22'/></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z'/><path d='M19 10v2a7 7 0 0 1-14 0v-2'/><line x1='12' x2='12' y1='19' y2='22'/></svg>") center/contain no-repeat;
}
.mod-chat-icon {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M7.9 20A9 9 0 1 0 4 16.1L2 22Z'/><path d='M8 12h.01'/><path d='M12 12h.01'/><path d='M16 12h.01'/></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M7.9 20A9 9 0 1 0 4 16.1L2 22Z'/><path d='M8 12h.01'/><path d='M12 12h.01'/><path d='M16 12h.01'/></svg>") center/contain no-repeat;
}
.mod-level {
  height: 26px; padding: 0 10px;
  border-radius: 9999px;
  background: var(--rule-muted);
  color: var(--rule-ink-2);
  font-size: 12px; font-weight: 600;
  display: flex; align-items: center;
}
.mod-name {
  font-size: 16px; font-weight: 600;
  color: var(--rule-foreground);
}
.mod-progress {
  height: 6px;
  border-radius: 9999px;
  background: var(--rule-muted);
  overflow: hidden;
}
.mod-progress-fill {
  height: 100%;
  border-radius: 9999px;
  background: linear-gradient(90deg, var(--rule-primary), var(--rule-primary-hover));
  transition: width 1s cubic-bezier(.2,.8,.2,1);
}
.mod-footer {
  display: flex; align-items: center; justify-content: space-between;
}
.mod-percent {
  font-size: 13px; font-weight: 500;
  color: var(--rule-muted-foreground);
}
.mod-arrow {
  width: 16px; height: 16px;
  background: var(--rule-ink-3);
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m9 18 6-6-6-6'/></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m9 18 6-6-6-6'/></svg>") center/contain no-repeat;
}

.le-empty {
  margin-top: 16px;
  padding: 32px;
  border: 1px dashed var(--rule-border);
  border-radius: 12px;
  color: var(--rule-muted-foreground);
  font-size: 13px;
  text-align: center;
}

/* ---- Vocabulary ---- */
.vocab-card {
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: 12px;
  padding: 6px 20px;
}
.vocab-row {
  display: flex; align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--rule-border);
  cursor: pointer;
  transition: background 0.15s ease;
}
.vocab-row:last-child { border-bottom: none; }
.vocab-row:hover { background: var(--rule-muted); }
.vocab-phonetic {
  width: 160px;
  font-size: 13px;
  color: var(--rule-muted-foreground);
  flex-shrink: 0;
}
.vocab-en {
  flex: 1; min-width: 0;
  font-size: 16px; font-weight: 600;
  color: var(--rule-foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.vocab-cn {
  margin-right: 16px;
  font-size: 15px; font-weight: 600;
  color: var(--rule-primary);
}
.vocab-star {
  width: 22px; height: 22px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: transform 0.15s ease;
}
.vocab-star:hover { transform: scale(1.15); }
.star-icon {
  width: 18px; height: 18px;
  background: var(--rule-ink-3);
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'/></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'/></svg>") center/contain no-repeat;
}
.vocab-star.is-starred .star-icon {
  background: var(--state-warning);
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'/></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'/></svg>") center/contain no-repeat;
}

/* ---- Bottom Tip ---- */
.le-tip {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 16px 0 8px;
  color: var(--rule-muted-foreground);
  font-size: 13px;
}
.le-tip-icon {
  width: 16px; height: 16px;
  background: var(--rule-primary);
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 3v18'/><path d='m8 8 4-4 4 4'/><path d='m20 17-4-4 4-4'/><path d='M4 17l4-4-4-4'/></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 3v18'/><path d='m8 8 4-4 4 4'/><path d='m20 17-4-4 4-4'/><path d='M4 17l4-4-4-4'/></svg>") center/contain no-repeat;
}

/* =========================================================
   Responsive
   ========================================================= */
@media (max-width: 1024px) {
  .mod-grid { grid-template-columns: repeat(2, 1fr); }
  .overview-card { flex-direction: column; gap: 24px; }
  .overview-stats { padding-left: 0; border-left: none; gap: 24px; }
}

@media (max-width: 768px) {
  .app-sidebar { transform: translateX(-100%); transition: transform 0.3s; }
  .app-main { margin-left: 0; }
  .app-content { padding: 16px; }
  .mod-grid { grid-template-columns: 1fr; }
  .vocab-phonetic { width: 120px; }
}

@media (max-width: 480px) {
  .overview-stats { flex-wrap: wrap; }
  .vocab-row { flex-wrap: wrap; gap: 8px; }
  .vocab-phonetic { width: 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .mod-card:hover { transform: none; }
  .vocab-star:hover { transform: none; }
}
</style>
