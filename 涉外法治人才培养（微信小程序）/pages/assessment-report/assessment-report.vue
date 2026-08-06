<template>
  <view class="page-wrap">
    <!-- 状态栏安全区占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 可滚动内容区 -->
    <scroll-view scroll-y class="screen" scroll-with-animation>
      <!-- 成绩概览卡片 -->
      <view class="score-card reveal d1">
        <view class="deco a"></view>
        <view class="deco b"></view>

        <view class="card-content">
          <view class="score-icon">
            <text class="score-icon-text ri-trophy-line"></text>
          </view>

          <view class="score-label">本次成绩</view>
          <view class="score-value">
            <text class="score-num">{{ reportData.score }}</text>
            <text class="score-total">/{{ reportData.totalScore }}</text>
          </view>

          <view class="score-meta">
            <view class="meta-item">
              <text class="meta-ico ri-time-line"></text>
              <text class="meta-label">用时</text>
              <text class="meta-value">{{ reportData.time }}</text>
            </view>
            <view class="meta-divider"></view>
            <view class="meta-item">
              <text class="meta-ico ri-checkbox-circle-line"></text>
              <text class="meta-label">作答</text>
              <text class="meta-value">{{ reportData.answeredCount }}/{{ reportData.totalCount }} 题</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 能力维度雷达图 -->
      <view class="radar-card reveal d2">
        <view class="card-head">
          <view class="card-title-row">
            <view class="title-bar"></view>
            <text class="card-title-text">能力维度分析</text>
          </view>
        </view>

        <view class="radar-wrap">
          <canvas type="2d" id="radarChart" class="radar-canvas" style="width: 300px; height: 300px;"></canvas>
        </view>

        <view class="dimension-list">
          <view class="dimension-item" v-for="(dim, index) in reportData.dimensions" :key="index">
            <view class="dim-info">
              <text class="dim-name">{{ dim.name }}</text>
              <text class="dim-score">{{ dim.score }}分</text>
            </view>
            <view class="dim-bar">
              <view class="dim-bar-fill" :style="{ width: dim.score + '%', background: getBarColor(dim.score) }"></view>
            </view>
            <view class="dim-target">
              <text class="target-label">目标</text>
              <text class="target-value">{{ dim.target }}分</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 学习建议卡片 -->
      <view class="advice-card reveal d3">
        <view class="card-head">
          <view class="card-title-row">
            <view class="title-bar"></view>
            <text class="card-title-text">学习建议</text>
          </view>
        </view>

        <view class="advice-content">
          <view class="advice-item" v-for="(advice, index) in adviceList" :key="index">
            <view class="advice-icon" :style="{ background: advice.bg }">
              <text class="advice-icon-text" :class="advice.icon"></text>
            </view>
            <view class="advice-text">
              <view class="advice-title">{{ advice.title }}</view>
              <view class="advice-desc">{{ advice.desc }}</view>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部按钮 -->
      <view class="footer">
        <view class="action-btn" hover-class="action-hover" @click="goToDataCenter">
          <text class="action-btn-text">查看数据中心</text>
        </view>
      </view>

      <view style="height: 60rpx;"></view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 0,
      reportData: {
        score: 85,
        totalScore: 100,
        time: '28分32秒',
        answeredCount: 10,
        totalCount: 10,
        dimensions: [
          { name: '国际商事仲裁', score: 88, target: 90 },
          { name: '跨境数据合规', score: 82, target: 85 },
          { name: '国际贸易法', score: 90, target: 88 },
          { name: '涉外民事诉讼', score: 78, target: 85 },
          { name: '国际私法', score: 85, target: 88 }
        ]
      },
      adviceList: [
        {
          title: '涉外民事诉讼',
          desc: '建议加强协议管辖和法律适用方面的学习',
          icon: 'ri-book-open-line',
          bg: 'linear-gradient(135deg, #F59E0B, #D97706)'
        },
        {
          title: '跨境数据合规',
          desc: '建议深入学习GDPR和数据出境规则',
          icon: 'ri-database-2-line',
          bg: 'linear-gradient(135deg, #8B5CF6, #6D28D9)'
        }
      ]
    }
  },
  onReady() {
    this.statusBarHeight = this.getStatusBarHeight()
    this.loadReportData()
    this.$nextTick(() => {
      setTimeout(() => {
        this.drawRadarChart()
      }, 300)
    })
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
    loadReportData() {
      const data = uni.getStorageSync('lastAssessmentReport')
      if (data) {
        this.reportData = data
        // 根据得分生成学习建议
        this.generateAdvice()
      }
    },
    generateAdvice() {
      const advice = []
      this.reportData.dimensions.forEach(dim => {
        if (dim.score < dim.target) {
          let icon = 'ri-book-open-line'
          let bg = 'linear-gradient(135deg, #F59E0B, #D97706)'
          if (dim.name.includes('数据')) {
            icon = 'ri-database-2-line'
            bg = 'linear-gradient(135deg, #8B5CF6, #6D28D9)'
          } else if (dim.name.includes('贸易')) {
            icon = 'ri-global-line'
            bg = 'linear-gradient(135deg, #06B6D4, #0891B2)'
          } else if (dim.name.includes('仲裁')) {
            icon = 'ri-scales-3-line'
            bg = 'linear-gradient(135deg, #5B9DF9, #2E7BE0)'
          }
          advice.push({
            title: dim.name,
            desc: `当前${dim.score}分，目标${dim.target}分，建议加强该领域学习`,
            icon: icon,
            bg: bg
          })
        }
      })
      this.adviceList = advice.slice(0, 3)
    },
    getBarColor(score) {
      if (score >= 90) return 'linear-gradient(90deg, #22C55E, #16A34A)'
      if (score >= 80) return 'linear-gradient(90deg, #5B9DF9, #2E7BE0)'
      if (score >= 70) return 'linear-gradient(90deg, #F59E0B, #D97706)'
      return 'linear-gradient(90deg, #FB7185, #E11D48)'
    },
    drawRadarChart() {
      const query = uni.createSelectorQuery().in(this)
      query.select('#radarChart')
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res[0]) return
          
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')
          
          // 设置画布尺寸
          const dpr = uni.getSystemInfoSync().pixelRatio
          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr
          ctx.scale(dpr, dpr)
          
          const dimensions = this.reportData.dimensions
          const centerX = 150
          const centerY = 150
          const maxRadius = 100
          const sides = dimensions.length
          const angleStep = (Math.PI * 2) / sides

          // 清空画布
          ctx.clearRect(0, 0, canvas.width, canvas.height)

          // 绘制背景网格
          ctx.strokeStyle = 'rgba(120, 160, 210, 0.2)'
          ctx.lineWidth = 1
          for (let i = 1; i <= 5; i++) {
            const radius = (maxRadius / 5) * i
            ctx.beginPath()
            for (let j = 0; j <= sides; j++) {
              const angle = angleStep * j - Math.PI / 2
              const x = centerX + radius * Math.cos(angle)
              const y = centerY + radius * Math.sin(angle)
              if (j === 0) {
                ctx.moveTo(x, y)
              } else {
                ctx.lineTo(x, y)
              }
            }
            ctx.closePath()
            ctx.stroke()
          }

          // 绘制轴线
          ctx.strokeStyle = 'rgba(120, 160, 210, 0.3)'
          for (let i = 0; i < sides; i++) {
            const angle = angleStep * i - Math.PI / 2
            const x = centerX + maxRadius * Math.cos(angle)
            const y = centerY + maxRadius * Math.sin(angle)
            ctx.beginPath()
            ctx.moveTo(centerX, centerY)
            ctx.lineTo(x, y)
            ctx.stroke()
          }

          // 绘制数据区域
          ctx.beginPath()
          for (let i = 0; i < sides; i++) {
            const angle = angleStep * i - Math.PI / 2
            const score = dimensions[i].score
            const radius = (score / 100) * maxRadius
            const x = centerX + radius * Math.cos(angle)
            const y = centerY + radius * Math.sin(angle)
            if (i === 0) {
              ctx.moveTo(x, y)
            } else {
              ctx.lineTo(x, y)
            }
          }
          ctx.closePath()
          ctx.fillStyle = 'rgba(91, 157, 249, 0.3)'
          ctx.fill()
          ctx.strokeStyle = 'rgba(91, 157, 249, 0.8)'
          ctx.lineWidth = 2
          ctx.stroke()

          // 绘制数据点
          for (let i = 0; i < sides; i++) {
            const angle = angleStep * i - Math.PI / 2
            const score = dimensions[i].score
            const radius = (score / 100) * maxRadius
            const x = centerX + radius * Math.cos(angle)
            const y = centerY + radius * Math.sin(angle)
            ctx.beginPath()
            ctx.arc(x, y, 4, 0, Math.PI * 2)
            ctx.fillStyle = '#5B9DF9'
            ctx.fill()
          }

          // 绘制标签
          ctx.font = '11px sans-serif'
          ctx.fillStyle = '#355580'
          ctx.textAlign = 'center'
          for (let i = 0; i < sides; i++) {
            const angle = angleStep * i - Math.PI / 2
            const labelRadius = maxRadius + 20
            const x = centerX + labelRadius * Math.cos(angle)
            const y = centerY + labelRadius * Math.sin(angle)
            const name = dimensions[i].name
            ctx.fillText(name, x, y)
          }
        })
    },
    goToDataCenter() {
      uni.switchTab({
        url: '/pages/data/data'
      })
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

/* ---------- Page wrap ---------- */
.page-wrap {
  min-height: 100vh;
  background: linear-gradient(160deg, #EAF3FF 0%, #F4F9FF 45%, #E6F1FE 100%);
  position: relative;
  display: flex;
  flex-direction: column;
}
page { min-height: 100vh; }

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
  background: radial-gradient(circle, rgba(91,157,249,0.38), transparent 70%);
  top: -120rpx; left: -100rpx;
}
.page-wrap::after {
  width: 600rpx; height: 600rpx;
  background: radial-gradient(circle, rgba(6,182,212,0.20), transparent 70%);
  bottom: 60rpx; right: -180rpx;
}

/* ---------- Status bar ---------- */
.status-bar {
  width: 100%;
  flex-shrink: 0;
  background: transparent;
}

/* ---------- Screen ---------- */
.screen {
  position: relative;
  z-index: 5;
  flex: 1;
  box-sizing: border-box;
  padding: 16rpx 36rpx 220rpx;
}

/* ---------- Score card ---------- */
.score-card {
  position: relative;
  padding: 60rpx 44rpx 52rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  overflow: hidden;
  border-radius: var(--r-lg);
  background: var(--glass);
  border: 2rpx solid var(--glass-border-soft);
  box-shadow: var(--glass-shadow);
  margin-top: 20rpx;
}

.deco {
  position: absolute;
  border-radius: 50%;
  filter: blur(8px);
  pointer-events: none;
  z-index: 0;
}
.deco.a {
  width: 300rpx; height: 300rpx; top: -92rpx; right: -88rpx;
  background: radial-gradient(circle, rgba(139,92,246,0.22), transparent 70%);
}
.deco.b {
  width: 260rpx; height: 260rpx; bottom: -100rpx; left: -80rpx;
  background: radial-gradient(circle, rgba(6,182,212,0.18), transparent 70%);
}

.card-content {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-icon {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--amber) 0%, #D97706 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 24rpx 56rpx rgba(245,158,11,0.38);
  margin-bottom: 28rpx;
}
.score-icon-text {
  font-size: 64rpx;
  color: #fff;
}

.score-label {
  font-size: 26rpx;
  color: var(--muted);
  font-weight: 500;
  margin-bottom: 12rpx;
}

.score-value {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
  margin-bottom: 36rpx;
}
.score-num {
  font-size: 72rpx;
  font-weight: 700;
  color: var(--ink);
  line-height: 1;
}
.score-total {
  font-size: 32rpx;
  color: var(--muted);
  font-weight: 500;
}

.score-meta {
  display: flex;
  align-items: center;
  gap: 32rpx;
  padding: 28rpx 36rpx;
  background: var(--blue-50);
  border-radius: var(--r-md);
  border: 2rpx solid rgba(91,157,249,0.22);
  width: 100%;
}

.meta-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.meta-ico {
  font-size: 36rpx;
  color: var(--brand-deep);
}

.meta-label {
  font-size: 22rpx;
  color: var(--muted);
  font-weight: 500;
}

.meta-value {
  font-size: 28rpx;
  color: var(--ink);
  font-weight: 700;
}

.meta-divider {
  width: 2rpx;
  height: 72rpx;
  background: rgba(91,157,249,0.22);
}

/* ---------- Radar card ---------- */
.radar-card {
  position: relative;
  padding: 36rpx;
  border-radius: var(--r-lg);
  background: var(--glass);
  border: 2rpx solid var(--glass-border-soft);
  box-shadow: var(--glass-shadow-sm);
  margin-top: 24rpx;
}

.card-head {
  margin-bottom: 28rpx;
}

.card-title-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.title-bar {
  width: 8rpx;
  height: 32rpx;
  border-radius: 4rpx;
  background: linear-gradient(180deg, var(--brand), var(--blue-600));
}

.card-title-text {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--ink);
}

.radar-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 32rpx;
}

.radar-canvas {
  width: 300px;
  height: 300px;
}

.dimension-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.dimension-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.dim-info {
  width: 180rpx;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.dim-name {
  font-size: 24rpx;
  color: var(--ink);
  font-weight: 600;
}

.dim-score {
  font-size: 22rpx;
  color: var(--brand-deep);
  font-weight: 700;
}

.dim-bar {
  flex: 1;
  height: 16rpx;
  border-radius: var(--r-pill);
  background: rgba(120, 160, 210, 0.18);
  overflow: hidden;
}

.dim-bar-fill {
  height: 100%;
  border-radius: var(--r-pill);
  transition: width 1s cubic-bezier(.22,1,.36,1);
}

.dim-target {
  width: 100rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4rpx;
}

.target-label {
  font-size: 20rpx;
  color: var(--muted);
}

.target-value {
  font-size: 22rpx;
  color: var(--muted);
  font-weight: 600;
}

/* ---------- Advice card ---------- */
.advice-card {
  position: relative;
  padding: 36rpx;
  border-radius: var(--r-lg);
  background: var(--glass);
  border: 2rpx solid var(--glass-border-soft);
  box-shadow: var(--glass-shadow-sm);
  margin-top: 24rpx;
}

.advice-content {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.advice-item {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  padding: 24rpx;
  border-radius: var(--r-md);
  background: rgba(120, 160, 210, 0.06);
  border: 2rpx solid var(--line);
}

.advice-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.12);
}

.advice-icon-text {
  font-size: 36rpx;
  color: #fff;
}

.advice-text {
  flex: 1;
}

.advice-title {
  font-size: 28rpx;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 8rpx;
}

.advice-desc {
  font-size: 24rpx;
  color: var(--muted);
  line-height: 1.5;
}

/* ---------- Footer ---------- */
.footer {
  flex-shrink: 0;
  padding: 30rpx 36rpx 50rpx;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100rpx;
  border-radius: var(--r-pill);
  background: linear-gradient(135deg, var(--brand), var(--blue-600));
  color: #fff;
  box-shadow: 0 20rpx 48rpx rgba(46,123,224,0.34);
  transition: transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .25s;
}

.action-hover {
  transform: scale(0.96);
}

.action-btn-text {
  font-size: 32rpx;
  font-weight: 700;
  letter-spacing: .5rpx;
}

/* ---------- Animations ---------- */
@keyframes fadeUp { from { opacity: 0; transform: translateY(36rpx); } to { opacity: 1; transform: translateY(0); } }

.reveal { opacity: 0; animation: fadeUp .6s cubic-bezier(.22,1,.36,1) forwards; }
.reveal.d1 { animation-delay: .06s; }
.reveal.d2 { animation-delay: .18s; }
.reveal.d3 { animation-delay: .30s; }
</style>
