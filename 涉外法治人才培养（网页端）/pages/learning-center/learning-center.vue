<template>
  <view class="lc-shell">
    <!-- ===== Brand CSS Variables ===== -->
    <view class="css-vars" aria-hidden="true"></view>

    <!-- ===== App Shell (Sidebar + Main) ===== -->
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
          <view class="app-nav-item is-active" data-nav-key="learning-center" @tap="triggerHeroAnimation">
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

      <!-- ===== Main Content Area ===== -->
      <view class="app-main">
        <header class="app-topbar">
          <text class="app-topbar-title">学习中心</text>
          <text class="app-topbar-meta">{{ todayDateText }}</text>
        </header>

        <main class="app-content">
          <!-- ===== Hero Section ===== -->
          <section class="lc-hero" :class="{ 'hero-animate': heroAnimated }" aria-label="学习中心概览">
            <view class="lc-hero-content">
              <text class="lc-hero-title hero-title-enter">{{ heroTitle }}</text>
              <text class="lc-hero-subtitle hero-subtitle-enter">系统化涉外法治能力培养平台，助力法律人才走向国际舞台</text>
              <view class="lc-hero-stats">
                <view class="lc-hero-stat hero-stat-enter" style="--delay: 0">
                  <text class="lc-hero-stat-num">{{ displayStats.courses }}</text>
                  <text class="lc-hero-stat-label">已上线课程</text>
                </view>
                <view class="lc-hero-stat hero-stat-enter" style="--delay: 1">
                  <text class="lc-hero-stat-num">{{ displayStats.studyCount }}</text>
                  <text class="lc-hero-stat-label">累计测评</text>
                </view>
                <view class="lc-hero-stat hero-stat-enter" style="--delay: 2">
                  <text class="lc-hero-stat-num">{{ displayStats.completionRate }}</text>
                  <text class="lc-hero-stat-label">知识条目</text>
                </view>
              </view>
            </view>
            <view class="lc-hero-bg" aria-hidden="true"></view>
            <view class="lc-hero-deco lc-hero-deco-1 hero-deco-enter" style="--d:1" aria-hidden="true"></view>
            <view class="lc-hero-deco lc-hero-deco-2 hero-deco-enter" style="--d:2" aria-hidden="true"></view>
            <view class="lc-hero-deco lc-hero-deco-3 hero-deco-enter" style="--d:3" aria-hidden="true"></view>
          </section>

          <!-- ===== Video Learning Section ===== -->
          <section class="lc-section" :class="{ 'is-visible': sections.video }" aria-label="视频学习">
            <view class="lc-section-header">
              <view class="lc-section-title-wrap">
                <view class="lc-section-bar"></view>
                <view>
                  <text class="lc-section-title">视频学习</text>
                  <text class="lc-section-subtitle">精选涉外法治视频课程，随学随看</text>
                </view>
              </view>
              <view v-if="videos.length" class="more-videos-btn" @tap="showMoreVideos">
                <text>更多视频</text>
                <view class="chev-r-sm"></view>
              </view>
            </view>
            <view class="video-grid">
              <view class="video-card" v-for="(video, vIdx) in latestVideos" :key="vIdx" @tap="playVideo(video)">
                <view class="video-thumb">
                  <view class="video-thumb-gradient" :style="videoThumbStyle(video)"></view>
                  <view class="video-play-overlay">
                    <view class="video-play-btn">
                      <view class="play-icon"></view>
                    </view>
                  </view>
                  <text class="video-duration">{{ video.duration }}</text>
                </view>
                <view class="video-info">
                  <text class="video-title">{{ video.title }}</text>
                  <view class="video-meta">
                    <text class="video-meta-item">
                      <view class="user-icon-sm"></view>
                      <text>{{ video.category }}</text>
                    </text>
                    <text class="video-meta-item">
                      <view class="eye-icon-sm"></view>
                      <text>{{ video.status }}</text>
                    </text>
                  </view>
                </view>
              </view>
            </view>
            <view v-if="!videos.length" class="lc-empty">暂无视频课程</view>
          </section>

          <!-- ===== 法律英语资源 Section ===== -->
          <section class="lc-section" :class="{ 'is-visible': sections.english }" aria-label="法律英语资源">
            <view class="lc-section-header">
              <view class="lc-section-title-wrap">
                <view class="lc-section-bar"></view>
                <view>
                  <text class="lc-section-title">法律英语资源</text>
                  <text class="lc-section-subtitle">词汇、听力与实务资源来自资源数据库</text>
                </view>
              </view>
            </view>
            <view class="rec-grid">
              <view class="rec-card" v-for="(item, eIdx) in englishResources" :key="eIdx" @tap="openEnglishResource(item)">
                <text class="rec-tag rec-tag-adv">{{ item.category }}</text>
                <text class="rec-title">{{ item.title }}</text>
                <text class="rec-reason">{{ item.description || (item.level ? '难度：' + item.level : '暂无简介') }}</text>
                <view class="rec-btn">
                  <text>{{ item.fileUrl ? '查看资源' : '暂无资源文件' }}</text>
                  <view class="arrow-r"></view>
                </view>
              </view>
            </view>
            <view v-if="!englishResources.length" class="lc-empty">暂无法律英语资源</view>
          </section>

          <!-- ===== Professional Skills Section ===== -->
          <section class="lc-section" :class="{ 'is-visible': sections.skills }" aria-label="专业技能提升">
            <view class="lc-section-header">
              <view class="lc-section-title-wrap">
                <view class="lc-section-bar"></view>
                <view>
                  <text class="lc-section-title">专业技能提升</text>
                  <text class="lc-section-subtitle">法律英语综合训练，覆盖词汇、听力与实务能力</text>
                </view>
              </view>
            </view>
            <view class="skill-grid">
              <view class="skill-card" @tap="goToLegalEnglish">
                <view class="skill-card-head">
                  <view class="skill-icon-wrap" style="background: linear-gradient(135deg, #2563EB, #0EA5E9)">
                    <view class="headphones-icon"></view>
                  </view>
                  <view class="skill-info">
                    <text class="skill-name">法律英语综合训练</text>
                    <text class="skill-desc">词汇、听力与实务训练，点击进入综合训练</text>
                  </view>
                </view>
                <view class="skill-meta">
                  <text class="skill-course-count">4 个训练模块</text>
                  <view class="skill-progress-wrap">
                    <view class="skill-progress-track">
                      <view class="skill-progress-fill" style="width: 0%"></view>
                    </view>
                    <view class="skill-progress-label">
                      <text>学习进度</text>
                      <text class="skill-progress-pct">0%</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </section>

          <!-- ===== Recommendation Section ===== -->
          <section class="lc-section" :class="{ 'is-visible': sections.recommendation }" aria-label="为你推荐">
            <view class="lc-section-header">
              <view class="lc-section-title-wrap">
                <view class="lc-section-bar"></view>
                <view>
                  <text class="lc-section-title">为你推荐</text>
                  <text class="lc-section-subtitle">基于你的学习记录和测评结果，个性化推荐</text>
                </view>
              </view>
              <view v-if="recommendations.length" class="more-videos-btn" @tap="refreshRecommendations">
                <view class="refresh-icon"></view>
                <text>刷新</text>
              </view>
            </view>
            <view class="rec-grid">
              <view class="rec-card" v-for="(rec, rIdx) in recommendations" :key="rIdx">
                <text class="rec-tag" :class="rec.tagClass">{{ rec.tag }}</text>
                <text class="rec-title">{{ rec.title }}</text>
                <text class="rec-reason">{{ rec.reason }}</text>
                <view class="rec-level">
                  <view v-for="n in 3" :key="n" class="star-icon" :class="{ filled: n <= rec.level }"></view>
                  <text class="rec-level-label">{{ rec.levelLabel }}</text>
                </view>
                <view class="rec-btn" @tap="startLearning(rec)">
                  <text>开始学习</text>
                  <view class="arrow-r"></view>
                </view>
              </view>
            </view>
            <view v-if="!recommendations.length" class="lc-empty">暂无推荐内容</view>
          </section>
        </main>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { onLoad, onReady, onPageScroll } from '@dcloudio/uni-app'
import { requireLogin, getDisplayName, getLevelText } from '@/utils/auth.js'
import { resolveResourceUrl } from '@/utils/video-config.js'

/* ============================================================
   Scroll-Reveal Animation System (与 index.vue 一致)
   目前无板块启用，保留系统以备后续使用
   ============================================================ */
const REVEAL_IDS = []
const revealOffsets = reactive(new Map())
const visibleSet = reactive(new Set())
const viewportHeight = ref(800)
const scrollY = ref(0)

onReady(() => {
  // no-op: 当前没有需要 reveal 的元素
})

const checkReveal = () => {
  // no-op
}

// onPageScroll：reveal 系统已停用，这里做一个空处理以避免任何滚动期间的响应式开销
onPageScroll(() => {
  // no-op
})

/* ============================================================
   User Data
   ============================================================ */
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

/* ============================================================
   Hero Data & Animation
   ============================================================ */
const heroTitle = '弥合涉外法治缺口，构筑全球法律视野'
const heroAnimated = ref(false)
const animatedStats = reactive({
  courses: 0,
  studyCount: '0',
  completionRate: 0
})

/* ============================================================
   数字滚动动画（平滑过渡 + 可配置时长 + 整数/小数 + 暂停/继续）
   ============================================================ */
// 每个数字项的目标配置
const STAT_CONFIG = {
  courses:        { from: 0, to: 0, decimals: 0, suffix: '', useGrouping: false },
  studyCount:     { from: 0, to: 0, decimals: 0, suffix: '',  useGrouping: true  },
  completionRate: { from: 0, to: 0, decimals: 0, suffix: '', useGrouping: false }
}

// 默认动画时长（毫秒），可配置
const STAT_DEFAULT_DURATION = 3000
const statDuration = ref(STAT_DEFAULT_DURATION)

// 可选时长档位（用户可切换）
const statDurOptions = [
  { label: '1.5s', value: 1500 },
  { label: '3s',   value: 3000 },
  { label: '5s',   value: 5000 }
]

// 运行时状态：raw number + 动画控制
const statRaw = reactive({ courses: 0, studyCount: 0, completionRate: 0 })
const statAnimCtrl = reactive({
  rafId: null,           // requestAnimationFrame id
  startTime: 0,          // 当前动画启动的时刻 (performance.now)
  pausedAtElapsed: 0,    // 暂停时刻已走过的 elapsed
  paused: false,         // 是否暂停
  running: false,        // 是否正在运行中
  startDelay: 0          // 首次/每次触发时的延迟：0，点击即启动
})

// 格式化工具：整数/小数一致，千分位开关
function formatStat(value, cfg) {
  const fixed = Number(value).toFixed(cfg.decimals)
  let str = fixed
  if (cfg.useGrouping) {
    const parts = str.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    str = parts.join('.')
  }
  return str + cfg.suffix
}

// 对外展示值（保持显示格式一致）
const displayStats = computed(() => ({
  courses:        formatStat(statRaw.courses,        STAT_CONFIG.courses),
  studyCount:     formatStat(statRaw.studyCount,     STAT_CONFIG.studyCount),
  completionRate: formatStat(statRaw.completionRate, STAT_CONFIG.completionRate)
}))

// 缓动：cubic easeOut
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

// 应用进度到每个 raw 字段
function applyStatProgress(progress) {
  const eased = easeOutCubic(Math.max(0, Math.min(1, progress)))
  for (const key of Object.keys(STAT_CONFIG)) {
    const { from, to, decimals } = STAT_CONFIG[key]
    const raw = from + (to - from) * eased
    // 在动画过程中也保留 decimals 精度，避免小数位跳动
    statRaw[key] = decimals > 0 ? Number(raw.toFixed(decimals)) : Math.round(raw)
  }
}

// 启动/重启动画
function startStatAnimation(opts = {}) {
  const duration = typeof opts.duration === 'number' ? opts.duration : statDuration.value
  const delay = typeof opts.delay === 'number' ? opts.delay : statAnimCtrl.startDelay

  // 先停止任何运行中的动画
  cancelStatAnimation()

  // 重置为起始值
  for (const key of Object.keys(STAT_CONFIG)) statRaw[key] = STAT_CONFIG[key].from

  statAnimCtrl.paused = false
  statAnimCtrl.pausedAtElapsed = 0
  statAnimCtrl.running = true

  const kick = () => {
    statAnimCtrl.startTime = performance.now()

    const step = (now) => {
      if (!statAnimCtrl.running) return

      const elapsed = now - statAnimCtrl.startTime + statAnimCtrl.pausedAtElapsed
      const progress = Math.min(elapsed / duration, 1)

      applyStatProgress(progress)

      if (progress < 1) {
        statAnimCtrl.rafId = requestAnimationFrame(step)
      } else {
        statAnimCtrl.running = false
        statAnimCtrl.rafId = null
      }
    }

    statAnimCtrl.rafId = requestAnimationFrame(step)
  }

  if (delay > 0) {
    setTimeout(kick, delay)
  } else {
    kick()
  }
}

// 取消当前正在运行的动画
function cancelStatAnimation() {
  if (statAnimCtrl.rafId) {
    try { cancelAnimationFrame(statAnimCtrl.rafId) } catch (e) {}
    statAnimCtrl.rafId = null
  }
  statAnimCtrl.running = false
  statAnimCtrl.paused = false
  statAnimCtrl.pausedAtElapsed = 0
}

// 暂停 / 继续（当前按钮已删除，保留函数外壳避免历史引用报错）
function togglePauseStatAnimation() {
  // no-op
}

/* ============================================================
   Hero 进场动画触发
   ============================================================ */
function triggerHeroAnimation() {
  // 重置状态
  heroAnimated.value = false

  // 强制重绘后重新触发动画 + 数字滚动
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      heroAnimated.value = true
      startStatAnimation({ duration: statDuration.value, delay: statAnimCtrl.startDelay })
    })
  })
}

// 旧的 animateStats 仍保留，指向新系统（避免调用处报错 / 兼容）
function animateStats() {
  startStatAnimation({ duration: statDuration.value, delay: statAnimCtrl.startDelay })
}

/* ============================================================
   Video Data
   ============================================================ */
const videoGradients = [
  'linear-gradient(135deg, #1E40AF, #3B82F6)',
  'linear-gradient(135deg, #0F766E, #14B8A6)',
  'linear-gradient(135deg, #7C3AED, #A78BFA)',
  'linear-gradient(135deg, #B45309, #F59E0B)',
  'linear-gradient(135deg, #DB2777, #F472B6)',
  'linear-gradient(135deg, #2563EB, #0EA5E9)'
]

const videos = ref([])
const latestVideos = computed(() => videos.value.slice(0, 4))
const englishResources = ref([])
const resourceLoading = ref(false)

function mapVideo(doc, index) {
  return {
    id: doc._id,
    title: doc.title,
    category: doc.cat || '未分类',
    duration: doc.meta || '--:--',
    status: doc.status || '已上线',
    fileUrl: doc.fileUrl || '',
    cover: doc.cover || '',
    description: doc.description || '',
    gradient: videoGradients[index % videoGradients.length]
  }
}

function videoThumbStyle(video) {
  if (video.cover) {
    return {
      backgroundImage: `linear-gradient(rgba(15,23,42,.06), rgba(15,23,42,.38)), url("${video.cover}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }
  }
  return { background: video.gradient }
}

function mapEnglish(doc) {
  return {
    id: doc._id,
    title: doc.title,
    category: doc.cat || '未分类',
    level: doc.meta || '',
    fileUrl: doc.fileUrl || '',
    cover: doc.cover || '',
    description: doc.description || ''
  }
}

async function loadResources() {
  if (resourceLoading.value) return
  resourceLoading.value = true
  try {
    const resourcesObj = uniCloud.importObject('resources', { customUI: true })
    const r = (await resourcesObj.listPublic({ type: 'all' })) || {}
    if (r.errCode !== 0) {
      uni.showToast({ title: r.errMsg || '资源加载失败', icon: 'none' })
      return
    }
    const list = r.list || []
    const videoList = list
      .filter(d => d.type === 'video')
      .sort((a, b) => (b.createDate || 0) - (a.createDate || 0))
    videos.value = videoList.map(mapVideo)
    englishResources.value = list.filter(d => d.type === 'english').map(mapEnglish)
    STAT_CONFIG.courses.suffix = ''
    STAT_CONFIG.courses.to = videos.value.length
    statRaw.courses = videos.value.length

    recommendationPool.value = videos.value.map(toRecommendation)
    currentRecommendationIds.value = recommendationPool.value.slice(0, 4).map(r => r.id)
    recommendations.value = recommendationPool.value.slice(0, 4)

    const ovr = await loadOverviewWithCache()
    if (ovr && ovr.errCode === 0) {
      STAT_CONFIG.studyCount.to = ovr.surveyCount || 0
      STAT_CONFIG.completionRate.to = ovr.knowledgeCount || 0
      statRaw.studyCount = ovr.surveyCount || 0
      statRaw.completionRate = ovr.knowledgeCount || 0
    }
  } catch (e) {
    uni.showToast({ title: (e && e.errMsg) || '资源加载失败', icon: 'none' })
  } finally {
    resourceLoading.value = false
  }
}

const OVERVIEW_CACHE_KEY = 'lc_overview_cache'
const OVERVIEW_CACHE_TTL = 10 * 60 * 1000

async function loadOverviewWithCache() {
  const now = Date.now()
  try {
    const cached = uni.getStorageSync(OVERVIEW_CACHE_KEY)
    if (cached && cached.expireAt && cached.expireAt > now && cached.data) {
      return cached.data
    }
  } catch (e) {
    // 缓存读取失败时直接重新请求
  }

  try {
    const usersObj = uniCloud.importObject('users', { customUI: true })
    const ovr = (await usersObj.overview()) || {}
    if (ovr.errCode === 0) {
      try {
        uni.setStorageSync(OVERVIEW_CACHE_KEY, {
          expireAt: now + OVERVIEW_CACHE_TTL,
          data: ovr
        })
      } catch (e) {}
    }
    return ovr
  } catch (e) {
    console.error('[learning-center] overview load error:', e)
    return null
  }
}

function playVideo(video) {
  uni.navigateTo({ url: `/pages/learning-center/video-detail?id=${video.id}` })
}

function openEnglishResource(item) {
  const url = resolveResourceUrl(item.fileUrl)
  if (!url) {
    uni.showToast({ title: '该资源暂未配置文件地址', icon: 'none' })
    return
  }
  // #ifdef H5
  window.open(url, '_blank')
  // #endif
  // #ifndef H5
  uni.setClipboardData({ data: url, success: () => uni.showToast({ title: '资源地址已复制', icon: 'none' }) })
  // #endif
}

function goToListeningTraining() {
  uni.navigateTo({ url: '/pages/learning-center/listening-training' })
}

function showMoreVideos() {
  uni.navigateTo({ url: '/pages/learning-center/video-list' })
}

/* ============================================================
   Skills Data
   ============================================================ */
function goToLegalEnglish() {
  uni.navigateTo({ url: '/pages/learning-center/legal-english' })
}

/* ============================================================
   Recommendations Data
   ============================================================ */
const recommendations = ref([])
const recommendationPool = ref([])
const currentRecommendationIds = ref([])

function toRecommendation(video) {
  return {
    id: video.id,
    tag: video.category,
    tagClass: 'rec-tag-adv',
    title: video.title,
    reason: `视频 · ${video.duration}`,
    level: 1,
    levelLabel: '视频',
    url: `/pages/learning-center/video-detail?id=${video.id}`
  }
}

function shuffleRecommendations(list) {
  const result = list.slice()
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = result[i]
    result[i] = result[j]
    result[j] = tmp
  }
  return result
}

function refreshRecommendations() {
  const pool = recommendationPool.value
  if (!pool.length) return
  const currentIds = new Set(currentRecommendationIds.value)
  const otherItems = shuffleRecommendations(pool.filter(item => !currentIds.has(item.id)))
  let picked = []

  if (otherItems.length >= 4) {
    picked = otherItems.slice(0, 4)
  } else {
    picked = otherItems
    const pickedIds = new Set(picked.map(item => item.id))
    const fillItems = shuffleRecommendations(pool.filter(item => !pickedIds.has(item.id)))
    picked = picked.concat(fillItems.slice(0, Math.max(0, 4 - picked.length)))
  }

  currentRecommendationIds.value = picked.map(item => item.id)
  recommendations.value = picked
}

function startLearning(rec) {
  if (rec.url) {
    uni.navigateTo({ url: rec.url })
  } else if (rec.fileUrl) {
    openEnglishResource(rec)
  } else {
    uni.showToast({ title: '该资源暂未配置入口', icon: 'none' })
  }
}

/* ============================================================
   Section Visibility Animation
   ============================================================ */
const sections = reactive({
  // 直接初始化为 true：不再依赖 setTimeout 逐个点亮 .is-visible
  // 避免首屏出现"透明度为0→延迟后淡入"的假白屏/闪烁观感
  // 也取消 setTimeouts 调度开销
  video: true,
  english: true,
  skills: true,
  recommendation: true
})

function observeSections() {
  // no-op：所有板块初始化时已可见，不再需要延迟激活
}

/* ============================================================
   Navigation Methods
   ============================================================ */
function navigateTo(url) {
  uni.navigateTo({ url })
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

/* ============================================================
   Lifecycle
   ============================================================ */
onMounted(() => {
  // 页面加载时触发 Hero 进场动画
  heroAnimated.value = true
  observeSections()
  animateStats()
})

onLoad(() => {
  // 登录鉴权：未登录跳转登录页
  if (!requireLogin()) return
  try {
    const info = uni.getStorageSync('userInfo')
    if (info && info.name) {
      userName.value = info.name
    }
  } catch (e) {}
  loadResources()
})
</script>

<style scoped>
/* =========================================================
   Brand Design Tokens
   ========================================================= */
.lc-shell {
  /* === Brand Primary === */
  --rule-primary: #2563EB;
  --rule-primary-hover: #1D4ED8;
  --rule-primary-active: #1E40AF;
  --rule-primary-foreground: #FFFFFF;
  --rule-primary-tint-1: #DBEAFE;
  --rule-primary-tint-2: #BFDBFE;
  --rule-primary-tint-3: #EFF6FF;

  /* === Semantic === */
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

  /* === Radius === */
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

/* =========================================================
   Shell Layout
   ========================================================= */
.app-shell {
  display: flex;
  min-height: 100vh;
  background: var(--rule-background);
}

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
  flex-shrink: 0;
  overflow: hidden;
}

.ls-svg-glyph {
  width: 20px; height: 20px;
  background: #fff;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M7 21h10'/><path d='M12 3v18'/><path d='M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M7 21h10'/><path d='M12 3v18'/><path d='M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2'/></svg>") center/contain no-repeat;
}

.app-sidebar-logo-text {
  font-size: 15px; font-weight: 600;
  color: var(--rule-foreground);
  white-space: nowrap;
}

.app-sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  display: flex; flex-direction: column;
  gap: 4px;
  overflow-y: auto;
}

.app-nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
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

/* Nav icons (mask-based SVGs) */
.navi-icon {
  width: 20px; height: 20px; flex-shrink: 0;
  background: currentColor;
  display: inline-block;
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
.app-sidebar-user {
  padding: 16px 12px;
  border-top: 1px solid var(--rule-border);
}
.app-sidebar-user-inner {
  display: flex; align-items: center; gap: 12px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.15s ease;
}
.app-sidebar-user-inner:hover { background: var(--rule-muted); }
.app-sidebar-user-avatar {
  width: 32px; height: 32px; border-radius: 9999px;
  background: var(--rule-primary-tint-1); color: var(--rule-primary);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 600;
  flex-shrink: 0;
}
.app-sidebar-user-name {
  display: block;
  font-size: 13px; font-weight: 500;
  color: var(--rule-foreground);
}
.app-sidebar-user-role {
  display: block;
  font-size: 12px; color: var(--rule-muted-foreground);
}

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
  font-size: 13px;
  font-weight: 500;
}

/* ===== Main ===== */
.app-main {
  flex: 1; margin-left: 240px;
  display: flex; flex-direction: column;
  min-height: 100vh; min-width: 0;
}

.app-topbar {
  height: 64px;
  border-bottom: 1px solid var(--rule-border);
  background: var(--rule-card);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 32px; flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 30;
}
.app-topbar-title {
  font-size: 18px; font-weight: 600;
  color: var(--rule-foreground);
}
.app-topbar-meta {
  font-size: 13px;
  color: var(--rule-muted-foreground);
}

.app-content {
  flex: 1;
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

/* =========================================================
   Hero Section
   ========================================================= */
.lc-hero {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  padding: 64px 48px;
  margin-bottom: 56px;
  min-height: 340px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.lc-hero-bg {
  position: absolute;
  inset: 0;
  /* 性能优化：移除持续运行的背景渐变动画，改为静态渐变 */
  background: linear-gradient(135deg, #1E40AF, #2563EB, #3B82F6);
  z-index: 0;
}
/* 移除 heroGradientFlow 动画定义，避免 GPU 持续占用 */
.lc-hero-deco {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
  z-index: 1;
  pointer-events: none;
  will-change: transform;
}
.lc-hero-deco-1 {
  width: 300px; height: 300px;
  top: -100px; right: -80px;
  animation: floatDeco 8s ease-in-out infinite;
}
.lc-hero-deco-2 {
  width: 200px; height: 200px;
  bottom: -60px; left: -40px;
  animation: floatDeco 10s ease-in-out infinite reverse;
}
.lc-hero-deco-3 {
  width: 120px; height: 120px;
  top: 40%; left: 15%;
  animation: floatDeco 6s ease-in-out infinite;
}

/* ============ Hero 进场动画 ============ */
/* 初始状态：所有元素隐藏 */
.hero-title-enter,
.hero-subtitle-enter,
.hero-stat-enter,
.hero-deco-enter {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

/* 标题：从上方淡入 */
.hero-title-enter {
  transform: translateY(-40px) scale(0.95);
}

/* 副标题：从下方淡入 */
.hero-subtitle-enter {
  transform: translateY(30px);
  transition-delay: 0.15s;
}

/* 统计数据：依次缩放淡入 */
.hero-stat-enter {
  transform: translateY(20px) scale(0.9);
  transition-delay: calc(0.3s + var(--delay) * 0.12s);
  transition-duration: 0.65s;
}

/* 装饰元素：从远处缩放淡入 */
.hero-deco-enter {
  transform: scale(0) translateY(0);
  transition-delay: calc(0.5s + var(--d) * 0.08s);
  transition-duration: 0.5s;
}

/* 动画激活状态 */
.hero-animate .hero-title-enter {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.hero-animate .hero-subtitle-enter {
  opacity: 1;
  transform: translateY(0);
}

.hero-animate .hero-stat-enter {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.hero-animate .hero-deco-enter {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* 减弱动画（无障碍） */
@media (prefers-reduced-motion: reduce) {
  .hero-title-enter,
  .hero-subtitle-enter,
  .hero-stat-enter,
  .hero-deco-enter {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

/* ============ Scroll-Reveal 进场动画（与 index.vue 一致） ============ */
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

@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
}

@keyframes floatDeco {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(20px, -15px) scale(1.05); }
  66% { transform: translate(-10px, 10px) scale(0.95); }
}
.lc-hero-content {
  position: relative;
  z-index: 2;
  max-width: 720px;
}
.lc-hero-title {
  display: block;
  font-size: 44px;
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: -0.02em;
  line-height: 1.3;
  margin-bottom: 16px;
  text-shadow: 0 2px 20px rgba(0,0,0,0.15);
  white-space: nowrap;
}
.lc-hero-subtitle {
  display: block;
  font-size: 16px;
  color: rgba(255,255,255,0.88);
  margin-bottom: 32px;
  line-height: 1.6;
}
.lc-hero-stats {
  display: flex; gap: 48px;
  justify-content: center;
  flex-wrap: wrap;
}
.lc-hero-stat {
  text-align: center;
}
.lc-hero-stat-num {
  display: block;
  font-size: 32px; font-weight: 700;
  color: #FFFFFF;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}
.lc-hero-stat-label {
  display: block;
  font-size: 13px;
  color: rgba(255,255,255,0.7);
  margin-top: 4px;
}

/* =========================================================
   Section Common
   ========================================================= */
.lc-section {
  margin-bottom: 56px;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s cubic-bezier(.2,.8,.2,1);
}
.lc-section:last-child { margin-bottom: 0; }
.lc-section.is-visible {
  opacity: 1;
  transform: translateY(0);
}
.lc-section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
}
.lc-section-title-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}
.lc-section-bar {
  width: 4px; height: 24px;
  background: var(--rule-primary);
  border-radius: 2px;
  flex-shrink: 0;
}
.lc-section-title {
  display: block;
  font-size: 22px; font-weight: 700;
  color: var(--rule-foreground);
  letter-spacing: -0.01em;
  line-height: 1.2;
}
.lc-section-subtitle {
  display: block;
  font-size: 14px;
  color: var(--rule-muted-foreground);
  margin-top: 4px;
}

/* =========================================================
   Video Learning
   ========================================================= */
.video-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.video-card {
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  display: flex; flex-direction: column;
  transition: transform 0.2s cubic-bezier(.2,.8,.2,1), box-shadow 0.2s ease, border-color 0.2s ease;
  /* 性能优化：提示 GPU 合成层 */
  will-change: transform;
  contain: layout style;
}
.video-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--rule-shadow-2);
  border-color: var(--rule-primary-tint-2);
}
.video-thumb {
  position: relative;
  height: 140px;
  overflow: hidden;
}
.video-thumb-gradient {
  position: absolute;
  inset: 0;
  transition: transform 0.3s ease;
}
.video-card:hover .video-thumb-gradient {
  transform: scale(1.05);
}
.video-play-overlay {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(15,23,42,0);
  transition: background 0.2s ease;
}
.video-card:hover .video-play-overlay {
  background: rgba(15,23,42,0.3);
}
.video-play-btn {
  width: 48px; height: 48px; border-radius: 50%;
  background: rgba(255,255,255,0.9);
  display: flex; align-items: center; justify-content: center;
  transform: scale(0.8); opacity: 0;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,.2);
}
.video-card:hover .video-play-btn {
  transform: scale(1);
  opacity: 1;
}
.play-icon {
  width: 18px; height: 18px;
  background: var(--rule-primary);
  margin-left: 2px;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'><polygon points='6 3 20 12 6 21 6 3'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'><polygon points='6 3 20 12 6 21 6 3'/></svg>") center/contain no-repeat;
}
.video-duration {
  position: absolute; bottom: 8px; right: 8px;
  background: rgba(15,23,42,0.7); color: #fff;
  font-size: 11px; font-weight: 500;
  padding: 2px 8px; border-radius: 4px;
  font-variant-numeric: tabular-nums;
}
.video-info {
  padding: 16px;
}
.video-title {
  display: block;
  font-size: 14px; font-weight: 600;
  color: var(--rule-foreground);
  line-height: 1.4;
  margin-bottom: 8px;
}
.video-meta {
  display: flex; gap: 12px;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--rule-muted-foreground);
}
.video-meta-item {
  display: flex; align-items: center; gap: 4px;
}
.user-icon-sm, .eye-icon-sm {
  width: 13px; height: 13px;
  background: currentColor;
}
.user-icon-sm {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>") center/contain no-repeat;
}
.eye-icon-sm {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z'/><circle cx='12' cy='12' r='3'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z'/><circle cx='12' cy='12' r='3'/></svg>") center/contain no-repeat;
}

.more-videos-btn {
  font-size: 14px; font-weight: 500;
  color: var(--rule-primary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 0;
  transition: color 0.15s ease;
  white-space: nowrap;
  display: inline-flex; align-items: center; gap: 4px;
}
.more-videos-btn:hover {
  color: var(--rule-primary-hover);
  text-decoration: underline;
}
.refresh-icon {
  width: 15px; height: 15px;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8'/><path d='M21 3v5h-5'/><path d='M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16'/><path d='M3 21v-5h5'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8'/><path d='M21 3v5h-5'/><path d='M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16'/><path d='M3 21v-5h5'/></svg>") center/contain no-repeat;
}
.chev-r-sm {
  width: 15px; height: 15px;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='9 18 15 12 9 6'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='9 18 15 12 9 6'/></svg>") center/contain no-repeat;
}

/* =========================================================
   Skill Cards
   ========================================================= */
.skill-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.skill-card {
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: 14px;
  padding: 24px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  /* 性能优化 */
  will-change: transform;
  contain: layout style;
}
.skill-card:hover {
  border-color: var(--rule-primary-tint-2);
  box-shadow: var(--rule-shadow-2);
  transform: translateY(-2px);
}
.skill-card-head {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
.skill-icon-wrap {
  width: 48px; height: 48px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.headphones-icon, .handshake-icon, .globe-icon, .gavel-icon, .file-text-icon {
  width: 24px; height: 24px;
  background: #fff;
}
.headphones-icon {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M3 18v-6a9 9 0 0 1 18 0v6'/><path d='M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M3 18v-6a9 9 0 0 1 18 0v6'/><path d='M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z'/></svg>") center/contain no-repeat;
}
.handshake-icon {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M11 17a1 1 0 0 1 2 0'/><path d='M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1.5'/><path d='M16 7.5h5v5h-5l-3-2.5 3-2.5z'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M11 17a1 1 0 0 1 2 0'/><path d='M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1.5'/><path d='M16 7.5h5v5h-5l-3-2.5 3-2.5z'/></svg>") center/contain no-repeat;
}
.globe-icon {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20'/><path d='M2 12h20'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20'/><path d='M2 12h20'/></svg>") center/contain no-repeat;
}
.gavel-icon {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='m14.5 15.5 3 3L19 17l-3-3'/><path d='m8 12 4.5 4.5'/><path d='M2 22 7.5 16.5'/><path d='M18.5 5.5a2 2 0 0 0-2.8 0L9.2 11.9a2 2 0 0 0 0 2.8l2.7 2.7a2 2 0 0 0 2.8 0l6.4-6.4a2 2 0 0 0 0-2.8l-2.7-2.7z'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='m14.5 15.5 3 3L19 17l-3-3'/><path d='m8 12 4.5 4.5'/><path d='M2 22 7.5 16.5'/><path d='M18.5 5.5a2 2 0 0 0-2.8 0L9.2 11.9a2 2 0 0 0 0 2.8l2.7 2.7a2 2 0 0 0 2.8 0l6.4-6.4a2 2 0 0 0 0-2.8l-2.7-2.7z'/></svg>") center/contain no-repeat;
}
.file-text-icon {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'/><polyline points='14 2 14 8 20 8'/><line x1='16' x2='8' y1='13' y2='13'/><line x1='16' x2='8' y1='17' y2='17'/><line x1='10' x2='8' y1='9' y2='9'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'/><polyline points='14 2 14 8 20 8'/><line x1='16' x2='8' y1='13' y2='13'/><line x1='16' x2='8' y1='17' y2='17'/><line x1='10' x2='8' y1='9' y2='9'/></svg>") center/contain no-repeat;
}
.skill-info {
  flex: 1; min-width: 0;
}
.skill-name {
  display: block;
  font-size: 17px; font-weight: 700;
  color: var(--rule-foreground);
  margin-bottom: 4px;
}
.skill-desc {
  display: block;
  font-size: 13px;
  color: var(--rule-muted-foreground);
  line-height: 1.5;
}
.skill-meta {
  display: flex; align-items: center; gap: 12px;
  margin-top: 16px;
}
.skill-course-count {
  font-size: 12px; font-weight: 500;
  background: var(--rule-primary-tint-3); color: var(--rule-primary);
  padding: 3px 10px; border-radius: 6px;
  flex-shrink: 0;
}
.skill-progress-wrap {
  flex: 1; min-width: 0;
}
.skill-progress-track {
  height: 6px;
  background: var(--rule-muted);
  border-radius: 3px;
  overflow: hidden;
}
.skill-progress-fill {
  height: 100%;
  background: var(--rule-primary);
  border-radius: 3px;
  transition: width 1s cubic-bezier(.2,.8,.2,1);
}
.skill-progress-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: var(--rule-muted-foreground);
  margin-top: 4px;
}
.skill-progress-pct {
  color: var(--rule-primary);
  font-weight: 600;
}

/* =========================================================
   Recommendations
   ========================================================= */
.rec-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.lc-empty {
  margin-top: 16px;
  padding: 32px;
  border: 1px dashed var(--rule-border);
  border-radius: 10px;
  color: var(--rule-ink-3);
  text-align: center;
  font-size: 14px;
}
.rec-card {
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: 14px;
  padding: 24px;
  display: flex; flex-direction: column; gap: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  /* 性能优化 */
  will-change: transform;
  contain: layout style;
}
.rec-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--rule-shadow-2);
  border-color: var(--rule-primary-tint-2);
}
.rec-tag {
  display: inline-flex;
  font-size: 12px; font-weight: 600;
  padding: 3px 10px; border-radius: 6px;
  width: fit-content;
}
.rec-tag-weak {
  background: var(--state-error-tint);
  color: var(--state-error);
}
.rec-tag-up {
  background: var(--state-success-tint);
  color: var(--state-success);
}
.rec-tag-adv {
  background: var(--state-info-tint);
  color: var(--rule-primary);
}
.rec-tag-daily {
  background: var(--state-warning-tint);
  color: var(--state-warning);
}
.rec-title {
  display: block;
  font-size: 16px; font-weight: 700;
  color: var(--rule-foreground);
  line-height: 1.4;
}
.rec-reason {
  display: block;
  font-size: 13px;
  color: var(--rule-muted-foreground);
  line-height: 1.5;
  flex: 1;
}
.rec-level {
  display: flex;
  align-items: center; gap: 4px;
  font-size: 12px;
  color: var(--rule-muted-foreground);
}
.star-icon {
  width: 14px; height: 14px;
  background: none;
  border: 1.5px solid #CBD5E1;
  border-radius: 2px;
  transition: all 0.15s ease;
}
.star-icon.filled {
  background: #F59E0B;
  border-color: #F59E0B;
}
.rec-level-label {
  margin-left: 4px;
}
.rec-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  font-size: 13px; font-weight: 600;
  background: var(--rule-primary); color: var(--rule-primary-foreground);
  padding: 8px 16px; border-radius: 8px;
  border: none; cursor: pointer;
  transition: background 0.15s ease, transform 0.15s ease;
  width: fit-content;
}
.rec-btn:hover {
  background: var(--rule-primary-hover);
  transform: scale(1.02);
}
.arrow-r {
  width: 16px; height: 16px;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M5 12h14'/><path d='m12 5 7 7-7 7'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M5 12h14'/><path d='m12 5 7 7-7 7'/></svg>") center/contain no-repeat;
}

/* =========================================================
   Responsive
   ========================================================= */
@media (max-width: 1024px) {
  .video-grid { grid-template-columns: repeat(2, 1fr); }
  .skill-grid { grid-template-columns: repeat(2, 1fr); }
  .rec-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .video-grid { grid-template-columns: 1fr; }
  .skill-grid { grid-template-columns: 1fr; }
  .rec-grid { grid-template-columns: 1fr; }
  .lc-hero { padding: 40px 24px; }
  .lc-hero-stats { gap: 24px; }
  .lc-hero-title { font-size: 28px; }
  .lc-hero-stat-num { font-size: 26px; }
}
@media (max-width: 768px) {
  .app-sidebar { transform: translateX(-100%); transition: transform 0.3s; }
  .app-main { margin-left: 0; }
  .app-content { padding: 16px; }
  .lc-section-header { flex-direction: column; align-items: flex-start; }
}
@media (prefers-reduced-motion: reduce) {
  .lc-hero-bg { animation: none; }
  .lc-hero-deco { animation: none; }
  .lc-section { transition-duration: 0.01ms; }
  .video-card:hover, .skill-card:hover, .rec-card:hover { transform: none; }
}
</style>
