<template>
  <view class="page-wrap">
    <!-- 状态栏安全区占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 顶部导航 -->
    <view class="sub-header">
      <view class="back" hover-class="bk-hover" @click="navBack" aria-label="返回">
        <view class="bk-ico"></view>
      </view>
      <text class="title">测评记录详情</text>
      <view class="spacer"></view>
    </view>

    <!-- 可滚动内容区 -->
    <scroll-view scroll-y class="screen" scroll-with-animation>
      <!-- 加载中 -->
      <view class="state-box" v-if="loading">
        <view class="state-dot"></view>
        <text class="state-text">记录加载中…</text>
      </view>

      <!-- 加载失败 -->
      <view class="state-box" v-else-if="errorText">
        <view class="state-dot err"></view>
        <text class="state-text">{{ errorText }}</text>
        <view class="retry-btn" hover-class="btn-hover" @click="reload">重新加载</view>
      </view>

      <block v-else-if="doc">
        <!-- 概览卡 -->
        <view class="sum-card reveal d1">
          <view class="sum-score-wrap">
            <view class="sum-score" :class="scoreClass">
              <text class="sum-score-num">{{ score }}</text>
              <text class="sum-score-unit">分</text>
            </view>
            <view class="sum-level" :class="scoreClass">{{ level }}</view>
          </view>
          <view class="sum-info">
            <view class="sum-mode">
              <view class="sum-mode-dot"></view>
              <text>{{ modeName }}</text>
            </view>
            <view class="sum-meta-row">
              <text class="sum-meta-label">完成时间</text>
              <text class="sum-meta-val">{{ dateText }}</text>
            </view>
            <view class="sum-meta-row">
              <text class="sum-meta-label">答题用时</text>
              <text class="sum-meta-val">{{ doc.time || '--' }}</text>
            </view>
            <view class="sum-stat">
              <view class="sum-stat-item">
                <text class="sum-stat-num ok">{{ stat.correct }}</text>
                <text class="sum-stat-lbl">答对</text>
              </view>
              <view class="sum-stat-item">
                <text class="sum-stat-num bad">{{ stat.wrong }}</text>
                <text class="sum-stat-lbl">答错</text>
              </view>
              <view class="sum-stat-item">
                <text class="sum-stat-num miss">{{ stat.missed }}</text>
                <text class="sum-stat-lbl">未答</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 无逐题数据提示 -->
        <view class="no-items" v-if="!items.length">
          <text class="no-items-ico">📄</text>
          <text class="no-items-title">暂无逐题数据</text>
          <text class="no-items-sub">该记录产生较早，未保存逐题明细</text>
        </view>

        <!-- 逐题回顾 -->
        <block v-else>
          <view
            class="rd-card"
            v-for="(it, i) in items"
            :key="i"
            :class="verdictClass(it)"
          >
            <view class="rd-head">
              <view class="rd-no">{{ i + 1 }}</view>
              <text class="rd-type" :class="typeClass(it.type)">{{ typeText(it) }}</text>
              <view v-if="it.type !== 'subjective'" class="rd-verdict" :class="verdictClass(it)">
                <view class="rd-verdict-dot"></view>
                <text>{{ verdictText(it) }}</text>
              </view>
            </view>

            <view class="rd-stem">{{ it.title }}</view>

            <!-- 案例材料 -->
            <view class="rd-case" v-if="it.caseText">
              <text class="rd-case-text">{{ it.caseText }}</text>
            </view>

            <!-- 选择题选项 -->
            <view v-if="it.type === 'single' || it.type === 'multi'" class="rd-opts">
              <view
                class="rd-opt"
                v-for="(opt, oi) in it.options"
                :key="oi"
                :class="optState(it, opt.key)"
              >
                <text class="rd-opt-key">{{ opt.key }}</text>
                <text class="rd-opt-text">{{ opt.text }}</text>
                <text class="rd-opt-tag" v-if="optState(it, opt.key) === 'is-right'">✓ 正确答案</text>
                <text class="rd-opt-tag" v-else-if="optState(it, opt.key) === 'is-wrong'">✗ 我的选择</text>
              </view>
            </view>

            <!-- 判断题 -->
            <view v-else-if="it.type === 'judge'" class="rd-judge">
              <view class="rd-j" :class="jChip('对', it)">
                <view class="rd-j-circle"><text class="rd-j-sym">✓</text></view>
                <text class="rd-j-txt">正确</text>
                <text class="rd-j-tag" v-if="jChip('对', it) === 'is-right'">正确答案</text>
                <text class="rd-j-tag" v-else-if="jChip('对', it) === 'is-wrong'">我的选择</text>
              </view>
              <view class="rd-j" :class="jChip('错', it)">
                <view class="rd-j-circle"><text class="rd-j-sym">✕</text></view>
                <text class="rd-j-txt">错误</text>
                <text class="rd-j-tag" v-if="jChip('错', it) === 'is-right'">正确答案</text>
                <text class="rd-j-tag" v-else-if="jChip('错', it) === 'is-wrong'">我的选择</text>
              </view>
            </view>

            <!-- 客观题答案对比 -->
            <view v-if="it.type !== 'subjective'" class="rd-ans">
              <view class="rd-ans-row">
                <text class="rd-ans-lbl">我的答案</text>
                <text class="rd-ans-val" :class="{ empty: isBlank(it.userAnswer) }">{{ userAnsText(it) }}</text>
              </view>
              <view class="rd-ans-row">
                <text class="rd-ans-lbl ok">正确答案</text>
                <text class="rd-ans-val ok">{{ rightAnsText(it) }}</text>
              </view>
            </view>

            <!-- 主观题作答对比 -->
            <view v-else class="rd-subj">
              <view class="rd-subj-block">
                <view class="rd-subj-label">我的作答</view>
                <text class="rd-subj-text" :class="{ none: isBlank(it.userAnswer) }">
                  {{ isBlank(it.userAnswer) ? '未作答' : it.userAnswer }}
                </text>
              </view>
              <view class="rd-subj-block ref">
                <view class="rd-subj-label">参考答案</view>
                <text class="rd-subj-text" :class="{ none: isBlank(it.answer) }">
                  {{ isBlank(it.answer) ? '暂无' : it.answer }}
                </text>
              </view>
            </view>

            <!-- 解析 -->
            <view class="rd-anl" v-if="it.analysis">
              <view class="rd-anl-head">
                <view class="rd-anl-bar"></view>
                <text class="rd-anl-title">答案解析</text>
              </view>
              <text class="rd-anl-text">{{ it.analysis }}</text>
            </view>
          </view>
          <view style="height: 60rpx;"></view>
        </block>
      </block>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 0,
      id: '',
      doc: null,
      items: [],
      loading: true,
      errorText: ''
    }
  },
  computed: {
    score() {
      return this.doc ? Number(this.doc.score) || 0 : 0
    },
    level() {
      return (this.doc && this.doc.level) || '未评级'
    },
    scoreClass() {
      const s = this.score
      if (s >= 90) return 'lv-high'
      if (s >= 70) return 'lv-mid'
      if (s >= 60) return 'lv-low'
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
      const p = n => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
    },
    stat() {
      let correct = 0
      let wrong = 0
      let missed = 0
      ;(this.items || []).forEach(it => {
        if (it.type === 'subjective') return
        if (it.isCorrect === true) correct++
        else if (this.isBlank(it.userAnswer)) missed++
        else wrong++
      })
      return { correct, wrong, missed }
    }
  },
  onLoad(options) {
    this.statusBarHeight = this.getStatusBarHeight()
    this.id = (options && options.id) || ''
    if (this.id) this.loadDetail()
    else {
      this.loading = false
      this.errorText = '缺少记录参数'
    }
  },
  methods: {
    getStatusBarHeight() {
      try {
        return uni.getWindowInfo().statusBarHeight || 0
      } catch (e) {
        try {
          return uni.getSystemInfoSync().statusBarHeight || 0
        } catch (err) {
          return 0
        }
      }
    },
    navBack() {
      const pages = getCurrentPages()
      if (pages.length > 1) uni.navigateBack()
      else uni.switchTab({ url: '/pages/data/data' })
    },
    reload() {
      this.loading = true
      this.errorText = ''
      this.loadDetail()
    },
    async loadDetail() {
      const token = uni.getStorageSync('token')
      if (!token) {
        this.loading = false
        this.errorText = '未登录或登录已失效'
        return
      }
      try {
        const surveyObj = uniCloud.importObject('survey', { customUI: true })
        const r = await surveyObj.detail({ token, id: this.id })
        if (r && r.errCode !== 0) {
          this.loading = false
          this.errorText = r.errMsg || '记录加载失败'
          return
        }
        this.doc = (r && r.doc) || {}
        this.items = Array.isArray(this.doc.items) ? this.doc.items : []
        this.loading = false
      } catch (e) {
        this.loading = false
        this.errorText = (e && e.errMsg) || '网络异常，加载失败'
      }
    },

    /* ---------- 展示辅助 ---------- */
    isBlank(v) {
      return v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length)
    },
    typeClass(t) {
      if (t === 'single') return 't-single'
      if (t === 'multi') return 't-multi'
      if (t === 'judge') return 't-judge'
      if (t === 'subjective') return 't-subj'
      return ''
    },
    typeText(it) {
      if (it.type === 'single') return '单选题'
      if (it.type === 'multi') return '多选题'
      if (it.type === 'judge') return '判断题'
      if (it.type === 'subjective') return it.subType === 'case' || it.caseText ? '案例分析题' : '论述题'
      return '题目'
    },
    verdictText(it) {
      if (it.isCorrect === true) return '回答正确'
      if (this.isBlank(it.userAnswer)) return '未作答'
      return '回答错误'
    },
    verdictClass(it) {
      if (it.type === 'subjective') return ''
      if (it.isCorrect === true) return 'is-ok'
      if (this.isBlank(it.userAnswer)) return 'is-miss'
      return 'is-bad'
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
    isRight(it, key) {
      return this.rightKeys(it).indexOf(String(key).trim().toUpperCase()) >= 0
    },
    isUserPick(it, key) {
      return this.myKeys(it).indexOf(String(key).trim().toUpperCase()) >= 0
    },
    optState(it, key) {
      if (it.type === 'judge') return ''
      if (this.isRight(it, key)) return 'is-right'
      if (this.isUserPick(it, key)) return 'is-wrong'
      return ''
    },
    userAnsText(it) {
      if (this.isBlank(it.userAnswer)) return '未作答'
      if (Array.isArray(it.userAnswer)) return it.userAnswer.join('、')
      return String(it.userAnswer)
    },
    rightAnsText(it) {
      if (it.type === 'judge') {
        const a = it.answer
        if (a === true || a === '对') return '对'
        if (a === false || a === '错') return '错'
        return String(this.isBlank(a) ? '' : a)
      }
      if (Array.isArray(it.answer)) return it.answer.join('、')
      return String(this.isBlank(it.answer) ? '' : it.answer)
    },
    jChip(v, it) {
      const mine = !this.isBlank(it.userAnswer) && String(it.userAnswer).trim() === v
      if (this.rightAnsText(it) === v) return 'is-right'
      if (mine) return 'is-wrong'
      return ''
    }
  }
}
</script>

<style>
page {
  --brand: #5B9DF9;
  --brand-deep: #2E7BE0;
  --blue-50: #EFF6FF;
  --blue-100: #DBEAFE;
  --blue-200: #BFDBFE;
  --blue-600: #2563EB;
  --ink: #16314F;
  --ink-2: #355580;
  --muted: #7A92B0;
  --muted-2: #9AAFC6;
  --line: rgba(120, 160, 210, 0.16);
  --glass: rgba(255, 255, 255, 0.6);
  --glass-2: rgba(255, 255, 255, 0.75);
  --glass-border: rgba(255, 255, 255, 0.75);
  --glass-border-soft: rgba(255, 255, 255, 0.5);
  --glass-shadow: 0 20rpx 68rpx rgba(46, 123, 224, 0.12);
  --glass-shadow-sm: 0 12rpx 36rpx rgba(46, 123, 224, 0.08);
  --green: #16A34A;
  --green-soft: rgba(34, 197, 94, 0.14);
  --rose: #E11D48;
  --rose-soft: rgba(251, 113, 133, 0.14);
  --amber: #D97706;
  --amber-soft: rgba(245, 158, 11, 0.16);
  --violet: #7C3AED;
  --violet-soft: rgba(139, 92, 246, 0.14);
  --r-xs: 20rpx;
  --r-sm: 28rpx;
  --r-md: 36rpx;
  --r-pill: 999rpx;
}

.page-wrap {
  height: 100vh;
  background: linear-gradient(160deg, #EAF3FF 0%, #F4F9FF 45%, #E6F1FE 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
page { height: 100vh; overflow: hidden; }
.page-wrap::before,
.page-wrap::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  filter: blur(140rpx);
  z-index: 0;
  pointer-events: none;
}
.page-wrap::before {
  width: 520rpx; height: 520rpx;
  background: radial-gradient(circle, rgba(91,157,249,0.34), transparent 70%);
  top: -120rpx; left: -100rpx;
}
.page-wrap::after {
  width: 600rpx; height: 600rpx;
  background: radial-gradient(circle, rgba(6,182,212,0.18), transparent 70%);
  bottom: 60rpx; right: -180rpx;
}

.status-bar { width: 100%; flex-shrink: 0; background: transparent; }

.sub-header {
  position: relative; z-index: 45;
  flex-shrink: 0;
  display: flex; align-items: center;
  padding: 20rpx 28rpx 18rpx;
  gap: 10rpx;
  background: linear-gradient(180deg, rgba(234,243,255,0.96) 0%, rgba(244,249,255,0.9) 78%, rgba(244,249,255,0) 100%);
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
}
.sub-header .title { font-size: 34rpx; font-weight: 700; color: var(--ink); letter-spacing: .5rpx; }
.sub-header .spacer { flex: 1; }
.back {
  display: flex; align-items: center; justify-content: center;
  width: 80rpx; height: 80rpx;
  color: var(--ink-2);
  flex-shrink: 0;
}
.bk-hover { opacity: 0.55; }
.bk-ico {
  width: 40rpx; height: 40rpx;
  background: var(--ink-2);
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='19' y1='12' x2='5' y2='12'/%3E%3Cpolyline points='12 19 5 12 12 5'/%3E%3C/svg%3E") center/contain no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='19' y1='12' x2='5' y2='12'/%3E%3Cpolyline points='12 19 5 12 12 5'/%3E%3C/svg%3E") center/contain no-repeat;
}

.screen {
  position: relative; z-index: 5;
  flex: 1 1 auto;
  min-height: 0;
  height: 0;
  padding: 8rpx 28rpx 40rpx;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
}

/* 状态 */
.state-box {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 140rpx 60rpx;
  text-align: center;
}
.state-dot {
  width: 76rpx; height: 76rpx; border-radius: 50%;
  border: 6rpx solid var(--blue-200);
  border-top-color: var(--brand);
  animation: spin 0.9s linear infinite;
}
.state-dot.err { border-color: var(--rose-soft); border-top-color: var(--rose); animation: none; }
.state-text { margin-top: 28rpx; font-size: 26rpx; color: var(--muted); }
.retry-btn {
  margin-top: 40rpx;
  height: 76rpx; padding: 0 56rpx;
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: var(--r-pill);
  font-size: 28rpx; font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, var(--brand), var(--blue-600));
  box-shadow: 0 14rpx 32rpx rgba(46,123,224,0.34);
}
.btn-hover { transform: scale(0.96); opacity: 0.9; }

/* 概览卡 */
.sum-card {
  display: flex; align-items: center; gap: 28rpx;
  padding: 30rpx 28rpx;
  margin-bottom: 22rpx;
  border-radius: var(--r-md);
  background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(239,246,255,0.92));
  border: 2rpx solid var(--glass-border-soft);
  box-shadow: var(--glass-shadow);
  overflow: hidden;
}
.sum-score-wrap {
  flex-shrink: 0;
  display: flex; flex-direction: column; align-items: center; gap: 10rpx;
}
.sum-score {
  width: 148rpx; height: 148rpx;
  border-radius: 50%;
  display: flex; align-items: baseline; justify-content: center;
  gap: 2rpx;
  border: 8rpx solid rgba(120,160,210,0.2);
  background: rgba(255,255,255,0.6);
}
.sum-score.lv-high { border-color: rgba(34,197,94,0.45); }
.sum-score.lv-mid { border-color: rgba(91,157,249,0.45); }
.sum-score.lv-low { border-color: rgba(245,158,11,0.45); }
.sum-score-num { font-size: 52rpx; font-weight: 800; color: var(--ink); font-feature-settings: "tnum"; }
.sum-score-unit { font-size: 22rpx; font-weight: 600; color: var(--muted); }
.sum-level {
  height: 40rpx; padding: 0 22rpx;
  border-radius: var(--r-pill);
  font-size: 20rpx; font-weight: 700;
  background: var(--blue-50); color: var(--brand-deep);
}
.sum-level.lv-high { background: var(--green-soft); color: var(--green); }
.sum-level.lv-mid { background: var(--blue-50); color: var(--brand-deep); }
.sum-level.lv-low { background: var(--amber-soft); color: var(--amber); }

.sum-info { flex: 1; min-width: 0; }
.sum-mode {
  display: flex; align-items: center; gap: 10rpx;
  font-size: 30rpx; font-weight: 700; color: var(--ink);
}
.sum-mode-dot {
  width: 14rpx; height: 14rpx; border-radius: 50%;
  background: linear-gradient(135deg, var(--brand), var(--blue-600));
  box-shadow: 0 0 0 6rpx rgba(91,157,249,0.16);
}
.sum-meta-row {
  display: flex; align-items: center; gap: 14rpx;
  margin-top: 12rpx;
}
.sum-meta-label { font-size: 22rpx; color: var(--muted); flex-shrink: 0; }
.sum-meta-val { font-size: 22rpx; color: var(--ink-2); font-feature-settings: "tnum"; }
.sum-stat {
  display: flex; gap: 16rpx;
  margin-top: 16rpx;
}
.sum-stat-item {
  flex: 1;
  display: flex; flex-direction: column; align-items: center; gap: 2rpx;
  padding: 10rpx 0;
  border-radius: var(--r-xs);
  background: rgba(255,255,255,0.6);
  border: 2rpx solid var(--line);
}
.sum-stat-num { font-size: 30rpx; font-weight: 800; font-feature-settings: "tnum"; }
.sum-stat-num.ok { color: var(--green); }
.sum-stat-num.bad { color: var(--rose); }
.sum-stat-num.miss { color: var(--amber); }
.sum-stat-lbl { font-size: 18rpx; color: var(--muted); }

/* 无逐题数据 */
.no-items {
  display: flex; flex-direction: column; align-items: center;
  padding: 120rpx 40rpx;
  text-align: center;
}
.no-items-ico { font-size: 72rpx; line-height: 1; }
.no-items-title { margin-top: 22rpx; font-size: 30rpx; font-weight: 700; color: var(--ink); }
.no-items-sub { margin-top: 12rpx; font-size: 24rpx; color: var(--muted); }

/* 逐题卡片 */
.rd-card {
  position: relative;
  padding: 26rpx 28rpx 28rpx;
  margin-bottom: 22rpx;
  border-radius: var(--r-md);
  background: var(--glass-2);
  border: 2rpx solid var(--glass-border-soft);
  box-shadow: var(--glass-shadow-sm);
  overflow: hidden;
}
.rd-card::before {
  content: "";
  position: absolute;
  left: 0; top: 26rpx; bottom: 26rpx;
  width: 6rpx;
  border-radius: 0 6rpx 6rpx 0;
}
.rd-card.is-ok::before { background: linear-gradient(180deg, #22C55E, #16A34A); }
.rd-card.is-bad::before { background: linear-gradient(180deg, #FB7185, #E11D48); }
.rd-card.is-miss::before { background: linear-gradient(180deg, #FBBF24, #D97706); }

.rd-head {
  display: flex; align-items: center;
  flex-wrap: wrap;
  gap: 12rpx;
  padding-right: 8rpx;
}
.rd-no {
  width: 44rpx; height: 44rpx;
  border-radius: 12rpx;
  background: rgba(91,157,249,0.12);
  color: var(--brand-deep);
  font-size: 24rpx; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  font-feature-settings: "tnum";
}
.rd-type {
  height: 40rpx; padding: 0 18rpx;
  border-radius: var(--r-pill);
  font-size: 20rpx; font-weight: 600;
  display: inline-flex; align-items: center;
}
.rd-type.t-single { background: var(--blue-50); color: var(--brand-deep); }
.rd-type.t-multi { background: var(--violet-soft); color: var(--violet); }
.rd-type.t-judge { background: var(--amber-soft); color: var(--amber); }
.rd-type.t-subj { background: rgba(6,182,212,0.12); color: #0E7490; }
.rd-verdict {
  display: inline-flex; align-items: center; gap: 8rpx;
  height: 40rpx; padding: 0 18rpx;
  border-radius: var(--r-pill);
  font-size: 20rpx; font-weight: 600;
}
.rd-verdict-dot { width: 10rpx; height: 10rpx; border-radius: 50%; }
.rd-verdict.is-ok { background: var(--green-soft); color: var(--green); }
.rd-verdict.is-ok .rd-verdict-dot { background: var(--green); }
.rd-verdict.is-bad { background: var(--rose-soft); color: var(--rose); }
.rd-verdict.is-bad .rd-verdict-dot { background: var(--rose); }
.rd-verdict.is-miss { background: var(--amber-soft); color: var(--amber); }
.rd-verdict.is-miss .rd-verdict-dot { background: var(--amber); }

.rd-stem {
  margin-top: 22rpx;
  font-size: 30rpx; font-weight: 600; color: var(--ink);
  line-height: 1.65;
  white-space: pre-wrap;
}
.rd-case {
  margin-top: 18rpx;
  padding: 20rpx 22rpx;
  border-radius: var(--r-xs);
  background: rgba(139,92,246,0.06);
  border: 2rpx solid rgba(139,92,246,0.12);
}
.rd-case-text {
  font-size: 24rpx; color: var(--ink-2);
  line-height: 1.7;
  white-space: pre-wrap;
}

/* 选项 */
.rd-opts {
  margin-top: 18rpx;
  display: flex; flex-direction: column; gap: 14rpx;
}
.rd-opt {
  display: flex; align-items: flex-start; gap: 16rpx;
  padding: 18rpx 20rpx;
  border-radius: var(--r-xs);
  background: rgba(255,255,255,0.72);
  border: 2rpx solid var(--line);
  transition: all .2s;
}
.rd-opt-key {
  flex-shrink: 0;
  width: 44rpx; height: 44rpx;
  border-radius: 50%;
  background: rgba(120,160,210,0.14);
  color: var(--ink-2);
  font-size: 24rpx; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.rd-opt-text {
  flex: 1;
  font-size: 26rpx; color: var(--ink-2);
  line-height: 1.6;
  white-space: pre-wrap;
}
.rd-opt-tag {
  flex-shrink: 0;
  font-size: 20rpx; font-weight: 600;
  margin-top: 4rpx;
  white-space: nowrap;
}
.rd-opt.is-right {
  background: rgba(34,197,94,0.09);
  border-color: rgba(34,197,94,0.4);
}
.rd-opt.is-right .rd-opt-key { background: var(--green); color: #fff; }
.rd-opt.is-right .rd-opt-text { color: var(--green); font-weight: 600; }
.rd-opt.is-right .rd-opt-tag { color: var(--green); }
.rd-opt.is-wrong {
  background: rgba(251,113,133,0.09);
  border-color: rgba(251,113,133,0.4);
}
.rd-opt.is-wrong .rd-opt-key { background: var(--rose); color: #fff; }
.rd-opt.is-wrong .rd-opt-text { color: var(--rose); }
.rd-opt.is-wrong .rd-opt-tag { color: var(--rose); }

/* 判断题 */
.rd-judge {
  margin-top: 18rpx;
  display: flex; gap: 18rpx;
}
.rd-j {
  flex: 1;
  display: flex; flex-direction: column; align-items: center; gap: 10rpx;
  padding: 20rpx 12rpx;
  border-radius: var(--r-xs);
  background: rgba(255,255,255,0.72);
  border: 2rpx solid var(--line);
  transition: all .2s;
}
.rd-j-circle {
  width: 56rpx; height: 56rpx; border-radius: 50%;
  background: rgba(120,160,210,0.14);
  display: flex; align-items: center; justify-content: center;
}
.rd-j-sym { font-size: 30rpx; font-weight: 800; color: var(--muted); }
.rd-j-txt { font-size: 24rpx; font-weight: 600; color: var(--ink-2); }
.rd-j-tag { font-size: 18rpx; font-weight: 600; }
.rd-j.is-right {
  background: rgba(34,197,94,0.09);
  border-color: rgba(34,197,94,0.4);
}
.rd-j.is-right .rd-j-circle { background: var(--green); }
.rd-j.is-right .rd-j-sym { color: #fff; }
.rd-j.is-right .rd-j-txt { color: var(--green); }
.rd-j.is-right .rd-j-tag { color: var(--green); }
.rd-j.is-wrong {
  background: rgba(251,113,133,0.09);
  border-color: rgba(251,113,133,0.4);
}
.rd-j.is-wrong .rd-j-circle { background: var(--rose); }
.rd-j.is-wrong .rd-j-sym { color: #fff; }
.rd-j.is-wrong .rd-j-txt { color: var(--rose); }
.rd-j.is-wrong .rd-j-tag { color: var(--rose); }

/* 客观答案对比 */
.rd-ans {
  margin-top: 20rpx;
  display: flex; flex-direction: column;
  border-radius: var(--r-xs);
  background: rgba(120,160,210,0.06);
  padding: 6rpx 20rpx;
}
.rd-ans-row {
  display: flex; align-items: center; gap: 18rpx;
  padding: 12rpx 0;
}
.rd-ans-row + .rd-ans-row { border-top: 2rpx solid var(--line); }
.rd-ans-lbl {
  flex-shrink: 0;
  width: 132rpx;
  font-size: 22rpx; color: var(--muted);
}
.rd-ans-lbl.ok { color: var(--green); }
.rd-ans-val {
  flex: 1;
  font-size: 26rpx; font-weight: 600; color: var(--rose);
  line-height: 1.5;
  word-break: break-all;
}
.rd-ans-val.empty { color: var(--amber); font-weight: 500; }
.rd-ans-val.ok { color: var(--green); }

/* 主观题 */
.rd-subj {
  margin-top: 20rpx;
  display: flex; flex-direction: column; gap: 16rpx;
}
.rd-subj-block {
  padding: 18rpx 20rpx;
  border-radius: var(--r-xs);
  background: rgba(255,255,255,0.6);
  border: 2rpx solid var(--line);
}
.rd-subj-block.ref {
  background: rgba(34,197,94,0.05);
  border-color: rgba(34,197,94,0.22);
}
.rd-subj-label {
  font-size: 22rpx; font-weight: 700;
  color: var(--ink-2);
  margin-bottom: 10rpx;
}
.rd-subj-block.ref .rd-subj-label { color: var(--green); }
.rd-subj-text {
  display: block;
  font-size: 25rpx; color: var(--ink-2);
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-all;
}
.rd-subj-text.none { color: var(--muted-2); }

/* 解析 */
.rd-anl {
  margin-top: 20rpx;
  padding: 20rpx 22rpx;
  border-radius: var(--r-xs);
  background: rgba(91,157,249,0.07);
  border: 2rpx solid rgba(91,157,249,0.14);
}
.rd-anl-head {
  display: flex; align-items: center; gap: 12rpx;
  margin-bottom: 10rpx;
}
.rd-anl-bar {
  width: 8rpx; height: 26rpx;
  border-radius: 4rpx;
  background: linear-gradient(180deg, var(--brand), var(--blue-600));
}
.rd-anl-title { font-size: 24rpx; font-weight: 700; color: var(--brand-deep); }
.rd-anl-text {
  display: block;
  font-size: 25rpx; color: var(--ink-2);
  line-height: 1.7;
  white-space: pre-wrap;
}

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(36rpx); } to { opacity: 1; transform: translateY(0); } }
.reveal { opacity: 0; animation: fadeUp .6s cubic-bezier(.22,1,.36,1) forwards; }
.reveal.d1 { animation-delay: .06s; }
</style>
