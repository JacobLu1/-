<template>
  <view class="page-wrap">
    <!-- Status bar safe-area (iOS notch / Android punch-hole) -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    <!-- Top bar: search + avatar -->
    <view class="topbar">
      <view class="search">
        <text class="search-ico ri-search-line"></text>
        <input class="search-input" type="text" placeholder="搜索测评记录" placeholder-class="search-placeholder" />
      </view>
      <view class="avatar-btn" hover-class="avatar-hover" @click="navTo('/pages/profile/profile')">{{ avatarText }}</view>
    </view>

    <!-- Scrollable screen body -->
    <scroll-view scroll-y class="screen" scroll-with-animation>

      <!-- 1. Page header -->
      <view class="page-head reveal d1">
        <view>
          <text class="page-title">我的数据中心</text>
          <text class="page-sub">{{ displayName }} · 涉外法治学习画像</text>
        </view>
        <view class="chip">近6个月</view>
      </view>

      <!-- 2. Stats grid (4 mini cards) -->
      <view class="stats-grid">
        <view class="gmini reveal d1">
          <view class="stat-ico ico-brand">
            <text class="stat-ico-text ri-file-list-3-line"></text>
          </view>
          <view class="stat-num"><text class="num count">{{ stats.quizCount }}</text><text class="unit">次</text></view>
          <text class="stat-label">测评次数</text>
          <view class="stat-trend up">
            <text>累计统计</text>
          </view>
        </view>

        <view class="gmini reveal d2">
          <view class="stat-ico ico-violet">
            <text class="stat-ico-text ri-shield-check-line"></text>
          </view>
          <view class="stat-num"><text class="num count">{{ stats.avgScore }}</text></view>
          <text class="stat-label">平均得分</text>
          <view class="stat-trend up">
            <text>平均成绩</text>
          </view>
        </view>

        <view class="gmini reveal d1">
          <view class="stat-ico ico-amber">
            <text class="stat-ico-text ri-trophy-line"></text>
          </view>
          <view class="stat-num"><text class="num count">{{ stats.topScore }}</text></view>
          <text class="stat-label">最高得分</text>
          <view class="stat-trend up">
            <text>最高成绩</text>
          </view>
        </view>

        <view class="gmini reveal d2">
          <view class="stat-ico ico-green">
            <text class="stat-ico-text ri-user-3-line"></text>
          </view>
          <view class="stat-num"><text class="num count">Top {{ stats.rankPct }}%</text></view>
          <text class="stat-label">群体排名</text>
          <view class="stat-trend up">
            <text>个人画像</text>
          </view>
        </view>
      </view>

      <!-- 3. Line chart card -->
      <view class="card pad reveal d2" style="margin-top:16px;">
        <view class="card-head">
          <view class="card-title-row">
            <view class="title-bar"></view>
            <text class="card-title-text">个人成绩趋势</text>
          </view>
          <text class="card-sub">最近 8 次测评</text>
        </view>
        <view class="chart-wrap" id="lineChart">
          <canvas type="2d" id="lineChartCanvas" class="chart-canvas" :style="{ width: chartWidth + 'px', height: '190px' }"
            @touchstart="onChartTouch($event, 'lineChart')"
            @touchmove="onChartTouch($event, 'lineChart')"
            @touchend="onChartTouch($event, 'lineChart')"
          ></canvas>
        </view>
      </view>

      <!-- 4. Radar chart card -->
      <view class="card pad reveal d3" style="margin-top:16px;">
        <view class="card-head">
          <view class="card-title-row">
            <view class="title-bar"></view>
            <text class="card-title-text">能力维度分布</text>
          </view>
          <text class="card-sub">六维能力雷达</text>
        </view>
        <view class="chart-wrap" id="radarChart">
          <canvas type="2d" id="radarChartCanvas" class="chart-canvas radar-canvas" :style="{ width: radarWidth + 'px', height: '264px' }"
            @touchstart="onChartTouch($event, 'radarChart')"
            @touchmove="onChartTouch($event, 'radarChart')"
            @touchend="onChartTouch($event, 'radarChart')"
          ></canvas>
        </view>
      </view>

      <!-- 5. Dimension bars card -->
      <view class="card pad reveal d4" style="margin-top:16px;">
        <view class="card-head">
          <view class="card-title-row">
            <view class="title-bar"></view>
            <text class="card-title-text">能力维度测评</text>
          </view>
          <text class="card-sub">当前水平 / 目标 100</text>
        </view>

        <block v-if="dimensions.length">
          <view class="dim-row" v-for="(d, i) in dimensions" :key="i">
            <view class="dim-top">
              <text class="dim-name">{{ d.name }}</text>
              <view class="lvl" :class="d.levelClass">{{ d.levelLabel }}</view>
            </view>
            <view class="dim-bar">
              <view class="dim-fill" :style="{ width: d.animatedWidth + '%' }"></view>
              <view class="dim-target"></view>
            </view>
            <view class="dim-meta">
              <view>
                <text class="dim-score">{{ d.score }}</text>
                <text class="dim-score-max">/100</text>
              </view>
              <text class="dim-gap-label">缺口 <text class="dim-gap-num">{{ d.gap }}%</text></text>
            </view>
          </view>
        </block>
        <view v-else class="empty-note">暂无能力维度数据</view>
      </view>

      <!-- 7. 我的测评记录 -->
      <view class="card pad reveal d5" style="margin-top:16px;">
        <view class="card-head">
          <view class="card-title-row">
            <view class="title-bar"></view>
            <text class="card-title-text">我的测评记录</text>
          </view>
          <text class="card-sub">全部 ›</text>
        </view>
        <block v-if="quizRecords.length">
          <view class="record-row" v-for="(r, i) in quizRecords" :key="i">
            <view class="record-ico">
              <text class="record-ico-text ri-file-list-3-line"></text>
            </view>
            <view class="record-info">
              <view class="record-name">{{ r.name }}</view>
              <view class="record-date">{{ r.date }}</view>
            </view>
            <view class="record-score">
              <text class="record-score-num">{{ r.score }}</text>
              <text class="record-score-unit">分</text>
            </view>
            <view class="record-time">{{ r.time }}</view>
          </view>
        </block>
        <view v-else class="empty-note">暂无测评记录</view>
      </view>

      <!-- 6. Footer note -->
      <view class="foot-note reveal d5">
        <view class="foot-dot"></view>
        <text>数据来自 survey_result 测评记录</text>
      </view>

      <view style="height: 100rpx;"></view>
    </scroll-view>
  </view>
</template>

<script>
import * as echarts from 'echarts/core'
import { LineChart, RadarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, RadarComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// 按需注册，减小打包体积；动画为 ECharts 默认开启
echarts.use([LineChart, RadarChart, GridComponent, TooltipComponent, RadarComponent, CanvasRenderer])

export default {
  data() {
    return {
      statusBarHeight: 0,
      displayName: '用户',
      avatarText: '用',
      stats: {
        quizCount: 0,
        avgScore: 0,
        topScore: 0,
        rankPct: 0
      },

      chartWidth: 326,
      radarWidth: 300,

      lineData: [],

      radarData: [],

      quizRecords: [],

      dimensions: []
    }
  },
  onReady() {
    this.statusBarHeight = this.getStatusBarHeight()
  },
  async onShow() {
    this.loadUserInfo()
    await this.loadData()
    this.getChartWidths()
  },
  methods: {
    async loadData() {
      const token = uni.getStorageSync('token')
      if (!token) {
        this.applyRecords([])
        return
      }
      try {
        const surveyObj = uniCloud.importObject('survey')
        const r = await surveyObj.myResults({ token, page: 1, pageSize: 50 })
        if (r.errCode !== 0) {
          uni.showToast({ title: r.errMsg || '测评记录加载失败', icon: 'none' })
          this.applyRecords([])
          return
        }
        this.applyRecords(r.list || [])
      } catch (e) {
        uni.showToast({ title: (e && e.errMsg) || '测评记录加载失败', icon: 'none' })
        this.applyRecords([])
      }
    },
    applyRecords(list) {
      const scores = list.map(r => Number(r.score) || 0)
      this.stats = {
        quizCount: list.length,
        avgScore: scores.length ? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)) : 0,
        topScore: scores.length ? Math.max(...scores) : 0,
        rankPct: 0
      }
      this.lineData = [...scores].reverse().slice(0, 8)
      this.quizRecords = list.map(r => ({
        id: r._id,
        name: this.formatRecordName(r),
        date: this.formatDate(r.createDate),
        score: Number(r.score) || 0,
        time: r.time || '--'
      }))

      const dimMap = {}
      const dimCount = {}
      list.forEach(r => {
        ;(r.dimensions || []).forEach(d => {
          const name = d.name || '综合'
          dimMap[name] = (dimMap[name] || 0) + (Number(d.score) || 0)
          dimCount[name] = (dimCount[name] || 0) + 1
        })
      })
      this.dimensions = Object.keys(dimMap).map(name => {
        const score = Math.round(dimMap[name] / dimCount[name])
        return {
          name,
          score,
          levelClass: score >= 85 ? 'senior' : score >= 70 ? 'mid' : 'junior',
          levelLabel: score >= 85 ? '高级' : score >= 70 ? '中级' : '初级',
          gap: 100 - score,
          animatedWidth: 0
        }
      })

      const latest = list[0] || {}
      this.radarData = (latest.dimensions || []).map(d => ({
        label: d.name || '综合',
        value: Number(d.score) || 0
      }))
    },
    formatRecordName(r) {
      if (r.mode === 'special' && r.specialCategory) {
        return `${r.specialCategory}专项测评`
      }
      return '涉外法治综合测评'
    },
    formatDate(value) {
      if (!value) return '--'
      const d = new Date(value)
      if (isNaN(d.getTime())) return String(value)
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    },
    loadUserInfo() {
      const app = getApp()
      const user = (app && app.globalData && app.globalData.userInfo) || uni.getStorageSync('userInfo') || {}
      const name = (user && (user.name || user.account)) || '用户'
      this.displayName = String(name).trim() || '用户'
      this.avatarText = (this.displayName || '用').slice(0, 1).toUpperCase()
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
    navTo(url) {
      // tabbar 页面需要用 switchTab
      const tabbarPages = ['/pages/assessment/assessment', '/pages/index/index', '/pages/data/data']
      if (tabbarPages.includes(url)) {
        uni.switchTab({ url })
      } else {
        uni.navigateTo({ url })
      }
    },

    getChartWidths() {
      const query = uni.createSelectorQuery().in(this)
      query.select('.chart-wrap').boundingClientRect()
      query.exec(res => {
        if (res && res[0]) {
          this.chartWidth = res[0].width
          this.radarWidth = res[0].width
          this.initCharts()
          this.animateBars()
        }
      })
    },

    initCharts() {
      // 已初始化过的图表不重复创建，避免 echarts.init 重复实例化报错
      if (!this.lineChart) {
        this.initEChart('#lineChartCanvas', this.buildLineOption()).then(c => {
          if (c) this.lineChart = c
        })
      }
      if (!this.radarChart && this.radarData.length) {
        this.initEChart('#radarChartCanvas', this.buildRadarOption()).then(c => {
          if (c) this.radarChart = c
        })
      }
    },

    initEChart(canvasId, option) {
      const self = this
      return new Promise(resolve => {
        const query = uni.createSelectorQuery().in(self)
        query.select(canvasId)
          .fields({ node: true, size: true })
          .exec(res => {
            if (!res || !res[0] || !res[0].node) return resolve(null)
            const canvas = res[0].node
            const w = res[0].width
            const h = res[0].height

            // 使用新 API 获取像素比，配合 dpr 高清显示
            let dpr = 1
            try {
              dpr = uni.getWindowInfo().pixelRatio || 1
            } catch (e) {
              dpr = uni.getSystemInfoSync().pixelRatio || 1
            }

            // 该 canvas 已有实例则复用，仅 resize + 更新配置
            const existed = echarts.getInstanceByDom(canvas)
            if (existed) {
              existed.resize({ width: w, height: h })
              existed.setOption(option, true)
              return resolve(existed)
            }

            // 小程序 Canvas 2D 节点没有 addEventListener/removeEventListener，
            // 补齐空实现，避免 zrender 的 HandlerDomProxy 挂载 DOM 监听时报错
            if (typeof canvas.addEventListener !== 'function') {
              canvas.addEventListener = function () {}
            }
            if (typeof canvas.removeEventListener !== 'function') {
              canvas.removeEventListener = function () {}
            }

            canvas.width = w * dpr
            canvas.height = h * dpr
            const chart = echarts.init(canvas, null, {
              width: w,
              height: h,
              devicePixelRatio: dpr
            })
            chart.setOption(option)
            resolve(chart)
          })
      })
    },

    // 折线图：个人成绩趋势（自带入场动画）
    buildLineOption() {
      const data = this.lineData
      const labels = []
      for (let i = 0; i < data.length; i++) labels.push('第' + (i + 1) + '次')
      return {
        grid: { left: 40, right: 16, top: 24, bottom: 26 },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: labels,
          axisLine: { lineStyle: { color: 'rgba(120,160,210,0.35)' } },
          axisTick: { show: false },
          axisLabel: { color: '#7A92B0', fontSize: 9, margin: 10 }
        },
        yAxis: {
          type: 'value',
          min: 60,
          max: 100,
          interval: 10,
          splitLine: { lineStyle: { color: 'rgba(120,160,210,0.20)', type: 'dashed' } },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: '#7A92B0', fontSize: 9 }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(22,49,79,0.92)',
          borderWidth: 0,
          textStyle: { color: '#FFFFFF', fontSize: 11 },
          axisPointer: { lineStyle: { color: 'rgba(46,123,224,0.6)' } }
        },
        series: [{
          name: '成绩',
          type: 'line',
          data: data,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: { color: '#2E7BE0', borderColor: '#FFFFFF', borderWidth: 1.5 },
          lineStyle: { width: 2.6, color: '#2E7BE0' },
          areaStyle: { color: 'rgba(91,157,249,0.25)' },
          animation: true,
          animationDuration: 1200,
          animationEasing: 'cubicOut'
        }]
      }
    },

    // 雷达图：六维能力分布（自带入场动画）
    buildRadarOption() {
      const items = this.radarData
      return {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(22,49,79,0.92)',
          borderWidth: 0,
          textStyle: { color: '#FFFFFF', fontSize: 11 },
          confine: true,
          // 自定义定位：优先显示在触发点上方；空间不足时自动翻转到下方/侧边，
          // 保证 tooltip 完整落在画布内，避免超出画布底边被下方卡片遮挡
          position: (point, params, dom, rect, size) => {
            const viewW = size.viewSize[0]
            const viewH = size.viewSize[1]
            const tipW = size.contentSize[0]
            const tipH = size.contentSize[1]
            // 横向：默认触发点右侧 12px，放不下则移到左侧
            let x = point[0] + 12
            if (x + tipW > viewW - 4) x = Math.max(4, point[0] - tipW - 12)
            // 纵向：默认触发点上方 12px，上方放不下则移到下方
            let y = point[1] - tipH - 12
            if (y < 4) y = point[1] + 12
            if (y + tipH > viewH - 4) y = Math.max(4, viewH - tipH - 4)
            return [x, y]
          }
        },
        radar: {
          indicator: items.map(d => ({ name: d.label, max: 100 })),
          radius: '62%',
          center: ['50%', '52%'],
          axisName: { color: '#355580', fontSize: 11, fontWeight: 'bold' },
          splitLine: { lineStyle: { color: 'rgba(120,160,210,0.30)' } },
          splitArea: { areaStyle: { color: ['rgba(91,157,249,0.04)', 'rgba(91,157,249,0.08)'] } },
          axisLine: { lineStyle: { color: 'rgba(120,160,210,0.32)' } }
        },
        series: [{
          type: 'radar',
          data: [{
            value: items.map(d => d.value),
            name: '能力值',
            symbol: 'circle',
            symbolSize: 4,
            lineStyle: { color: '#2E7BE0', width: 2.2 },
            itemStyle: { color: '#2E7BE0' },
            areaStyle: { color: 'rgba(91,157,249,0.35)' }
          }]
        }]
      }
    },

    // 触摸事件转发给 ECharts（ec-canvas 同款方案），用于 tooltip 交互
    onChartTouch(e, key) {
      const chart = this[key]
      if (!chart || !e.touches) return
      let list = e.touches
      if (!list.length && e.changedTouches && e.changedTouches.length) {
        list = e.changedTouches
      }
      if (!list.length) return
      const touch = list[0]
      // 小程序 canvas 触摸坐标（x/y 相对画布），补齐 zrender 需要的坐标字段
      touch.offsetX = touch.x
      touch.offsetY = touch.y
      e.zrX = touch.x
      e.zrY = touch.y
      const zr = chart.getZr()
      const type = e.type
      if (type === 'touchstart') {
        zr.handler.dispatch('mousedown', e)
        zr.handler.dispatch('mousemove', e)
        zr.handler.processGesture(e, 'start')
      } else if (type === 'touchmove') {
        zr.handler.dispatch('mousemove', e)
        zr.handler.processGesture(e, 'change')
      } else if (type === 'touchend' || type === 'touchcancel') {
        zr.handler.dispatch('mouseup', e)
        zr.handler.dispatch('click', e)
        zr.handler.processGesture(e, 'end')
      }
    },

    animateBars() {
      this.dimensions.forEach((d, i) => {
        setTimeout(() => {
          d.animatedWidth = d.score
        }, 350 + i * 110)
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

/* ---------- Status bar safe-area ---------- */
.status-bar {
  width: 100%;
  flex-shrink: 0;
  background: transparent;
}

/* ---------- Top bar ---------- */
.topbar {
  position: relative;
  z-index: 45;
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 88rpx 36rpx 24rpx;
  flex-shrink: 0;
}
.search {
  flex: 1;
  height: 88rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 0 32rpx;
  border-radius: var(--r-pill);
  background: var(--glass);
  border: 2rpx solid var(--glass-border);
  box-shadow: var(--glass-shadow-sm);
}
.search-ico {
  font-size: 32rpx;
  flex-shrink: 0;
  line-height: 1;
}
.search-input {
  flex: 1;
  border: none;
  background: none;
  outline: none;
  font-size: 28rpx;
  color: var(--ink);
  height: 88rpx;
  line-height: 88rpx;
}
.search-placeholder { color: var(--muted-2); }

.avatar-btn {
  width: 88rpx; height: 88rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--blue-400), var(--blue-600));
  display: flex; align-items: center; justify-content: center;
  font-size: 30rpx; font-weight: 600; color: #fff;
  box-shadow: 0 12rpx 32rpx rgba(46,123,224,0.32);
  border: 4rpx solid rgba(255,255,255,0.8);
  flex-shrink: 0;
}
.avatar-hover { transform: scale(0.95); }

/* ---------- Screen body ---------- */
.screen {
  position: relative;
  z-index: 5;
  flex: 1;
  box-sizing: border-box;
  padding: 16rpx 36rpx 220rpx;
}

/* ---------- Page header ---------- */
.page-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16rpx 4rpx 28rpx;
}
.page-title {
  font-size: 42rpx;
  font-weight: 800;
  color: var(--ink);
  letter-spacing: 1rpx;
  display: block;
}
.page-sub {
  font-size: 23rpx;
  color: var(--muted);
  margin-top: 6rpx;
  display: block;
}

/* ---------- Chip ---------- */
.chip {
  display: inline-flex;
  align-items: center;
  gap: 10rpx;
  height: 52rpx;
  padding: 0 24rpx;
  border-radius: var(--r-pill);
  font-size: 24rpx;
  font-weight: 600;
  background: var(--blue-50);
  color: var(--brand-deep);
  border: 2rpx solid rgba(91,157,249,0.2);
  flex-shrink: 0;
}

/* ---------- Stats grid ---------- */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
}
.gmini {
  position: relative;
  padding: 28rpx 28rpx 24rpx;
  background: var(--glass);
  border: 2rpx solid var(--glass-border-soft);
  border-radius: var(--r-md);
  box-shadow: var(--glass-shadow-sm);
  overflow: hidden;
}
.gmini::after {
  content: "";
  position: absolute;
  right: -36rpx; top: -36rpx;
  width: 120rpx; height: 120rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(91,157,249,0.16), transparent 70%);
}
.stat-ico {
  width: 60rpx; height: 60rpx;
  border-radius: 18rpx;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8rpx 20rpx rgba(46,123,224,0.22);
}
.stat-ico-text { font-size: 32rpx; line-height: 60rpx; display: block; text-align: center; width: 60rpx; height: 60rpx; }
.ico-brand { background: linear-gradient(135deg, var(--brand), var(--blue-600)); }
.ico-violet { background: linear-gradient(135deg, #A78BFA, #7C3AED); }
.ico-amber { background: linear-gradient(135deg, #FBBF24, #F59E0B); }
.ico-green { background: linear-gradient(135deg, #34D399, #16A34A); }

.stat-num {
  font-size: 54rpx;
  font-weight: 800;
  color: var(--ink);
  line-height: 1.05;
  margin-top: 18rpx;
  letter-spacing: -1rpx;
}
.stat-num .unit {
  font-size: 24rpx;
  font-weight: 600;
  color: var(--muted);
  margin-left: 4rpx;
  letter-spacing: 0;
}
.stat-label {
  font-size: 24rpx;
  color: var(--muted);
  margin-top: 4rpx;
  display: block;
}
.stat-trend {
  font-size: 22rpx;
  font-weight: 700;
  margin-top: 14rpx;
  display: inline-flex;
  align-items: center;
  gap: 4rpx;
  padding: 4rpx 14rpx;
  border-radius: var(--r-pill);
}
.stat-trend.up {
  color: #15803D;
  background: var(--green-soft);
}

/* ---------- Card ---------- */
.card {
  position: relative;
  background: var(--glass);
  border: 2rpx solid var(--glass-border-soft);
  border-radius: var(--r-lg);
  box-shadow: var(--glass-shadow);
}
.card.pad { padding: 36rpx; }

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}
.card-title-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.title-bar {
  width: 8rpx;
  height: 30rpx;
  border-radius: 8rpx;
  background: linear-gradient(180deg, var(--brand), var(--blue-600));
  flex-shrink: 0;
}
.card-title-text {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--ink);
}
.card-sub {
  font-size: 22rpx;
  color: var(--muted);
}

/* ---------- Chart wrap ---------- */
.chart-wrap {
  position: relative;
}
.chart-canvas {
  width: 100%;
  height: 380rpx;
}
.radar-canvas {
  height: 528rpx;
}

/* ---------- Dimension bars ---------- */
.dim-row {
  padding: 26rpx 0;
  border-bottom: 2rpx solid var(--line);
}
.dim-row:last-child {
  border-bottom: none;
  padding-bottom: 4rpx;
}
.dim-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}
.dim-name {
  font-size: 27rpx;
  font-weight: 700;
  color: var(--ink);
}
.dim-bar {
  position: relative;
  height: 20rpx;
  background: rgba(120,160,210,0.16);
  border-radius: var(--r-pill);
  overflow: visible;
}
.dim-fill {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  border-radius: var(--r-pill);
  background: linear-gradient(90deg, var(--brand), var(--blue-600));
  box-shadow: 0 4rpx 12rpx rgba(46,123,224,0.3);
  transition: width 1.1s cubic-bezier(.22,1,.36,1);
}
.dim-target {
  position: absolute;
  right: 0; top: -6rpx; bottom: -6rpx;
  width: 4rpx;
  background: var(--brand-deep);
  border-radius: 4rpx;
  opacity: 0.55;
}
.dim-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14rpx;
  font-size: 22rpx;
}
.dim-score {
  font-weight: 800;
  color: var(--ink);
  font-size: 26rpx;
}
.dim-score-max {
  color: var(--muted-2);
  font-weight: 500;
  font-size: 22rpx;
}
.dim-gap-label {
  color: var(--muted);
  font-weight: 600;
  font-size: 22rpx;
}
.dim-gap-num {
  color: var(--rose);
  font-weight: 800;
  font-size: 22rpx;
}

/* Level chips */
.lvl {
  height: 44rpx;
  padding: 0 18rpx;
  font-size: 22rpx;
  border-radius: var(--r-pill);
  font-weight: 700;
  display: inline-flex;
  align-items: center;
}
.lvl.junior { background: var(--amber-soft); color: #B45309; }
.lvl.mid { background: var(--violet-soft); color: #6D28D9; }
.lvl.senior { background: var(--green-soft); color: #15803D; }

/* ---------- Quiz records ---------- */
.record-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx 0;
  border-bottom: 2rpx solid var(--line);
}
.record-row:last-child {
  border-bottom: none;
  padding-bottom: 4rpx;
}
.record-ico {
  width: 64rpx; height: 64rpx;
  border-radius: 18rpx;
  background: linear-gradient(135deg, var(--brand), var(--blue-600));
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.record-ico-text { font-size: 30rpx; color: #fff; line-height: 1; }
.record-info {
  flex: 1;
  min-width: 0;
}
.record-name {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.record-date {
  font-size: 20rpx;
  color: var(--muted);
  margin-top: 4rpx;
}
.record-score {
  display: flex;
  align-items: baseline;
  gap: 2rpx;
  flex-shrink: 0;
}
.record-score-num {
  font-size: 36rpx;
  font-weight: 800;
  color: var(--green);
}
.record-score-unit {
  font-size: 20rpx;
  font-weight: 600;
  color: var(--green);
}
.empty-note {
  padding: 32rpx 8rpx;
  text-align: center;
  font-size: 24rpx;
  color: var(--muted);
}
.record-time {
  font-size: 20rpx;
  color: var(--muted);
  flex-shrink: 0;
  width: 80rpx;
  text-align: right;
}

/* ---------- Footer note ---------- */
.foot-note {
  text-align: center;
  font-size: 22rpx;
  color: var(--muted-2);
  padding: 36rpx 0 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}
.foot-dot {
  width: 12rpx; height: 12rpx;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 0 6rpx var(--green-soft);
}

/* ---------- Animations ---------- */
@keyframes fadeUp { from { opacity: 0; transform: translateY(36rpx); } to { opacity: 1; transform: translateY(0); } }

.reveal { opacity: 0; animation: fadeUp 0.6s cubic-bezier(.22,1,.36,1) forwards; }
.reveal.d1 { animation-delay: 0.06s; }
.reveal.d2 { animation-delay: 0.12s; }
.reveal.d3 { animation-delay: 0.18s; }
.reveal.d4 { animation-delay: 0.24s; }
.reveal.d5 { animation-delay: 0.30s; }

.num { font-feature-settings: "tnum"; }
</style>
