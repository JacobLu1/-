<template>
  <div class="app-shell">
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
        <view class="app-nav-item is-active" data-nav-key="learning-center" @tap="navigateTo('/pages/learning-center/learning-center')">
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
    <div class="app-main">
      <header class="app-topbar">
        <div class="app-topbar-left">
          <div class="app-back-btn" @click="goBack">
            <span class="back-arrow-icon"></span>
            <span>返回</span>
          </div>
          <h1 class="app-topbar-title">视频学习详情</h1>
        </div>
        <span class="app-topbar-meta">{{ todayDateText }}</span>
      </header>
      <main class="app-content">

        <!-- ===== 1. Header bar ===== -->
        <div class="vd-header-bar">
          <div class="vd-title-area">
            <h1 class="vd-video-title">{{ currentTitle }}</h1>
            <div class="vd-video-meta">
              <span class="vd-meta-item">
                <i data-lucide="user"></i> {{ currentCategory }}
              </span>
              <span class="vd-meta-item">
                <i data-lucide="clock"></i> 总时长 {{ currentDuration }}
              </span>
              <span class="vd-meta-tag">{{ currentCategory }}</span>
            </div>
          </div>
        </div>

        <!-- ===== 2. Main grid: video player + course outline ===== -->
        <div class="vd-main-grid vd-reveal" :class="{'is-visible': visibleSections[0]}">
          <!-- Left: Video player card -->
          <div class="vd-player-card" :class="{'is-fullscreen': isFullscreen}" ref="playerCardRef">
            <div class="vd-player-wrap" @click="onPlayerAreaClick">
              <template v-if="!isEmbedVideo">
                <video
                  class="vd-video-element"
                  :src="videoSrc"
                  :controls="false"
                  preload="metadata"
                  playsinline
                  webkit-playsinline
                  @timeupdate="onTimeUpdate"
                  @loadedmetadata="onLoadedMeta"
                  @play="onPlay"
                  @pause="onPause"
                  @ended="onEnded"
                  @waiting="onWaiting"
                  @playing="onPlaying"
                  @seeked="onSeeked"
                  @progress="onProgress"
                  @volumechange="onVolumeChange"
                  @error="onVideoError"
                ></video>

                <!-- 缓冲加载动画 -->
                <div v-if="isBuffering" class="vd-buffering" aria-hidden="true">
                  <div class="vd-spinner"></div>
                </div>

                <!-- 加载失败提示 -->
                <div v-if="videoError" class="vd-error">
                  <p class="vd-error-title">视频加载失败</p>
                  <p class="vd-error-sub">{{ videoError }}</p>
                  <button class="vd-retry-btn" type="button" @click.stop="retryLoad">重试</button>
                </div>


              </template>

              <!-- B站官方嵌入播放器 -->
              <iframe
                v-else
                class="vd-embed-player"
                :src="bilibiliEmbedUrl"
                title="bilibili video player"
                frameborder="0"
                scrolling="no"
                allowfullscreen
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              ></iframe>
            </div>

            <div v-if="!isEmbedVideo" class="vd-player-controls">
              <button class="vd-ctrl-btn" type="button" aria-label="播放/暂停" @click="togglePlay">
                <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6 3 20 12 6 21 6 3"></polygon>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                  <rect x="14" y="4" width="4" height="16" rx="1"></rect>
                </svg>
              </button>

              <div class="vd-progress-bar"
                   @click="handleProgressClick"
                   @mousemove="handleProgressMouseMove"
                   @mousedown="handleProgressMouseDown"
                   @mouseup="handleProgressMouseUp"
                   @mouseleave="handleProgressMouseLeave"
                   @touchstart.passive="handleProgressTouchStart"
                   @touchmove.passive="handleProgressTouchMove"
                   @touchend="handleProgressTouchEnd">
                <div class="vd-progress-buffer" :style="{width: bufferedPct + '%'}"></div>
                <div class="vd-progress-fill" :class="{ 'is-dragging': isDragging }" :style="{width: progressPct + '%'}"></div>
                <!-- 预览指示器 -->
                <div v-if="hoverPosition >= 0"
                     class="vd-progress-preview"
                     :style="{left: hoverPosition + '%'}">
                  <div class="vd-preview-tooltip">{{ hoverTimeFormatted }}</div>
                  <div class="vd-preview-line"></div>
                </div>
              </div>

              <span class="vd-progress-time">
                <span class="vd-current-time">{{ currentTimeFormatted }}</span> / {{ durationFormatted }}
              </span>

              <!-- 音量控制 -->
              <div class="vd-volume-ctrl">
                <button class="vd-ctrl-btn" type="button" :aria-label="isMuted || volumePct === 0 ? '取消静音' : '静音'" @click="toggleMute">
                  <svg v-if="isMuted || volumePct === 0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                  </svg>
                  <svg v-else-if="volumePct < 50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                  </svg>
                </button>
                <div class="vd-volume-track" role="slider" aria-label="音量"
                     :aria-valuenow="volumePct" aria-valuemin="0" aria-valuemax="100"
                     @click="onVolumeTrackClick"
                     @mousedown="onVolumeTrackDown"
                     @mousemove="onVolumeTrackMove"
                     @mouseup="onVolumeTrackUp"
                     @mouseleave="onVolumeTrackLeave">
                  <div class="vd-volume-fill" :style="{width: volumePct + '%'}"></div>
                </div>
              </div>

              <!-- 倍速控制 -->
              <div class="vd-speed-ctrl">
                <button class="vd-speed-btn" type="button" @click="speedMenuOpen = !speedMenuOpen">
                  {{ playbackRate }}x
                </button>
                <div v-if="speedMenuOpen" class="vd-speed-menu">
                  <button v-for="r in speedOptions" :key="r" type="button"
                          :class="{active: playbackRate === r}" @click="setSpeed(r)">{{ r }}x</button>
                </div>
              </div>

              <!-- 全屏 -->
              <button class="vd-ctrl-btn" type="button" :aria-label="isFullscreen ? '退出全屏' : '全屏'" @click="toggleFullscreen">
                <svg v-if="!isFullscreen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <polyline points="9 21 3 21 3 15"></polyline>
                  <line x1="21" y1="3" x2="14" y2="10"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="4 14 10 14 10 20"></polyline>
                  <polyline points="20 10 14 10 14 4"></polyline>
                  <line x1="14" y1="10" x2="21" y2="3"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
              </button>
            </div>
          </div>

          <!-- Right: Course intro card -->
          <div class="vd-outline-card" :style="outlineCardStyle">
            <div class="vd-outline-header">
              <span class="vd-outline-title">
                课程简介
                <span v-if="aiIntro" class="vd-ai-badge">AI 生成</span>
              </span>
            </div>
            <div class="vd-outline-list vd-intro-body">
              <rich-text v-if="aiIntro" class="vd-intro-html" :nodes="aiIntroHtml"></rich-text>
              <p v-else-if="aiGenerating" class="vd-intro-text vd-ai-loading">AI 正在根据课程内容生成简介…</p>
              <p v-else class="vd-intro-text">{{ (currentResource && currentResource.description) || '暂无课程简介' }}</p>
            </div>
          </div>
        </div>

        <!-- ===== 3. Related recommended videos ===== -->
        <section class="vd-reveal" :class="{'is-visible': visibleSections[2]}" aria-label="相关推荐">
          <div class="doc-section-header">
            <h2 class="doc-section-title">相关推荐</h2>
            <span class="doc-section-meta">共 {{ recommendedVideos.length }} 门课程</span>
          </div>
          <div class="vd-rec-grid">
            <div v-for="video in recommendedVideos" 
                 :key="video.id" 
                 class="rec-card"
                 @click="navigateTo('/pages/learning-center/video-detail?id=' + video.id)">
              <div class="rec-thumb">
                <div class="rec-thumb-bg" :style="recThumbStyle(video)"></div>
                <div class="rec-play-overlay">
                  <div class="rec-play-btn">
                    <div class="rec-play-triangle"></div>
                  </div>
                </div>
                <span class="rec-duration">{{ video.duration }}</span>
              </div>
              <div class="rec-info">
                <h3 class="rec-title">{{ video.title }}</h3>
                <div class="rec-meta">
                  <span class="rec-meta-item">
                    <div class="rec-user-icon"></div>
                    {{ video.category }}
                  </span>
                  <span class="rec-meta-item">
                    <div class="rec-eye-icon"></div>
                    {{ video.date || '已上线' }}
                  </span>
                </div>
              </div>
            </div>
            <div v-if="!recommendedVideos.length" class="vd-empty">暂无推荐视频</div>
          </div>
        </section>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { onLoad, onShow, onHide, onUnload } from '@dcloudio/uni-app'
import { requireLogin, getDisplayName, getLevelText } from '@/utils/auth.js'
import { resolveResourceUrl } from '@/utils/video-config.js'

// 用户信息
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

// ==================== AI 课程简介 ====================
const aiIntro = ref('')
const aiIntroHtml = ref('')
const aiGenerating = ref(false)

// ==================== Markdown → HTML（课程简介排版） ====================
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function inlineMd(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:700;">$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em style="font-style:italic;">$2</em>')
    .replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,.06);border-radius:4px;padding:1px 5px;font-size:13px;">$1</code>')
}

function markdownToHtml(md) {
  if (!md) return ''
  const lines = String(md).split('\n')
  let html = ''
  let i = 0

  while (i < lines.length) {
    let line = lines[i]

    // 标题：## 课程概述 等
    const headMatch = line.match(/^(#{1,3})\s+(.+)$/)
    if (headMatch) {
      const level = headMatch[1].length
      const text = headMatch[2]
      const size = level === 1 ? '17px' : level === 2 ? '16px' : '15px'
      html += '<p style="font-size:' + size + ';font-weight:700;color:var(--rule-foreground);margin:12px 0 6px;">' + inlineMd(text) + '</p>'
      i++
      continue
    }

    // 无序列表：收集相邻列表项
    if (/^[-*]\s+/.test(line)) {
      let items = []
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push('<li style="color:var(--rule-ink-2);line-height:1.7;">' + inlineMd(lines[i].replace(/^[-*]\s+/, '')) + '</li>')
        i++
      }
      html += '<ul style="padding-left:18px;margin:6px 0;list-style:disc;">' + items.join('') + '</ul>'
      continue
    }

    // 有序列表
    if (/^\d+[.、]\s+/.test(line)) {
      let items = []
      while (i < lines.length && /^\d+[.、]\s+/.test(lines[i])) {
        items.push('<li style="color:var(--rule-ink-2);line-height:1.7;">' + inlineMd(lines[i].replace(/^\d+[.、]\s+/, '')) + '</li>')
        i++
      }
      html += '<ol style="padding-left:18px;margin:6px 0;list-style:decimal;">' + items.join('') + '</ol>'
      continue
    }

    // 空行
    if (!line.trim()) {
      html += '<div style="height:6px;"></div>'
      i++
      continue
    }

    // 普通段落
    html += '<p style="margin:6px 0;color:var(--rule-foreground);line-height:1.7;word-break:break-word;">' + inlineMd(line.trim()) + '</p>'
    i++
  }

  return html
}

// ==================== 播放器状态 ====================
const playerCardRef = ref(null)
const outlineCardStyle = ref({})

// 简介卡片高度以播放器卡片为上限：内容超高时卡片内部滚动，播放器保持自身高度不被撑高
function syncOutlineHeight() {
  const el = playerCardRef.value
  if (!el) return
  outlineCardStyle.value = { maxHeight: el.offsetHeight + 'px' }
}

const currentResource = ref(null)
const currentTitle = ref('视频学习详情')
const currentCategory = ref('涉外法治')
const currentDuration = ref('--:--')
// 视频地址必须由 resource.fileUrl 提供，不配置时不再回退到默认示例视频
const videoSrc = ref('')
const bilibiliEmbedUrl = ref('')
const isEmbedVideo = computed(() => !!bilibiliEmbedUrl.value)
// 进度记忆存储 key
let progressKey = 'vd_progress_'

const isPlaying = ref(false)
const isBuffering = ref(false)
const isDragging = ref(false)
const hoverPosition = ref(-1) // 鼠标悬停位置（0-100），-1表示不在进度条上
const progressPct = ref(0)
const bufferedPct = ref(0)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const isMuted = ref(false)
const playbackRate = ref(1)
const speedMenuOpen = ref(false)
const isFullscreen = ref(false)
const videoError = ref('')
const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2]

// 推荐视频：由资源库真实视频生成
const recommendedVideos = ref([])

const visibleSections = ref([false, false, false])

// 秒数格式化为 mm:ss 或 h:mm:ss
const formatTime = (sec) => {
  if (!isFinite(sec) || sec < 0) sec = 0
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = Math.floor(sec % 60)
  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

const currentTimeFormatted = computed(() => formatTime(currentTime.value))

const durationFormatted = computed(() => {
  return duration.value > 0 ? formatTime(duration.value) : '--:--'
})

const hoverTimeFormatted = computed(() => {
  if (hoverPosition.value < 0 || duration.value <= 0) return '00:00'
  const hoverSeconds = Math.round(duration.value * hoverPosition.value / 100)
  return formatTime(hoverSeconds)
})

const volumePct = computed(() => Math.round((isMuted.value ? 0 : volume.value) * 100))

// B站支持：播放页地址或官方嵌入地址统一转为 iframe 可加载地址
const buildBilibiliEmbedUrl = (fileUrl) => {
  if (!fileUrl) return ''
  const value = String(fileUrl).trim()
  if (/player\.bilibili\.com\/player\.html/i.test(value)) {
    return /^https?:\/\//i.test(value) ? value : `https://${value}`
  }
  const bvid = value.match(/BV[0-9A-Za-z]{8,}/)
  if (!bvid) return ''
  const pageMatch = value.match(/[?&]p=(\d+)/)
  const page = pageMatch ? pageMatch[1] : '1'
  return `https://player.bilibili.com/player.html?bvid=${bvid[0]}&page=${page}&high_quality=1&danmaku=0`
}

// ==================== 播放器核心逻辑 ====================

// uni-app H5 会把 <video> 编译为 <uni-video> 包装组件：模板上写的类名落在 uni-video 上，
// 真实原生 video 元素是其内部后代（class 为 uni-video-video）。因此用后代选择器取真实元素，
// 才能正常调用 play/pause/currentTime/volume 等原生 API。
const getVideo = () => {
  if (typeof document === 'undefined') return null
  return document.querySelector('.vd-video-element video') || document.querySelector('.uni-video-video')
}

// 播放 / 暂停
const togglePlay = () => {
  if (videoError.value) return
  const v = getVideo()
  if (!v) return
  if (v.paused) {
    v.play().catch(() => {
      videoError.value = '浏览器阻止了自动播放，请点击播放按钮'
    })
  } else {
    v.pause()
  }
}

// 点击播放区域（视频画面 / 空白区）切换播放
const onPlayerAreaClick = (e) => {
  // 排除缓冲遮罩、错误遮罩，避免事件冒泡导致 togglePlay 被执行两次
  if (e.target.closest('.vd-buffering, .vd-error')) return
  togglePlay()
}

// 视频事件
const onPlay = () => {
  isPlaying.value = true
  isBuffering.value = false
}

const onPause = () => {
  isPlaying.value = false
}

const onPlaying = () => {
  isBuffering.value = false
}

const onWaiting = () => {
  // 暂停态下的 seek 也会触发 waiting，但没有 playing 事件兜底，会导致缓冲动画一直转圈
  const v = getVideo()
  if (!v || v.paused) return
  isBuffering.value = true
}

const onSeeked = () => {
  // 跳转完成后兜底清除缓冲态
  isBuffering.value = false
}

const onEnded = () => {
  isPlaying.value = false
  progressPct.value = 100
}

const onVideoError = () => {
  videoError.value = '视频文件无法加载，请检查网络后重试'
  isPlaying.value = false
  isBuffering.value = false
}

const retryLoad = () => {
  videoError.value = ''
  const v = getVideo()
  if (v) v.load()
}

// 元数据加载完成：记录时长（本页面不保存/恢复进度，始终从 0:00 开始）
const onLoadedMeta = () => {
  const v = getVideo()
  if (!v) return
  duration.value = isFinite(v.duration) ? v.duration : 0
}

// 播放进度更新
const onTimeUpdate = () => {
  const v = getVideo()
  if (!v || !duration.value) return
  // uni-app H5 的 uni-video 不转发 seeked/playing 事件，播放态跳转后 waiting 置起的
  // 缓冲态无人清除；timeupdate 是转发的，播放恢复后借此兜底清除
  isBuffering.value = false
  if (!isDragging.value) {
    currentTime.value = v.currentTime
    progressPct.value = (v.currentTime / duration.value) * 100
  }
}

// 缓冲进度
const onProgress = () => {
  const v = getVideo()
  if (!v || !v.buffered || !v.buffered.length || !duration.value) return
  const end = v.buffered.end(v.buffered.length - 1)
  bufferedPct.value = Math.min(100, (end / duration.value) * 100)
}

// 彻底清除已保存的播放进度（本页面不持久化进度，页面关闭/离开时清除，保证下次从 0:00 开始）
const clearProgress = () => {
  try {
    uni.removeStorageSync(progressKey)
  } catch (e) {}
}

// 计算进度条位置（兼容鼠标与触摸）
const calculateProgress = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX
  const x = clientX - rect.left
  return Math.min(100, Math.max(0, (x / rect.width) * 100))
}

// 按百分比跳转
const seekToPct = (pct) => {
  const v = getVideo()
  if (!v || !duration.value) return
  const t = (pct / 100) * duration.value
  v.currentTime = t
  currentTime.value = t
  progressPct.value = pct
  // 立即清除缓冲态，避免暂停态下跳转后出现"无限加载"
  isBuffering.value = false
}

// 进度条鼠标事件
const handleProgressMouseMove = (e) => {
  hoverPosition.value = calculateProgress(e)
  if (isDragging.value) {
    progressPct.value = hoverPosition.value
    currentTime.value = (hoverPosition.value / 100) * duration.value
  }
}

const handleProgressMouseDown = (e) => {
  e.preventDefault()
  isDragging.value = true
  hoverPosition.value = calculateProgress(e)
  seekToPct(hoverPosition.value)
}

const handleProgressMouseUp = (e) => {
  if (isDragging.value) {
    isDragging.value = false
    seekToPct(calculateProgress(e))
  }
}

const handleProgressMouseLeave = () => {
  if (!isDragging.value) {
    hoverPosition.value = -1
  }
}

const handleProgressClick = (e) => {
  if (isDragging.value) return
  seekToPct(calculateProgress(e))
}

// 进度条触摸事件（移动端）
const handleProgressTouchStart = (e) => {
  isDragging.value = true
  seekToPct(calculateProgress(e))
}

const handleProgressTouchMove = (e) => {
  if (!isDragging.value) return
  const pct = calculateProgress(e)
  progressPct.value = pct
  currentTime.value = (pct / 100) * duration.value
}

const handleProgressTouchEnd = (e) => {
  if (!isDragging.value) return
  isDragging.value = false
  const last = e.changedTouches[e.changedTouches.length - 1]
  seekToPct(calculateProgress(last))
}

// 音量控制（自定义轨道，兼容 uni-app H5 不保留原生 input[type=range] 的问题）
let volumeDragging = false

const volumeTrackPct = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX
  const x = clientX - rect.left
  return Math.min(100, Math.max(0, (x / rect.width) * 100))
}

const applyVolumePct = (pct) => {
  const v = getVideo()
  if (!v) return
  v.volume = pct / 100
  v.muted = false
  volume.value = pct / 100
  isMuted.value = false
}

const onVolumeTrackClick = (e) => applyVolumePct(volumeTrackPct(e))
const onVolumeTrackDown = (e) => {
  volumeDragging = true
  applyVolumePct(volumeTrackPct(e))
}
const onVolumeTrackMove = (e) => {
  if (volumeDragging) applyVolumePct(volumeTrackPct(e))
}
const onVolumeTrackUp = (e) => {
  if (volumeDragging) {
    volumeDragging = false
    applyVolumePct(volumeTrackPct(e))
  }
}
const onVolumeTrackLeave = () => {
  volumeDragging = false
}

const toggleMute = () => {
  const v = getVideo()
  if (!v) return
  v.muted = !v.muted
  isMuted.value = v.muted
  if (!v.muted && v.volume === 0) {
    v.volume = 0.5
    volume.value = 0.5
  }
}

const onVolumeChange = () => {
  const v = getVideo()
  if (!v) return
  volume.value = v.volume
  isMuted.value = v.muted
}

// 播放速度
const setSpeed = (rate) => {
  const v = getVideo()
  if (v) v.playbackRate = rate
  playbackRate.value = rate
  speedMenuOpen.value = false
}

// 全屏切换
const toggleFullscreen = () => {
  const el = playerCardRef.value
  if (!el) return
  const isFs = document.fullscreenElement || document.webkitFullscreenElement
  if (isFs) {
    const exit = document.exitFullscreen || document.webkitExitFullscreen
    if (exit) exit.call(document)
  } else {
    const req = el.requestFullscreen || el.webkitRequestFullscreen
    if (req) {
      try {
        const p = req.call(el)
        if (p && p.catch) p.catch(() => {})
      } catch (e) {}
    }
  }
}

const onFullscreenChange = () => {
  isFullscreen.value = !!(document.fullscreenElement || document.webkitFullscreenElement)
}

// 键盘快捷键（空格播放/暂停，方向键快进快退/音量，M静音，F全屏）
const onKeydown = (e) => {
  const v = getVideo()
  if (!v) return
  const tag = (e.target && e.target.tagName || '').toUpperCase()
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON' || tag === 'UNI-BUTTON') return
  switch (e.key) {
    case ' ':
      e.preventDefault()
      togglePlay()
      break
    case 'ArrowRight':
      e.preventDefault()
      v.currentTime = Math.min(duration.value || 0, v.currentTime + 10)
      break
    case 'ArrowLeft':
      e.preventDefault()
      v.currentTime = Math.max(0, v.currentTime - 10)
      break
    case 'ArrowUp':
      e.preventDefault()
      v.volume = Math.min(1, v.volume + 0.1)
      break
    case 'ArrowDown':
      e.preventDefault()
      v.volume = Math.max(0, v.volume - 0.1)
      break
    case 'm':
    case 'M':
      toggleMute()
      break
    case 'f':
    case 'F':
      toggleFullscreen()
      break
  }
}

const navigateTo = (url) => {
  uni.navigateTo({ url })
}

const goBack = () => {
  uni.navigateBack({
    fail: () => {
      uni.navigateTo({ url: '/pages/learning-center/learning-center' })
    }
  })
}

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.clearStorageSync()
        uni.reLaunch({ url: '/pages/login/login' })
      }
    }
  })
}

// 全局鼠标释放：确保拖拽（进度条/音量条）时鼠标移出控件也能正常结束
const handleGlobalMouseUp = () => {
  if (isDragging.value) {
    isDragging.value = false
    hoverPosition.value = -1
  }
  volumeDragging = false
}

// 生命周期
onMounted(() => {
  // 清除历史遗留的播放进度，保证本页始终从 0:00 开始
  clearProgress()

  // 模拟滚动显示
  setTimeout(() => {
    visibleSections.value = [true, true, true]
  }, 100)

  if (typeof window !== 'undefined') {
    // 简介卡片最高不超过播放器高度（随窗口尺寸/字体加载联动）
    syncOutlineHeight()
    setTimeout(syncOutlineHeight, 300)
    window.addEventListener('resize', syncOutlineHeight)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(syncOutlineHeight).catch(() => {})
    }
    window.addEventListener('mouseup', handleGlobalMouseUp)
    window.addEventListener('keydown', onKeydown)
    document.addEventListener('fullscreenchange', onFullscreenChange)
    document.addEventListener('webkitfullscreenchange', onFullscreenChange)
    window.addEventListener('beforeunload', clearProgress)
  }
})

onBeforeUnmount(() => {
  clearProgress()
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', syncOutlineHeight)
    window.removeEventListener('mouseup', handleGlobalMouseUp)
    window.removeEventListener('keydown', onKeydown)
    document.removeEventListener('fullscreenchange', onFullscreenChange)
    document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
    window.removeEventListener('beforeunload', clearProgress)
  }
})

// 页面重新显示时：重置视频到 0:00（覆盖返回栈中同实例的场景），并再次清除进度
onShow(() => {
  const v = getVideo()
  if (v) {
    v.pause()
    if (v.currentTime > 0) {
      v.currentTime = 0
      currentTime.value = 0
      progressPct.value = 0
    }
  }
  clearProgress()
})

// 页面隐藏 / 卸载时彻底清除进度
onHide(() => {
  clearProgress()
})

onUnload(() => {
  clearProgress()
})

onLoad(async (options) => {
  // 登录鉴权：未登录跳转登录页
  if (!requireLogin()) return
  try {
    const info = uni.getStorageSync('userInfo')
    if (info && info.name) {
      userName.value = info.name
    }
  } catch (e) {}
  if (options && options.id) {
    // 两个请求互相独立，并行加载减少等待时间
    await Promise.all([
      loadResource(options.id),
      loadRecommended(options.id)
    ])
  }
})

async function loadResource(id) {
  // id 未变 + 已经有资源：直接跳过网络请求
  if (id === lastLoadedId && currentResource.value) {
    return
  }

  const now = Date.now()
  let doc = null

  // 1) 内存中命中
  const cachedDoc = docCache.get(id)
  if (cachedDoc && cachedDoc.expireAt > now) {
    doc = cachedDoc.doc
  }

  // 2) 内存未命中：从共享列表缓存里找（详情字段通常已完整），省一次 get 请求
  if (!doc) {
    try {
      const listCached = uni.getStorageSync(RESOURCES_CACHE_KEY)
      if (listCached && listCached.expireAt && listCached.expireAt > now && listCached.data) {
        const hit = (listCached.data.list || []).find(d => d._id === id)
        if (hit && hit.fileUrl) doc = hit
      }
    } catch (e) {}
  }

  // 3) 仍然没有：发起 get 请求
  if (!doc) {
    try {
      const resourcesObj = uniCloud.importObject('resources', { customUI: true })
      const r = (await resourcesObj.get({ id })) || {}
      if (r.errCode !== 0) {
        uni.showToast({ title: r.errMsg || '资源加载失败', icon: 'none' })
        return
      }
      doc = r.doc
      // 写入详情缓存
      docCache.set(id, { expireAt: now + DOC_CACHE_TTL, doc })
    } catch (e) {
      uni.showToast({ title: (e && e.errMsg) || '资源加载失败', icon: 'none' })
      return
    }
  }

  currentResource.value = doc
  currentTitle.value = doc.title || '未命名视频'
  currentCategory.value = doc.cat || '未分类'
  currentDuration.value = doc.meta || '--:--'
  videoError.value = ''
  const embedUrl = buildBilibiliEmbedUrl(doc.fileUrl)
  bilibiliEmbedUrl.value = embedUrl
  if (embedUrl) {
    videoSrc.value = ''
  } else {
    const resolved = resolveResourceUrl(doc.fileUrl)
    videoSrc.value = resolved
    if (!resolved) {
      videoError.value = '该资源暂未配置文件地址'
    }
  }
  progressKey = `vd_progress_${id}`
  lastLoadedId = id
  // 使用 AI 根据课程信息生成简介与讲师介绍（带本地缓存，避免重复调用）
  generateAiVideoIntro(id, doc)
}

// 调用 AI 生成课程简介；同视频缓存到本地，命中则直接使用
// 缓存 key 带版本号：AI 简介格式升级时 +1，旧缓存自动作废重新生成
const AI_INTRO_CACHE_VERSION = 3
async function generateAiVideoIntro(id, doc) {
  const cacheKey = `vd_ai_intro_v${AI_INTRO_CACHE_VERSION}_${id}`
  try {
    const cached = uni.getStorageSync(cacheKey)
    if (cached && cached.intro) {
      aiIntro.value = cached.intro
      aiIntroHtml.value = markdownToHtml(cached.intro)
      return
    }
  } catch (e) {}

  aiGenerating.value = true
  try {
    const aiChat = uniCloud.importObject('aiChat', { customUI: true })
    const r = await aiChat.generateVideoIntro({
      title: doc.title,
      category: doc.cat,
      description: doc.description || '',
      meta: doc.meta || ''
    })
    if (r.errCode === 0) {
      aiIntro.value = r.intro
      aiIntroHtml.value = markdownToHtml(r.intro)
      try {
        uni.setStorageSync(cacheKey, { intro: r.intro })
      } catch (e) {}
    }
  } catch (e) {
    console.error('[video-detail] AI intro generate error:', e)
  } finally {
    aiGenerating.value = false
  }
}

function recThumbStyle(video) {
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

// Fisher-Yates 洗牌
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/* ============================================================
   Cache helpers (shared with learning-center page)
   ============================================================ */
const RESOURCES_CACHE_KEY = 'lc_resources_all_cache'
const RESOURCES_CACHE_TTL = 5 * 60 * 1000

// 模块级：推荐用全部视频缓存，一次生命周期内只请求一次
let allVideosCache = null
// 模块级：单个资源详情缓存（map<id, {expireAt, doc}>）
const docCache = new Map()
const DOC_CACHE_TTL = 10 * 60 * 1000
// 上一次加载的 id，用于同 id 快速短路
let lastLoadedId = null

async function loadVideoListAll() {
  // 已在内存中，直接复用
  if (allVideosCache) return allVideosCache

  const now = Date.now()
  // 尝试从本地存储共享学习中心的缓存
  try {
    const cached = uni.getStorageSync(RESOURCES_CACHE_KEY)
    if (cached && cached.expireAt && cached.expireAt > now && cached.data && cached.data.errCode === 0) {
      const videoList = (cached.data.list || []).filter(d => d.type === 'video')
      if (videoList.length) {
        allVideosCache = videoList
        return allVideosCache
      }
    }
  } catch (e) {}

  // 回退：自己拉取，并写入共享缓存
  try {
    const resourcesObj = uniCloud.importObject('resources', { customUI: true })
    const r = (await resourcesObj.listPublic({ type: 'all' })) || {}
    if (r.errCode === 0) {
      try {
        uni.setStorageSync(RESOURCES_CACHE_KEY, {
          expireAt: Date.now() + RESOURCES_CACHE_TTL,
          data: r
        })
      } catch (e) {}
      allVideosCache = (r.list || []).filter(d => d.type === 'video')
      return allVideosCache
    }
  } catch (e) {
    console.error('[video-detail] video list load error:', e)
  }
  return []
}

async function loadRecommended(currentId) {
  try {
    const list = await loadVideoListAll()
    allVideosCache = list.filter(d => d._id !== currentId)
    pickRecommended()
  } catch (e) {
    console.error('[video-detail] recommended load error:', e)
  }
}

function pickRecommended() {
  const gradients = [
    'linear-gradient(135deg, #1E40AF, #3B82F6)',
    'linear-gradient(135deg, #0F766E, #14B8A6)',
    'linear-gradient(135deg, #7C3AED, #A78BFA)',
    'linear-gradient(135deg, #B45309, #F59E0B)',
    'linear-gradient(135deg, #DB2777, #F472B6)',
    'linear-gradient(135deg, #2563EB, #0EA5E9)'
  ]
  recommendedVideos.value = shuffle(allVideosCache)
    .slice(0, 4)
    .map((doc, idx) => ({
      id: doc._id,
      title: doc.title,
      category: doc.cat || '未分类',
      duration: doc.meta || '--:--',
      date: doc.date || '',
      cover: doc.cover || '',
      gradient: gradients[idx % gradients.length]
    }))
}

function refreshRecommended() {
  pickRecommended()
}
</script>

<style scoped>
/* ============================================
   视频学习详情 - 样式
   ============================================ */

/* ============================================
   Brand CSS Variables
   ============================================ */
.app-shell {
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

  /* === Base Shell Layout === */
  display: flex;
  min-height: 100vh;
  background: var(--rule-background);
  color: var(--rule-foreground);
  font-family: "Inter", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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

.app-main {
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 0;
}

.app-topbar {
  height: 64px;
  border-bottom: 1px solid var(--rule-border);
  background: var(--rule-card);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 30;
}

.app-topbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}

.app-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 30px;
  padding: 0 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--rule-muted-foreground);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  flex-shrink: 0;
}

.app-back-btn:hover {
  background: var(--rule-primary-tint-3);
  color: var(--rule-primary);
}

.back-arrow-icon {
  width: 14px;
  height: 14px;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M19 12H5'/><path d='m12 5-7 7 7 7'/></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M19 12H5'/><path d='m12 5-7 7 7 7'/></svg>") center/contain no-repeat;
}

.app-topbar-title {
  font-size: 18px;
  font-weight: 600;
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

/* === Header bar === */
.vd-header-bar {
  margin-bottom: 24px;
}

.vd-video-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--rule-foreground);
  letter-spacing: -0.02em;
  margin: 0 0 12px;
  line-height: 1.3;
}

.vd-video-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.vd-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: var(--rule-muted-foreground);
}

.vd-meta-item svg {
  width: 15px;
  height: 15px;
}

.vd-meta-tag {
  font-size: 12px;
  font-weight: 500;
  background: var(--rule-muted);
  color: var(--rule-ink-2);
  padding: 3px 10px;
  border-radius: 6px;
}

/* === Main grid: player + outline === */
.vd-main-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
  /* 禁止网格拉伸：简介卡片内容增高时，播放器保持自身高度不被撑高 */
  align-items: start;
}

/* === Player card === */
.vd-player-card {
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: 12px;
  overflow: hidden;
}

.vd-player-wrap {
  position: relative;
  aspect-ratio: 16/9;
  background: #0F172A;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.vd-video-element {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #0F172A;
  display: block;
}

/* 真实原生 video 是 uni-video 包装元素的内部后代，需 :deep 穿透才能命中 */
.vd-video-element :deep(video) {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #0F172A;
  display: block;
}

.vd-embed-player {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
  background: #0F172A;
}

/* 缓冲加载动画 */
.vd-buffering {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.45);
}

.vd-spinner {
  width: 46px;
  height: 46px;
  border: 4px solid rgba(255, 255, 255, 0.25);
  border-top-color: #fff;
  border-radius: 50%;
  animation: vdSpin 0.8s linear infinite;
}

@keyframes vdSpin {
  to { transform: rotate(360deg); }
}

/* 加载失败提示 */
.vd-error {
  position: absolute;
  inset: 0;
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(15, 23, 42, 0.88);
  color: #fff;
  text-align: center;
  padding: 20px;
}

.vd-error-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.vd-error-sub {
  font-size: 13px;
  color: #CBD5E1;
  margin: 0 0 8px;
}

.vd-retry-btn {
  padding: 8px 22px;
  border: none;
  border-radius: 9999px;
  background: var(--rule-primary);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.vd-retry-btn:hover {
  background: var(--rule-primary-hover);
}

/* 隐藏 uni-video 自带的中央默认播放按钮：H5 端 controls=false 时 uni-video 会额外渲染
   一个中央播放按钮，此处隐藏 */
.vd-player-wrap :deep(.uni-video-default) {
  display: none !important;
}

.vd-player-controls {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 18px;
  border-top: 1px solid var(--rule-border);
  flex-wrap: wrap;
}

/* 全屏模式下的播放器卡片 */
.vd-player-card.is-fullscreen {
  border-radius: 0;
  border: none;
  background: #000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.vd-player-card.is-fullscreen .vd-player-wrap {
  flex: 1;
  aspect-ratio: auto;
  height: auto;
}

.vd-player-card.is-fullscreen .vd-player-controls {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.92);
  flex-shrink: 0;
}

.vd-player-card.is-fullscreen .vd-progress-time {
  color: #CBD5E1;
}

.vd-ctrl-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--rule-muted);
  border: none;
  color: var(--rule-ink-2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s ease, color 0.15s ease;
}

.vd-ctrl-btn:hover {
  background: var(--rule-primary);
  color: var(--rule-primary-foreground);
}

.vd-ctrl-btn svg {
  width: 24px;
  height: 24px;
  margin-left: 2px;
}

.vd-progress-bar {
  flex: 1;
  height: 8px;
  background: var(--rule-muted);
  border-radius: 4px;
  position: relative;
  cursor: pointer;
}

/* 已缓冲进度 */
.vd-progress-buffer {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: rgba(37, 99, 235, 0.25);
  border-radius: 3px;
  pointer-events: none;
}

.vd-progress-fill {
  height: 100%;
  background: var(--rule-primary);
  border-radius: 3px;
  transition: width 0.2s ease;
  position: relative;
  pointer-events: none;
}

.vd-progress-fill.is-dragging {
  transition: none;
}

.vd-progress-bar.is-dragging {
  height: 8px;
}

.vd-progress-time {
  font-size: 14px;
  color: var(--rule-muted-foreground);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

/* === 音量控制 === */
.vd-volume-ctrl {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.vd-volume-track {
  width: 0;
  opacity: 0;
  height: 8px;
  border-radius: 4px;
  background: var(--rule-muted);
  position: relative;
  cursor: pointer;
  overflow: hidden;
  transition: width 0.2s ease, opacity 0.2s ease;
}

.vd-volume-ctrl:hover .vd-volume-track,
.vd-volume-ctrl:focus-within .vd-volume-track {
  width: 90px;
  opacity: 1;
}

.vd-volume-fill {
  height: 100%;
  background: var(--rule-primary);
  border-radius: 3px;
}

/* === 倍速控制 === */
.vd-speed-ctrl {
  position: relative;
  flex-shrink: 0;
}

.vd-speed-btn {
  height: 40px;
  min-width: 56px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1px solid var(--rule-border);
  background: var(--rule-card);
  color: var(--rule-ink-2);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-variant-numeric: tabular-nums;
  transition: border-color 0.15s ease, color 0.15s ease;
}

.vd-speed-btn:hover {
  border-color: var(--rule-primary);
  color: var(--rule-primary);
}

.vd-speed-menu {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  min-width: 76px;
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: 8px;
  box-shadow: var(--rule-shadow-2);
  padding: 4px;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.vd-speed-menu button,
.vd-speed-menu uni-button {
  display: block;
  width: 100%;
  margin: 0;
  padding: 7px 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  line-height: inherit;
  border-radius: 6px;
  color: var(--rule-ink-2);
  font-variant-numeric: tabular-nums;
  transition: background 0.15s ease, color 0.15s ease;
  text-align: center;
}

.vd-speed-menu button:hover,
.vd-speed-menu uni-button:hover {
  background: var(--rule-muted);
}

.vd-speed-menu button.active,
.vd-speed-menu uni-button.active {
  color: var(--rule-primary);
  background: var(--rule-primary-tint-3);
  font-weight: 600;
}

/* 进度条预览指示器 */
.vd-progress-preview {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.vd-preview-tooltip {
  position: absolute;
  bottom: calc(100% + 12px);
  background: rgba(15, 23, 42, 0.9);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 4px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.2);
  animation: fadeInDown 0.15s ease;
}

.vd-preview-line {
  width: 2px;
  height: 14px;
  background: var(--rule-primary);
  border-radius: 1px;
  box-shadow: 0 0 4px rgba(37, 99, 235, 0.4);
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* === Outline card === */
.vd-outline-card {
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  /* 与播放器卡片等高（网格拉伸），内容超高时内部滚动 */
  min-height: 0;
  height: 100%;
}

.vd-outline-header {
  padding: 18px 20px;
  border-bottom: 1px solid var(--rule-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.vd-outline-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--rule-foreground);
}

.vd-outline-progress {
  font-size: 12px;
  color: var(--rule-muted-foreground);
}

.vd-empty {
  padding: 28px 16px;
  border: 1px dashed var(--rule-border);
  border-radius: 12px;
  color: var(--rule-muted-foreground);
  font-size: 13px;
  text-align: center;
}

.vd-outline-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

/* 课程简介内容（原课程大纲位置） */
.vd-intro-body {
  padding: 12px 20px 20px;
  overflow-y: auto;
}

.vd-intro-text {
  font-size: 14px;
  line-height: 1.75;
  color: var(--rule-ink-2);
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

/* AI 生成的富文本简介 */
.vd-intro-html {
  display: block;
  font-size: 14px;
  line-height: 1.7;
  color: var(--rule-ink-2);
  word-break: break-word;
}

/* AI 生成标记 */
.vd-ai-badge {
  font-size: 11px;
  font-weight: 500;
  background: var(--state-info-tint);
  color: var(--state-info);
  padding: 2px 8px;
  border-radius: 9999px;
  flex-shrink: 0;
}

/* AI 生成加载提示 */
.vd-ai-loading {
  color: var(--rule-muted-foreground) !important;
  animation: vdAiPulse 1.4s ease-in-out infinite;
}

@keyframes vdAiPulse {
  0%, 100% { opacity: 0.45; }
  50% { opacity: 1; }
}

/* === Section header (aligned with legal-db) === */
.doc-section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.doc-section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--rule-foreground);
}

.doc-section-meta {
  font-size: 13px;
  color: var(--rule-muted-foreground);
}

/* === Recommended cards (redesigned, matching video-list) === */
.rec-card {
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.rec-card:hover {
  transform: translateY(-6px);
  border-color: rgba(37,99,235,.3);
  box-shadow: 0 20px 40px -18px rgba(37,99,235,.35);
}

.rec-thumb {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.rec-thumb-bg {
  position: absolute;
  inset: 0;
  transition: transform 0.3s ease;
}

.rec-card:hover .rec-thumb-bg {
  transform: scale(1.05);
}

.rec-play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15,23,42,0);
  transition: background 0.25s ease;
}

.rec-play-btn {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: rgba(255,255,255,.92);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 24px -8px rgba(15,23,42,.35);
  opacity: 0;
  transform: scale(.85);
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.rec-card:hover .rec-play-overlay {
  background: rgba(15,23,42,.28);
}

.rec-card:hover .rec-play-btn {
  opacity: 1;
  transform: scale(1);
}

.rec-play-triangle {
  width: 0;
  height: 0;
  border-top: 9px solid transparent;
  border-bottom: 9px solid transparent;
  border-left: 14px solid var(--rule-primary);
  margin-left: 3px;
}

.rec-duration {
  position: absolute;
  right: 10px;
  bottom: 10px;
  padding: 3px 8px;
  border-radius: 9999px;
  background: rgba(15,23,42,.78);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}

.rec-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rec-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--rule-foreground);
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.rec-meta {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.rec-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--rule-muted-foreground);
}

.rec-user-icon,
.rec-eye-icon {
  width: 14px;
  height: 14px;
  background: currentColor;
}

.rec-user-icon {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>") center/contain no-repeat;
}

.rec-eye-icon {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z'/><circle cx='12' cy='12' r='3'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z'/><circle cx='12' cy='12' r='3'/></svg>") center/contain no-repeat;
}

/* === Recommended grid (4 per row default) === */
.vd-rec-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  box-sizing: border-box;
}

.rec-card {
  box-sizing: border-box;
  min-width: 0;
}

/* === Scroll reveal === */
.vd-reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s cubic-bezier(.2,.8,.2,1);
}

.vd-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* === Responsive === */
@media (max-width: 1024px) {
  .vd-main-grid {
    grid-template-columns: 1fr;
  }
  
  .vd-rec-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .app-sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .app-sidebar.open {
    transform: translateX(0);
  }
  
  .app-main {
    margin-left: 0;
  }
  
  .app-content {
    padding: 20px;
  }

  /* 移动端播放器控制条：进度条独占一行，其余控件紧凑排列 */
  .vd-player-controls {
    gap: 10px;
    padding: 12px 14px;
  }

  .vd-progress-bar {
    order: -1;
    flex-basis: 100%;
    height: 8px;
  }

  .vd-volume-ctrl:hover .vd-volume-track,
  .vd-volume-ctrl:focus-within .vd-volume-track {
    width: 56px;
  }
}

@media (max-width: 640px) {
  .vd-rec-grid {
    grid-template-columns: 1fr;
  }
  
  .vd-video-title {
    font-size: 22px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .video-card:hover {
    transform: none;
  }
  
  .video-card:hover .video-thumb-gradient {
    transform: none;
  }
  
  .vd-reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
  
  .vd-progress-fill {
    transition: none;
  }
}
</style>
