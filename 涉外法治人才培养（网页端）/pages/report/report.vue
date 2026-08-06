<template>
  <view class="report-shell">
    <!-- ===== App Shell (Sidebar + Main) ===== -->
    <view class="app-shell">
      <!-- ===== Left Sidebar ===== -->
      <aside class="app-sidebar">
        <!-- Logo / Home Link -->
        <view class="app-sidebar-logo">
          <view class="app-sidebar-logo-icon">
            <view class="ls-svg-glyph" aria-hidden="true"></view>
          </view>
          <text class="app-sidebar-logo-text">涉外法治人才培养</text>
        </view>

        <!-- Navigation -->
        <nav class="app-sidebar-nav">
          <view class="app-nav-item" @tap="navigateTo('/pages/survey/survey')">
            <view class="navi-icon navi-icon-survey"></view>
            <text>问卷测评</text>
          </view>
          <view class="app-nav-item is-active" data-nav-key="data-center">
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

        <!-- User Info -->
        <view class="app-sidebar-user">
          <view class="app-sidebar-user-inner" @tap="navigateTo('/pages/profile/profile')">
            <view class="app-sidebar-user-avatar">{{ avatarChar }}</view>
            <view style="min-width:0;flex:1">
              <text class="app-sidebar-user-name">{{ displayName }}</text>
              <text class="app-sidebar-user-role">{{ displayRole }}</text>
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
          <text class="app-topbar-title">个人数据中心</text>
          <text class="app-topbar-meta">{{ todayDateText }}</text>
        </header>

        <main class="app-content">
          <!-- ===== KPI Stat Cards Row ===== -->
          <view class="dc-section" aria-label="核心指标">
            <view class="kpi-grid">
              <!-- Card 1: 我的测评次数 -->
              <view class="kpi-card">
                <view class="kpi-card-head">
                  <text class="kpi-card-label">我的测评次数</text>
                  <view class="kpi-card-icon" aria-hidden="true">
                    <view class="kpi-icon kpi-icon-trend"></view>
                  </view>
                </view>
                <text class="kpi-card-value">12</text>
                <view class="kpi-card-trend">
                  <view class="kpi-arrow-up"></view>
                  <text>+3 较上月</text>
                </view>
              </view>
              <!-- Card 2: 我的平均得分 -->
              <view class="kpi-card">
                <view class="kpi-card-head">
                  <text class="kpi-card-label">我的平均得分</text>
                  <view class="kpi-card-icon" aria-hidden="true">
                    <view class="kpi-icon kpi-icon-award"></view>
                  </view>
                </view>
                <text class="kpi-card-value">82.5</text>
                <view class="kpi-card-trend">
                  <view class="kpi-arrow-up"></view>
                  <text>+4.2分 较上月</text>
                </view>
              </view>
              <!-- Card 3: 我的最高得分 -->
              <view class="kpi-card">
                <view class="kpi-card-head">
                  <text class="kpi-card-label">我的最高得分</text>
                  <view class="kpi-card-icon" aria-hidden="true">
                    <view class="kpi-icon kpi-icon-check"></view>
                  </view>
                </view>
                <text class="kpi-card-value">91</text>
                <view class="kpi-card-trend new-record">
                  <view class="kpi-icon-star-sm"></view>
                  <text>新纪录</text>
                </view>
              </view>
              <!-- Card 4: 我的群体排名 -->
              <view class="kpi-card">
                <view class="kpi-card-head">
                  <text class="kpi-card-label">我的群体排名</text>
                  <view class="kpi-card-icon" aria-hidden="true">
                    <view class="kpi-icon kpi-icon-users"></view>
                  </view>
                </view>
                <text class="kpi-card-value">Top 15%</text>
                <view class="kpi-card-trend">
                  <view class="kpi-arrow-up"></view>
                  <text>↑5名 较上月</text>
                </view>
              </view>
            </view>
          </view>

          <!-- ===== Charts Row ===== -->
          <view class="dc-section" aria-label="趋势与能力分布">
            <view class="charts-row">
              <!-- Left: Line Chart -->
              <view class="chart-card">
                <view class="chart-card-header">
                  <view>
                    <text class="chart-card-title">个人成绩趋势</text>
                    <text class="chart-card-subtitle">近6次测评</text>
                  </view>
                  <view class="chart-filter" aria-label="筛选 月度">
                    <text>月度</text>
                    <view class="chevron-down"></view>
                  </view>
                </view>
                <view class="chart-canvas-wrap line-chart chart-centered">
                  <canvas canvas-id="trendCanvas" id="trendCanvas" class="chart-canvas"
                          @mousemove="onTrendMove" @mouseleave="onTrendLeave"
                          @touchstart="onTrendMove" @touchmove="onTrendMove" @touchend="onTrendEnd"
                          @click="onTrendTap"></canvas>
                </view>
              </view>
              <!-- Right: Radar Chart -->
              <view class="chart-card">
                <view class="chart-card-header">
                  <view>
                    <text class="chart-card-title">能力维度分布</text>
                    <text class="chart-card-subtitle">六项核心能力</text>
                  </view>
                </view>
                <view class="chart-canvas-wrap radar-chart chart-centered">
                  <canvas canvas-id="radarCanvas" id="radarCanvas" class="chart-canvas"
                          @mousemove="onRadarMove" @mouseleave="onRadarLeave"
                          @touchstart="onRadarMove" @touchmove="onRadarMove" @touchend="onRadarEnd"
                          @click="onRadarTap"></canvas>
                </view>
              </view>
            </view>
          </view>

          <!-- ===== Assessment Comparison Table ===== -->
          <view class="dc-section" aria-label="测评维度对比">
            <view class="table-card">
              <view class="chart-card-header">
                <view>
                  <text class="chart-card-title">能力维度测评对比</text>
                  <text class="chart-card-subtitle">各领域缺口分布与等级评定</text>
                </view>
              </view>
              <!-- Level Standard -->
              <view class="level-standard">
                <view class="ls-title">等级评定标准</view>
                <view class="ls-list">
                  <view class="ls-item"><text class="ls-badge level-s">S</text><text class="ls-name">卓越</text><text class="ls-desc">综合得分 ≥ 90</text></view>
                  <view class="ls-item"><text class="ls-badge level-a">A</text><text class="ls-name">优秀</text><text class="ls-desc">80 ≤ 得分 < 90</text></view>
                  <view class="ls-item"><text class="ls-badge level-b">B</text><text class="ls-name">良好</text><text class="ls-desc">70 ≤ 得分 < 80</text></view>
                  <view class="ls-item"><text class="ls-badge level-c">C</text><text class="ls-name">中等</text><text class="ls-desc">60 ≤ 得分 < 70</text></view>
                  <view class="ls-item"><text class="ls-badge level-d">D</text><text class="ls-name">待提升</text><text class="ls-desc">得分 < 60</text></view>
                </view>
                <view class="ls-formula">
                  <text class="lf-title">计算公式：</text>
                  <text class="lf-text">综合得分 = 达成率×50% + 群体超越×30% + 缺口修正×20%</text>
                </view>
              </view>
              <view class="table-container">
                <view class="dc-table dc-table-gap">
                  <view class="dc-table-thead">
                    <view class="dc-table-th dc-th-dim">评估维度</view>
                    <view class="dc-table-th dc-th-gap">
                      <view class="gap-th">
                        <text>缺口进度</text>
                        <text class="gap-th-sub">(实际 / 目标)</text>
                      </view>
                    </view>
                    <view class="dc-table-th dc-th-level">等级</view>
                  </view>
                  <view class="dc-table-tbody">
                    <view class="dc-table-tr" v-for="(row, idx) in comparisonData" :key="idx">
                      <view class="dc-table-td dc-td-dim">
                        <view class="dim-name">{{ row.label }}</view>
                        <view class="dim-meta">
                          <text class="dm-actual">实际 {{ row.personal }}</text>
                          <text class="dm-sep">·</text>
                          <text class="dm-target">目标 {{ row.target }}</text>
                          <text class="dm-sep">·</text>
                          <text class="dm-avg">均值 {{ row.avg }}</text>
                        </view>
                      </view>
                      <view class="dc-table-td dc-td-gap">
                        <view class="cell-gap">
                          <view class="cg-head">
                            <text class="cg-pct" :class="row.gapLevelClass">
                              {{ row.gapPct > 0 ? '缺 -' + row.gapPct.toFixed(1) + '%' : '已达标' }}
                            </text>
                            <text class="cg-rate">达成 {{ row.achievePct.toFixed(0) }}%</text>
                          </view>
                          <view class="cg-track">
                            <view class="cg-fill"
                                  :style="{width: Math.min(100, row.achievePct) + '%'}"
                                  :class="row.fillClass"></view>
                          </view>
                          <view class="cg-legend">
                            <text class="cgl-0">0</text>
                            <text class="cgl-50">50</text>
                            <text class="cgl-target">目标 100</text>
                          </view>
                        </view>
                      </view>
                      <view class="dc-table-td dc-td-level">
                        <view class="level-card" :class="'lc-' + row.levelClass">
                          <text class="lc-letter">{{ row.levelLetter }}</text>
                          <view class="lc-right">
                            <text class="lc-text">{{ row.levelText }}</text>
                            <text class="lc-score">{{ row.totalScore.toFixed(0) }} 分</text>
                          </view>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </main>
      </view>
    </view>
  </view>
</template>

<script>
import { requireLogin, getDisplayName, getLevelText } from '@/utils/auth.js'
export default {
  name: 'Report',
  onLoad() {
    if (!requireLogin()) return
  },
  data() {
    return {
      // 基础原始数据
      rawComparison: [
        { label: '国际法知识',  personal: 85, avg: 76, target: 85 },
        { label: '涉外民商法',  personal: 72, avg: 74, target: 85 },
        { label: '国际贸易法',  personal: 78, avg: 71, target: 80 },
        { label: '国际投资法',  personal: 65, avg: 68, target: 82 },
        { label: '海商法',      personal: 70, avg: 65, target: 80 },
        { label: '国际仲裁',    personal: 82, avg: 75, target: 88 }
      ],
      trendData: [75, 78, 74, 82, 85, 91],
      trendLabels: ['2月', '3月', '4月', '5月', '6月', '7月'],
      radarData: [85, 72, 78, 65, 70, 82],
      radarLabels: ['国际法', '涉外民商法', '国际贸易法', '国际投资法', '海商法', '国际仲裁'],
      radarTargets: [85, 85, 80, 82, 80, 88],
      // ===== 图表动画与交互状态 =====
      trendHover: -1,
      radarHover: -1,
      _trendSize: null,
      _radarSize: null,
      _trendOk: false,
      _radarOk: false,
      _animFrame: null,
      _hasShown: false,
      _trendPoints: null,
      _radarPoints: null,
      trendRect: null,
      radarRect: null
    }
  },
  computed: {
    // 显示名：填了姓名显示姓名，否则显示登录账号
    displayName() {
      return getDisplayName()
    },
    displayRole() {
      return getLevelText()
    },
    avatarChar() {
      return (this.displayName || '用').slice(0, 1)
    },
    todayDateText() {
      const now = new Date()
      const y = now.getFullYear()
      const m = String(now.getMonth() + 1).padStart(2, '0')
      const d = String(now.getDate()).padStart(2, '0')
      return `${y}年${m}月${d}日`
    },
    /**
     * 能力维度测评对比数据
     * 等级计算方法（多维度加权综合评分）：
     *
     * 【指标1：目标达成率】权重 50%
     *   公式：achieveScore = min(100, (personal / target) * 100)
     *   含义：实际得分达到目标得分的比例，满分为100
     *
     * 【指标2：群体超越度】权重 30%
     *   公式：surpassScore = min(100, max(0, ((personal - avg) / avg) * 100 + 70))
     *   含义：相较群体平均的相对位置，70为基准（持平平均），超15%即满分
     *
     * 【指标3：缺口修正度】权重 20%
     *   公式：gapFixScore = max(0, 100 - gapPct * 2)
     *   含义：缺口越大扣分越多，每1%缺口扣2分
     *
     * 综合得分：total = achieveScore * 0.5 + surpassScore * 0.3 + gapFixScore * 0.2
     *
     * 等级划分：
     *   S 卓越  ≥ 90
     *   A 优秀  80 ~ 90
     *   B 良好  70 ~ 80
     *   C 中等  60 ~ 70
     *   D 待提升 < 60
     */
    comparisonData() {
      return this.rawComparison.map(item => {
        const { label, personal, avg, target } = item

        // 缺口百分比（相对目标）
        const gapPct = Math.max(0, ((target - personal) / target) * 100)
        // 达成率百分比
        const achievePct = Math.min(100, (personal / target) * 100)

        // 指标1：目标达成率（50%）
        const achieveScore = Math.min(100, achievePct)

        // 指标2：群体超越度（30%）：以70为基准，超平均越多越高
        const relativeSurpass = avg > 0 ? ((personal - avg) / avg) * 100 : 0
        const surpassScore = Math.min(100, Math.max(0, 70 + relativeSurpass * 2))

        // 指标3：缺口修正度（20%）：缺口越小越好
        const gapFixScore = Math.max(0, 100 - gapPct * 2)

        // 综合得分
        const totalScore = achieveScore * 0.5 + surpassScore * 0.3 + gapFixScore * 0.2

        // 等级评定
        let levelLetter, levelText, levelClass
        if (totalScore >= 90) {
          levelLetter = 'S'
          levelText = '卓越'
          levelClass = 's'
        } else if (totalScore >= 80) {
          levelLetter = 'A'
          levelText = '优秀'
          levelClass = 'a'
        } else if (totalScore >= 70) {
          levelLetter = 'B'
          levelText = '良好'
          levelClass = 'b'
        } else if (totalScore >= 60) {
          levelLetter = 'C'
          levelText = '中等'
          levelClass = 'c'
        } else {
          levelLetter = 'D'
          levelText = '待提升'
          levelClass = 'd'
        }

        // 缺口等级分类（用于进度条颜色和缺口标签颜色）
        let gapLevelClass = 'gap-excellent'
        let fillClass = 'fill-excellent'
        if (gapPct > 0 && gapPct <= 10) {
          gapLevelClass = 'gap-normal'
          fillClass = 'fill-normal'
        } else if (gapPct > 10) {
          gapLevelClass = 'gap-warning'
          fillClass = 'fill-warning'
        }

        return {
          label,
          personal,
          avg,
          target,
          gapPct,
          achievePct,
          achieveScore: Number(achieveScore.toFixed(2)),
          surpassScore: Number(surpassScore.toFixed(2)),
          gapFixScore: Number(gapFixScore.toFixed(2)),
          totalScore: Number(totalScore.toFixed(2)),
          levelLetter,
          levelText,
          levelClass,
          gapLevelClass,
          fillClass
        }
      })
    },
    radarGapData() {
      return this.radarData.map((actual, i) => {
        const target = this.radarTargets[i]
        const gapPct = ((target - actual) / target) * 100
        let gapClass = 'gap-normal'
        let fillClass = 'fill-normal'
        if (gapPct <= 0) {
          gapClass = 'gap-excellent'
          fillClass = 'fill-excellent'
        } else if (gapPct > 10) {
          gapClass = 'gap-warning'
          fillClass = 'fill-warning'
        }
        return {
          name: this.radarLabels[i],
          actual: actual,
          target: target,
          gapPct: Math.max(0, gapPct),
          gapClass: gapClass,
          fillClass: fillClass
        }
      })
    }
  },
  methods: {
    navigateTo(url) {
      uni.navigateTo({ url })
    },
    handleLogout() {
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
    },
    getCanvasSize(canvasId) {
      return new Promise((resolve) => {
        const query = uni.createSelectorQuery().in(this)
        query.select('#' + canvasId).boundingClientRect()
        query.select('.chart-canvas-wrap.radar-chart').boundingClientRect()
        query.select('.chart-canvas-wrap.line-chart').boundingClientRect()
        query.exec((res) => {
          if (!res || res.length === 0) return resolve(null)
          // 优先返回 canvas 自身尺寸
          const canvasRect = res[0]
          if (canvasRect && canvasRect.width > 0 && canvasRect.height > 0) {
            if (canvasId === 'trendCanvas') this.trendRect = canvasRect
            else if (canvasId === 'radarCanvas') this.radarRect = canvasRect
            return resolve({ w: canvasRect.width, h: canvasRect.height })
          }
          // 否则根据传入 id 返回对应容器尺寸作为 fallback
          const wrapRect = canvasId === 'radarCanvas' ? res[1] : res[2]
          if (wrapRect && wrapRect.width > 0) {
            if (canvasId === 'trendCanvas') this.trendRect = wrapRect
            else if (canvasId === 'radarCanvas') this.radarRect = wrapRect
            return resolve({
              w: Math.max(wrapRect.width - 2, 300),
              h: Math.max(wrapRect.height > 0 ? wrapRect.height - 2 : 300, 300)
            })
          }
          resolve(null)
        })
      })
    },
    async drawTrendChart(progress = 1, hoverIndex = -1, cachedSize = null) {
      try {
        const size = cachedSize || await this.getCanvasSize('trendCanvas')
        const ctx = uni.createCanvasContext('trendCanvas', this)
        const W = size && size.w ? Math.max(size.w, 360) : 420
        const H = size && size.h ? Math.max(size.h, 280) : 300
        const brandColor = '#2563EB'
        const gridColor = '#E2E8F0'
        const mutedColor = '#64748B'

        const padTop = Math.max(18, Math.round(H * 0.08))
        const padBottom = Math.max(28, Math.round(H * 0.12))
        const padLeft = Math.max(34, Math.round(W * 0.09))
        const padRight = Math.max(18, Math.round(W * 0.05))
        const plotH = Math.max(160, H - padTop - padBottom)
        const plotW = Math.max(240, W - padLeft - padRight)
        const fontSize = Math.max(11, Math.round(W * 0.026))
        const dotR = Math.max(3.5, Math.round(W * 0.01))
        const lineW = Math.max(2, Math.round(W * 0.005))

        ctx.setFillStyle('#FFFFFF')
        ctx.fillRect(0, 0, W, H)

        ctx.setStrokeStyle(gridColor)
        ctx.setLineWidth(1)
        const gridRows = 4
        for (let i = 0; i <= gridRows; i++) {
          const y = padTop + (plotH / gridRows) * i
          ctx.beginPath()
          ctx.moveTo(padLeft, y)
          ctx.lineTo(W - padRight, y)
          ctx.stroke()
        }

        ctx.setFontSize(fontSize)
        ctx.setFillStyle(mutedColor)
        const minVal = 60
        const maxVal = 100
        for (let i = 0; i <= gridRows; i++) {
          const y = padTop + (plotH / gridRows) * i
          const val = maxVal - ((maxVal - minVal) / gridRows) * i
          const textW = ctx.measureText ? ctx.measureText(String(val)).width : 20
          ctx.fillText(String(val), Math.max(2, padLeft - textW - 6), y + fontSize / 3)
        }

        const N = this.trendLabels.length
        const xStep = plotW / Math.max(1, (N - 1))
        this.trendLabels.forEach((label, i) => {
          const x = padLeft + i * xStep
          const textW = ctx.measureText ? ctx.measureText(label).width : 22
          ctx.fillText(label, Math.max(2, x - textW / 2), H - padBottom / 3)
        })

        const data = this.trendData
        const points = data.map((v, i) => {
          const x = padLeft + i * xStep
          const y = padTop + ((maxVal - v) / (maxVal - minVal)) * plotH
          return { x: Math.round(x), y: Math.round(y) }
        })
        this._trendPoints = points

        // 动画进度：折线从起点逐段向左向右延伸
        const p = Math.max(0, Math.min(1, progress))
        const lineEnd = Math.max(0, (points.length - 1) * p)
        const drawnCount = Math.floor(lineEnd) + 1
        const lastIdx = Math.min(points.length - 1, Math.floor(lineEnd))
        const frac = lineEnd - Math.floor(lineEnd)
        const segX = lastIdx + 1 < points.length
          ? points[lastIdx].x + (points[lastIdx + 1].x - points[lastIdx].x) * frac
          : points[lastIdx].x
        const segY = lastIdx + 1 < points.length
          ? points[lastIdx].y + (points[lastIdx + 1].y - points[lastIdx].y) * frac
          : points[lastIdx].y

        // 面积渐变（随进度淡入）
        ctx.beginPath()
        ctx.moveTo(points[0].x, padTop + plotH)
        for (let i = 0; i <= lastIdx; i++) ctx.lineTo(points[i].x, points[i].y)
        ctx.lineTo(segX, segY)
        ctx.lineTo(segX, padTop + plotH)
        ctx.closePath()
        const gradient = ctx.createLinearGradient(0, padTop, 0, padTop + plotH)
        gradient.addColorStop(0, `rgba(37,99,235,${(0.28 * p).toFixed(3)})`)
        gradient.addColorStop(1, `rgba(37,99,235,${(0.04 * p).toFixed(3)})`)
        ctx.setFillStyle(gradient)
        ctx.fill()

        // 折线（随进度延伸）
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        for (let i = 1; i <= lastIdx; i++) ctx.lineTo(points[i].x, points[i].y)
        ctx.lineTo(segX, segY)
        ctx.setStrokeStyle(brandColor)
        ctx.setLineWidth(lineW)
        ctx.stroke()

        // 数据点（淡入）
        ctx.setGlobalAlpha(Math.min(1, p * 1.6))
        ctx.setFillStyle('#FFFFFF')
        for (let i = 0; i < drawnCount; i++) {
          ctx.beginPath()
          ctx.arc(points[i].x, points[i].y, dotR + 1.5, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.setFillStyle(brandColor)
        for (let i = 0; i < drawnCount; i++) {
          ctx.beginPath()
          ctx.arc(points[i].x, points[i].y, dotR, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.setGlobalAlpha(1)

        // 动画结束后在末点加柔和光晕
        if (p >= 1 && hoverIndex < 0) {
          const lp = points[points.length - 1]
          ctx.setStrokeStyle('rgba(37,99,235,0.30)')
          ctx.setLineWidth(1.5)
          ctx.beginPath()
          ctx.arc(lp.x, lp.y, dotR + 6, 0, Math.PI * 2)
          ctx.stroke()
        }

        // 悬停交互：引导线 + 高亮 + 气泡提示
        if (hoverIndex >= 0 && hoverIndex < points.length) {
          const hp = points[hoverIndex]
          ctx.setStrokeStyle('rgba(37,99,235,0.22)')
          ctx.setLineWidth(1)
          ctx.beginPath()
          ctx.moveTo(hp.x, padTop)
          ctx.lineTo(hp.x, padTop + plotH)
          ctx.stroke()

          ctx.setFillStyle('rgba(37,99,235,0.12)')
          ctx.beginPath()
          ctx.arc(hp.x, hp.y, dotR + 9, 0, Math.PI * 2)
          ctx.fill()

          ctx.setStrokeStyle(brandColor)
          ctx.setLineWidth(2)
          ctx.beginPath()
          ctx.arc(hp.x, hp.y, dotR + 4.5, 0, Math.PI * 2)
          ctx.stroke()

          this.drawTooltip(ctx, `${this.trendLabels[hoverIndex]}  ${this.trendData[hoverIndex]}分`, hp.x, hp.y, W, H)
        }

        ctx.draw()
      } catch (e) {
        console.error('[drawTrendChart] error:', e)
      }
    },
    async drawRadarChart(progress = 1, hoverIndex = -1, cachedSize = null) {
      try {
        const size = cachedSize || await this.getCanvasSize('radarCanvas')
        const ctx = uni.createCanvasContext('radarCanvas', this)
        const W = size && size.w ? Math.max(size.w, 320) : 360
        const H = size && size.h ? Math.max(size.h, 320) : 340
        const cx = W / 2
        const cy = H / 2
        const availMin = Math.min(W, H)
        const R = Math.max(70, availMin * 0.36)
        const brandColor = '#2563EB'
        const gridColor = '#E2E8F0'
        const mutedColor = '#64748B'
        const fontSize = Math.max(11, Math.round(availMin * 0.042))
        const labelDist = Math.max(18, R * 0.30)
        const dotR = Math.max(2.5, Math.round(availMin * 0.012))

        ctx.setFillStyle('#FFFFFF')
        ctx.fillRect(0, 0, W, H)

        const levels = [20, 40, 60, 80, 100]
        const sides = 6
        levels.forEach(level => {
          const r = (level / 100) * R
          ctx.beginPath()
          ctx.setStrokeStyle(gridColor)
          ctx.setLineWidth(1)
          for (let i = 0; i < sides; i++) {
            const angle = (Math.PI * 2 / sides) * i - Math.PI / 2
            const x = cx + r * Math.cos(angle)
            const y = cy + r * Math.sin(angle)
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.closePath()
          ctx.stroke()
        })

        for (let i = 0; i < sides; i++) {
          const angle = (Math.PI * 2 / sides) * i - Math.PI / 2
          ctx.beginPath()
          ctx.moveTo(cx, cy)
          ctx.lineTo(cx + R * Math.cos(angle), cy + R * Math.sin(angle))
          ctx.setStrokeStyle(gridColor)
          ctx.stroke()
        }

        // 动画进度：数据多边形由中心向外生长 + 淡入
        const p = Math.max(0, Math.min(1, progress))
        const data = this.radarData
        const pts = data.map((v, i) => {
          const angle = (Math.PI * 2 / sides) * i - Math.PI / 2
          const r = (Math.max(0, Math.min(100, v)) / 100) * R * p
          return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
        })
        this._radarPoints = pts

        ctx.beginPath()
        pts.forEach((pt, i) => {
          if (i === 0) ctx.moveTo(pt.x, pt.y)
          else ctx.lineTo(pt.x, pt.y)
        })
        ctx.closePath()
        ctx.setFillStyle(`rgba(37,99,235,${(0.20 * p).toFixed(3)})`)
        ctx.fill()
        ctx.setStrokeStyle(`rgba(37,99,235,${Math.min(1, p * 1.4).toFixed(3)})`)
        ctx.setLineWidth(2)
        ctx.stroke()

        // 顶点圆点（淡入）
        ctx.setGlobalAlpha(Math.min(1, p * 1.6))
        pts.forEach(pt => {
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, dotR + 1.2, 0, Math.PI * 2)
          ctx.setFillStyle('#FFFFFF')
          ctx.fill()
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, dotR, 0, Math.PI * 2)
          ctx.setFillStyle(brandColor)
          ctx.fill()
        })
        ctx.setGlobalAlpha(1)

        // 标签
        ctx.setFontSize(fontSize)
        ctx.setFillStyle(mutedColor)
        this.radarLabels.forEach((label, i) => {
          const angle = (Math.PI * 2 / sides) * i - Math.PI / 2
          const lx = cx + (R + labelDist) * Math.cos(angle)
          const ly = cy + (R + labelDist) * Math.sin(angle)
          const textW = ctx.measureText ? ctx.measureText(label).width : 44
          let tx = lx - textW / 2
          let ty = ly + fontSize / 3
          if (tx < 2) tx = 2
          if (tx + textW > W) tx = W - textW - 2
          if (ty < fontSize) ty = fontSize
          if (ty > H) ty = H - 2
          ctx.fillText(label, tx, ty)
        })

        // 悬停交互：高亮顶点 + 气泡提示
        if (hoverIndex >= 0 && hoverIndex < pts.length) {
          const hp = pts[hoverIndex]
          ctx.setFillStyle('rgba(37,99,235,0.12)')
          ctx.beginPath()
          ctx.arc(hp.x, hp.y, dotR + 9, 0, Math.PI * 2)
          ctx.fill()
          ctx.setStrokeStyle(brandColor)
          ctx.setLineWidth(2)
          ctx.beginPath()
          ctx.arc(hp.x, hp.y, dotR + 4.5, 0, Math.PI * 2)
          ctx.stroke()
          this.drawTooltip(ctx, `${this.radarLabels[hoverIndex]}  ${this.radarData[hoverIndex]}分`, hp.x, hp.y, W, H)
        }

        ctx.draw()
      } catch (e) {
        console.error('[drawRadarChart] error:', e)
      }
    },
    /* ===== 图表动画 ===== */
    animateChart(drawFn, duration = 1000) {
      const self = this
      return new Promise((resolve) => {
        const start = Date.now()
        const step = () => {
          const t = Math.min(1, (Date.now() - start) / duration)
          const eased = 1 - Math.pow(1 - t, 3)
          drawFn(eased)
          if (t < 1) {
            self._animFrame = requestAnimationFrame(step)
          } else {
            drawFn(1)
            self._animFrame = null
            resolve()
          }
        }
        step()
      })
    },
    animateTrend() {
      this.getCanvasSize('trendCanvas').then((size) => {
        if (!size || size.w <= 0) return
        this._trendSize = size
        this._trendOk = true
        this.animateChart((p) => {
          this.drawTrendChart(p, this.trendHover, this._trendSize)
        }, 1000)
      })
    },
    animateRadar() {
      this.getCanvasSize('radarCanvas').then((size) => {
        if (!size || size.w <= 0) return
        this._radarSize = size
        this._radarOk = true
        this.animateChart((p) => {
          this.drawRadarChart(p, this.radarHover, this._radarSize)
        }, 1100)
      })
    },
    drawTooltip(ctx, text, x, y, W, H) {
      ctx.setFontSize(12)
      const tw = (ctx.measureText ? ctx.measureText(text).width : 96) + 18
      const th = 26
      const r = 6
      let bx = x - tw / 2
      if (bx < 4) bx = 4
      if (bx + tw > W - 4) bx = W - tw - 4
      let by = y - th - 12
      if (by < 4) by = y + 16
      ctx.setFillStyle('rgba(15,23,42,0.88)')
      ctx.beginPath()
      ctx.moveTo(bx + r, by)
      ctx.lineTo(bx + tw - r, by)
      ctx.quadraticCurveTo(bx + tw, by, bx + tw, by + r)
      ctx.lineTo(bx + tw, by + th - r)
      ctx.quadraticCurveTo(bx + tw, by + th, bx + tw - r, by + th)
      ctx.lineTo(bx + r, by + th)
      ctx.quadraticCurveTo(bx, by + th, bx, by + th - r)
      ctx.lineTo(bx, by + r)
      ctx.quadraticCurveTo(bx, by, bx + r, by)
      ctx.closePath()
      ctx.fill()
      ctx.setFillStyle('#FFFFFF')
      ctx.fillText(text, bx + 9, by + th / 2 + 4)
    },
    /* ===== 图表交互 ===== */
    getCanvasPoint(e, chart) {
      const t = (e && e.touches && e.touches[0]) ? e.touches[0] : e
      let x = t ? t.x : undefined
      let y = t ? t.y : undefined
      if ((x === undefined || y === undefined) && t && t.offsetX !== undefined) {
        x = t.offsetX
        y = t.offsetY
      }
      if (x === undefined || y === undefined) {
        const rect = chart === 'trend' ? this.trendRect : this.radarRect
        const src = (t && t.clientX !== undefined) ? t : (e && e.changedTouches && e.changedTouches[0])
        if (rect && src) {
          x = src.clientX - rect.left
          y = src.clientY - rect.top
        }
      }
      if (x === undefined || y === undefined) return null
      return { x, y }
    },
    hitTestTrend(pt) {
      const pts = this._trendPoints
      if (!pts || pts.length === 0) return -1
      let best = -1
      let bestDist = 32
      pts.forEach((p, i) => {
        const d = Math.hypot(pt.x - p.x, pt.y - p.y)
        if (d < bestDist) { bestDist = d; best = i }
      })
      return best
    },
    hitTestRadar(pt) {
      const pts = this._radarPoints
      if (!pts || pts.length === 0) return -1
      let best = -1
      let bestDist = 32
      pts.forEach((p, i) => {
        const d = Math.hypot(pt.x - p.x, pt.y - p.y)
        if (d < bestDist) { bestDist = d; best = i }
      })
      return best
    },
    handleCanvasMove(e, chart) {
      const pt = this.getCanvasPoint(e, chart)
      if (!pt) return
      const idx = chart === 'trend' ? this.hitTestTrend(pt) : this.hitTestRadar(pt)
      const key = chart === 'trend' ? 'trendHover' : 'radarHover'
      if (this[key] !== idx) {
        this[key] = idx
        if (chart === 'trend') this.drawTrendChart(1, idx, this._trendSize)
        else this.drawRadarChart(1, idx, this._radarSize)
      }
    },
    handleCanvasLeave(chart) {
      const key = chart === 'trend' ? 'trendHover' : 'radarHover'
      if (this[key] !== -1) {
        this[key] = -1
        if (chart === 'trend') this.drawTrendChart(1, -1, this._trendSize)
        else this.drawRadarChart(1, -1, this._radarSize)
      }
    },
    onTrendMove(e) { this.handleCanvasMove(e, 'trend') },
    onTrendLeave() { this.handleCanvasLeave('trend') },
    onTrendEnd() { this.handleCanvasLeave('trend') },
    onTrendTap(e) {
      const pt = this.getCanvasPoint(e, 'trend')
      if (!pt) return
      const idx = this.hitTestTrend(pt)
      this.trendHover = idx
      this.drawTrendChart(1, idx, this._trendSize)
    },
    onRadarMove(e) { this.handleCanvasMove(e, 'radar') },
    onRadarLeave() { this.handleCanvasLeave('radar') },
    onRadarEnd() { this.handleCanvasLeave('radar') },
    onRadarTap(e) {
      const pt = this.getCanvasPoint(e, 'radar')
      if (!pt) return
      const idx = this.hitTestRadar(pt)
      this.radarHover = idx
      this.drawRadarChart(1, idx, this._radarSize)
    }
  },
  onReady() {
    // 立即动画绘制 + 延时双保险，解决容器首帧尺寸未就绪的问题
    this.animateTrend()
    this.animateRadar()
    setTimeout(() => {
      if (!this._trendOk) this.animateTrend()
      if (!this._radarOk) this.animateRadar()
    }, 500)
    setTimeout(() => {
      if (!this._trendOk) this.animateTrend()
      if (!this._radarOk) this.animateRadar()
    }, 1200)
  },
  onShow() {
    // 首次展示由 onReady 负责，避免重复动画
    if (!this._hasShown) {
      this._hasShown = true
      return
    }
    // 页面重新显示时补绘，防止后台切换导致画布清空
    setTimeout(() => {
      this._trendOk = false
      this._radarOk = false
      this.animateTrend()
      this.animateRadar()
    }, 150)
  },
  beforeDestroy() {
    if (this._animFrame) {
      cancelAnimationFrame(this._animFrame)
      this._animFrame = null
    }
  }
}
</script>

<style scoped>
/* ============================================================
   涉外法治人才培养测评 - Brand CSS
   Style: Blue-White Professional, Modern & Comfortable
   Brand Prefix: rule
   ============================================================ */
.report-shell {
  /* === Brand Primary (single hue) === */
  --rule-primary: #2563EB;
  --rule-primary-hover: #1D4ED8;
  --rule-primary-active: #1E40AF;
  --rule-primary-foreground: #FFFFFF;
  --rule-primary-tint-1: #DBEAFE;
  --rule-primary-tint-2: #BFDBFE;
  --rule-primary-tint-3: #EFF6FF;

  /* === Semantic Aliases === */
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

  /* === Radius Scale === */
  --rule-radius-small: 4px;
  --rule-radius-medium: 8px;
  --rule-radius-large: 16px;
  --rule-radius-full: 9999px;

  /* === State Colors === */
  --state-success: #16A34A;
  --state-success-tint: #DCFCE7;
  --state-warning: #D97706;
  --state-warning-tint: #FEF3C7;
  --state-error: #DC2626;
  --state-error-tint: #FEE2E2;
  --state-info: #2563EB;
  --state-info-tint: #DBEAFE;

  /* === Neutrals === */
  --rule-ink: #0F172A;
  --rule-ink-2: #475569;
  --rule-ink-3: #94A3B8;
  --rule-line: #E2E8F0;
  --rule-surface: #FFFFFF;
  --rule-surface-2: #F8FAFC;

  /* === Shadows === */
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

/* ============================================================
   Shell Layout
   ============================================================ */
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
.app-nav-item.is-active {
  background: var(--rule-primary);
  color: #FFFFFF;
}
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

/* ===== Sidebar User ===== */
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
.app-sidebar-user-name {
  display: block; font-size: 13px; font-weight: 500;
  color: var(--rule-foreground);
}
.app-sidebar-user-role {
  display: block; font-size: 12px;
  color: var(--rule-muted-foreground);
}

/* ===== Sidebar Logout Button ===== */
.app-sidebar-logout {
  display: flex; align-items: center; gap: 8px;
  margin: 8px 12px 0; padding: 10px 12px;
  border-radius: 8px; cursor: pointer;
  color: var(--rule-ink-2); font-size: 13px;
  transition: background 0.15s ease, color 0.15s ease;
}
.app-sidebar-logout:hover {
  background: var(--state-error-tint);
  color: var(--state-error);
}
.app-sidebar-logout-icon {
  width: 16px; height: 16px; flex-shrink: 0;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>") center/contain no-repeat;
}
.app-sidebar-logout-text {
  font-size: 13px; font-weight: 500;
}

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

/* ============================================================
   Page-specific CSS
   ============================================================ */
.dc-section { margin-bottom: 24px; }
.dc-section:last-child { margin-bottom: 0; }

/* === KPI Cards === */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.kpi-card {
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: border-color 0.15s ease, transform 0.15s cubic-bezier(.2,.8,.2,1);
  min-width: 0;
}
.kpi-card:hover { border-color: var(--rule-primary-tint-2); transform: translateY(-2px); }
.kpi-card-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.kpi-card-label { font-size: 13px; color: var(--rule-muted-foreground); font-weight: 500; }
.kpi-card-icon {
  width: 36px; height: 36px; border-radius: 8px;
  background: var(--rule-primary-tint-3);
  display: flex; align-items: center; justify-content: center;
  color: var(--rule-primary); flex-shrink: 0;
}
.kpi-icon {
  width: 20px; height: 20px; background: currentColor;
  -webkit-mask-size: contain; mask-size: contain;
  -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
  -webkit-mask-position: center; mask-position: center;
}
.kpi-icon-trend {
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='22 7 13.5 15.5 8.5 10.5 2 17'/><polyline points='16 7 22 7 22 13'/></svg>");
          mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='22 7 13.5 15.5 8.5 10.5 2 17'/><polyline points='16 7 22 7 22 13'/></svg>");
}
.kpi-icon-award {
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='8' r='6'/><path d='M15.477 12.89 17 22l-5-3-5 3 1.523-9.11'/></svg>");
          mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='8' r='6'/><path d='M15.477 12.89 17 22l-5-3-5 3 1.523-9.11'/></svg>");
}
.kpi-icon-check {
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'/><polyline points='22 4 12 14.01 9 11.01'/></svg>");
          mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'/><polyline points='22 4 12 14.01 9 11.01'/></svg>");
}
.kpi-icon-users {
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M22 21v-2a4 4 0 0 0-3-3.87'/><path d='M16 3.13a4 4 0 0 1 0 7.75'/></svg>");
          mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M22 21v-2a4 4 0 0 0-3-3.87'/><path d='M16 3.13a4 4 0 0 1 0 7.75'/></svg>");
}
.kpi-card-value {
  font-size: 28px; font-weight: 700; line-height: 1.1;
  color: var(--rule-foreground);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}
.kpi-card-trend {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 12px; color: var(--state-success); font-weight: 500;
}
.kpi-card-trend.new-record { color: var(--rule-primary); }
.kpi-arrow-up {
  width: 14px; height: 14px; background: currentColor;
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='22 7 13.5 15.5 8.5 10.5 2 17'/><polyline points='16 7 22 7 22 13'/></svg>");
          mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='22 7 13.5 15.5 8.5 10.5 2 17'/><polyline points='16 7 22 7 22 13'/></svg>");
  -webkit-mask-size: contain; mask-size: contain;
  -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
  -webkit-mask-position: center; mask-position: center;
}
.kpi-icon-star-sm {
  width: 14px; height: 14px; background: currentColor;
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='8' r='6'/><path d='M15.477 12.89 17 22l-5-3-5 3 1.523-9.11'/></svg>");
          mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='8' r='6'/><path d='M15.477 12.89 17 22l-5-3-5 3 1.523-9.11'/></svg>");
  -webkit-mask-size: contain; mask-size: contain;
  -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
  -webkit-mask-position: center; mask-position: center;
}

/* === Charts Row === */
.charts-row {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 20px;
}
.chart-card {
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.chart-card-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 12px; margin-bottom: 20px;
}
.chart-card-title { font-size: 16px; font-weight: 600; color: var(--rule-foreground); }
.chart-card-subtitle { font-size: 13px; color: var(--rule-muted-foreground); margin-top: 4px; }
.chart-filter {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 13px; color: var(--rule-ink-2);
  border: 1px solid var(--rule-border);
  border-radius: var(--rule-radius-medium);
  padding: 6px 10px; cursor: pointer; white-space: nowrap;
  transition: border-color 0.15s ease, color 0.15s ease;
}
.chart-filter:hover { border-color: var(--rule-primary-tint-2); color: var(--rule-primary); }
.chevron-down {
  width: 14px; height: 14px; background: currentColor;
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
          mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
  -webkit-mask-size: contain; mask-size: contain;
  -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
  -webkit-mask-position: center; mask-position: center;
}
.chart-canvas-wrap {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chart-canvas-wrap.chart-centered .chart-canvas {
  display: block;
  margin: 0 auto;
}
.chart-canvas-wrap.line-chart { min-height: 300px; }
.chart-canvas-wrap.radar-chart { min-height: 340px; }
.chart-canvas {
  width: 100%; height: 340px;
  cursor: pointer;
  touch-action: pan-y;
  -webkit-user-select: none; user-select: none;
}

/* === Comparison Table === */
.table-card {
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: 12px;
  padding: 24px;
  min-width: 0;
}
/* ===== Level Standard ===== */
.level-standard {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px 18px;
  margin-bottom: 18px;
  background: linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%);
  border: 1px solid var(--rule-primary-tint-1);
  border-radius: 14px;
}
.ls-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--rule-foreground);
  display: flex;
  align-items: center;
}
.ls-title::before {
  content: '';
  width: 4px;
  height: 14px;
  background: var(--rule-primary);
  border-radius: 4px;
  margin-right: 8px;
}
.ls-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.ls-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px 5px 6px;
  background: #FFFFFF;
  border: 1px solid var(--rule-border);
  border-radius: 999px;
  box-shadow: 0 1px 4px -2px rgba(15, 23, 42, 0.06);
}
.ls-badge {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  color: #fff;
  line-height: 1;
}
.ls-badge.level-s { background: linear-gradient(135deg, #F59E0B, #D97706); box-shadow: 0 2px 6px -2px rgba(217,119,6,0.5); }
.ls-badge.level-a { background: linear-gradient(135deg, #16A34A, #15803D); box-shadow: 0 2px 6px -2px rgba(22,163,74,0.5); }
.ls-badge.level-b { background: linear-gradient(135deg, #2563EB, #1D4ED8); box-shadow: 0 2px 6px -2px rgba(37,99,235,0.5); }
.ls-badge.level-c { background: linear-gradient(135deg, #6366F1, #4F46E5); box-shadow: 0 2px 6px -2px rgba(99,102,241,0.5); }
.ls-badge.level-d { background: linear-gradient(135deg, #DC2626, #B91C1C); box-shadow: 0 2px 6px -2px rgba(220,38,38,0.5); }
.ls-name { font-size: 12px; font-weight: 600; color: var(--rule-foreground); }
.ls-desc { font-size: 11px; color: var(--rule-muted-foreground); }

.ls-formula {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px dashed rgba(37,99,235,0.2);
  font-size: 12px;
  color: var(--rule-muted-foreground);
}
.lf-title { font-weight: 600; color: var(--rule-primary); }
.lf-text { font-family: 'Courier New', monospace; color: var(--rule-ink-2); }

/* ===== Gap Table ===== */
.table-container { overflow-x: auto; }
.dc-table { width: 100%; min-width: 640px; }
.dc-table-gap { min-width: 760px; }
.dc-table-thead {
  display: flex; flex-direction: row;
  border-bottom: 2px solid var(--rule-primary-tint-1);
  background: linear-gradient(180deg, #F8FAFC 0%, transparent 100%);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.dc-table-th {
  flex: 1; font-size: 13px; font-weight: 600;
  color: var(--rule-ink-2);
  padding: 14px 16px; text-align: left;
  white-space: nowrap;
}
.dc-table-gap .dc-th-dim { flex: 0 0 26%; }
.dc-table-gap .dc-th-gap { flex: 1; }
.dc-table-gap .dc-th-level { flex: 0 0 24%; }
.gap-th { display: flex; align-items: baseline; gap: 6px; }
.gap-th-sub { font-size: 11px; font-weight: 400; color: var(--rule-muted-foreground); }

.dc-table-tbody { display: flex; flex-direction: column; }
.dc-table-tr {
  display: flex; flex-direction: row;
  border-bottom: 1px solid var(--rule-border);
  transition: background 0.2s ease, transform 0.15s ease;
  min-height: 96px;
}
.dc-table-tr:last-child { border-bottom: none; }
.dc-table-tr:nth-child(even) { background: rgba(248, 250, 252, 0.5); }
.dc-table-tr:hover {
  background: var(--rule-primary-tint-3);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px -6px rgba(37,99,235,0.15);
}
.dc-table-td {
  flex: 1; font-size: 14px; color: var(--rule-foreground);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  min-height: 96px;
}
.dc-table-gap .dc-td-dim { flex: 0 0 26%; flex-direction: column; align-items: flex-start; justify-content: center; gap: 6px; }
.dc-table-gap .dc-td-gap { flex: 1; }
.dc-table-gap .dc-td-level { flex: 0 0 24%; }

.dim-name { font-size: 14px; font-weight: 600; color: var(--rule-foreground); }
.dim-meta {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--rule-muted-foreground);
}
.dm-actual { color: var(--rule-primary); font-weight: 600; font-variant-numeric: tabular-nums; }
.dm-target { color: var(--state-success); font-weight: 500; font-variant-numeric: tabular-nums; }
.dm-avg { color: var(--rule-ink-3); font-variant-numeric: tabular-nums; }
.dm-sep { color: var(--rule-border); }

/* Cell gap progress */
.cell-gap {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}
.cg-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 2px;
}
.cg-pct {
  font-size: 12.5px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.2px;
}
.cg-pct.gap-excellent { color: var(--state-success); }
.cg-pct.gap-normal { color: var(--rule-primary); }
.cg-pct.gap-warning { color: var(--state-warning); }
.cg-rate {
  font-size: 11.5px;
  color: var(--rule-muted-foreground);
  font-variant-numeric: tabular-nums;
}
.cg-track {
  position: relative;
  height: 10px;
  background: #F1F5F9;
  border-radius: 999px;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.06);
}
.cg-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}
.cg-fill.fill-excellent {
  background: linear-gradient(90deg, #22C55E 0%, #16A34A 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.35);
}
.cg-fill.fill-normal {
  background: linear-gradient(90deg, #3B82F6 0%, #2563EB 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.3);
}
.cg-fill.fill-warning {
  background: linear-gradient(90deg, #F59E0B 0%, #D97706 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.3);
}
.cg-legend {
  display: flex;
  justify-content: space-between;
  font-size: 10.5px;
  color: var(--rule-ink-3);
  font-variant-numeric: tabular-nums;
  margin-top: -2px;
}
.cgl-50 { position: absolute; left: 50%; transform: translateX(-50%); display: none; }
.cgl-target { color: var(--rule-muted-foreground); }

/* Level card */
.level-card {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid transparent;
  background: #fff;
  min-width: 132px;
  width: 100%;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04);
}
.level-card.lc-s {
  background: linear-gradient(135deg, #FFFBEB, #FEF3C7);
  border-color: #F59E0B;
  box-shadow: 0 4px 14px -6px rgba(245,158,11,0.4);
}
.level-card.lc-a {
  background: linear-gradient(135deg, #F0FDF4, #DCFCE7);
  border-color: #22C55E;
  box-shadow: 0 4px 14px -6px rgba(34,197,94,0.4);
}
.level-card.lc-b {
  background: linear-gradient(135deg, #EFF6FF, #DBEAFE);
  border-color: #3B82F6;
  box-shadow: 0 4px 14px -6px rgba(59,130,246,0.4);
}
.level-card.lc-c {
  background: linear-gradient(135deg, #EEF2FF, #E0E7FF);
  border-color: #6366F1;
  box-shadow: 0 4px 14px -6px rgba(99,102,241,0.4);
}
.level-card.lc-d {
  background: linear-gradient(135deg, #FEF2F2, #FEE2E2);
  border-color: #EF4444;
  box-shadow: 0 4px 14px -6px rgba(239,68,68,0.4);
}
.lc-letter {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  line-height: 1;
  flex-shrink: 0;
}
.lc-s .lc-letter { background: linear-gradient(135deg, #F59E0B, #D97706); }
.lc-a .lc-letter { background: linear-gradient(135deg, #22C55E, #16A34A); }
.lc-b .lc-letter { background: linear-gradient(135deg, #3B82F6, #2563EB); }
.lc-c .lc-letter { background: linear-gradient(135deg, #6366F1, #4F46E5); }
.lc-d .lc-letter { background: linear-gradient(135deg, #EF4444, #DC2626); }
.lc-right {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}
.lc-text { font-size: 13px; font-weight: 700; color: var(--rule-foreground); line-height: 1.2; }
.lc-score { font-size: 11px; color: var(--rule-muted-foreground); font-variant-numeric: tabular-nums; line-height: 1.2; }

/* Old table styles (kept for safety) */
.gap-pos { color: var(--state-success); font-weight: 600; font-variant-numeric: tabular-nums; }
.gap-neg { color: var(--state-error); font-weight: 600; font-variant-numeric: tabular-nums; }
.score-num { font-variant-numeric: tabular-nums; font-weight: 500; }
.level-tag {
  display: inline-flex; align-items: center;
  font-size: 12px; font-weight: 500;
  padding: 3px 10px; border-radius: var(--rule-radius-medium);
  white-space: nowrap;
}
.level-excellent { background: var(--state-success-tint); color: var(--state-success); }
.level-good { background: var(--state-info-tint); color: var(--rule-primary); }
.level-medium { background: var(--state-warning-tint); color: var(--state-warning); }

/* === Responsive === */
@media (max-width: 1024px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
  .charts-row { grid-template-columns: 1fr; }
  .chart-canvas-wrap.radar-chart { min-height: 340px; }
  .chart-canvas-wrap.line-chart { min-height: 300px; }
  .chart-canvas { height: 340px; }
  /* Table */
  .dc-table-gap { min-width: 720px; }
  .dc-table-gap .dc-th-dim,
  .dc-table-gap .dc-td-dim { flex: 0 0 28%; }
  .dc-table-gap .dc-th-level,
  .dc-table-gap .dc-td-level { flex: 0 0 26%; }
}
@media (max-width: 768px) {
  .app-sidebar { transform: translateX(-100%); transition: transform 0.3s; }
  .app-main { margin-left: 0; }
  .app-content { padding: 16px; }
  .chart-card { padding: 18px; }
  .chart-canvas-wrap.line-chart { min-height: 260px; }
  .chart-canvas-wrap.radar-chart { min-height: 300px; }
  .chart-canvas { height: 300px; }
  /* Table */
  .table-card { padding: 16px; }
  .level-standard { padding: 12px 14px; gap: 10px; margin-bottom: 14px; }
  .ls-list { gap: 7px; }
  .ls-item { padding: 4px 10px 4px 5px; }
  .dc-table-gap { min-width: 680px; }
  .dc-table-gap .dc-th-dim,
  .dc-table-gap .dc-td-dim { flex: 0 0 30%; padding: 12px 12px; }
  .dc-table-gap .dc-th-level,
  .dc-table-gap .dc-td-level { flex: 0 0 28%; padding: 12px 12px; }
  .dc-table-gap .dc-td-gap { padding: 12px 12px; }
  .dc-table-tr { min-height: 88px; }
  .dc-table-td { min-height: 88px; padding: 12px; }
  .level-card { padding: 8px 10px; min-width: 120px; gap: 10px; }
  .lc-letter { width: 32px; height: 32px; font-size: 16px; }
  .dim-meta { font-size: 11px; gap: 4px; }
  .cg-track { height: 8px; }
}
@media (max-width: 640px) {
  .kpi-grid { grid-template-columns: 1fr; }
  /* Table - allow horizontal scroll for small screens */
  .dc-table-gap { min-width: 520px; }
  .dc-table-gap .dc-th-dim,
  .dc-table-gap .dc-td-dim { flex: 0 0 34%; }
  .dc-table-gap .dc-th-level,
  .dc-table-gap .dc-td-level { flex: 0 0 30%; }
  .level-standard {
    border-radius: 12px;
  }
  .ls-formula { font-size: 11px; }
  .dc-table-tr:hover { transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .kpi-card, .dc-table-tr, .chart-filter, .gap-item-fill, .cg-fill { transition-duration: 0.01ms; }
  .kpi-card:hover { transform: none; }
  .dc-table-tr:hover { transform: none; }
}
</style>