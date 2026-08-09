<template>
  <!--
    涉外法治人才培养首页
    V1.2: IntersectionObserver 驱动区块滚动动画，支持来回反复触发
  -->
  <view class="home-page">
    <!-- ===================== HERO ===================== -->
    <view class="hero" aria-label="平台首页">
      <view class="hero-mesh enter-anim enter-anim--shape" :style="heroMeshStyle" aria-hidden="true"></view>
      <view class="hero-shape hero-shape--1 enter-anim enter-anim--shape" :style="heroShape1Style" aria-hidden="true"></view>
      <view class="hero-shape hero-shape--2 enter-anim enter-anim--shape" :style="heroShape2Style" aria-hidden="true"></view>
      <view class="hero-shape hero-shape--3 enter-anim enter-anim--shape" :style="heroShape3Style" aria-hidden="true"></view>

      <view class="hero-content">
        <text class="hero-eyebrow enter-anim enter-anim--1">专业平台</text>
        <text class="hero-title enter-anim enter-anim--2">涉外法治人才培养</text>
        <text class="hero-subtitle enter-anim enter-anim--3">多维度评估 · 精准诊断 · 持续提升涉外法治人才专业素养</text>
        <view class="cta-enter enter-anim enter-anim--4" @tap="handleEnterAssessment">
          <text class="cta-text">进入平台</text>
          <text class="cta-arrow">→</text>
        </view>
      </view>

      <view class="scroll-indicator enter-anim enter-anim--5" aria-hidden="true">
        <text class="scroll-chev">↓</text>
      </view>
    </view>

    <!-- ===================== 1: 多维度测评体系 ===================== -->
    <view class="feature-section" aria-label="多维度测评体系">
      <view class="container">
        <view class="feature-grid">
          <view id="reveal-0" :class="['feature-text', 'reveal', visibleSet.has('reveal-0') ? 'visible' : '']" style="--reveal-delay: 0.00s"
          >
            <view class="feature-eyebrow">
              <text class="eyebrow-icon">◈</text>
              <text class="eyebrow-text">测评体系</text>
            </view>
            <text class="feature-heading">多维度测评体系</text>
            <text class="feature-desc">围绕国际法知识储备、跨境法律实务、涉外法律文书写作与外语法律技能等核心维度，构建覆盖知识、能力与素养的立体化评估框架，全面诊断涉外法治人才的专业功底。</text>
            <view class="feature-stats">
              <view class="feature-stat">
                <text class="feature-stat-num">{{ overview.questionCount }}<text class="unit">题</text></text>
                <text class="feature-stat-label">题库题目</text>
              </view>
              <view class="feature-stat">
                <text class="feature-stat-num">{{ overview.surveyCount }}<text class="unit">次</text></text>
                <text class="feature-stat-label">累计测评</text>
              </view>
              <view class="feature-stat">
                <text class="feature-stat-num">{{ overview.userCount }}<text class="unit">人</text></text>
                <text class="feature-stat-label">注册用户</text>
              </view>
            </view>
          </view>

          <!-- 外层视差 + 内层 reveal 动画 -->
          <view class="feature-visual" :style="featureVisual1Style">
            <view id="reveal-1" :class="['reveal', visibleSet.has('reveal-1') ? 'visible' : '']" style="--reveal-delay: 0.15s"
            >
              <view class="visual-card">
                <view class="dim-grid">
                  <view class="dim-chip is-accent"><text class="chip-text">国际公法</text></view>
                  <view class="dim-chip"><text class="chip-text">国际私法</text></view>
                  <view class="dim-chip"><text class="chip-text">国际经济法</text></view>
                  <view class="dim-chip"><text class="chip-text">跨境实务</text></view>
                  <view class="dim-chip"><text class="chip-text">法律文书</text></view>
                  <view class="dim-chip is-accent"><text class="chip-text">涉外仲裁</text></view>
                  <view class="dim-chip"><text class="chip-text">条约解释</text></view>
                  <view class="dim-chip"><text class="chip-text">外语技能</text></view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- ===================== 2: 智能数据分析 ===================== -->
    <view class="feature-section feature-section--alt" aria-label="智能数据分析">
      <view class="container">
        <view class="feature-grid feature-grid--reverse">
          <view id="reveal-2" :class="['feature-text', 'reveal', visibleSet.has('reveal-2') ? 'visible' : '']" style="--reveal-delay: 0.00s"
          >
            <view class="feature-eyebrow">
              <text class="eyebrow-icon">📊</text>
              <text class="eyebrow-text">数据分析</text>
            </view>
            <text class="feature-heading">智能数据分析</text>
            <text class="feature-desc">基于测评数据沉淀，自动生成能力雷达、趋势曲线与薄弱项分析报告。以数据驱动洞察测评走势，精准定位技能差距，为个性化提升提供量化依据。</text>
            <view class="feature-stats">
              <view class="feature-stat">
                <text class="feature-stat-num">{{ overview.resourceCount }}<text class="unit">项</text></text>
                <text class="feature-stat-label">上线资源</text>
              </view>
              <view class="feature-stat">
                <text class="feature-stat-num">{{ overview.knowledgeCount }}<text class="unit">篇</text></text>
                <text class="feature-stat-label">知识条目</text>
              </view>
            </view>
          </view>

          <!-- 外层视差 + 内层 reveal 动画 -->
          <view class="feature-visual" :style="featureVisual2Style">
            <view id="reveal-3" :class="['reveal', visibleSet.has('reveal-3') ? 'visible' : '']" style="--reveal-delay: 0.15s"
            >
              <view class="visual-card">
                <view class="chart-wrap">
                  <view class="chart-bars">
                    <view class="chart-bar" :style="{ height: '45%' }"></view>
                    <view class="chart-bar is-mid" :style="{ height: '62%' }"></view>
                    <view class="chart-bar is-strong" :style="{ height: '88%' }"></view>
                    <view class="chart-bar is-mid" :style="{ height: '70%' }"></view>
                    <view class="chart-bar" :style="{ height: '52%' }"></view>
                    <view class="chart-bar is-strong" :style="{ height: '76%' }"></view>
                  </view>
                  <view class="chart-labels">
                    <text class="label-text">国际公法</text>
                    <text class="label-text">国际私法</text>
                    <text class="label-text">跨境实务</text>
                    <text class="label-text">法律文书</text>
                    <text class="label-text">涉外仲裁</text>
                    <text class="label-text">外语技能</text>
                  </view>
                  <view class="chart-legend">
                    <view class="legend-item">
                      <view class="dot" style="background: var(--rule-primary)"></view>
                      <text class="legend-text">熟练</text>
                    </view>
                    <view class="legend-item">
                      <view class="dot" style="background: var(--rule-primary-tint-2)"></view>
                      <text class="legend-text">一般</text>
                    </view>
                    <view class="legend-item">
                      <view class="dot" style="background: var(--rule-primary-tint-1)"></view>
                      <text class="legend-text">待提升</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- ===================== 3: 权威法律库 + AI助手 ===================== -->
    <view class="feature-section" aria-label="权威法律库与AI智能助手">
      <view class="container">
        <view id="reveal-4" :class="['section-head', 'reveal', visibleSet.has('reveal-4') ? 'visible' : '']" style="--reveal-delay: 0.00s"
        >
          <view class="feature-eyebrow">
            <text class="eyebrow-icon">📚</text>
            <text class="eyebrow-text">资源与工具</text>
          </view>
          <text class="feature-heading">权威法律库与智能助手</text>
        </view>

        <view class="dual-grid">
          <view id="reveal-5" :class="['dual-card', 'reveal', visibleSet.has('reveal-5') ? 'visible' : '']" style="--reveal-delay: 0.10s"
          >
            <view class="icon-badge">
              <text class="badge-icon">📖</text>
            </view>
            <text class="card-title">权威法律库</text>
            <text class="card-desc">汇聚国际公约、双边协定、涉外法律法规与典型案例，提供条目检索、条款对照与版本溯源，为测评与学习提供权威法源支撑。</text>
          </view>

          <view id="reveal-6" :class="['dual-card', 'reveal', visibleSet.has('reveal-6') ? 'visible' : '']" style="--reveal-delay: 0.25s"
          >
            <view class="icon-badge">
              <text class="badge-icon">🤖</text>
            </view>
            <text class="card-title">AI智能助手</text>
            <text class="card-desc">7×24小时在线法律咨询，支持测评答疑、条文解读与学习路径推荐。结合测评结果智能匹配提升建议，让专业指导随时可达。</text>
          </view>
        </view>
      </view>
    </view>

    <!-- ===================== FOOTER ===================== -->
    <view class="footer">
      <view class="footer-inner">
        <text class="footer-sign">© 2026 涉外法治人才培养平台</text>
        <view class="footer-links">
          <text class="footer-link" @tap="handleFooterLink('关于我们')">关于我们</text>
          <text class="footer-link" @tap="handleFooterLink('联系方式')">联系方式</text>
          <text class="footer-link" @tap="handleFooterLink('隐私政策')">隐私政策</text>
        </view>
        <text class="footer-tech">技术支持:LexGlobal法视界技术组成员</text>
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 涉外法治人才培养首页
 * IntersectionObserver 驱动区块滚动动画，支持来回反复触发
 * 视差滚动: 使用 onPageScroll 驱动
 */

import { ref, computed, reactive } from 'vue'
import { onReady, onPageScroll } from '@dcloudio/uni-app'

// ==================== 视差滚动数据 ====================

const scrollY = ref(0)

const heroMeshStyle = computed(() => ({
  transform: `translate3d(0, ${scrollY.value * 0.08}px, 0) scale(1)`
}))
const heroShape1Style = computed(() => ({
  transform: `translate3d(0, ${scrollY.value * 0.15}px, 0) rotate(${scrollY.value * 0.03}deg)`
}))
const heroShape2Style = computed(() => ({
  transform: `translate3d(${scrollY.value * 0.1}px, ${scrollY.value * 0.18}px, 0)`
}))
const heroShape3Style = computed(() => ({
  transform: `translate3d(0, ${scrollY.value * 0.12}px, 0) rotate(${-scrollY.value * 0.02}deg)`
}))
const featureVisual1Style = computed(() => ({
  transform: `translate3d(0, ${-scrollY.value * 0.04}px, 0)`
}))
const featureVisual2Style = computed(() => ({
  transform: `translate3d(0, ${-scrollY.value * 0.04}px, 0)`
}))

// ==================== 滚动触发出场动画 ====================

/** 所有需要出场动画的元素 id */
const REVEAL_IDS = ['reveal-0', 'reveal-1', 'reveal-2', 'reveal-3', 'reveal-4', 'reveal-5', 'reveal-6']

/** 记录每个 reveal 元素距离页面顶部的绝对偏移 */
const revealOffsets = reactive(new Map())

/** 已滚入视口的元素（用于模板 :class 切换） */
const visibleSet = reactive(new Set())

/** 视口高度，onReady 时测量 */
const viewportHeight = ref(800)

/**
 * onReady: 页面元素渲染完成后，测量各 reveal 元素的初始偏移位置
 */
onReady(() => {
  const sys = uni.getSystemInfoSync()
  viewportHeight.value = sys.windowHeight

  const query = uni.createSelectorQuery()
  REVEAL_IDS.forEach((id) => {
    query.select(`#${id}`).boundingClientRect()
  })
  query.exec((res) => {
    if (!res || !res.length) {
      // 兜底：测量失败则直接显示所有内容，避免空白
      REVEAL_IDS.forEach((id) => visibleSet.add(id))
      return
    }
    res.forEach((rect, i) => {
      if (rect && rect.top !== undefined) {
        revealOffsets.set(REVEAL_IDS[i], rect.top)
        // 首屏可见的元素直接标记为 visible，避免闪烁
        if (rect.top < viewportHeight.value) {
          visibleSet.add(REVEAL_IDS[i])
        }
      } else {
        visibleSet.add(REVEAL_IDS[i])
      }
    })
  })

  // 兜底保护：500ms 后若还有未测量的元素，直接显示
  setTimeout(() => {
    REVEAL_IDS.forEach((id) => {
      if (!revealOffsets.has(id)) {
        visibleSet.add(id)
      }
    })
  }, 500)

  loadOverview()
})

const overview = reactive({
  questionCount: 0,
  surveyCount: 0,
  userCount: 0,
  resourceCount: 0,
  knowledgeCount: 0
})

async function loadOverview() {
  try {
    const usersObj = uniCloud.importObject('users')
    const r = (await usersObj.overview()) || {}
    if (r.errCode === 0) {
      overview.questionCount = r.questionCount || 0
      overview.surveyCount = r.surveyCount || 0
      overview.userCount = r.userCount || 0
      overview.resourceCount = r.resourceCount || 0
      overview.knowledgeCount = r.knowledgeCount || 0
    }
  } catch (e) {
    console.error('[index] overview load error:', e)
  }
}

/**
 * 根据滚动位置检查哪些元素进入视口 → 切换 visibleSet
 * 触发阈值：元素顶部进入 "视口底部 × 0.78" 线时激活
 */
const checkReveal = () => {
  const triggerY = scrollY.value + viewportHeight.value * 0.78
  REVEAL_IDS.forEach((id) => {
    const offset = revealOffsets.get(id)
    if (offset === undefined) return
    if (triggerY >= offset) {
      visibleSet.add(id)
    } else {
      visibleSet.delete(id)
    }
  })
}

// ==================== 登录事件处理 ====================

const handleEnterAssessment = () => {
  // 先判断是否已有登录态，未登录则跳登录页，已登录直接进测评
  const token = uni.getStorageSync('token')
  if (!token) {
    uni.navigateTo({ url: '/pages/login/login' })
  } else {
    uni.navigateTo({ url: '/pages/survey/survey' })
  }
}

const handleLegalDB = () => {
  uni.navigateTo({ url: '/pages/legal-db/legal-db' })
}

const handleAIAssistant = () => {
  uni.navigateTo({ url: '/pages/ai-assistant/ai-assistant' })
}

const handleFooterLink = (link) => {
  console.log('点击页脚链接:', link)
}

// ==================== 页面滚动 ====================

onPageScroll((e) => {
  scrollY.value = e.scrollTop
  checkReveal()
})
</script>

<style scoped>
/*
  ============================================================
  涉外法治人才培养CSS
  Style: Blue-White Professional, Modern & Comfortable
  Brand Prefix: rule
  ============================================================
*/

.home-page {
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
  --rule-ring: #2563EB;
  --rule-radius-small: 4px;
  --rule-radius-medium: 8px;
  --rule-radius-large: 16px;
  --rule-radius-full: 9999px;
  --rule-ink: #0F172A;
  --rule-ink-2: #475569;
  --rule-ink-3: #94A3B8;
  --rule-shadow-1: 0 1px 2px rgba(15,23,42,.04), 0 1px 1px rgba(15,23,42,.02);
  --rule-shadow-2: 0 8px 24px -8px rgba(15,23,42,.12);
  --rule-shadow-3: 0 24px 60px -20px rgba(15,23,42,.20);
}

.home-page {
  min-height: 100vh;
  background: var(--rule-background);
  color: var(--rule-foreground);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  scroll-behavior: smooth;
  overflow-x: hidden;
}

/* ==================== 容器 ==================== */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}

/* ==================== Hero 区==================== */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  background: var(--rule-background);
}

.hero-mesh {
  position: absolute;
  inset: -20%;
  z-index: 0;
  background:
    radial-gradient(40% 40% at 20% 30%, rgba(37,99,235,0.08), transparent 70%),
    radial-gradient(35% 35% at 80% 25%, rgba(37,99,235,0.06), transparent 70%),
    radial-gradient(45% 45% at 70% 75%, rgba(37,99,235,0.05), transparent 70%),
    radial-gradient(30% 30% at 25% 80%, rgba(37,99,235,0.04), transparent 70%);
  background-color: var(--rule-background);
  background-repeat: no-repeat;
  animation: meshDrift 22s ease-in-out infinite alternate;
  will-change: transform, background-position;
}

@keyframes meshDrift {
  0%   { transform: translate3d(0,0,0) scale(1);   background-position: 0% 0%,0% 0%,0% 0%,0% 0%; }
  50%  { transform: translate3d(-2%,1.5%,0) scale(1.04); background-position: 10% 5%,-8% 6%,6% -4%,-5% 8%; }
  100% { transform: translate3d(2%,-1.5%,0) scale(1.02); background-position: -8% -6%,10% -4%,-6% 8%,8% -6%; }
}

.hero-shape {
  position: absolute;
  border-radius: var(--rule-radius-large);
  border: 1px solid var(--rule-border);
  background: var(--rule-primary-tint-3);
  opacity: 0.5;
  z-index: 0;
  pointer-events: none;
}
.hero-shape--1 { width: 180px; height: 180px; top: 14%; left: 8%; animation: floatA 14s ease-in-out infinite; }
.hero-shape--2 { width: 120px; height: 120px; top: 22%; right: 10%; border-radius: var(--rule-radius-full); animation: floatB 18s ease-in-out infinite; }
.hero-shape--3 { width: 90px; height: 90px; bottom: 18%; left: 14%; border-radius: var(--rule-radius-medium); animation: floatA 16s ease-in-out infinite reverse; }

@keyframes floatA {
  0%,100% { transform: translate3d(0,0,0) rotate(0deg); }
  50%     { transform: translate3d(0,-22px,0) rotate(8deg); }
}
@keyframes floatB {
  0%,100% { transform: translate3d(0,0,0); }
  50%     { transform: translate3d(14px,-16px,0); }
}

.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 120px 32px;
  max-width: 820px;
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: var(--rule-muted-foreground);
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  padding: 6px 14px;
  border-radius: var(--rule-radius-full);
  box-shadow: var(--rule-shadow-1);
}
.hero-eyebrow::before {
  content: "";
  width: 6px; height: 6px;
  border-radius: var(--rule-radius-full);
  background: var(--rule-primary);
  display: inline-block;
}

.hero-title {
  font-size: clamp(40px, 6vw, 72px);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.08;
  color: var(--rule-foreground);
  word-break: keep-all;
}
.hero-subtitle {
  font-size: clamp(16px, 1.6vw, 20px);
  line-height: 1.6;
  color: var(--rule-muted-foreground);
  max-width: 600px;
}

/* ========================================================
   Hero 首屏入场序列动画
   仅页面首次加载时播放一次，与下方滚动反复动画区分开
   ======================================================== */

/* 通用入场动画：基础参数 0.55s ease-out  transform/opacity */
.enter-anim {
  opacity: 0;
  transform: translate3d(0, 20px, 0);
  animation: heroFadeInUp 0.55s cubic-bezier(.18,.82,.2,1) forwards;
  will-change: transform, opacity;
}

@keyframes heroFadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 20px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

/* ① 顶部标签【专业测评平台】 立即触发：延迟 0ms */
.enter-anim--1 {
  animation-delay: 0ms;
  transform: translate3d(0, 16px, 0);
  animation-name: heroEyebrowDrop;
}
@keyframes heroEyebrowDrop {
  from { opacity: 0; transform: translate3d(0, -16px, 0); }
  to   { opacity: 1; transform: translate3d(0, 0, 0); }
}

/* ② 大标题：延迟 80ms */
.enter-anim--2 { animation-delay: 80ms; }

/* ③ 副标题：延迟 160ms */
.enter-anim--3 { animation-delay: 160ms; }

/* ④ 蓝色按钮：延迟 240ms，附带给轻微缩放 */
.enter-anim--4 { animation-name: heroBtnIn; }
.enter-anim--4 { animation-delay: 240ms; }
@keyframes heroBtnIn {
  from {
    opacity: 0;
    transform: translate3d(0, 20px, 0) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
}

/* ⑤ 背景装饰图形 + 网格：缓慢淡入（不移动） */
.enter-anim--shape {
  opacity: 0;
  transform: translate3d(0, 0, 0);
  animation: heroShapeFadeIn 1.1s cubic-bezier(.18,.82,.2,1) forwards;
  animation-delay: 60ms;
}
@keyframes heroShapeFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
/* 针对 hero-shape 原本就有 opacity: 0.5，叠加动画 */
.hero-shape.enter-anim--shape {
  opacity: 0;
}
.hero-shape.enter-anim--shape.hero-shape--1,
.hero-shape.enter-anim--shape.hero-shape--2,
.hero-shape.enter-anim--shape.hero-shape--3 {
  /* 动画结束后保持最终状态为原有 opacity */
  animation: heroShapeSoftIn 1.1s cubic-bezier(.18,.82,.2,1) forwards;
  animation-delay: 60ms;
}
@keyframes heroShapeSoftIn {
  from { opacity: 0; }
  to   { opacity: 0.5; }
}

/* 滚动指示器：先淡入，再启动呼吸浮动动画 */
.enter-anim--5 { animation-delay: 320ms; }

/* scroll-chev 无限上下浮动呼吸动画，引导滚动 */
.scroll-chev {
  display: inline-block;
  animation: scrollBreathe 2.6s ease-in-out infinite;
  animation-delay: calc(320ms + 550ms);
  opacity: 0.7;
}
@keyframes scrollBreathe {
  0%,100% { transform: translateY(0);    opacity: 0.7; }
  50%     { transform: translateY(8px);  opacity: 1; }
}

/* ==================== CTA button extra hover ==================== */

/* CTA button */
.cta-enter {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 40px;
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  background: var(--rule-primary);
  color: var(--rule-primary-foreground);
  border: 1px solid var(--rule-primary);
  border-radius: var(--rule-radius-medium);
  box-shadow: var(--rule-shadow-1);
  transition: transform 0.2s cubic-bezier(.2,.8,.2,1), box-shadow 0.2s cubic-bezier(.2,.8,.2,1), background-color 0.2s cubic-bezier(.2,.8,.2,1);
  margin-top: 8px;
  cursor: pointer;
}
.cta-arrow { font-size: 18px; transition: transform 0.2s cubic-bezier(.2,.8,.2,1); }
.cta-enter:hover {
  transform: translateY(-2px);
  background: var(--rule-primary-hover);
  box-shadow: 0 8px 30px rgba(37,99,235,0.30);
}
.cta-enter:hover .cta-arrow { transform: translateX(4px); }
.cta-enter:active { transform: translateY(0); box-shadow: var(--rule-shadow-1); }

/* Scroll-down indicator */
.scroll-indicator {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--rule-muted-foreground);
  font-size: 12px;
  letter-spacing: 0.04em;
}
.scroll-chev { font-size: 22px; animation: bounceDown 2s ease-in-out infinite; }
@keyframes bounceDown {
  0%,100% { transform: translateY(0); opacity: 0.7; }
  50%     { transform: translateY(6px); opacity: 1; }
}

/* ==================== Feature sections ==================== */
.feature-section {
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  padding: 96px 0;
  background: var(--rule-background);
  overflow: hidden;
}
.feature-section--alt {
  background: var(--rule-card);
  border-top: 1px solid var(--rule-border);
  border-bottom: 1px solid var(--rule-border);
}

.feature-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
.feature-grid--reverse .feature-text { order: 2; }
.feature-grid--reverse .feature-visual { order: 1; }

.feature-text { display: flex; flex-direction: column; gap: 20px; }

.feature-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--rule-primary);
}
.eyebrow-icon { font-size: 18px; }

.feature-heading {
  font-size: clamp(28px, 3.2vw, 40px);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--rule-foreground);
  word-break: keep-all;
}
.feature-desc {
  font-size: 16px;
  line-height: 1.7;
  color: var(--rule-muted-foreground);
  max-width: 480px;
}
.feature-stats {
  display: flex;
  gap: 32px;
  margin-top: 8px;
  padding-top: 24px;
  border-top: 1px solid var(--rule-border);
}
.feature-stat { display: flex; flex-direction: column; gap: 4px; }
.feature-stat-num {
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--rule-foreground);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.unit { font-size: 16px; font-weight: 600; color: var(--rule-primary); margin-left: 2px; }
.feature-stat-label { font-size: 13px; color: var(--rule-muted-foreground); }

/* Visual: dimensions card */
.visual-card {
  position: relative;
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: var(--rule-radius-large);
  padding: 32px;
  box-shadow: var(--rule-shadow-2);
  overflow: hidden;
}
.dim-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.dim-chip {
  background: var(--rule-primary-tint-3);
  border: 1px solid var(--rule-primary-tint-1);
  border-radius: var(--rule-radius-medium);
  padding: 14px 8px;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  color: var(--rule-ink-2);
  line-height: 1.3;
  transition: all 0.2s ease;
}
.dim-chip.is-accent {
  background: var(--rule-primary);
  border-color: var(--rule-primary);
  color: var(--rule-primary-foreground);
}

/* Visual: bar chart */
.chart-wrap { display: flex; flex-direction: column; gap: 16px; }
.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 14px;
  height: 200px;
  padding: 12px 4px 0;
  border-bottom: 1px solid var(--rule-border);
}
.chart-bar {
  flex: 1;
  border-radius: var(--rule-radius-small) var(--rule-radius-small) 0 0;
  background: var(--rule-primary-tint-1);
  transition: background-color 0.2s cubic-bezier(.2,.8,.2,1);
}
.chart-bar.is-mid { background: var(--rule-primary-tint-2); }
.chart-bar.is-strong { background: var(--rule-primary); }
.chart-bar:hover { filter: brightness(1.05); }
.chart-labels { display: flex; gap: 14px; padding: 0 4px; }
.label-text { flex: 1; text-align: center; font-size: 12px; color: var(--rule-muted-foreground); }
.chart-legend { display: flex; align-items: center; gap: 16px; font-size: 13px; color: var(--rule-muted-foreground); }
.legend-item { display: flex; align-items: center; gap: 6px; }
.dot { width: 10px; height: 10px; border-radius: var(--rule-radius-small); display: inline-block; }
.legend-text { font-size: 13px; color: var(--rule-muted-foreground); }

/* ===== Two-column cards ===== */
.dual-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
.dual-card {
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: var(--rule-radius-large);
  padding: 36px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: var(--rule-shadow-1);
  transition: transform 0.2s cubic-bezier(.2,.8,.2,1), box-shadow 0.2s cubic-bezier(.2,.8,.2,1), border-color 0.2s cubic-bezier(.2,.8,.2,1);
  cursor: pointer;
}
.dual-card:hover {
  transform: translateY(-3px);
  border-color: var(--rule-primary-tint-1);
  box-shadow: var(--rule-shadow-2);
}
.icon-badge {
  width: 44px; height: 44px;
  border-radius: var(--rule-radius-medium);
  background: var(--rule-primary-tint-3);
  color: var(--rule-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.badge-icon { font-size: 22px; }
.card-title { font-size: 20px; font-weight: 600; letter-spacing: -0.01em; color: var(--rule-foreground); }
.card-desc { font-size: 15px; line-height: 1.65; color: var(--rule-muted-foreground); }
.card-link { margin-top: auto; font-size: 14px; font-weight: 600; color: var(--rule-primary); display: inline-flex; align-items: center; gap: 6px; }
.link-arrow { font-size: 16px; transition: transform 0.2s cubic-bezier(.2,.8,.2,1); }
.dual-card:hover .link-arrow { transform: translateX(3px); }

.section-head {
  text-align: center;
  margin-bottom: 56px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}
.section-head .feature-eyebrow { justify-content: center; }
.section-head .feature-heading { max-width: 640px; }

/* ==================== Footer ==================== */
.footer { background: var(--rule-card); border-top: 1px solid var(--rule-border); padding: 48px 32px; }
.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.footer-sign { font-size: 14px; color: var(--rule-muted-foreground); }
.footer-tech { font-size: 13px; color: var(--rule-ink-3); }
.footer-links { display: flex; gap: 24px; }
.footer-link { font-size: 14px; color: var(--rule-muted-foreground); transition: color 0.2s cubic-bezier(.2,.8,.2,1); cursor: pointer; }
.footer-link:hover { color: var(--rule-primary); }

/* ==================== Reveal 动画 ==================== */
/* 滚动触发出场：JS 切换 .visible 类，CSS transition 驱动淡入上浮 */
/* --reveal-delay 控制同区块内多个元素的交错出场延迟 */

.reveal {
  opacity: 0;
  transform: translate3d(0, 36px, 0);
  transition:
    opacity 0.55s cubic-bezier(.3, 0, 0, 1),
    transform 0.55s cubic-bezier(.3, 0, 0, 1);
  transition-delay: var(--reveal-delay, 0s);
  will-change: transform, opacity;
}

.reveal.visible {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

/* ==================== Responsive ==================== */
@media (max-width: 900px) {
  .feature-grid, .feature-grid--reverse { grid-template-columns: 1fr; gap: 40px; }
  .feature-grid--reverse .feature-text, .feature-grid--reverse .feature-visual { order: 0; }
  .dual-grid { grid-template-columns: 1fr; }
  .feature-section { min-height: auto; padding: 72px 0; }
  .container { padding: 0 20px; }
  .footer-inner { flex-direction: column; text-align: center; }
}

@media (max-width: 520px) {
  .dim-grid { grid-template-columns: repeat(2, 1fr); }
  .feature-stats { flex-direction: column; gap: 16px; }
  .hero-content { padding: 96px 20px; }
}

/* ===== Reduced motion ===== */
@media (prefers-reduced-motion: reduce) {
  .home-page { scroll-behavior: auto; }
  .hero-mesh, .hero-shape--1, .hero-shape--2, .hero-shape--3, .scroll-chev { animation: none !important; opacity: 1 !important; }
  .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
  .cta-enter, .cta-arrow, .dual-card, .chart-bar, .footer-link, .link-arrow { transition: none !important; }
  /* 禁用 Hero 首屏入场序列动画，避免内容透明空白 */
  .enter-anim,
  .enter-anim--1,
  .enter-anim--2,
  .enter-anim--3,
  .enter-anim--4,
  .enter-anim--5,
  .enter-anim--shape {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  .hero-shape.enter-anim--shape { opacity: 0.5 !important; }
}
</style>
