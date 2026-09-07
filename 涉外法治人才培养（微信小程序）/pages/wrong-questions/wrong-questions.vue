<template>
  <view class="page-wrap">
    <!-- 状态栏安全区占位（iOS 刘海屏 / 安卓挖孔屏适配） -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 顶部导航：返回 + 标题 + 错题数量 -->
    <view class="sub-header">
      <view class="back" hover-class="bk-hover" @click="navBack" aria-label="返回">
        <view class="bk-ico"></view>
      </view>
      <text class="title">我的错题</text>
      <view class="head-count" v-if="total">{{ total }}题</view>
    </view>

    <!-- 可滚动内容区 -->
    <scroll-view scroll-y class="screen" scroll-with-animation @scrolltolower="loadMore">
      <!-- 顶部说明卡 -->
      <view class="intro reveal d1" v-if="!loading && !errorText && list.length">
        <view class="intro-ico">
          <text class="intro-ico-t">✓</text>
        </view>
        <view class="intro-txt">
          <text class="intro-title">错题回顾</text>
          <text class="intro-sub">来自历次测评中答错 / 漏答的客观题，反复练习直至掌握</text>
        </view>
      </view>

      <!-- 加载中 -->
      <view class="state-box" v-if="loading">
        <view class="state-dot"></view>
        <text class="state-text">错题整理中…</text>
      </view>

      <!-- 加载失败 -->
      <view class="state-box" v-else-if="errorText">
        <view class="state-dot err"></view>
        <text class="state-text">{{ errorText }}</text>
        <view class="retry-btn" hover-class="btn-hover" @click="reload">重新加载</view>
      </view>

      <!-- 空状态 -->
      <view class="state-box" v-else-if="!list.length">
        <view class="empty-ico">🎉</view>
        <text class="empty-title">暂无错题</text>
        <text class="empty-sub">完成一次测评后，答错的题目会自动收录到这里</text>
        <view class="go-btn" hover-class="btn-hover" @click="goAssess">去测评</view>
      </view>

      <!-- 错题卡片列表 -->
      <block v-else>
        <view class="wq-card" v-for="(it, i) in list" :key="i">
          <view class="wq-head">
            <view class="wq-no">{{ i + 1 }}</view>
            <text class="wq-type" :class="typeClass(it.type)">{{ typeText(it.type) }}</text>
            <text class="wq-verdict" :class="{ miss: isBlank(it.userAnswer) }">
              {{ isBlank(it.userAnswer) ? '未作答' : '回答错误' }}
            </text>
            <view class="wq-meta">
              <text class="wq-times" v-if="it.wrongTimes > 1">错 {{ it.wrongTimes }} 次</text>
              <text class="wq-date">{{ fmtDate(it.lastWrongDate) }}</text>
            </view>
          </view>

          <view class="wq-stem">{{ it.title }}</view>

          <!-- 案例材料 -->
          <view class="wq-case" v-if="it.caseText">
            <text class="wq-case-text">{{ it.caseText }}</text>
          </view>

          <!-- 选择题选项 -->
          <view v-if="it.type === 'single' || it.type === 'multi'" class="wq-opts">
            <view
              class="wq-opt"
              v-for="(opt, oi) in it.options"
              :key="oi"
              :class="optState(it, opt.key)"
            >
              <text class="wq-opt-key">{{ opt.key }}</text>
              <text class="wq-opt-text">{{ opt.text }}</text>
              <text class="wq-opt-tag" v-if="optState(it, opt.key) === 'is-right'">✓ 正确答案</text>
              <text class="wq-opt-tag" v-else-if="optState(it, opt.key) === 'is-wrong'">✗ 我的选择</text>
            </view>
          </view>

          <!-- 判断题对错选择 -->
          <view v-else-if="it.type === 'judge'" class="wq-judge">
            <view class="wq-j" :class="jChip('对', it)">
              <view class="wq-j-circle"><text class="wq-j-sym">✓</text></view>
              <text class="wq-j-txt">正确</text>
              <text class="wq-j-tag" v-if="jChip('对', it) === 'is-right'">正确答案</text>
              <text class="wq-j-tag" v-else-if="jChip('对', it) === 'is-wrong'">我的选择</text>
            </view>
            <view class="wq-j" :class="jChip('错', it)">
              <view class="wq-j-circle"><text class="wq-j-sym">✕</text></view>
              <text class="wq-j-txt">错误</text>
              <text class="wq-j-tag" v-if="jChip('错', it) === 'is-right'">正确答案</text>
              <text class="wq-j-tag" v-else-if="jChip('错', it) === 'is-wrong'">我的选择</text>
            </view>
          </view>

          <!-- 答案对比 -->
          <view class="wq-ans">
            <view class="wq-ans-row">
              <text class="wq-ans-lbl">我的答案</text>
              <text class="wq-ans-val" :class="{ empty: isBlank(it.userAnswer) }">{{ userAnsText(it) }}</text>
            </view>
            <view class="wq-ans-row">
              <text class="wq-ans-lbl ok">正确答案</text>
              <text class="wq-ans-val ok">{{ rightAnsText(it) }}</text>
            </view>
          </view>

          <!-- 解析 -->
          <view class="wq-anl" v-if="it.analysis">
            <view class="wq-anl-head">
              <view class="wq-anl-bar"></view>
              <text class="wq-anl-title">解析</text>
            </view>
            <text class="wq-anl-text">{{ it.analysis }}</text>
          </view>
        </view>

        <!-- 加载更多 -->
        <view class="load-more" v-if="!finished">
          <view class="lm-dot" :class="{ on: loadingMore }"></view>
          <text>{{ loadingMore ? '加载中…' : '上滑加载更多' }}</text>
        </view>
        <view class="load-end" v-else-if="list.length">— 已展示全部错题 —</view>
        <view style="height: 60rpx;"></view>
      </block>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 0,
      page: 1,
      pageSize: 20,
      total: 0,
      list: [],
      loading: true,
      loadingMore: false,
      finished: false,
      errorText: ''
    }
  },
  onShow() {
    this.statusBarHeight = this.getStatusBarHeight()
    this.reload()
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
    navBack() { uni.navigateBack({ delta: 1 }) },
    goAssess() {
      uni.switchTab({ url: '/pages/assessment-start/assessment-start' })
    },
    reload() {
      this.page = 1
      this.list = []
      this.finished = false
      this.errorText = ''
      this.loading = true
      this.fetchWrong()
    },
    loadMore() {
      if (this.loading || this.loadingMore || this.finished || this.errorText) return
      this.page++
      this.loadingMore = true
      this.fetchWrong()
    },
    async fetchWrong() {
      const token = uni.getStorageSync('token')
      if (!token) {
        this.loading = false
        this.loadingMore = false
        this.errorText = '请先登录后查看错题'
        return
      }
      try {
        const surveyObj = uniCloud.importObject('survey', { customUI: true })
        const r = await surveyObj.wrongQuestions({ token, page: this.page, pageSize: this.pageSize })
        if (r && r.errCode !== 0) {
          this.loading = false
          this.loadingMore = false
          this.errorText = r.errMsg || '错题加载失败'
          return
        }
        const rows = (r && r.list) || []
        this.list = this.page === 1 ? rows : this.list.concat(rows)
        this.total = Number(r.total) || 0
        this.finished = this.list.length >= this.total
        this.loading = false
        this.loadingMore = false
      } catch (e) {
        this.loading = false
        this.loadingMore = false
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
      return ''
    },
    typeText(it) {
      const t = it.type
      if (t === 'single') return '单选题'
      if (t === 'multi') return '多选题'
      if (t === 'judge') return '判断题'
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
      // v 取值 '对' / '错'；同时命中的优先显示正确答案标记
      const mine = !this.isBlank(it.userAnswer) && String(it.userAnswer).trim() === v
      if (this.rightAnsText(it) === v) return 'is-right'
      if (mine) return 'is-wrong'
      return ''
    },
    fmtDate(ts) {
      if (!ts) return ''
      const d = new Date(ts)
      if (isNaN(d.getTime())) return String(ts)
      const p = n => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
    }
  }
}
</script>

<style>
page {
  --brand: #5B9DF9;
  --brand-deep: #2E7BE0;
  --brand-soft: #8FB8F5;
  --blue-50: #EFF6FF;
  --blue-100: #DBEAFE;
  --blue-200: #BFDBFE;
  --blue-300: #93C5FD;
  --blue-400: #60A5FA;
  --blue-600: #2563EB;
  --ink: #16314F;
  --ink-2: #355580;
  --muted: #7A92B0;
  --muted-2: #9AAFC6;
  --line: rgba(120, 160, 210, 0.16);
  --glass: rgba(255, 255, 255, 0.6);
  --glass-2: rgba(255, 255, 255, 0.72);
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
  --r-lg: 48rpx;
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

/* 顶部导航 */
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
.head-count {
  margin-left: auto;
  min-width: 72rpx; height: 44rpx; padding: 0 18rpx;
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: var(--r-pill);
  background: linear-gradient(135deg, var(--brand), var(--blue-600));
  color: #fff; font-size: 22rpx; font-weight: 600;
  box-shadow: 0 8rpx 20rpx rgba(46,123,224,0.32);
}
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

/* 可滚动内容区 */
.screen {
  position: relative; z-index: 5;
  flex: 1 1 auto;
  min-height: 0;
  height: 0;
  padding: 8rpx 28rpx 40rpx;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
}

/* 顶部说明 */
.intro {
  display: flex; align-items: center; gap: 22rpx;
  padding: 24rpx 28rpx;
  margin-bottom: 20rpx;
  border-radius: var(--r-md);
  background: linear-gradient(135deg, rgba(255,255,255,0.86), rgba(239,246,255,0.9));
  border: 2rpx solid var(--glass-border-soft);
  box-shadow: var(--glass-shadow-sm);
}
.intro-ico {
  width: 68rpx; height: 68rpx; border-radius: 50%;
  flex-shrink: 0;
  background: linear-gradient(135deg, var(--brand), var(--blue-600));
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 10rpx 24rpx rgba(46,123,224,0.34);
}
.intro-ico-t { color: #fff; font-size: 34rpx; font-weight: 800; }
.intro-txt { flex: 1; display: flex; flex-direction: column; gap: 6rpx; }
.intro-title { font-size: 28rpx; font-weight: 700; color: var(--ink); }
.intro-sub { font-size: 22rpx; color: var(--muted); line-height: 1.5; }

/* 状态 / 空态 */
.state-box {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 120rpx 60rpx;
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
.empty-ico { font-size: 88rpx; line-height: 1; }
.empty-title { margin-top: 24rpx; font-size: 32rpx; font-weight: 700; color: var(--ink); }
.empty-sub { margin-top: 14rpx; font-size: 24rpx; color: var(--muted); line-height: 1.6; max-width: 460rpx; }
.retry-btn, .go-btn {
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

/* 错题卡片 */
.wq-card {
  position: relative;
  padding: 26rpx 28rpx 28rpx;
  margin-bottom: 22rpx;
  border-radius: var(--r-md);
  background: var(--glass-2);
  border: 2rpx solid var(--glass-border-soft);
  box-shadow: var(--glass-shadow-sm);
  overflow: hidden;
}
.wq-card::before {
  content: "";
  position: absolute;
  left: 0; top: 26rpx; bottom: 26rpx;
  width: 6rpx;
  border-radius: 0 6rpx 6rpx 0;
  background: linear-gradient(180deg, #FB7185, #F59E0B);
}

/* 头部：序号 + 题型 + 判定 */
.wq-head {
  display: flex; align-items: center;
  flex-wrap: wrap;
  gap: 12rpx;
  padding-right: 8rpx;
}
.wq-no {
  width: 44rpx; height: 44rpx;
  border-radius: 12rpx;
  background: rgba(91,157,249,0.12);
  color: var(--brand-deep);
  font-size: 24rpx; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  font-feature-settings: "tnum";
}
.wq-type {
  height: 40rpx; padding: 0 18rpx;
  border-radius: var(--r-pill);
  font-size: 20rpx; font-weight: 600;
  display: inline-flex; align-items: center;
}
.wq-type.t-single { background: var(--blue-50); color: var(--brand-deep); }
.wq-type.t-multi { background: var(--violet-soft); color: var(--violet); }
.wq-type.t-judge { background: var(--amber-soft); color: var(--amber); }
.wq-verdict {
  height: 40rpx; padding: 0 18rpx;
  border-radius: var(--r-pill);
  font-size: 20rpx; font-weight: 600;
  display: inline-flex; align-items: center;
  background: var(--rose-soft); color: var(--rose);
}
.wq-verdict.miss { background: var(--amber-soft); color: var(--amber); }
.wq-meta {
  margin-left: auto;
  display: flex; align-items: center; gap: 14rpx;
}
.wq-times {
  font-size: 20rpx; color: var(--rose);
  background: var(--rose-soft);
  height: 36rpx; padding: 0 14rpx;
  border-radius: var(--r-pill);
  display: inline-flex; align-items: center;
  font-weight: 600;
}
.wq-date { font-size: 20rpx; color: var(--muted-2); font-feature-settings: "tnum"; }

/* 题干 */
.wq-stem {
  margin-top: 22rpx;
  font-size: 30rpx; font-weight: 600; color: var(--ink);
  line-height: 1.65;
  white-space: pre-wrap;
}
.wq-case {
  margin-top: 18rpx;
  padding: 20rpx 22rpx;
  border-radius: var(--r-xs);
  background: rgba(139,92,246,0.06);
  border: 2rpx solid rgba(139,92,246,0.12);
}
.wq-case-text {
  font-size: 24rpx; color: var(--ink-2);
  line-height: 1.7;
  white-space: pre-wrap;
}

/* 选择题选项 */
.wq-opts {
  margin-top: 18rpx;
  display: flex; flex-direction: column; gap: 14rpx;
}
.wq-opt {
  display: flex; align-items: flex-start; gap: 16rpx;
  padding: 18rpx 20rpx;
  border-radius: var(--r-xs);
  background: rgba(255,255,255,0.72);
  border: 2rpx solid var(--line);
  transition: all .2s;
}
.wq-opt-key {
  flex-shrink: 0;
  width: 44rpx; height: 44rpx;
  border-radius: 50%;
  background: rgba(120,160,210,0.14);
  color: var(--ink-2);
  font-size: 24rpx; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.wq-opt-text {
  flex: 1;
  font-size: 26rpx; color: var(--ink-2);
  line-height: 1.6;
  white-space: pre-wrap;
}
.wq-opt-tag {
  flex-shrink: 0;
  font-size: 20rpx; font-weight: 600;
  margin-top: 4rpx;
  white-space: nowrap;
}
.wq-opt.is-right {
  background: rgba(34,197,94,0.09);
  border-color: rgba(34,197,94,0.4);
}
.wq-opt.is-right .wq-opt-key {
  background: var(--green);
  color: #fff;
}
.wq-opt.is-right .wq-opt-text { color: var(--green); font-weight: 600; }
.wq-opt.is-right .wq-opt-tag { color: var(--green); }
.wq-opt.is-wrong {
  background: rgba(251,113,133,0.09);
  border-color: rgba(251,113,133,0.4);
}
.wq-opt.is-wrong .wq-opt-key {
  background: var(--rose);
  color: #fff;
}
.wq-opt.is-wrong .wq-opt-text { color: var(--rose); }
.wq-opt.is-wrong .wq-opt-tag { color: var(--rose); }

/* 判断题 */
.wq-judge {
  margin-top: 18rpx;
  display: flex; gap: 18rpx;
}
.wq-j {
  flex: 1;
  display: flex; flex-direction: column; align-items: center; gap: 10rpx;
  padding: 20rpx 12rpx;
  border-radius: var(--r-xs);
  background: rgba(255,255,255,0.72);
  border: 2rpx solid var(--line);
  transition: all .2s;
}
.wq-j-circle {
  width: 56rpx; height: 56rpx; border-radius: 50%;
  background: rgba(120,160,210,0.14);
  display: flex; align-items: center; justify-content: center;
}
.wq-j-sym { font-size: 30rpx; font-weight: 800; color: var(--muted); }
.wq-j-txt { font-size: 24rpx; font-weight: 600; color: var(--ink-2); }
.wq-j-tag { font-size: 18rpx; font-weight: 600; }
.wq-j.is-right {
  background: rgba(34,197,94,0.09);
  border-color: rgba(34,197,94,0.4);
}
.wq-j.is-right .wq-j-circle { background: var(--green); }
.wq-j.is-right .wq-j-sym { color: #fff; }
.wq-j.is-right .wq-j-txt { color: var(--green); }
.wq-j.is-right .wq-j-tag { color: var(--green); }
.wq-j.is-wrong {
  background: rgba(251,113,133,0.09);
  border-color: rgba(251,113,133,0.4);
}
.wq-j.is-wrong .wq-j-circle { background: var(--rose); }
.wq-j.is-wrong .wq-j-sym { color: #fff; }
.wq-j.is-wrong .wq-j-txt { color: var(--rose); }
.wq-j.is-wrong .wq-j-tag { color: var(--rose); }

/* 答案对比 */
.wq-ans {
  margin-top: 20rpx;
  display: flex; flex-direction: column;
  border-radius: var(--r-xs);
  background: rgba(120,160,210,0.06);
  padding: 6rpx 20rpx;
}
.wq-ans-row {
  display: flex; align-items: center; gap: 18rpx;
  padding: 12rpx 0;
}
.wq-ans-row + .wq-ans-row { border-top: 2rpx solid var(--line); }
.wq-ans-lbl {
  flex-shrink: 0;
  width: 132rpx;
  font-size: 22rpx; color: var(--muted);
}
.wq-ans-lbl.ok { color: var(--green); }
.wq-ans-val {
  flex: 1;
  font-size: 26rpx; font-weight: 600; color: var(--rose);
  line-height: 1.5;
  word-break: break-all;
}
.wq-ans-val.empty { color: var(--amber); font-weight: 500; }
.wq-ans-val.ok { color: var(--green); }

/* 解析 */
.wq-anl {
  margin-top: 20rpx;
  padding: 20rpx 22rpx;
  border-radius: var(--r-xs);
  background: rgba(91,157,249,0.07);
  border: 2rpx solid rgba(91,157,249,0.14);
}
.wq-anl-head {
  display: flex; align-items: center; gap: 12rpx;
  margin-bottom: 10rpx;
}
.wq-anl-bar {
  width: 8rpx; height: 26rpx;
  border-radius: 4rpx;
  background: linear-gradient(180deg, var(--brand), var(--blue-600));
}
.wq-anl-title { font-size: 24rpx; font-weight: 700; color: var(--brand-deep); }
.wq-anl-text {
  display: block;
  font-size: 25rpx; color: var(--ink-2);
  line-height: 1.7;
  white-space: pre-wrap;
}

/* 加载更多 */
.load-more, .load-end {
  display: flex; align-items: center; justify-content: center; gap: 12rpx;
  padding: 24rpx 0 8rpx;
  font-size: 22rpx; color: var(--muted-2);
}
.lm-dot {
  width: 12rpx; height: 12rpx;
  border-radius: 50%;
  background: var(--muted-2);
}
.lm-dot.on { animation: blink 0.9s ease-in-out infinite; }

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes blink { 0%,100% { opacity: .3; } 50% { opacity: 1; } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(36rpx); } to { opacity: 1; transform: translateY(0); } }
.reveal { opacity: 0; animation: fadeUp .6s cubic-bezier(.22,1,.36,1) forwards; }
.reveal.d1 { animation-delay: .06s; }
</style>
