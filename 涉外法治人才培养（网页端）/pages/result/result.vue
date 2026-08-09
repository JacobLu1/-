<template>
  <view class="result-shell">
    <!-- ===== 背景 App Shell（位于半透明模糊遮罩之下） ===== -->
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
          <view class="app-nav-item is-active" data-nav-key="survey">
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

      <!-- ===== Main Content Area（背景内容） ===== -->
      <view class="app-main">
        <header class="app-topbar">
          <text class="app-topbar-title">涉外法治综合测评</text>
          <text class="app-topbar-meta">{{ todayDateText }}</text>
        </header>

        <main class="app-content">
          <view class="survey-main">
            <view class="survey-header">
              <text class="survey-header-title">{{ result.mode === 'special' ? '专项测评 · ' + (result.specialCategory || '涉外法治') : '涉外法治人才专业能力测评' }}</text>
              <view class="countdown-timer">
                <view class="cd-clock-icon"></view>
                <text>剩余时间</text>
                <text class="timer-num">00:00</text>
              </view>
            </view>

            <section class="survey-card">
              <view class="q-meta">
                <text class="q-badge">第 1 题 / 共 19 题</text>
                <text class="q-category">单选题</text>
              </view>
              <text class="q-text">根据《中华人民共和国涉外民事关系法律适用法》，涉外合同当事人没有选择合同适用的法律的，适用与合同有最密切联系的法律。下列哪项不属于确定"最密切联系地"的考量因素？</text>
              <view class="q-options">
                <view class="q-option is-checked">
                  <view class="q-radio-dot"></view>
                  <text class="q-option-letter">A</text>
                  <text class="q-option-text">合同订立地</text>
                </view>
                <view class="q-option">
                  <view class="q-radio-dot"></view>
                  <text class="q-option-letter">B</text>
                  <text class="q-option-text">合同履行地</text>
                </view>
              </view>
            </section>
          </view>
        </main>
      </view>
    </view>

    <!-- ===== 结果弹层（中央结果盒完全不透明，其余区域半透明模糊） ===== -->
    <view class="result-overlay" data-dom-id="modal-backdrop">
      <view class="result-modal">
        <view class="result-close" @tap="closeResult" aria-label="关闭">
          <view class="close-x"></view>
        </view>

        <view class="result-icon">
          <view class="trophy-icon"></view>
        </view>

        <text class="result-title">测评结果</text>
        <text class="result-subtitle">{{ resultSubtitle }}</text>

        <view class="result-score-section">
          <view>
            <text class="result-score">{{ result.score }}</text><text class="result-score-max">/100</text>
          </view>
          <text class="result-score-label">综合评分</text>
          <view class="result-badge">{{ result.level }}</view>
        </view>

        <view class="result-section">
          <text class="result-section-title">能力维度</text>
          <view class="skill-item" v-for="(d, dIdx) in result.dimensions" :key="dIdx">
            <view class="skill-row">
              <text class="skill-name">{{ d.name }}</text>
              <text class="skill-score">{{ d.score }}分</text>
            </view>
            <view class="skill-bar">
              <view class="skill-fill" :style="{ width: d.score + '%' }"></view>
            </view>
          </view>
        </view>

        <view class="result-section">
          <text class="result-section-title">提升建议</text>
          <view class="result-recommendations">
            <view class="rec-item" v-for="(r, rIdx) in result.recommendations" :key="rIdx">{{ r }}</view>
          </view>
        </view>

        <view class="result-actions">
          <button type="button" class="btn-secondary" @tap="viewDetail">数据中心</button>
          <button type="button" class="btn-primary" @tap="retake">重新测评</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { requireLogin, getDisplayName, getLevelText } from '@/utils/auth.js'

const DEFAULT_RESULT = {
  score: 0,
  level: '暂无',
  dimensions: [],
  recommendations: [],
  mode: 'comprehensive',
  specialCategory: ''
}

const result = ref(DEFAULT_RESULT)
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
const resultSubtitle = computed(() => {
  if (result.value.mode === 'special') {
    return `您已完成${result.value.specialCategory || '涉外法治'}专项测评`
  }
  return '您已完成涉外法治人才综合测评'
})

function navigateTo(url) { uni.navigateTo({ url }) }

function closeResult() {
  uni.redirectTo({ url: '/pages/survey/survey' })
}

function viewDetail() {
  uni.navigateTo({ url: '/pages/report/report' })
}

function retake() {
  uni.redirectTo({ url: '/pages/survey/survey?from=retake' })
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

onLoad(() => {
  // 登录鉴权：未登录跳转登录页
  if (!requireLogin()) return
  try {
    const info = uni.getStorageSync('userInfo')
    if (info && info.name) userName.value = info.name
  } catch (e) {}
  try {
    const saved = uni.getStorageSync('survey_result')
    if (saved) {
      const p = JSON.parse(saved)
      if (p && typeof p.score === 'number') {
        result.value = {
          score: p.score,
          level: p.level || '良好',
          dimensions: Array.isArray(p.dimensions) && p.dimensions.length
            ? p.dimensions
            : [],
          recommendations: Array.isArray(p.recommendations) && p.recommendations.length
            ? p.recommendations
            : [],
          mode: p.mode || 'comprehensive',
          specialCategory: p.specialCategory || ''
        }
      }
    }
  } catch (e) {
    console.error('[result] 读取结果失败:', e)
  }
})
</script>

<style scoped>
/* =========================================================
   涉外法治人才培养测评 - Brand CSS（与评估结果.html 一致）
   ========================================================= */
.result-shell {
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
  --state-info: #2563EB;
  --state-info-tint: #DBEAFE;

  --rule-ink: #0F172A;
  --rule-ink-2: #475569;
  --rule-ink-3: #94A3B8;
  --rule-line: #E2E8F0;
  --rule-surface: #FFFFFF;
  --rule-surface-2: #F8FAFC;

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

.app-shell { display: flex; min-height: 100vh; background: var(--rule-background); }

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
  flex-shrink: 0; overflow: hidden;
}
.ls-svg-glyph {
  width: 20px; height: 20px; background: #fff;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M7 21h10'/><path d='M12 3v18'/><path d='M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M7 21h10'/><path d='M12 3v18'/><path d='M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2'/></svg>") center/contain no-repeat;
}
.app-sidebar-logo-text {
  font-size: 15px; font-weight: 600;
  color: var(--rule-foreground);
  white-space: nowrap;
}
.app-sidebar-nav {
  flex: 1; padding: 16px 12px;
  display: flex; flex-direction: column;
  gap: 4px; overflow-y: auto;
}
.app-nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px; border-radius: 8px;
  font-size: 14px; font-weight: 500;
  color: var(--rule-ink-2);
  transition: background 0.15s ease, color 0.15s ease;
  cursor: pointer;
}
.app-nav-item:hover { background: var(--rule-muted); color: var(--rule-foreground); }
.app-nav-item.is-active { background: var(--rule-primary); color: #FFFFFF; }
.app-nav-item.is-active:hover { background: var(--rule-primary-hover); color: #fff; }
.navi-icon {
  width: 20px; height: 20px; flex-shrink: 0;
  background: currentColor; display: inline-block;
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
.app-sidebar-user { padding: 16px 12px; border-top: 1px solid var(--rule-border); }
.app-sidebar-user-inner {
  display: flex; align-items: center; gap: 12px;
  padding: 8px 12px; cursor: pointer; border-radius: 8px;
  transition: background 0.15s ease;
}
.app-sidebar-user-inner:hover { background: var(--rule-muted); }
.app-sidebar-user-avatar {
  width: 32px; height: 32px; border-radius: 9999px;
  background: var(--rule-primary-tint-1); color: var(--rule-primary);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 600; flex-shrink: 0;
}
.app-sidebar-user-name { display: block; font-size: 13px; font-weight: 500; color: var(--rule-foreground); }
.app-sidebar-user-role { display: block; font-size: 12px; color: var(--rule-muted-foreground); }
.app-sidebar-logout {
  display: flex; align-items: center; gap: 8px;
  margin: 8px 12px 0; padding: 10px 12px;
  border-radius: 8px; cursor: pointer;
  color: var(--rule-ink-2); font-size: 13px;
  transition: background 0.15s ease, color 0.15s ease;
}
.app-sidebar-logout:hover { background: var(--state-error-tint); color: var(--state-error); }
.app-sidebar-logout-icon {
  width: 16px; height: 16px; flex-shrink: 0;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>") center/contain no-repeat;
}
.app-sidebar-logout-text { font-size: 13px; font-weight: 500; }

/* ===== Main ===== */
.app-main {
  flex: 1; margin-left: 240px;
  display: flex; flex-direction: column;
  min-height: 100vh; min-width: 0;
}
.app-topbar {
  height: 64px; border-bottom: 1px solid var(--rule-border);
  background: var(--rule-card);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 32px; flex-shrink: 0;
}
.app-topbar-title { font-size: 18px; font-weight: 600; color: var(--rule-foreground); }
.app-topbar-meta { font-size: 13px; color: var(--rule-muted-foreground); }
.app-content { flex: 1; padding: 32px; }
.survey-main { width: 100%; }
.survey-header {
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; margin: 0 auto 24px;
  max-width: 800px; flex-wrap: wrap;
}
.survey-header-title { font-size: 18px; font-weight: 600; color: var(--rule-foreground); letter-spacing: -0.01em; }
.countdown-timer {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: 9999px;
  background: var(--rule-primary-tint-3);
  border: 1px solid var(--rule-primary-tint-1);
  color: var(--rule-primary); font-size: 13px; font-weight: 500;
  white-space: nowrap;
}
.cd-clock-icon {
  width: 16px; height: 16px; flex-shrink: 0;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><polyline points='12 6 12 12 16 14'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><polyline points='12 6 12 12 16 14'/></svg>") center/contain no-repeat;
}
.timer-num {
  font-family: "JetBrains Mono", "SF Mono", Consolas, monospace;
  font-variant-numeric: tabular-nums;
  font-weight: 600; letter-spacing: 0.02em;
}
.survey-card {
  max-width: 800px; margin: 0 auto 24px;
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: 16px;
  padding: 40px;
  box-shadow: var(--rule-shadow-1);
}
.q-meta { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.q-badge { font-size: 13px; color: var(--rule-muted-foreground); }
.q-category {
  display: inline-flex; align-items: center;
  padding: 3px 10px; border-radius: 9999px;
  background: var(--rule-primary-tint-3);
  color: var(--rule-primary);
  font-size: 12px; font-weight: 500;
}
.q-text {
  display: block; font-size: 18px; font-weight: 600;
  color: var(--rule-foreground);
  line-height: 1.6; margin: 0 0 24px;
  word-break: keep-all; overflow-wrap: break-word;
}
.q-options { display: flex; flex-direction: column; gap: 12px; }
.q-option {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px;
  border: 1px solid var(--rule-border);
  border-radius: 8px;
  background: var(--rule-card);
}
.q-option.is-checked { border-color: var(--rule-primary); background: var(--rule-primary-tint-3); }
.q-radio-dot {
  width: 18px; height: 18px; border-radius: 50%;
  border: 2px solid var(--rule-border);
  background: var(--rule-card);
  flex-shrink: 0;
}
.q-option.is-checked .q-radio-dot { border-color: var(--rule-primary); position: relative; }
.q-option.is-checked .q-radio-dot::after {
  content: ""; position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--rule-primary);
}
.q-option-letter { font-size: 14px; font-weight: 600; color: var(--rule-ink-2); flex-shrink: 0; width: 16px; }
.q-option.is-checked .q-option-letter { color: var(--rule-primary); }
.q-option-text { font-size: 15px; color: var(--rule-foreground); line-height: 1.5; }

/* =========================================================
   结果弹层（复刻评估结果.html）
   除中央结果盒外，其余区域半透明模糊
   ========================================================= */
.result-overlay {
  position: fixed; inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
.result-modal {
  background: var(--rule-card);
  border-radius: 16px;
  max-width: 520px; width: 90%;
  max-height: 85vh; overflow-y: auto;
  position: relative;
  box-shadow: var(--rule-shadow-3);
  padding: 40px;
  animation: modal-entrance 0.3s ease;
}
@keyframes modal-entrance {
  from { opacity: 0; transform: translateY(20px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.result-close {
  position: absolute; top: 16px; right: 16px;
  width: 36px; height: 36px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: var(--rule-muted-foreground);
  cursor: pointer;
  transition: background 0.15s ease;
}
.result-close:hover { background: var(--rule-muted); }
.close-x {
  width: 20px; height: 20px;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M18 6 6 18'/><path d='m6 6 12 12'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M18 6 6 18'/><path d='m6 6 12 12'/></svg>") center/contain no-repeat;
}
.result-icon {
  width: 64px; height: 64px; border-radius: 16px;
  background: var(--rule-primary-tint-3);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 20px;
}
.trophy-icon {
  width: 32px; height: 32px;
  background: var(--rule-primary);
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M15.474 14.035a9 9 0 0 0-9.948-3.327c-.996.274-1.562 1.376-1.093 2.294a12.7 12.7 0 0 0 3.758 4.626 12.7 12.7 0 0 0 5.556 2.364c1.017.169 1.87-.639 1.965-1.663a9 9 0 0 1 3.237-6.513'/><path d='M16 3.5v8.07a4 4 0 0 1-8 0V3.5'/><path d='M8 3.5h8'/><path d='M12 15.57v5.43'/><path d='M9 21h6'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M15.474 14.035a9 9 0 0 0-9.948-3.327c-.996.274-1.562 1.376-1.093 2.294a12.7 12.7 0 0 0 3.758 4.626 12.7 12.7 0 0 0 5.556 2.364c1.017.169 1.87-.639 1.965-1.663a9 9 0 0 1 3.237-6.513'/><path d='M16 3.5v8.07a4 4 0 0 1-8 0V3.5'/><path d='M8 3.5h8'/><path d='M12 15.57v5.43'/><path d='M9 21h6'/></svg>") center/contain no-repeat;
}
.result-title {
  display: block;
  font-size: 22px; font-weight: 700;
  text-align: center;
  color: var(--rule-foreground);
  margin: 0 0 8px;
}
.result-subtitle {
  display: block;
  font-size: 14px; text-align: center;
  color: var(--rule-muted-foreground);
  margin: 0 0 24px;
}
.result-score-section {
  text-align: center;
  margin-bottom: 28px;
  padding: 20px;
  background: var(--rule-surface-2);
  border-radius: 12px;
}
.result-score {
  font-size: 48px; font-weight: 800;
  color: var(--rule-primary);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.result-score-max {
  font-size: 20px;
  color: var(--rule-muted-foreground);
}
.result-score-label {
  display: block;
  font-size: 13px;
  color: var(--rule-muted-foreground);
  margin-top: 4px;
}
.result-badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 4px 12px; border-radius: 9999px;
  background: var(--rule-primary-tint-1);
  color: var(--rule-primary);
  font-size: 13px; font-weight: 600;
  margin-top: 8px;
}
.result-section { margin-bottom: 24px; }
.result-section:last-child { margin-bottom: 0; }
.result-section-title {
  display: block;
  font-size: 15px; font-weight: 600;
  color: var(--rule-foreground);
  margin: 0 0 12px;
}
.skill-item { margin-bottom: 14px; }
.skill-item:last-child { margin-bottom: 0; }
.skill-row {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 6px;
}
.skill-name { font-size: 14px; color: var(--rule-foreground); }
.skill-score {
  font-size: 14px; font-weight: 600;
  color: var(--rule-primary);
  font-variant-numeric: tabular-nums;
}
.skill-bar {
  height: 8px;
  background: var(--rule-muted);
  border-radius: 9999px;
  overflow: hidden;
}
.skill-fill {
  height: 100%;
  background: var(--rule-primary);
  border-radius: 9999px;
  transition: width 0.6s ease;
}
.result-recommendations {
  display: flex; flex-direction: column;
  gap: 8px;
}
.rec-item {
  font-size: 14px;
  color: var(--rule-ink-2);
  line-height: 1.6;
  padding-left: 0;
}
.rec-item::before {
  content: "→";
  color: var(--rule-primary);
  font-weight: 700;
  margin-right: 8px;
}
.result-actions {
  display: flex; gap: 12px;
  margin-top: 8px;
}
.result-actions .btn-secondary,
.result-actions .btn-primary {
  flex: 1; justify-content: center;
  padding: 12px;
  display: inline-flex; align-items: center; gap: 6px;
  border-radius: 8px; font-size: 14px; font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  line-height: 1.5;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
}
.btn-secondary {
  border: 1px solid var(--rule-border);
  background: var(--rule-card);
  color: var(--rule-foreground);
}
.btn-secondary:hover { border-color: var(--rule-primary); color: var(--rule-primary); }
.btn-primary {
  border: 1px solid var(--rule-primary);
  background: var(--rule-primary);
  color: #fff;
}
.btn-primary:hover {
  background: var(--rule-primary-hover);
  border-color: var(--rule-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.25);
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .app-sidebar { transform: translateX(-100%); transition: transform 0.3s; }
  .app-main { margin-left: 0; }
  .app-content { padding: 16px; }
}
@media (max-width: 480px) {
  .result-modal { padding: 24px; }
  .result-score { font-size: 40px; }
  .survey-card { padding: 24px; }
  .survey-header-title { font-size: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .result-modal { animation: none; }
  .skill-fill { transition: none; }
  * { transition-duration: 0.01ms !important; }
}
</style>
