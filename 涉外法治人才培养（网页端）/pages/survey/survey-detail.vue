<template>
  <view class="sd-shell">
    <!-- 左侧导航栏 -->
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

      <!-- 主内容区 -->
      <view class="app-main">
        <header class="app-topbar">
          <view class="app-topbar-left">
            <view class="sd-back" @tap="goBack">
              <view class="sd-back-icon"></view>
              <text>返回</text>
            </view>
            <text class="app-topbar-title">测评记录详情</text>
          </view>
          <text class="app-topbar-meta">{{ todayDateText }}</text>
        </header>

        <main class="app-content">
          <view class="sd-main">

            <!-- 加载 / 空态 -->
            <view v-if="loading" class="sd-empty">加载中…</view>
            <view v-else-if="errorText" class="sd-empty">{{ errorText }}</view>

            <template v-else>
              <!-- 概览卡片 -->
              <section class="sd-summary">
                <view class="sd-score-zone">
                  <view class="sd-score">{{ score }}</view>
                  <text class="sd-score-label">总分</text>
                </view>
                <view class="sd-summary-body">
                  <view class="sd-summary-head">
                    <text class="sd-mode-name">{{ modeName }}</text>
                    <text class="sd-level" :class="levelClass">{{ level }}</text>
                  </view>
                  <view class="sd-meta-row">
                    <text class="sd-meta-chip">{{ dateText }}</text>
                    <text class="sd-meta-chip sd-stat-ok">答对 {{ stat.correct }}</text>
                    <text class="sd-meta-chip sd-stat-bad">答错 {{ stat.wrong }}</text>
                    <text class="sd-meta-chip">未答 {{ stat.missed }}</text>
                  </view>
                </view>
              </section>

              <!-- 逐题回顾 -->
              <view class="sd-section-head">
                <view class="pc-accent-bar"></view>
                <text>逐题回顾与解析</text>
              </view>

              <view v-if="!items.length" class="sd-empty">
                该记录暂无逐题数据，可能是旧版本测评，暂不支持逐题查看
              </view>

              <view v-for="(it, i) in items" :key="i" class="sd-q" :class="verdictClass(it)">
                <!-- 头部 -->
                <view class="sd-q-head">
                  <text class="sd-q-index">第 {{ i + 1 }} 题</text>
                  <text class="sd-type-tag">{{ typeText(it) }}</text>
                  <text v-if="it.type !== 'subjective'" class="sd-verdict" :class="verdictClass(it)">
                    {{ verdictText(it) }}
                  </text>
                </view>

                <!-- 题干 -->
                <text class="sd-q-title">{{ it.title }}</text>

                <!-- 客观题选项 -->
                <view v-if="it.type !== 'subjective'" class="sd-opt-list">
                  <view v-for="opt in it.options" :key="opt.key" class="sd-opt" :class="optState(it, opt.key)">
                    <view class="sd-opt-key">{{ opt.key }}</view>
                    <text class="sd-opt-text">{{ opt.text }}</text>
                    <text v-if="isRight(it, opt.key)" class="sd-opt-mark is-right">✓ 正确答案</text>
                    <text v-else-if="isUserPick(it, opt.key)" class="sd-opt-mark is-wrong">✕ 我的选择</text>
                  </view>

                  <view class="sd-ans-strip">
                    <view class="sd-ans-cell">
                      <text class="sd-ans-label">我的答案</text>
                      <text class="sd-ans-value" :class="myAnsClass(it)">{{ userAnswerText(it) }}</text>
                    </view>
                    <view class="sd-ans-cell">
                      <text class="sd-ans-label">正确答案</text>
                      <text class="sd-ans-value is-key">{{ correctText(it) }}</text>
                    </view>
                  </view>
                </view>

                <!-- 主观题作答 -->
                <view v-else class="sd-subj">
                  <view v-if="it.caseText" class="sd-case-box">
                    <view class="sd-subj-label">案情材料</view>
                    <text class="sd-case-text">{{ it.caseText }}</text>
                  </view>
                  <view class="sd-subj-block">
                    <view class="sd-subj-label">我的作答</view>
                    <text class="sd-my-ans" :class="{ 'is-empty': !it.userAnswer }">{{ it.userAnswer || '（未作答）' }}</text>
                  </view>
                  <view v-if="it.answer" class="sd-subj-block">
                    <view class="sd-subj-label">参考答案</view>
                    <text class="sd-ref-ans">{{ it.answer }}</text>
                  </view>
                </view>

                <!-- 解析 -->
                <view v-if="it.analysis" class="sd-analysis">
                  <view class="sd-analysis-label">
                    <view class="sd-analysis-ico"></view>
                    <text>解析</text>
                  </view>
                  <text class="sd-analysis-text">{{ it.analysis }}</text>
                </view>
              </view>
            </template>

          </view>
        </main>
      </view>
    </view>
  </view>
</template>

<script>
import { requireLogin, getDisplayName, getLevelText } from '@/utils/auth.js'

function isBlank(v) {
  return v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length)
}

export default {
  name: 'SurveyRecordDetail',
  data() {
    return {
      id: '',
      loading: true,
      errorText: '',
      doc: null,
      items: [],
      userName: '',
      userRole: ''
    }
  },
  computed: {
    todayDateText() {
      const now = new Date()
      return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
    },
    userInitial() {
      return (this.userName || '用').slice(0, 1)
    },
    score() {
      return this.doc ? Number(this.doc.score) || 0 : 0
    },
    level() {
      return (this.doc && this.doc.level) || '未评级'
    },
    levelClass() {
      const s = this.score
      if (s >= 90) return 'sd-level-excellent'
      if (s >= 70) return 'sd-level-good'
      if (s >= 60) return 'sd-level-mid'
      return ''
    },
    modeName() {
      if (!this.doc) return ''
      return this.doc.mode === 'special' ? (this.doc.specialCategory || '专项测评') : '综合测评'
    },
    dateText() {
      const ts = this.doc && this.doc.createDate
      if (!ts) return '-'
      const d = new Date(ts)
      if (isNaN(d.getTime())) return String(ts)
      const p = (n) => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
    },
    stat() {
      let correct = 0
      let wrong = 0
      let missed = 0
      ;(this.items || []).forEach(it => {
        if (it.type === 'subjective') return
        if (it.isCorrect === true) correct++
        else if (isBlank(it.userAnswer)) missed++
        else wrong++
      })
      return { correct, wrong, missed }
    }
  },
  onLoad(query) {
    if (!requireLogin()) return
    this.userName = getDisplayName()
    this.userRole = getLevelText()
    this.id = (query && query.id) || ''
    if (this.id) this.loadDetail()
    else {
      this.loading = false
      this.errorText = '缺少记录参数'
    }
  },
  methods: {
    loadDetail() {
      const token = uni.getStorageSync('token')
      if (!token) {
        this.loading = false
        this.errorText = '未登录或登录已失效'
        return
      }
      const surveyObj = uniCloud.importObject('survey', { customUI: true })
      surveyObj.detail({ token, id: this.id })
        .then((r) => {
          r = r || {}
          if (r.errCode !== 0) {
            this.loading = false
            this.errorText = r.errMsg || '记录加载失败'
            return
          }
          this.doc = r.doc || {}
          this.items = Array.isArray(this.doc.items) ? this.doc.items : []
          this.loading = false
        })
        .catch((err) => {
          console.error('[survey-detail] load error:', err)
          this.loading = false
          this.errorText = (err && err.errMsg) || '网络异常，加载失败'
        })
    },
    /* ---------- 展示辅助 ---------- */
    typeText(it) {
      if (it.type === 'single') return '单选题'
      if (it.type === 'multi') return '多选题'
      if (it.type === 'judge') return '判断题'
      if (it.type === 'subjective') return (it.subType === 'case' || it.caseText) ? '案例分析题' : '论述题'
      return '题目'
    },
    toKeys(v) {
      if (Array.isArray(v)) return v.map(x => String(x).trim().toUpperCase()).filter(Boolean)
      if (typeof v === 'string' && v.trim()) return [v.trim().toUpperCase()]
      return []
    },
    myKeys(it) {
      if (it.type === 'judge') return []
      return this.toKeys(it.userAnswer)
    },
    rightKeys(it) {
      if (it.type === 'judge') return []
      return this.toKeys(it.answer)
    },
    optState(it, key) {
      if (it.type === 'judge') return ''
      if (this.isRight(it, key)) return 'is-right'
      if (this.isUserPick(it, key)) return 'is-wrong'
      return ''
    },
    isRight(it, key) {
      return this.rightKeys(it).includes(key)
    },
    isUserPick(it, key) {
      return this.myKeys(it).includes(key)
    },
    verdictText(it) {
      if (it.type === 'subjective') return ''
      if (it.isCorrect === true) return '回答正确'
      if (isBlank(it.userAnswer)) return '未作答'
      return '回答错误'
    },
    verdictClass(it) {
      if (it.type === 'subjective') return ''
      if (it.isCorrect === true) return 'q-ok'
      if (isBlank(it.userAnswer)) return 'q-miss'
      return 'q-bad'
    },
    myAnsClass(it) {
      if (it.isCorrect === true) return 'is-key'
      if (isBlank(it.userAnswer)) return 'is-empty'
      return 'is-bad'
    },
    userAnswerText(it) {
      if (isBlank(it.userAnswer)) return '未作答'
      if (Array.isArray(it.userAnswer)) return it.userAnswer.join('、')
      return String(it.userAnswer)
    },
    correctText(it) {
      if (it.type === 'judge') {
        const a = it.answer
        if (a === true || a === '对') return '对'
        if (a === false || a === '错') return '错'
        return String(isBlank(a) ? '' : a)
      }
      if (Array.isArray(it.answer)) return it.answer.join('、')
      return String(isBlank(it.answer) ? '' : it.answer)
    },
    goBack() {
      const pages = getCurrentPages()
      if (pages.length > 1) uni.navigateBack()
      else uni.reLaunch({ url: '/pages/profile/profile' })
    },
    navigateTo(url) {
      uni.navigateTo({ url })
    },
    handleLogout() {
      uni.showModal({
        title: '确认退出',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            try {
              uni.removeStorageSync('token')
              uni.removeStorageSync('userInfo')
              uni.removeStorageSync('adminToken')
              uni.removeStorageSync('adminInfo')
            } catch (e) { /* ignore */ }
            uni.reLaunch({ url: '/pages/login/login' })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
/* 品牌设计变量（与其他页面保持一致） */
.sd-shell {
  --rule-primary: #2563EB;
  --rule-primary-hover: #1D4ED8;
  --rule-primary-foreground: #FFFFFF;
  --rule-primary-tint-1: #DBEAFE;
  --rule-primary-tint-2: #BFDBFE;
  --rule-primary-tint-3: #EFF6FF;
  --rule-background: #F8FAFC;
  --rule-foreground: #0F172A;
  --rule-card: #FFFFFF;
  --rule-muted: #F1F5F9;
  --rule-muted-foreground: #64748B;
  --rule-border: #E2E8F0;
  --rule-radius-small: 4px;
  --rule-radius-medium: 8px;
  --rule-radius-large: 16px;
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
  min-height: 100vh;
  background: var(--rule-background);
  color: var(--rule-foreground);
  font-family: "Inter", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* 整体布局 */
.app-shell { display: flex; min-height: 100vh; background: var(--rule-background); }

/* 侧边导航栏 */
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
.app-sidebar-logo-icon { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ls-svg-img { width: 32px; height: 32px; }
.app-sidebar-logo-text { font-size: 15px; font-weight: 600; color: var(--rule-foreground); white-space: nowrap; }

.app-sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; }
.app-nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px; border-radius: 8px;
  font-size: 14px; font-weight: 500;
  color: var(--rule-ink-2);
  transition: background 0.15s ease, color 0.15s ease;
  cursor: pointer;
}
.app-nav-item:hover { background: var(--rule-muted); color: var(--rule-foreground); }
.navi-icon { width: 20px; height: 20px; flex-shrink: 0; background: currentColor; display: inline-block; }
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
  color: var(--rule-ink-2);
  transition: background 0.15s ease, color 0.15s ease;
}
.app-sidebar-logout:hover { background: var(--state-error-tint); color: var(--state-error); }
.app-sidebar-logout-icon {
  width: 16px; height: 16px; flex-shrink: 0; background: currentColor;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>") center/contain no-repeat;
}
.app-sidebar-logout-text { font-size: 13px; font-weight: 500; }

/* 主内容区 */
.app-main { flex: 1; margin-left: 240px; display: flex; flex-direction: column; min-height: 100vh; min-width: 0; }
.app-topbar {
  height: 64px; border-bottom: 1px solid var(--rule-border);
  background: var(--rule-card);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 32px; flex-shrink: 0;
}
.app-topbar-left { display: flex; align-items: center; gap: 16px; }
.app-topbar-title { font-size: 18px; font-weight: 600; color: var(--rule-foreground); }
.app-topbar-meta { font-size: 13px; color: var(--rule-muted-foreground); }
.app-content { flex: 1; padding: 32px; }

.sd-back {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 13px; font-weight: 500; color: var(--rule-muted-foreground);
  cursor: pointer; padding: 4px 6px; border-radius: 6px;
  transition: color 0.15s ease, background 0.15s ease;
}
.sd-back:hover { color: var(--rule-primary); background: var(--rule-primary-tint-3); }
.sd-back-icon {
  width: 14px; height: 14px; background: currentColor;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'><line x1='19' y1='12' x2='5' y2='12'/><polyline points='12 19 5 12 12 5'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'><line x1='19' y1='12' x2='5' y2='12'/><polyline points='12 19 5 12 12 5'/></svg>") center/contain no-repeat;
}

/* 页面内容 */
.sd-main {
  width: 100%; max-width: 960px; margin: 0 auto;
  display: flex; flex-direction: column; gap: 20px;
}

/* 概览卡片 */
.sd-summary {
  display: flex; align-items: center; gap: 28px;
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: var(--rule-radius-large);
  padding: 28px 32px;
  box-shadow: var(--rule-shadow-1);
}
.sd-score-zone {
  width: 120px; height: 120px; border-radius: 9999px; flex-shrink: 0;
  background: conic-gradient(from 0deg, var(--rule-primary) 0deg, var(--rule-primary) 0deg, #E2E8F0 0deg);
  background: var(--rule-primary-tint-3);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  border: 6px solid var(--rule-primary-tint-1);
}
.sd-score {
  font-size: 34px; font-weight: 800; color: var(--rule-primary);
  line-height: 1; letter-spacing: -0.02em;
}
.sd-score-label { margin-top: 6px; font-size: 12px; color: var(--rule-ink-2); }
.sd-summary-body { flex: 1; display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.sd-summary-head { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.sd-mode-name { font-size: 22px; font-weight: 700; letter-spacing: -0.01em; }
.sd-level {
  display: inline-flex; align-items: center;
  padding: 3px 12px; border-radius: 9999px;
  font-size: 13px; font-weight: 600;
  background: var(--rule-muted); color: var(--rule-ink-2);
}
.sd-level-excellent { background: var(--state-success-tint); color: var(--state-success); }
.sd-level-good { background: var(--rule-primary-tint-3); color: var(--rule-primary); }
.sd-level-mid { background: var(--state-warning-tint); color: var(--state-warning); }
.sd-meta-row { display: flex; flex-wrap: wrap; gap: 8px; }
.sd-meta-chip {
  display: inline-flex; align-items: center;
  padding: 4px 12px; border-radius: 9999px;
  background: var(--rule-muted); color: var(--rule-ink-2);
  font-size: 12px; font-weight: 500;
}
.sd-stat-ok { background: var(--state-success-tint); color: var(--state-success); }
.sd-stat-bad { background: var(--state-error-tint); color: var(--state-error); }

/* 小节标题 */
.sd-section-head {
  display: flex; align-items: center; gap: 10px;
  font-size: 16px; font-weight: 600; color: var(--rule-foreground);
  margin-top: 8px;
}
.pc-accent-bar { display: inline-block; width: 3px; height: 16px; background: var(--rule-primary); border-radius: 2px; flex-shrink: 0; }

/* 空态 */
.sd-empty {
  background: var(--rule-card);
  border: 1px dashed var(--rule-border);
  border-radius: var(--rule-radius-large);
  color: var(--rule-muted-foreground);
  font-size: 14px;
  text-align: center;
  padding: 48px 24px;
}

/* 逐题卡片 */
.sd-q {
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: var(--rule-radius-large);
  padding: 24px 28px;
  box-shadow: var(--rule-shadow-1);
  border-left: 3px solid transparent;
}
.sd-q.q-ok { border-left-color: var(--state-success); }
.sd-q.q-bad { border-left-color: var(--state-error); }
.sd-q.q-miss { border-left-color: var(--rule-ink-3); }

.sd-q-head { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
.sd-q-index { font-size: 13px; font-weight: 600; color: var(--rule-ink-3); }
.sd-type-tag {
  padding: 2px 10px; border-radius: 9999px;
  background: var(--rule-primary-tint-3); color: var(--rule-primary);
  font-size: 12px; font-weight: 500;
}
.sd-verdict {
  margin-left: auto; padding: 2px 10px; border-radius: 9999px;
  font-size: 12px; font-weight: 600;
}
.sd-verdict.q-ok { background: var(--state-success-tint); color: var(--state-success); }
.sd-verdict.q-bad { background: var(--state-error-tint); color: var(--state-error); }
.sd-verdict.q-miss { background: var(--rule-muted); color: var(--rule-ink-2); }

.sd-q-title {
  display: block;
  font-size: 15px; line-height: 1.7; color: var(--rule-foreground);
  margin-bottom: 16px; white-space: pre-wrap; word-break: break-word;
}

/* 客观题选项 */
.sd-opt-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.sd-opt {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px;
  border: 1px solid var(--rule-border);
  border-radius: var(--rule-radius-medium);
  background: var(--rule-surface-2);
  transition: border-color 0.15s ease, background 0.15s ease;
}
.sd-opt-key {
  width: 24px; height: 24px; border-radius: 6px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: var(--rule-card); border: 1px solid var(--rule-border);
  font-size: 13px; font-weight: 600; color: var(--rule-ink-2);
}
.sd-opt-text { flex: 1; font-size: 14px; line-height: 1.6; color: var(--rule-foreground); min-width: 0; white-space: pre-wrap; word-break: break-word; }
.sd-opt-mark { font-size: 12px; font-weight: 500; flex-shrink: 0; }
.sd-opt.is-right {
  border-color: #86EFAC; background: var(--state-success-tint);
}
.sd-opt.is-right .sd-opt-key { border-color: var(--state-success); color: var(--state-success); background: #FFFFFF; }
.sd-opt-mark.is-right { color: var(--state-success); }
.sd-opt.is-wrong {
  border-color: #FCA5A5; background: var(--state-error-tint);
}
.sd-opt.is-wrong .sd-opt-key { border-color: var(--state-error); color: var(--state-error); background: #FFFFFF; }
.sd-opt-mark.is-wrong { color: var(--state-error); }

/* 我的答案 / 正确答案 */
.sd-ans-strip {
  display: flex; gap: 12px; flex-wrap: wrap;
  margin-top: 4px;
}
.sd-ans-cell {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 7px 14px;
  border-radius: var(--rule-radius-medium);
  border: 1px solid var(--rule-border);
  background: var(--rule-card);
}
.sd-ans-label { font-size: 12px; color: var(--rule-muted-foreground); }
.sd-ans-value { font-size: 14px; font-weight: 600; color: var(--rule-ink-2); }
.sd-ans-value.is-key { color: var(--state-success); }
.sd-ans-value.is-bad { color: var(--state-error); }
.sd-ans-value.is-empty { color: var(--rule-ink-3); font-weight: 500; }

/* 主观题 */
.sd-subj { display: flex; flex-direction: column; gap: 14px; }
.sd-case-box {
  border: 1px dashed var(--rule-border);
  border-radius: var(--rule-radius-medium);
  background: var(--rule-surface-2);
  padding: 14px 16px;
}
.sd-subj-label {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 600; color: var(--rule-ink-2);
  margin-bottom: 8px;
}
.sd-case-text { display: block; font-size: 14px; line-height: 1.8; color: var(--rule-foreground); white-space: pre-wrap; word-break: break-word; }
.sd-subj-block { padding: 14px 16px; border-radius: var(--rule-radius-medium); border: 1px solid var(--rule-border); }
.sd-subj-block:nth-of-type(2) { background: var(--rule-surface-2); }
.sd-my-ans { display: block; font-size: 14px; line-height: 1.8; color: var(--rule-foreground); white-space: pre-wrap; word-break: break-word; }
.sd-my-ans.is-empty { color: var(--rule-ink-3); }
.sd-ref-ans { display: block; font-size: 14px; line-height: 1.8; color: var(--state-success); white-space: pre-wrap; word-break: break-word; }

/* 解析 */
.sd-analysis {
  margin-top: 16px; padding: 14px 16px;
  background: var(--rule-primary-tint-3);
  border-radius: var(--rule-radius-medium);
}
.sd-analysis-label {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 600; color: var(--rule-primary);
  margin-bottom: 6px;
}
.sd-analysis-ico {
  width: 14px; height: 14px; background: var(--rule-primary);
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M12 16v-4'/><path d='M12 8h.01'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M12 16v-4'/><path d='M12 8h.01'/></svg>") center/contain no-repeat;
}
.sd-analysis-text {
  display: block;
  font-size: 14px; line-height: 1.8; color: var(--rule-ink-2);
  white-space: pre-wrap; word-break: break-word;
}

/* 窄屏适配 */
@media (max-width: 900px) {
  .app-sidebar { transform: translateX(-100%); transition: transform 0.3s ease; }
  .app-main { margin-left: 0; }
}
</style>
