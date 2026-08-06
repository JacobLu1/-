<template>
  <view class="lt-page">
    <!-- 状态栏安全区占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    <!-- 自定义导航栏 -->
    <view class="lt-nav">
      <view class="lt-back" hover-class="lt-back-hover" @click="goBack">
        <text class="lt-back-arrow">‹</text>
        <text>返回</text>
      </view>
      <text class="lt-nav-title">听力实训</text>
      <view class="lt-nav-right"></view>
    </view>

    <scroll-view scroll-y class="lt-scroll" show-scrollbar="false">
      <!-- 概览卡 -->
      <view class="hero">
        <view class="hero-top">
          <view class="hero-info">
            <view class="hero-title">每周法律英语听力实训</view>
            <view class="hero-sub">坚持每日听力训练，巩固涉外法律英语能力</view>
          </view>
        </view>
        <view class="hero-progress-row">
          <text class="ri-checkbox-circle-fill hero-check"></text>
          <text class="hero-progress-text">本周已完成 2/7 项听力任务，累计练习 4.5 小时</text>
        </view>
      </view>

      <!-- 本周听力任务 -->
      <view class="sec reveal d1">
        <view class="sec-head">
          <view class="t">
            <view class="bar"></view>
            <text>本周听力任务</text>
          </view>
          <text class="sec-sub">按日安排，循序渐进</text>
        </view>
        <view class="task-grid">
          <view
            class="task-card"
            :class="'is-' + task.status"
            v-for="(task, i) in weeklyTasks"
            :key="i"
            hover-class="task-hover"
          >
            <view class="task-top">
              <view class="task-badge">{{ task.dayNum }}</view>
              <text class="task-day">{{ task.day }}</text>
              <text class="task-diff" :class="'diff-' + task.difficulty">{{ task.difficultyText }}</text>
            </view>
            <text class="task-title">{{ task.title }}</text>
            <view class="task-progress">
              <view class="task-bar">
                <view class="task-fill" :style="{ width: task.progress + '%' }"></view>
              </view>
              <text class="task-pct">{{ task.progress }}%</text>
            </view>
            <text class="task-status" :class="'status-' + task.status">{{ task.statusText }}</text>
          </view>
        </view>
      </view>

      <!-- 听力练习操作台 -->
      <view class="sec reveal d2">
        <view class="sec-head">
          <view class="t">
            <view class="bar"></view>
            <text>听力练习操作台</text>
          </view>
          <text class="sec-sub">当前练习 · 跨境并购谈判实录</text>
        </view>

        <!-- 播放器 -->
        <view class="player-card">
          <view class="player-top">
            <view class="play-btn" hover-class="play-hover" @click="togglePlay">
              <view class="play-ico" :class="isPlaying ? 'is-pause' : ''"></view>
            </view>
            <view class="player-info">
              <text class="player-title">跨境并购谈判实录（第3节）</text>
              <view class="player-bar-row">
                <view class="player-bar">
                  <view class="player-fill" :style="{ width: playerProgress + '%' }"></view>
                </view>
                <text class="player-time">{{ playerCurrentTime }} / {{ playerTotalTime }}</text>
              </view>
            </view>
          </view>
          <view class="player-ctrl">
            <view class="ctrl-btn" hover-class="ctrl-hover">{{ playbackRate }}</view>
            <view class="ctrl-btn" hover-class="ctrl-hover">
              <view class="vol-ico"></view>
            </view>
          </view>
        </view>

        <!-- 原文 + 习题 -->
        <view class="studio-panels">
          <view class="panel">
            <view class="panel-head">
              <view class="panel-title">
                <view class="bar-sm"></view>
                <text>法律原文文本</text>
              </view>
              <view class="lang-toggle">
                <text
                  class="lang-tag"
                  :class="currentLang === 'en' ? 'is-active' : ''"
                  @click="currentLang = 'en'"
                >英文</text>
                <text
                  class="lang-tag"
                  :class="currentLang === 'zh' ? 'is-active' : ''"
                  @click="currentLang = 'zh'"
                >中文</text>
              </view>
            </view>
            <text class="transcript">{{ currentTranscript }}</text>
          </view>

          <view class="panel">
            <view class="panel-head">
              <view class="panel-title">
                <view class="bar-sm"></view>
                <text>习题作答</text>
              </view>
              <text class="quiz-count">{{ quizQuestions.length }}题</text>
            </view>
            <view class="quiz-list">
              <view class="quiz-item" v-for="(q, qi) in quizQuestions" :key="qi">
                <text class="quiz-q">{{ q.question }}</text>
                <view class="quiz-opts">
                  <view
                    class="quiz-opt"
                    v-for="(op, oi) in q.options"
                    :key="oi"
                    :class="selectedAnswers[qi] === oi ? 'is-selected' : ''"
                    hover-class="opt-hover"
                    @click="selectAnswer(qi, oi)"
                  >
                    <view class="quiz-radio">
                      <text v-if="selectedAnswers[qi] === oi" class="ri-check-line"></text>
                    </view>
                    <text class="quiz-opt-text">{{ op }}</text>
                  </view>
                </view>
              </view>
            </view>
            <view class="submit-btn" hover-class="submit-hover" @click="submitAnswers">
              <text>提交作答</text>
              <text class="ri-arrow-right-s-line"></text>
            </view>
          </view>
        </view>
      </view>

      <!-- 历史练习记录 -->
      <view class="sec reveal d3">
        <view class="sec-head">
          <view class="t">
            <view class="bar"></view>
            <text>历史练习记录</text>
          </view>
          <text class="sec-sub">查看过往练习完成情况</text>
        </view>
        <view class="history-grid">
          <view class="history-card" v-for="(r, i) in historyRecords" :key="i">
            <view class="ring" :style="ringStyle(r)">
              <view class="ring-inner">
                <text class="ring-pct" :style="{ color: ringColor(r.level) }">{{ r.accuracy }}%</text>
              </view>
            </view>
            <text class="ring-label">正确率</text>
            <text class="history-title">{{ r.title }}</text>
            <view class="history-meta">
              <view class="history-meta-item">
                <text class="ri-calendar-line"></text>
                <text>{{ r.date }}</text>
              </view>
              <view class="history-meta-item">
                <text class="ri-time-line"></text>
                <text>用时 {{ r.duration }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部提示 -->
      <view class="lt-tip">
        <text class="ri-sparkling-2-line"></text>
        <text>坚持每日听力训练，法律英语稳步提升</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 0,
      isPlaying: false,
      playerProgress: 41,
      playerCurrentTime: '03:24',
      playerTotalTime: '08:15',
      playbackRate: '1.0x',
      currentLang: 'en',
      selectedAnswers: {},
      weeklyTasks: [
        { dayNum: 1, day: '周一', difficulty: 'intermediate', difficultyText: '中级', title: '合同条款听写训练', progress: 100, status: 'done', statusText: '已完成' },
        { dayNum: 2, day: '周二', difficulty: 'advanced', difficultyText: '高级', title: '国际仲裁裁决听力', progress: 100, status: 'done', statusText: '已完成' },
        { dayNum: 3, day: '周三', difficulty: 'advanced', difficultyText: '高级', title: '跨境并购谈判实录', progress: 60, status: 'active', statusText: '进行中' },
        { dayNum: 4, day: '周四', difficulty: 'intermediate', difficultyText: '中级', title: '海商法条款精听', progress: 0, status: 'pending', statusText: '未开始' },
        { dayNum: 5, day: '周五', difficulty: 'intermediate', difficultyText: '中级', title: '知识产权许可协议', progress: 0, status: 'pending', statusText: '未开始' },
        { dayNum: 6, day: '周六', difficulty: 'advanced', difficultyText: '高级', title: 'WTO争端解决听证', progress: 0, status: 'pending', statusText: '未开始' },
        { dayNum: 7, day: '周日', difficulty: 'beginner', difficultyText: '初级', title: '法律英语新闻听力', progress: 0, status: 'pending', statusText: '未开始' }
      ],
      transcripts: {
        en: 'Pursuant to Section 4.2 of the Share Purchase Agreement, the Seller shall indemnify the Purchaser against any losses arising from any breach of representations and warranties set forth in Schedule 3. The indemnification period shall expire twenty-four (24) months following the Closing Date, except for claims based on tax matters which shall survive for sixty (60) months.',
        zh: '根据《股权购买协议》第4.2条的规定，卖方应就附表3中所列的陈述和保证的任何违约行为所导致的任何损失向买方进行赔偿。赔偿期限应在交割日后的二十四（24）个月届满，但基于税务事项的索赔除外，该等索赔应存续六十（60）个月。'
      },
      quizQuestions: [
        { question: '1. What is the indemnification period for general breaches?', options: ['A. 12个月', 'B. 24个月', 'C. 36个月', 'D. 60个月'] },
        { question: '2. Which claims have a longer survival period?', options: ['A. 合同违约', 'B. 税务事项', 'C. 知识产权', 'D. 劳动纠纷'] },
        { question: '3. Where are the representations and warranties detailed?', options: ['A. Schedule 1', 'B. Schedule 2', 'C. Schedule 3', 'D. Schedule 4'] }
      ],
      historyRecords: [
        { accuracy: 92, level: 'high', title: '合同条款听写训练', date: '2026-07-28', duration: '15分钟' },
        { accuracy: 85, level: 'mid', title: '国际仲裁裁决听力', date: '2026-07-27', duration: '22分钟' },
        { accuracy: 95, level: 'high', title: '法律英语新闻听力', date: '2026-07-26', duration: '10分钟' },
        { accuracy: 78, level: 'low', title: '海商法条款精听', date: '2026-07-25', duration: '18分钟' }
      ]
    }
  },
  computed: {
    currentTranscript() {
      return this.transcripts[this.currentLang]
    }
  },
  onLoad() {
    this.statusBarHeight = this.getStatusBarHeight()
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
    goBack() {
      uni.navigateBack({
        fail: () => {
          uni.navigateTo({ url: '/pages/legal-english/legal-english' })
        }
      })
    },
    togglePlay() {
      this.isPlaying = !this.isPlaying
    },
    selectAnswer(qIndex, oIndex) {
      this.$set(this.selectedAnswers, qIndex, oIndex)
    },
    submitAnswers() {
      const count = Object.keys(this.selectedAnswers).length
      if (count < this.quizQuestions.length) {
        uni.showToast({ title: '还有题目未作答', icon: 'none' })
        return
      }
      uni.showToast({ title: '答案已提交', icon: 'success' })
    },
    ringColor(level) {
      if (level === 'high') return '#22C55E'
      if (level === 'low') return '#F59E0B'
      return '#2E7BE0'
    },
    ringStyle(r) {
      return { background: 'conic-gradient(' + this.ringColor(r.level) + ' ' + r.accuracy + '%, #e8eef8 0)' }
    }
  }
}
</script>

<style>
/* ============ Design Tokens ============ */
page {
  --brand: #2E7BE0;
  --brand-deep: #2563EB;
  --blue-600: #2563EB;
  --ink: #16314F;
  --ink-2: #355580;
  --muted: #7A92B0;
  --muted-2: #9AAFC6;
  --line: rgba(120, 160, 210, 0.16);
  --glass: rgba(255, 255, 255, 0.68);
  --glass-2: rgba(255, 255, 255, 0.82);
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
  --r-xs: 20rpx;
  --r-sm: 28rpx;
  --r-md: 36rpx;
  --r-lg: 48rpx;
  --r-pill: 999rpx;
  background-color: #f2f6fd;
}

/* ============ 页面 ============ */
.lt-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.status-bar {
  width: 100%;
  background: #ffffff;
}

/* ===== 导航栏 ===== */
.lt-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 24rpx;
  background: #ffffff;
  border-bottom: 1rpx solid #e8eef8;
}

.lt-back {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: 12rpx 16rpx;
  margin-left: -16rpx;
  font-size: 28rpx;
  color: #2E7BE0;
}

.lt-back-hover {
  opacity: 0.6;
}

.lt-back-arrow {
  font-size: 44rpx;
  line-height: 1;
  margin-top: -6rpx;
}

.lt-nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1b2233;
}

.lt-nav-right {
  width: 120rpx;
}

/* ===== 滚动区 ===== */
.lt-scroll {
  flex: 1;
  height: 0;
  padding: 24rpx 32rpx 60rpx;
  box-sizing: border-box;
}

/* ===== 概览卡 ===== */
.hero {
  border-radius: 40rpx;
  padding: 36rpx 32rpx 32rpx;
  background: linear-gradient(135deg, #3B82F6, #1E40AF);
  box-shadow: 0 20rpx 50rpx rgba(37, 99, 235, 0.30);
  position: relative;
  overflow: hidden;
}

.hero::after {
  content: "";
  position: absolute;
  right: -60rpx;
  top: -60rpx;
  width: 240rpx;
  height: 240rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
}

.hero-top {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-info {
  flex: 1;
  min-width: 0;
}

.hero-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.3;
}

.hero-sub {
  margin-top: 8rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.5;
}

.hero-progress-row {
  margin-top: 28rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
  position: relative;
  z-index: 1;
  padding: 20rpx 24rpx;
  border-radius: var(--r-sm);
  background: rgba(255, 255, 255, 0.12);
}

.hero-check {
  font-size: 32rpx;
  color: #FDE68A;
  flex-shrink: 0;
}

.hero-progress-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.92);
  line-height: 1.5;
}

/* ===== 区块标题 ===== */
.sec {
  margin-top: 40rpx;
}

.sec-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.sec-head .t {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.sec-head .t .bar {
  width: 8rpx;
  height: 30rpx;
  border-radius: 4rpx;
  background: linear-gradient(180deg, #5B9DF9, #2563EB);
}

.sec-head .t text {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--ink);
}

.sec-sub {
  font-size: 22rpx;
  color: var(--muted);
}

/* ===== 本周任务 ===== */
.task-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.task-card {
  position: relative;
  border-radius: 28rpx;
  background: var(--glass-2);
  border: 2rpx solid var(--glass-border-soft);
  box-shadow: var(--glass-shadow-sm);
  padding: 24rpx;
}

.task-card.is-active {
  border: 3rpx solid var(--brand);
  box-shadow: 0 0 0 6rpx rgba(46, 123, 224, 0.10), var(--glass-shadow-sm);
}

.task-hover {
  opacity: 0.9;
  transform: scale(0.98);
}

.task-top {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.task-badge {
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #B9C9DE, #7A92B0);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  font-weight: 700;
  flex-shrink: 0;
}

.task-card.is-done .task-badge {
  background: linear-gradient(135deg, #34D399, #16A34A);
}

.task-card.is-active .task-badge {
  background: linear-gradient(135deg, #5B9DF9, #2E7BE0);
}

.task-day {
  font-size: 26rpx;
  font-weight: 700;
  color: var(--ink-2);
}

.task-card.is-active .task-day {
  color: var(--brand);
}

.task-diff {
  margin-left: auto;
  font-size: 20rpx;
  font-weight: 600;
  padding: 4rpx 14rpx;
  border-radius: var(--r-pill);
}

.diff-beginner {
  background: var(--green-soft);
  color: #15803D;
}

.diff-intermediate {
  background: var(--amber-soft);
  color: #B45309;
}

.diff-advanced {
  background: var(--rose-soft);
  color: #BE123C;
}

.task-title {
  display: block;
  margin-top: 16rpx;
  font-size: 27rpx;
  font-weight: 600;
  color: var(--ink);
  line-height: 1.4;
  min-height: 76rpx;
}

.task-progress {
  margin-top: 14rpx;
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.task-bar {
  flex: 1;
  height: 12rpx;
  border-radius: var(--r-pill);
  background: rgba(120, 160, 210, 0.18);
  overflow: hidden;
}

.task-fill {
  display: block;
  height: 100%;
  border-radius: var(--r-pill);
  background: linear-gradient(90deg, #5B9DF9, #2563EB);
}

.task-card.is-done .task-fill {
  background: linear-gradient(90deg, #34D399, #16A34A);
}

.task-pct {
  font-size: 22rpx;
  font-weight: 700;
  color: var(--brand);
  min-width: 64rpx;
  text-align: right;
}

.task-card.is-done .task-pct {
  color: #16A34A;
}

.task-status {
  margin-top: 14rpx;
  display: inline-flex;
  align-items: center;
  font-size: 20rpx;
  font-weight: 600;
  padding: 4rpx 16rpx;
  border-radius: var(--r-pill);
}

.status-done {
  background: var(--green-soft);
  color: #15803D;
}

.status-active {
  background: rgba(46, 123, 224, 0.12);
  color: var(--brand);
}

.status-pending {
  background: rgba(120, 160, 210, 0.14);
  color: var(--muted);
}

/* ===== 播放器 ===== */
.player-card {
  border-radius: 36rpx;
  padding: 30rpx;
  background: linear-gradient(135deg, #3B82F6, #1E40AF);
  box-shadow: 0 20rpx 50rpx rgba(37, 99, 235, 0.28);
}

.player-top {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.play-btn {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 10rpx 26rpx rgba(255, 255, 255, 0.45);
}

.play-hover {
  transform: scale(0.94);
}

.play-ico {
  width: 44rpx;
  height: 44rpx;
  background: var(--brand);
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M8 5v14l11-7z' fill='black'/%3E%3C/svg%3E") center/contain no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M8 5v14l11-7z' fill='black'/%3E%3C/svg%3E") center/contain no-repeat;
}

.play-ico.is-pause {
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect x='6' y='4' width='4' height='16' rx='1' fill='black'/%3E%3Crect x='14' y='4' width='4' height='16' rx='1' fill='black'/%3E%3C/svg%3E") center/contain no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect x='6' y='4' width='4' height='16' rx='1' fill='black'/%3E%3Crect x='14' y='4' width='4' height='16' rx='1' fill='black'/%3E%3C/svg%3E") center/contain no-repeat;
}

.player-info {
  flex: 1;
  min-width: 0;
}

.player-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.4;
}

.player-bar-row {
  margin-top: 16rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.player-bar {
  flex: 1;
  height: 10rpx;
  border-radius: var(--r-pill);
  background: rgba(255, 255, 255, 0.25);
  overflow: hidden;
}

.player-fill {
  display: block;
  height: 100%;
  border-radius: var(--r-pill);
  background: #ffffff;
}

.player-time {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.85);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.player-ctrl {
  margin-top: 24rpx;
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
}

.ctrl-btn {
  min-width: 88rpx;
  height: 56rpx;
  padding: 0 24rpx;
  border-radius: var(--r-pill);
  background: rgba(255, 255, 255, 0.16);
  border: 2rpx solid rgba(255, 255, 255, 0.22);
  color: #ffffff;
  font-size: 22rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ctrl-hover {
  background: rgba(255, 255, 255, 0.3);
}

.vol-ico {
  width: 34rpx;
  height: 34rpx;
  background: #ffffff;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M11 5 6 9H2v6h4l5 4z' fill='black'/%3E%3Cpath d='M15.54 8.46a5 5 0 0 1 0 7.07' fill='none' stroke='black' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") center/contain no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M11 5 6 9H2v6h4l5 4z' fill='black'/%3E%3Cpath d='M15.54 8.46a5 5 0 0 1 0 7.07' fill='none' stroke='black' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") center/contain no-repeat;
}

/* ===== 面板 ===== */
.studio-panels {
  margin-top: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.panel {
  border-radius: 28rpx;
  background: var(--glass-2);
  border: 2rpx solid var(--glass-border-soft);
  box-shadow: var(--glass-shadow-sm);
  padding: 28rpx;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.panel-title .bar-sm {
  width: 6rpx;
  height: 26rpx;
  border-radius: 3rpx;
  background: linear-gradient(180deg, #5B9DF9, #2563EB);
}

.panel-title text {
  font-size: 28rpx;
  font-weight: 700;
  color: var(--ink);
}

/* 语言切换 */
.lang-toggle {
  display: inline-flex;
  gap: 4rpx;
  background: rgba(120, 160, 210, 0.16);
  padding: 4rpx;
  border-radius: var(--r-pill);
}

.lang-tag {
  font-size: 22rpx;
  font-weight: 600;
  padding: 8rpx 22rpx;
  border-radius: var(--r-pill);
  color: var(--muted);
  transition: all 0.2s;
}

.lang-tag.is-active {
  background: #ffffff;
  color: var(--brand);
  box-shadow: 0 4rpx 12rpx rgba(15, 23, 42, 0.10);
}

/* 原文 */
.transcript {
  display: block;
  font-size: 25rpx;
  line-height: 1.85;
  color: var(--ink-2);
  padding-left: 20rpx;
  border-left: 6rpx solid rgba(91, 157, 249, 0.45);
}

/* 习题 */
.quiz-count {
  font-size: 22rpx;
  font-weight: 600;
  color: var(--brand);
  background: rgba(46, 123, 224, 0.10);
  padding: 4rpx 18rpx;
  border-radius: var(--r-pill);
}

.quiz-list {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.quiz-item {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.quiz-q {
  font-size: 25rpx;
  font-weight: 600;
  color: var(--ink);
  line-height: 1.5;
}

.quiz-opts {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.quiz-opt {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx 22rpx;
  border-radius: 20rpx;
  background: rgba(120, 160, 210, 0.08);
  border: 2rpx solid transparent;
}

.quiz-opt.is-selected {
  background: rgba(46, 123, 224, 0.10);
  border-color: var(--brand);
}

.opt-hover {
  background: rgba(46, 123, 224, 0.10);
}

.quiz-radio {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 3rpx solid #B9C9DE;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 22rpx;
}

.quiz-opt.is-selected .quiz-radio {
  border-color: var(--brand);
  background: linear-gradient(135deg, #5B9DF9, #2E7BE0);
}

.quiz-opt-text {
  font-size: 25rpx;
  color: var(--ink-2);
}

.quiz-opt.is-selected .quiz-opt-text {
  color: var(--brand);
  font-weight: 600;
}

/* 提交按钮 */
.submit-btn {
  margin-top: 28rpx;
  height: 88rpx;
  border-radius: var(--r-pill);
  background: linear-gradient(135deg, #5B9DF9, #2E7BE0);
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  box-shadow: 0 12rpx 28rpx rgba(46, 123, 224, 0.32);
}

.submit-btn .ri-arrow-right-s-line {
  font-size: 32rpx;
}

.submit-hover {
  opacity: 0.9;
  transform: scale(0.98);
}

/* ===== 历史记录 ===== */
.history-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.history-card {
  border-radius: 28rpx;
  background: var(--glass-2);
  border: 2rpx solid var(--glass-border-soft);
  box-shadow: var(--glass-shadow-sm);
  padding: 28rpx 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ring {
  width: 128rpx;
  height: 128rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring-inner {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring-pct {
  font-size: 30rpx;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.ring-label {
  margin-top: 12rpx;
  font-size: 20rpx;
  color: var(--muted);
}

.history-title {
  margin-top: 6rpx;
  font-size: 26rpx;
  font-weight: 600;
  color: var(--ink);
  line-height: 1.4;
  text-align: center;
}

.history-meta {
  margin-top: 14rpx;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.history-meta-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  font-size: 20rpx;
  color: var(--muted);
}

.history-meta-item .ri-calendar-line,
.history-meta-item .ri-time-line {
  font-size: 24rpx;
}

/* ===== 底部提示 ===== */
.lt-tip {
  margin-top: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  color: var(--muted);
  font-size: 24rpx;
}

.lt-tip text:first-child {
  font-size: 26rpx;
  color: var(--brand);
}

/* ===== 入场动画 ===== */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(36rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.reveal {
  opacity: 0;
  animation: fadeUp 0.6s cubic-bezier(.22, 1, .36, 1) forwards;
}

.reveal.d1 { animation-delay: 0.06s; }
.reveal.d2 { animation-delay: 0.12s; }
.reveal.d3 { animation-delay: 0.18s; }
</style>
