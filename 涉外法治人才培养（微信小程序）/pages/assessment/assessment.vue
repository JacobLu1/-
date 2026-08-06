<template>
  <view class="page-wrap">
    <!-- 状态栏安全区占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 固定答题区：整页固定，无需上下滚动 -->
    <view class="quiz-area">
      <!-- 合并卡片：倒计时 + 题号导航 + 进度 + 题目内容 -->
      <view class="q-card" :class="cardAnimClass">
        <!-- 顶部信息行：倒计时 + 题号导航 + 标记 -->
        <view class="quiz-head">
        <view class="countdown-block" :class="{ urgent: isUrgent }" aria-live="polite">
          <view class="cd-label">
            <text class="cd-ico ri-time-line"></text>
            <text>剩余时间</text>
          </view>
          <view class="cd-time num">{{ formatTime(totalSec) }}</view>
          <view class="cd-sub">总时长 45 分钟</view>
        </view>
        <view class="nav-block">
          <view class="nav-head">
            <text class="qt">第 <text class="num">{{ current }}</text> / {{ total }} 题</text>
            <view class="legend">
              <view class="legend-item">
                <text class="dot b"></text>
                <text>当前</text>
              </view>
              <view class="legend-item">
                <text class="dot g"></text>
                <text>已答</text>
              </view>
              <view class="legend-item">
                <text class="dot a"></text>
                <text>标记</text>
              </view>
            </view>
          </view>
          <view class="bubbles" role="group" aria-label="题号导航">
            <view 
              class="bubble" 
              v-for="(q, i) in questions" 
              :key="i"
              :class="{ 
                current: current === q.n, 
                answered: isAnswered(q.n), 
                flagged: flagged.has(q.n) 
              }"
              :style="{ animationDelay: (0.04 * i + 0.12) + 's' }"
              @click="goTo(q.n)"
            >
              {{ q.n }}
            </view>
          </view>
        </view>
        <view class="flag-btn" :class="{ on: flagged.has(current) }" @click="toggleFlag">
          <text class="flag-ico ri-flag-line"></text>
        </view>
        </view>

        <!-- 作答进度 -->
        <view class="prog-wrap">
          <view class="prog">
            <view class="prog-fill" :style="{ width: answeredCount + '%' }"></view>
          </view>
          <view class="prog-meta">
            <text>作答进度</text>
            <text><text class="num">{{ answeredNum }}</text> / {{ total }} 已作答</text>
          </view>
        </view>

        <!-- 分隔线 -->
        <view class="q-divider"></view>

        <!-- 题型与题目 -->
        <view class="q-top">
          <view class="q-type-row">
            <text class="chip" :class="chipClass(currentQ.type)">{{ currentQ.type }}</text>
          </view>
        </view>
        <view class="q-stem">{{ currentQ.stem }}</view>
        
        <!-- 单选/多选 -->
        <view v-if="currentQ.type === '单选题' || currentQ.type === '多选题'" class="q-opts" role="radiogroup" :aria-label="currentQ.type + '选项'">
          <view 
            class="opt" 
            v-for="(opt, i) in currentQ.options" 
            :key="i"
            :class="{ selected: isOptSelected(i) }"
            @click="selectOpt(i)"
          >
            <text class="badge">{{ letters[i] }}</text>
            <text class="txt">{{ opt }}</text>
            <text class="check-ico ri-check-line" v-if="isOptSelected(i)"></text>
          </view>
        </view>

        <!-- 判断题 -->
        <view v-else-if="currentQ.type === '判断题'" class="judge-opts" role="radiogroup" aria-label="判断题选项">
          <view 
            class="judge true" 
            :class="{ selected: answers[current] === '正确' }"
            @click="selectJudge('正确')"
          >
            <text class="j-ico ri-check-line"></text>
            <text class="lbl">正确</text>
          </view>
          <view 
            class="judge false" 
            :class="{ selected: answers[current] === '错误' }"
            @click="selectJudge('错误')"
          >
            <text class="j-ico ri-close-line"></text>
            <text class="lbl">错误</text>
          </view>
        </view>

        <!-- 主观题 -->
        <view v-else-if="currentQ.type === '主观题'" class="subj-wrap">
          <textarea 
            class="subj" 
            v-model="answers[current]" 
            :maxlength="currentQ.maxLen" 
            placeholder="请在此作答……" 
            :placeholder-style="{ color: 'var(--muted-2)' }"
            auto-height
          />
          <view class="subj-foot">
            <text class="subj-hint">建议条理清晰、要点明确</text>
            <text class="subj-count" :class="{ over: answers[current] && answers[current].length >= currentQ.maxLen }">
              {{ (answers[current] || '').length }}/{{ currentQ.maxLen }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="action-bar">
      <view 
        class="ab-btn exit" 
        @click="showExitModal"
      >
        <text class="ab-ico ri-logout-box-r-line"></text>
        退出
      </view>
      <view 
        class="ab-btn ghost" 
        :class="{ disabled: current === 1 }"
        @click="goPrev"
      >
        <text class="ab-ico">‹</text>
        上一题
      </view>
      <view 
        class="ab-btn primary" 
        :class="{ submit: current === total }"
        @click="goNextOrSubmit"
      >
        {{ current === total ? '交卷' : '下一题' }}
        <text v-if="current !== total" class="ab-ico">›</text>
      </view>
    </view>

    <!-- 提交弹窗 -->
    <view class="modal-backdrop" :class="{ show: showModal }" @click.self="closeModal">
      <view class="modal">
        <view class="m-ico">⚠</view>
        <view class="m-title">确认提交试卷？</view>
        <view class="m-sub">已作答 <text class="num">{{ answeredNum }}</text> 题，未作答 <text class="num">{{ total - answeredNum }}</text> 题，提交后将无法继续作答。</view>
        <view class="m-actions">
          <view class="btn btn-ghost" @click="closeModal">取消</view>
          <view class="btn btn-primary" @click="submitPaper">提交</view>
        </view>
      </view>
    </view>

    <!-- 退出确认弹窗 -->
    <view class="modal-backdrop" :class="{ show: showExitConfirm }" @click.self="closeExitModal">
      <view class="modal">
        <view class="m-ico exit">⚠</view>
        <view class="m-title">确认退出测评？</view>
        <view class="m-sub">当前作答记录将被清除，退出后无法恢复。</view>
        <view class="m-actions">
          <view class="btn btn-ghost" @click="closeExitModal">继续作答</view>
          <view class="btn btn-rose" @click="confirmExit">确认退出</view>
        </view>
      </view>
    </view>

    <!-- Toast -->
    <view class="toast" :class="{ show: showToast }">
      <text class="t-ico ri-checkbox-circle-line"></text>
      <view class="t-txt">试卷已提交，成绩生成中</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 0,
      total: 10,
      current: 1,
      totalSec: 23 * 60 + 45,
      cdTimer: null,
      questions: [
        { n:1, type:'单选题', stem:'根据《承认及执行外国仲裁裁决公约》（《纽约公约》），下列哪项不属于缔约国可拒绝承认与执行外国仲裁裁决的情形？', options:['仲裁协议依其适用法律为无效','败诉方未能获得指定仲裁员或进行仲裁程序的适当通知','仲裁庭的组成与当事人约定不符','仲裁裁决在实体法律适用上存在错误'], multi:false },
        { n:2, type:'多选题', stem:'关于国际商事仲裁的管辖权，下列表述正确的有？', options:['仲裁庭有权对其管辖权异议作出决定','仲裁协议独立于主合同而存在','当事人可在仲裁程序中提出管辖权异议','仲裁庭的管辖权最终源于当事人的仲裁协议','法院在任何情形下均不得对仲裁管辖权进行任何审查'], multi:true },
        { n:3, type:'判断题', stem:'WTO 争端解决机构（DSB）通过的上诉机构报告与专家组报告对争端当事成员具有约束力，成员方应予执行。' },
        { n:4, type:'主观题', stem:'请简述跨境数据流动合规审查的主要步骤。', maxLen:500 },
        { n:5, type:'单选题', stem:'根据《联合国国际货物销售合同公约》（CISG），下列哪种情形构成卖方交付的货物与合同不符？', options:['货物数量短少','货物包装不符合约定方式','货物未按约定时间交付','以上情形均构成货物与合同不符'], multi:false },
        { n:6, type:'多选题', stem:'关于国际私法中的冲突规范，下列表述正确的有？', options:['冲突规范属于间接规范','冲突规范需通过连接点确定准据法','冲突规范直接规定当事人的实体权利义务','识别是适用冲突规范的前提','反致是冲突规范适用中的常见问题'], multi:true },
        { n:7, type:'判断题', stem:'法律英语中以 "without prejudice" 标记的通信内容，通常可在后续诉讼中作为对己方不利的证据使用。' },
        { n:8, type:'主观题', stem:'请论述涉外民事诉讼中协议管辖的成立条件及其限制。', maxLen:500 },
        { n:9, type:'单选题', stem:'在比较法研究中，下列哪项不属于大陆法系的典型特征？', options:['法官造法具有核心地位','成文法典体系化','法学理论具有权威性','民法典作为法律渊源的核心'], multi:false },
        { n:10, type:'多选题', stem:'关于数据跨境流动的法律规制，下列表述正确的有？', options:['我国《个人信息保护法》对个人信息出境设有明确规则','欧盟 GDPR 采用充分性决定机制','关键信息基础设施运营者数据出境受严格限制','个人信息出境可通过安全评估或签订标准合同等途径','跨境数据流动目前已实现完全自由化'], multi:true }
      ],
      answers: {},
      flagged: new Set(),
      letters: ['A','B','C','D','E'],
      cardAnimClass: '',
      animating: false,
      showModal: false,
      showToast: false,
      countdownStarted: false,
      showExitConfirm: false,
      startTime: null
    }
  },
  computed: {
    currentQ() { return this.questions[this.current - 1] },
    isUrgent() { return this.totalSec <= 300 && this.totalSec > 0 },
    answeredNum() {
      let count = 0
      for (let n = 1; n <= this.total; n++) {
        if (this.isAnswered(n)) count++
      }
      return count
    },
    answeredCount() { return (this.answeredNum / this.total) * 100 }
  },
  onLoad(options) {
    // 只有从"开始测评"页面进入时才启动倒计时
    if (options.fromStart === 'true') {
      this.startCountdown()
      this.startTime = Date.now()
    }
  },
  onReady() {
    // 顶部安全区适配：动态获取系统状态栏高度
    this.statusBarHeight = this.getStatusBarHeight()
    this.initAnswers()
  },
  onUnload() {
    if (this.cdTimer) clearInterval(this.cdTimer)
  },
  methods: {
    startCountdown() {
      if (this.countdownStarted) return
      this.countdownStarted = true
      this.cdTimer = setInterval(() => {
        if (this.totalSec <= 0) {
          clearInterval(this.cdTimer)
          return
        }
        this.totalSec--
      }, 1000)
    },
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
    initAnswers() {
      this.questions.forEach(q => {
        if (q.type === '多选题') this.$set(this.answers, q.n, [])
        else if (q.type === '主观题') this.$set(this.answers, q.n, '')
        else this.$set(this.answers, q.n, null)
      })
    },
    formatTime(sec) {
      const m = String(Math.floor(sec / 60)).padStart(2, '0')
      const s = String(sec % 60).padStart(2, '0')
      return m + ':' + s
    },
    chipClass(type) {
      return { '': '单选题', violet: '多选题', green: '判断题', amber: '主观题' }[type] || ''
    },
    isAnswered(n) {
      const a = this.answers[n]
      if (Array.isArray(a)) return a.length > 0
      if (typeof a === 'string') return a.trim().length > 0
      return a !== null && a !== undefined
    },
    isOptSelected(i) {
      const a = this.answers[this.current]
      if (this.currentQ.multi) return a.indexOf(i) >= 0
      return a === i
    },
    selectOpt(i) {
      if (this.animating) return
      if (this.currentQ.multi) {
        const arr = this.answers[this.current]
        const pos = arr.indexOf(i)
        if (pos >= 0) arr.splice(pos, 1)
        else arr.push(i)
        this.$forceUpdate()
      } else {
        this.$set(this.answers, this.current, i)
      }
    },
    selectJudge(v) {
      this.$set(this.answers, this.current, v)
    },
    toggleFlag() {
      if (this.flagged.has(this.current)) this.flagged.delete(this.current)
      else this.flagged.add(this.current)
      this.$forceUpdate()
    },
    goTo(n) {
      if (n === this.current || this.animating) return
      this.go(n, n > this.current ? 'next' : 'prev')
    },
    go(target, dir) {
      if (this.animating || target === this.current) return
      this.animating = true
      this.cardAnimClass = dir === 'next' ? 'slide-out-left' : 'slide-out-right'
      setTimeout(() => {
        this.current = target
        this.cardAnimClass = dir === 'next' ? 'slide-in-right' : 'slide-in-left'
        setTimeout(() => {
          this.cardAnimClass = ''
          this.animating = false
        }, 340)
      }, 250)
    },
    goPrev() {
      if (this.current > 1) this.go(this.current - 1, 'prev')
    },
    goNextOrSubmit() {
      if (this.current < this.total) this.go(this.current + 1, 'next')
      else this.openModal()
    },
    openModal() { this.showModal = true },
    closeModal() { this.showModal = false },
    showExitModal() { this.showExitConfirm = true },
    closeExitModal() { this.showExitConfirm = false },
    confirmExit() {
      this.closeExitModal()
      if (this.cdTimer) {
        clearInterval(this.cdTimer)
        this.cdTimer = null
      }
      // 清除答题记录
      this.answers = {}
      this.flagged = new Set()
      this.current = 1
      this.initAnswers()
      // 返回上一页
      uni.navigateBack({ delta: 1 })
    },
    submitPaper() {
      this.closeModal()
      if (this.cdTimer) {
        clearInterval(this.cdTimer)
        this.cdTimer = null
      }
      // 计算用时
      const endTime = Date.now()
      const usedSeconds = this.startTime ? Math.floor((endTime - this.startTime) / 1000) : (45 * 60 - this.totalSec)
      const usedMinutes = Math.floor(usedSeconds / 60)
      const usedSecs = usedSeconds % 60
      const timeStr = `${usedMinutes}分${usedSecs}秒`
      
      // 模拟成绩数据（实际项目中应该从后端获取）
      const reportData = {
        score: 85,
        totalScore: 100,
        time: timeStr,
        answeredCount: this.answeredNum,
        totalCount: this.total,
        dimensions: [
          { name: '国际商事仲裁', score: 88, target: 90 },
          { name: '跨境数据合规', score: 82, target: 85 },
          { name: '国际贸易法', score: 90, target: 88 },
          { name: '涉外民事诉讼', score: 78, target: 85 },
          { name: '国际私法', score: 85, target: 88 }
        ]
      }
      
      // 存储报告数据到本地
      uni.setStorageSync('lastAssessmentReport', reportData)
      
      // 跳转到报告页面
      uni.navigateTo({
        url: '/pages/assessment-report/assessment-report'
      })
    },
    navTo(url) {
      uni.navigateTo({ url })
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
  --blue-500: #4A90E2;
  --blue-600: #2563EB;
  --blue-700: #1D4ED8;
  --ink: #16314F;
  --ink-2: #355580;
  --muted: #7A92B0;
  --muted-2: #9AAFC6;
  --line: rgba(120, 160, 210, 0.16);
  --glass: rgba(255, 255, 255, 0.55);
  --glass-2: rgba(255, 255, 255, 0.68);
  --glass-3: rgba(255, 255, 255, 0.82);
  --glass-border: rgba(255, 255, 255, 0.75);
  --glass-border-soft: rgba(255, 255, 255, 0.45);
  --glass-shadow: 0 20rpx 68rpx rgba(46, 123, 224, 0.14);
  --glass-shadow-sm: 0 12rpx 36rpx rgba(46, 123, 224, 0.10);
  --green: #22C55E;
  --green-soft: rgba(34, 197, 94, 0.14);
  --amber: #F59E0B;
  --amber-soft: rgba(245, 158, 11, 0.16);
  --rose: #FB7185;
  --rose-soft: rgba(251, 113, 133, 0.14);
  --violet: #8B5CF6;
  --violet-soft: rgba(139, 92, 246, 0.14);
  --cyan: #06B6D4;
  --r-xs: 20rpx;
  --r-sm: 28rpx;
  --r-md: 36rpx;
  --r-lg: 48rpx;
  --r-xl: 60rpx;
  --r-pill: 999rpx;
}

.page-wrap {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(160deg, #EAF3FF 0%, #F4F9FF 45%, #E6F1FE 100%);
  position: relative;
  overflow: hidden;
}

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
  background: radial-gradient(circle, rgba(91,157,249,0.40), transparent 70%);
  top: -120rpx; right: -100rpx;
}
.page-wrap::after {
  width: 600rpx; height: 600rpx;
  background: radial-gradient(circle, rgba(6,182,212,0.22), transparent 70%);
  bottom: 80rpx; left: -180rpx;
}

/* ============ Status bar safe-area ============ */
.status-bar {
  width: 100%;
  flex-shrink: 0;
  background: transparent;
}

/* ============ Fixed quiz area (整页固定，无需滚动) ============ */
.quiz-area {
  position: relative; z-index: 5;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 88rpx 36rpx 0;
}
.quiz-head {
  display: flex;
  align-items: stretch;
  gap: 14rpx;
}

.countdown-block {
  flex: 1;
  position: relative;
  padding: 18rpx;
  border-radius: var(--r-md);
  background: linear-gradient(135deg, rgba(91,157,249,0.18), rgba(6,182,212,0.12));
  border: 2rpx solid rgba(91,157,249,0.28);
  overflow: hidden;
}
.countdown-block.urgent {
  background: linear-gradient(135deg, rgba(251,113,133,0.22), rgba(245,158,11,0.18));
  border-color: rgba(251,113,133,0.35);
}
.cd-label {
  display: flex; align-items: center; gap: 6rpx;
  font-size: 20rpx; font-weight: 600; color: var(--ink-2);
}
.cd-ico { font-size: 24rpx; line-height: 1; }
.cd-time {
  margin-top: 8rpx;
  font-size: 44rpx; font-weight: 700; color: var(--brand-deep);
  letter-spacing: 1rpx;
  line-height: 1.1;
}
.countdown-block.urgent .cd-time { color: #E11D48; animation: countGlow 1.5s ease-in-out infinite; }
.cd-sub {
  margin-top: 4rpx;
  font-size: 19rpx; color: var(--muted);
}

/* Navigator block */
.nav-block {
  flex: 1.3;
  display: flex; flex-direction: column;
  padding: 16rpx;
  border-radius: var(--r-md);
  background: var(--glass-2);
  border: 2rpx solid var(--glass-border-soft);
}
.nav-head {
  display: flex; justify-content: space-between; align-items: center;
}
.qt {
  font-size: 24rpx; font-weight: 600; color: var(--ink);
}
.legend {
  display: flex; gap: 10rpx;
}
.legend-item {
  display: flex; align-items: center; gap: 4rpx;
  font-size: 18rpx; color: var(--muted);
}
.legend-item .dot {
  width: 12rpx; height: 12rpx; border-radius: 4rpx;
}
.legend-item .dot.b { background: var(--brand); box-shadow: 0 0 0 3rpx rgba(91,157,249,0.22); }
.legend-item .dot.g { background: var(--green); }
.legend-item .dot.a { background: var(--amber); }

.bubbles {
  margin-top: 12rpx;
  display: flex; flex-wrap: wrap; gap: 8rpx;
}
.bubble {
  width: 48rpx; height: 48rpx; border-radius: 14rpx;
  background: rgba(120,160,210,0.14);
  color: var(--ink-2);
  display: flex; align-items: center; justify-content: center;
  font-size: 20rpx; font-weight: 600;
  animation: pop .42s cubic-bezier(.34,1.56,.64,1) both;
  transition: all .2s;
}
.bubble:active { transform: scale(0.9); }
.bubble.answered { background: var(--green-soft); color: #15803D; }
.bubble.flagged {
  background: var(--amber-soft);
  color: #B45309;
  box-shadow: inset 0 0 0 2rpx rgba(245,158,11,0.4);
}
.bubble.current {
  background: linear-gradient(135deg, var(--brand), var(--blue-600));
  color: #fff;
  transform: translateY(-2rpx) scale(1.06);
  box-shadow: 0 6rpx 16rpx rgba(46,123,224,0.45);
}

/* Progress */
.prog-wrap {
  margin-top: 10rpx;
  padding-top: 12rpx;
}
.prog {
  height: 12rpx; border-radius: var(--r-pill);
  background: rgba(120,160,210,0.18);
  overflow: hidden;
}
.prog-fill {
  height: 100%; width: 0;
  border-radius: var(--r-pill);
  background: linear-gradient(90deg, var(--brand), var(--cyan));
  transition: width .6s cubic-bezier(.22,1,.36,1);
}
.prog-meta {
  margin-top: 8rpx;
  display: flex; justify-content: space-between;
  font-size: 20rpx; color: var(--muted);
}

/* 状态区与题目区之间的分隔线 */
.q-divider {
  margin: 10rpx 0 2rpx;
  height: 2rpx;
  background: linear-gradient(90deg, transparent, rgba(120,160,210,0.28), transparent);
}

/* ============ Question card ============ */
.q-card {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 20rpx 24rpx 14rpx;
  background: var(--glass);
  border: 2rpx solid var(--glass-border-soft);
  border-radius: var(--r-lg);
  box-shadow: var(--glass-shadow);
}
.q-top {
  display: flex; justify-content: space-between; align-items: center;
}
.q-type-row {
  display: flex; align-items: center; gap: 16rpx;
}
.flag-btn {
  width: 64rpx; height: 64rpx; border-radius: 18rpx;
  align-self: center;
  flex-shrink: 0;
  background: rgba(120,160,210,0.14);
  display: flex; align-items: center; justify-content: center;
  transition: all .25s;
}
.flag-btn.on {
  background: var(--amber-soft);
  box-shadow: inset 0 0 0 2rpx rgba(245,158,11,0.35);
}
.flag-ico { font-size: 28rpx; opacity: .6; line-height: 1; }
.flag-btn.on .flag-ico { opacity: 1; }

.q-stem {
  margin-top: 16rpx;
  font-size: 30rpx; font-weight: 600; color: var(--ink);
  line-height: 1.5;
}

/* Single / Multiple options */
.q-opts {
  margin-top: 16rpx;
  display: flex; flex-direction: column; gap: 12rpx;
}
.opt {
  position: relative;
  display: flex; align-items: flex-start; gap: 14rpx;
  padding: 18rpx 22rpx;
  border-radius: var(--r-md);
  background: rgba(120,160,210,0.10);
  border: 2rpx solid transparent;
  transition: all .25s;
}
.opt:active { transform: scale(0.98); }
.opt.selected {
  background: var(--blue-50);
  border-color: rgba(91,157,249,0.38);
  box-shadow: 0 4rpx 14rpx rgba(46,123,224,0.12);
}
.opt .badge {
  width: 48rpx; height: 48rpx; border-radius: 14rpx;
  background: rgba(255,255,255,0.7);
  display: flex; align-items: center; justify-content: center;
  font-size: 22rpx; font-weight: 700; color: var(--ink-2);
  flex-shrink: 0;
  transition: all .2s;
}
.opt.selected .badge {
  background: linear-gradient(135deg, var(--brand), var(--blue-600));
  color: #fff;
}
.opt .txt {
  flex: 1;
  font-size: 27rpx; color: var(--ink);
  line-height: 1.5;
  padding-top: 2rpx;
}
.check-ico {
  position: absolute; right: 20rpx; top: 50%;
  transform: translateY(-50%);
  font-size: 28rpx; font-weight: 700;
  color: var(--brand-deep);
}

/* Judge */
.judge-opts {
  margin-top: 16rpx;
  display: grid; grid-template-columns: 1fr 1fr; gap: 14rpx;
}
.judge {
  display: flex; align-items: center; justify-content: center; gap: 10rpx;
  padding: 22rpx 16rpx;
  border-radius: var(--r-md);
  background: rgba(120,160,210,0.10);
  border: 2rpx solid transparent;
  transition: all .25s;
}
.judge:active { transform: scale(0.97); }
.judge.true.selected {
  background: var(--green-soft);
  border-color: rgba(34,197,94,0.4);
}
.judge.false.selected {
  background: var(--rose-soft);
  border-color: rgba(251,113,133,0.4);
}
.judge .j-ico {
  width: 48rpx; height: 48rpx; border-radius: 50%;
  background: rgba(255,255,255,0.7);
  display: flex; align-items: center; justify-content: center;
  font-size: 24rpx; font-weight: 700;
}
.judge.true .j-ico { color: var(--green); }
.judge.false .j-ico { color: var(--rose); }
.judge.true.selected .j-ico { background: var(--green); color: #fff; }
.judge.false.selected .j-ico { background: var(--rose); color: #fff; }
.judge .lbl {
  font-size: 28rpx; font-weight: 600; color: var(--ink);
}

/* Subjective */
.subj-wrap {
  margin-top: 16rpx;
}
.subj {
  width: 100%;
  min-height: 200rpx;
  padding: 18rpx;
  border-radius: var(--r-md);
  background: rgba(120,160,210,0.08);
  border: 2rpx solid var(--line);
  font-size: 27rpx; color: var(--ink);
  line-height: 1.55;
  box-sizing: border-box;
}
.subj-foot {
  margin-top: 12rpx;
  display: flex; justify-content: space-between; align-items: center;
}
.subj-hint { font-size: 20rpx; color: var(--muted); }
.subj-count {
  font-size: 20rpx; font-weight: 600; color: var(--muted);
  padding: 4rpx 10rpx; border-radius: 14rpx;
  background: rgba(120,160,210,0.12);
}
.subj-count.over { color: #E11D48; background: var(--rose-soft); }

/* ============ Chip ============ */
.chip {
  display: inline-flex; align-items: center;
  height: 48rpx; padding: 0 20rpx;
  border-radius: var(--r-pill);
  font-size: 22rpx; font-weight: 600;
  background: var(--blue-50);
  color: var(--brand-deep);
  border: 2rpx solid rgba(91,157,249,0.2);
}
.chip.amber { background: var(--amber-soft); color: #B45309; border-color: rgba(245,158,11,0.25); }
.chip.green { background: var(--green-soft); color: #15803D; border-color: rgba(34,197,94,0.25); }
.chip.violet { background: var(--violet-soft); color: #6D28D9; border-color: rgba(139,92,246,0.25); }

/* ============ Action bar (in-flow, above tabbar) ============ */
.action-bar {
  position: relative;
  z-index: 60;
  display: flex; align-items: center; justify-content: space-between;
  margin: 10rpx 28rpx 14rpx;
  padding: 12rpx 18rpx;
  flex-shrink: 0;
  border-radius: 24rpx;
  background: rgba(255,255,255,0.78);
  backdrop-filter: blur(24rpx);
  border: 2rpx solid var(--glass-border);
  box-shadow: 0 18rpx 44rpx rgba(46,123,224,0.18);
}
.ab-btn {
  display: inline-flex; align-items: center; gap: 8rpx;
  height: 76rpx; padding: 0 26rpx;
  border-radius: 22rpx;
  font-size: 26rpx; font-weight: 600;
  transition: all .2s;
}
.ab-btn:active { transform: scale(0.96); }
.ab-btn.ghost {
  background: rgba(120,160,210,0.14);
  color: var(--ink-2);
}
.ab-btn.ghost.disabled { opacity: .45; }
.ab-btn.primary {
  background: linear-gradient(135deg, var(--brand), var(--blue-600));
  color: #fff;
  box-shadow: 0 10rpx 26rpx rgba(46,123,224,0.34);
}
.ab-btn.primary.submit {
  background: linear-gradient(135deg, #10B981, #059669);
  box-shadow: 0 10rpx 26rpx rgba(16,185,129,0.38);
}
.ab-btn.exit {
  background: rgba(251,113,133,0.12);
  color: #E11D48;
}
.ab-btn.exit:active {
  background: rgba(251,113,133,0.20);
}
.ab-ico { font-size: 32rpx; line-height: 1; }

/* ============ Modal ============ */
.modal-backdrop {
  position: fixed; inset: 0;
  z-index: 100;
  background: rgba(14,26,43,0.42);
  display: flex; align-items: center; justify-content: center;
  padding: 0 60rpx;
  opacity: 0; pointer-events: none;
  transition: opacity .25s;
}
.modal-backdrop.show { opacity: 1; pointer-events: auto; }
.modal {
  width: 100%;
  padding: 44rpx 36rpx 36rpx;
  border-radius: var(--r-xl);
  background: #fff;
  box-shadow: 0 40rpx 80rpx rgba(14,26,43,0.25);
  transform: scale(.92);
  transition: transform .28s cubic-bezier(.34,1.56,.64,1);
}
.modal-backdrop.show .modal { transform: scale(1); }
.m-ico {
  width: 100rpx; height: 100rpx; border-radius: 50%;
  margin: 0 auto 20rpx;
  display: flex; align-items: center; justify-content: center;
  background: var(--amber-soft);
  font-size: 48rpx; color: #B45309;
}
.m-ico.exit {
  background: var(--rose-soft);
  color: #E11D48;
}
.m-title {
  text-align: center;
  font-size: 34rpx; font-weight: 700; color: var(--ink);
}
.m-sub {
  margin-top: 16rpx;
  text-align: center;
  font-size: 26rpx; color: var(--muted);
  line-height: 1.5;
}
.m-actions {
  margin-top: 36rpx;
  display: flex; gap: 20rpx;
}
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 16rpx;
  height: 88rpx; padding: 0 40rpx;
  border-radius: var(--r-pill);
  font-size: 28rpx; font-weight: 600;
  transition: transform .2s;
  flex: 1;
}
.btn:active { transform: scale(0.96); }
.btn-ghost {
  background: rgba(120,160,210,0.12);
  color: var(--ink-2);
  border: 2rpx solid var(--glass-border-soft);
}
.btn-primary {
  background: linear-gradient(135deg, var(--brand), var(--blue-600));
  color: #fff;
  box-shadow: 0 14rpx 32rpx rgba(46,123,224,0.36);
}
.btn-rose {
  background: linear-gradient(135deg, var(--rose), #E11D48);
  color: #fff;
  box-shadow: 0 14rpx 32rpx rgba(251,113,133,0.36);
}

/* ============ Toast ============ */
.toast {
  position: fixed;
  left: 50%; top: 40%;
  transform: translateX(-50%) scale(.9);
  z-index: 120;
  display: flex; align-items: center; gap: 14rpx;
  padding: 24rpx 36rpx;
  border-radius: var(--r-lg);
  background: rgba(14,26,43,0.88);
  box-shadow: 0 16rpx 40rpx rgba(14,26,43,0.3);
  opacity: 0; pointer-events: none;
  transition: opacity .28s, transform .28s cubic-bezier(.34,1.56,.64,1);
}
.toast.show { opacity: 1; transform: translateX(-50%) scale(1); pointer-events: auto; }
.t-ico {
  width: 48rpx; height: 48rpx; border-radius: 50%;
  background: rgba(34,197,94,0.18);
  color: var(--green);
  display: flex; align-items: center; justify-content: center;
  font-size: 28rpx; font-weight: 700;
}
.t-txt {
  font-size: 26rpx; color: #fff; font-weight: 600;
}

/* ============ Animations ============ */
@keyframes fadeUp { from { opacity: 0; transform: translateY(36rpx); } to { opacity: 1; transform: translateY(0); } }
@keyframes pop { 0% { transform: scale(.6); opacity: 0; } 60% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes countGlow { 0%,100% { text-shadow: 0 0 0 transparent; } 50% { text-shadow: 0 0 16rpx rgba(225,29,72,0.5); } }

.reveal { opacity: 0; animation: fadeUp .6s cubic-bezier(.22,1,.36,1) forwards; }
.reveal.d1 { animation-delay: .06s; }
.reveal.d2 { animation-delay: .12s; }

.num { font-feature-settings: "tnum"; }

@keyframes slide-out-left { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-40rpx); opacity: 0; } }
@keyframes slide-in-right { from { transform: translateX(40rpx); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes slide-out-right { from { transform: translateX(0); opacity: 1; } to { transform: translateX(40rpx); opacity: 0; } }
@keyframes slide-in-left { from { transform: translateX(-40rpx); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
.slide-out-left { animation: slide-out-left .25s ease-in forwards; }
.slide-in-right { animation: slide-in-right .34s cubic-bezier(.22,1,.36,1) both; }
.slide-out-right { animation: slide-out-right .25s ease-in forwards; }
.slide-in-left { animation: slide-in-left .34s cubic-bezier(.22,1,.36,1) both; }
</style>
