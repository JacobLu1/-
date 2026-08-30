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
          <div class="app-topbar-titles">
            <h1 class="app-topbar-title">每周法律英语听力实训</h1>
            <span class="app-topbar-breadcrumb">学习中心 / 听力实训</span>
          </div>
        </div>
        <span class="app-topbar-meta">{{ todayDateText }}</span>
      </header>
      <main class="app-content">

        <!-- ===== Shared SVG gradient defs ===== -->
        <svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="lt-grad-high" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="var(--state-success)"/>
              <stop offset="100%" stop-color="var(--state-success)" stop-opacity="0.6"/>
            </linearGradient>
            <linearGradient id="lt-grad-mid" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="var(--rule-primary)"/>
              <stop offset="100%" stop-color="var(--rule-primary-active)"/>
            </linearGradient>
            <linearGradient id="lt-grad-low" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="var(--state-warning)"/>
              <stop offset="100%" stop-color="var(--state-warning)" stop-opacity="0.6"/>
            </linearGradient>
          </defs>
        </svg>

        <!-- ===== Hero Title Block ===== -->
        <section class="lt-hero" aria-label="听力实训概览">
          <div class="lt-hero-main">
            <span class="lt-hero-tag">
              <span class="lt-hero-tag-icon"></span>
              听力实训
            </span>
            <h2 class="lt-hero-title">每周法律英语听力实训</h2>
            <p class="lt-hero-subtitle">坚持每日听力训练，巩固涉外法律英语能力</p>
            <div class="lt-hero-stats">
              <div class="lt-stat">
                <span class="lt-stat-num">{{ weeklyTasks.length }}</span>
                <span class="lt-stat-label">本周任务</span>
              </div>
              <span class="lt-stat-sep"></span>
              <div class="lt-stat">
                <span class="lt-stat-num">{{ completedCount }}/{{ weeklyTasks.length }}</span>
                <span class="lt-stat-label">已完成</span>
              </div>
              <span class="lt-stat-sep"></span>
              <div class="lt-stat">
                <span class="lt-stat-num">{{ averageAccuracy }}%</span>
                <span class="lt-stat-label">平均正确率</span>
              </div>
            </div>
          </div>
          <div class="lt-hero-art">
            <div class="lt-earphones">
              <div class="lt-earphone lt-earphone-band"></div>
              <div class="lt-earphone lt-earphone-left"></div>
              <div class="lt-earphone lt-earphone-right"></div>
              <div class="lt-eq">
                <span class="lt-eq-bar" :class="{'is-playing': isPlaying}"></span>
                <span class="lt-eq-bar" :class="{'is-playing': isPlaying}"></span>
                <span class="lt-eq-bar" :class="{'is-playing': isPlaying}"></span>
                <span class="lt-eq-bar" :class="{'is-playing': isPlaying}"></span>
                <span class="lt-eq-bar" :class="{'is-playing': isPlaying}"></span>
              </div>
            </div>
            <span class="lt-art-dot lt-art-dot-1"></span>
            <span class="lt-art-dot lt-art-dot-2"></span>
          </div>
        </section>

        <!-- ===== Section 1: 本周听力任务 ===== -->
        <section class="lc-section" :class="{'is-visible': visibleSections[0]}" aria-label="本周听力任务">
          <div class="lc-section-header">
            <div class="lc-section-title-wrap">
              <span class="lc-section-bar"></span>
              <div>
                <h2 class="lc-section-title">本周听力任务</h2>
                <p class="lc-section-subtitle">按日安排听力素材，循序渐进提升法律英语听力水平</p>
              </div>
            </div>
            <button v-if="lessons.length" class="lt-all-tasks-btn" type="button" @click="showAllLessons = !showAllLessons">
              <span>{{ showAllLessons ? '收起全部任务' : '全部听力任务' }}</span>
              <span class="lt-all-tasks-btn-count">{{ lessons.length }}</span>
            </button>
          </div>
          <div class="lt-task-grid">
            <!-- Task Cards -->
            <div v-for="(task, index) in weeklyTasks" :key="index"
                 class="lt-task-card"
                 :class="{'is-done': task.status === 'done', 'is-active': currentIndex === index}"
                 @click="selectLesson(index, true)">
              <div class="lt-task-top">
                <span class="lt-task-badge">{{ task.dayNum }}</span>
                <span class="lt-task-day">{{ task.day }}</span>
                <span class="lt-diff" :class="`lt-diff-${task.difficulty}`">{{ task.difficultyText }}</span>
              </div>
              <h3 class="lt-task-title">{{ task.title }}</h3>
              <div class="lt-task-progress">
                <div class="lt-progress-track">
                  <div class="lt-progress-fill" :style="{width: task.progress + '%'}"></div>
                </div>
                <span class="lt-progress-pct">{{ task.progress }}%</span>
              </div>
              <span class="lt-status" :class="`lt-status-${task.status}`">{{ task.statusText }}</span>
            </div>
          </div>
          <div v-if="showAllLessons && lessons.length" class="lt-all-tasks">
            <button v-for="(lesson, index) in lessons" :key="lesson.id" type="button"
                    class="lt-all-task"
                    :class="{'is-active': currentLesson && currentLesson.id === lesson.id}"
                    @click="selectLessonById(lesson.id, true)">
              <span class="lt-all-task-index">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="lt-all-task-title">{{ lesson.title }}</span>
              <span class="lt-all-task-meta">{{ lesson.difficultyText }} · {{ lesson.statusText }}</span>
              <span class="lt-all-task-arrow"></span>
            </button>
          </div>
          <div v-if="!weeklyTasks.length" class="lt-empty">暂无听力任务</div>
        </section>

        <!-- ===== Section 2: 听力练习操作台 ===== -->
        <section ref="studioSection" class="lc-section" :class="{'is-visible': visibleSections[1]}" aria-label="听力练习操作台">
          <div class="lc-section-header">
            <div class="lc-section-title-wrap">
              <span class="lc-section-bar"></span>
              <div>
                <h2 class="lc-section-title">听力练习操作台</h2>
                <p class="lc-section-subtitle">{{ playerTitle }}</p>
              </div>
            </div>
          </div>
          <div class="lt-studio">
            <!-- Audio Player Area -->
            <div class="lt-studio-player">
              <div class="lt-player-top">
                <button class="lt-play-btn" type="button" aria-label="播放/暂停" @click="togglePlay">
                  <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="6 3 20 12 6 21 6 3"></polygon>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                    <rect x="14" y="4" width="4" height="16" rx="1"></rect>
                  </svg>
                </button>
                <div class="lt-player-info">
                  <div class="lt-player-head">
                    <div class="lt-player-title">{{ playerTitle }}</div>
                    <div class="lt-eq lt-eq-sm" :class="{'is-on': isPlaying}">
                      <span class="lt-eq-bar"></span>
                      <span class="lt-eq-bar"></span>
                      <span class="lt-eq-bar"></span>
                      <span class="lt-eq-bar"></span>
                    </div>
                  </div>
                  <div class="lt-player-bar">
                    <div class="lt-progress-bar">
                      <div class="lt-progress-fill lt-player-fill" :style="{width: playerProgress + '%'}"></div>
                    </div>
                    <span class="lt-player-time">{{ playerCurrentTime }} / {{ playerTotalTime }}</span>
                  </div>
                </div>
                <div class="lt-player-controls">
                  <button class="lt-ctrl-btn" type="button" aria-label="倍速">{{ playbackRate }}x</button>
                  <button class="lt-ctrl-btn" type="button" aria-label="音量">
                    <i data-lucide="volume-2"></i>
                  </button>
                </div>
              </div>
            </div>
            <!-- Panels: Transcript + Quiz -->
            <div class="lt-studio-panels">
              <!-- Panel A: 法律原文文本 -->
              <div class="lt-panel lt-panel-transcript">
                <div class="lt-panel-header">
                  <h3 class="lt-panel-title">法律原文文本</h3>
                  <div class="lt-lang-toggle">
                    <span class="lt-lang-tag" :class="{'is-active': currentLang === 'en'}" @click="currentLang = 'en'">英文</span>
                    <span class="lt-lang-tag" :class="{'is-active': currentLang === 'zh'}" @click="currentLang = 'zh'">中文</span>
                  </div>
                </div>
                <p v-if="currentTranscript" class="lt-transcript">{{ currentTranscript }}</p>
                <p v-else-if="isTranscriptLoading" class="lt-empty">原文加载中...</p>
                <p v-else class="lt-empty">{{ currentLang === 'zh' ? '暂无中文文本' : '暂无听力原文' }}</p>
              </div>
              <!-- Panel B: 习题作答区域 -->
              <div class="lt-panel lt-panel-quiz">
                <div class="lt-panel-header">
                  <h3 class="lt-panel-title">习题作答</h3>
                  <span class="lt-quiz-count">{{ quizQuestions.length }}题</span>
                </div>
                <div class="lt-quiz-list">
                  <div v-if="!quizQuestions.length" class="lt-empty">暂无习题</div>
                  <div v-for="(question, qIndex) in quizQuestions" :key="qIndex" class="lt-quiz-item">
                    <div class="lt-quiz-q">{{ question.question }}</div>
                    <div class="lt-quiz-options">
                      <div v-for="(option, oIndex) in question.options" 
                           :key="oIndex" 
                           class="lt-quiz-option" 
                           :class="{'is-selected': selectedAnswers[qIndex] === oIndex}"
                           @click="selectAnswer(qIndex, oIndex)">
                        <span class="lt-quiz-radio"></span>
                        <span>{{ option }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button class="lt-submit-btn" type="button" @click="submitAnswers">
                  提交作答
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- ===== Section 3: 历史练习记录 ===== -->
        <section class="lc-section" :class="{'is-visible': visibleSections[2]}" aria-label="历史练习记录">
          <div class="lc-section-header">
            <div class="lc-section-title-wrap">
              <span class="lc-section-bar"></span>
              <div>
                <h2 class="lc-section-title">历史练习记录</h2>
                <p class="lc-section-subtitle">查看过往听力练习完成情况</p>
              </div>
            </div>
          </div>
          <div class="lt-history-grid">
            <div v-if="!historyRecords.length" class="lt-empty">暂无历史记录</div>
            <div v-for="(record, index) in historyRecords" 
                 :key="index" 
                 class="lt-history-card"
                 :class="`lt-card-${record.level}`">
              <div class="lt-history-ring-wrap">
                <svg class="lt-history-ring" viewBox="0 0 100 100">
                  <circle class="lt-ring-track" cx="50" cy="50" r="42"></circle>
                  <circle class="lt-ring-fill" cx="50" cy="50" r="42" 
                          stroke-dasharray="263.89" 
                          :stroke-dashoffset="record.strokeDashoffset"></circle>
                </svg>
                <span class="lt-history-ring-pct">{{ record.accuracy }}%</span>
              </div>
              <span class="lt-history-acc-label">正确率</span>
              <h3 class="lt-history-title">{{ record.title }}</h3>
              <div class="lt-history-meta">
                <div class="lt-history-date">
                  <i data-lucide="calendar"></i> {{ record.date }}
                </div>
                <div class="lt-history-time">
                  <i data-lucide="clock"></i> 用时 {{ record.duration }}
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { requireLogin, getDisplayName, getLevelText } from '@/utils/auth.js'

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

// 响应式数据
const isPlaying = ref(false)
const playerProgress = ref(0)
const playerCurrentTime = ref('00:00')
const playerTotalTime = ref('00:00')
const playerTitle = ref('暂无练习内容')
const playbackRate = ref(1.0)
const currentLang = ref('en')
const selectedAnswers = ref({})
const visibleSections = ref([false, false, false])

// 听力资源
const lessons = ref([])
const currentLesson = ref(null)
const currentIndex = ref(-1)
const weeklyTasks = ref([])
const studioSection = ref(null)
const showAllLessons = ref(false)
const isTranscriptLoading = ref(false)
let audioInstance = null
let activeTranscriptId = ''

// 文本数据
const transcripts = ref({
  en: '',
  zh: ''
})

const currentTranscript = computed(() => transcripts.value[currentLang.value])

// 习题数据
const quizQuestions = ref([])

// 历史记录数据
const historyRecords = ref([])

// 统计计算
const completedCount = computed(() => weeklyTasks.value.filter(t => t.status === 'done').length)
const averageAccuracy = computed(() => {
  if (!historyRecords.value.length) return 0
  return Math.round(historyRecords.value.reduce((sum, r) => sum + r.accuracy, 0) / historyRecords.value.length)
})

// 方法
function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function mapDifficulty(meta) {
  const m = (meta || '').toLowerCase()
  if (m.includes('初') || m.includes('beginner')) return 'beginner'
  if (m.includes('高') || m.includes('advanced') || m.includes('hard')) return 'advanced'
  return 'intermediate'
}

function mapDifficultyText(meta) {
  const key = mapDifficulty(meta)
  return key === 'beginner' ? '初级' : key === 'advanced' ? '高级' : '中级'
}

const CJK_CHAR = /[\u3400-\u9fff]/
const CHINESE_PUNCT = /[\u3000-\u303f\uff00-\uffef]/
const LATIN_CHAR = /[A-Za-z]/
const TOKEN_PATTERN = /[\u3400-\u9fff\u3000-\u303f\uff00-\uffef]+|[A-Za-z][A-Za-z'’\-]*|[^\u3400-\u9fff\u3000-\u303f\uff00-\uffefA-Za-z]+/g
const ENGLISH_NUMBER_PREFIX = /^\d{1,3}\.\s*$/
const CHINESE_NUMBER_PREFIX = /^(?:\d{1,3}[、．.·]\s*|[（(]\d{1,3}[）)]\s*)$/
const ENGLISH_ITEM_PATTERN = /\d{1,3}\.\s+[A-Za-z]/g
const CHINESE_ITEM_START = /(?=[（(]\d{1,3}[）)])/
const CHINESE_HEADING_PATTERN = /(?:第[零一二三四五六七八九十百千万0-9]+[章节部分编条款]|[一二三四五六七八九十]{1,3}[、．.·]|[（(][一二三四五六七八九十]{1,3}[）)]|\d{1,3}[、．.·])/g
const BIG_HEADING = /^第[零一二三四五六七八九十百千万0-9]+(?:章|部分|编|篇)/
const SOURCE_TITLE = /^(?:法律英语|听力|何家弘)/
const STANDALONE_HEADING_MARKER = /^(?:第[零一二三四五六七八九十百千万0-9]+[章节部分编条款]|[一二三四五六七八九十]{1,3}[、．.·]|[（(][一二三四五六七八九十]{1,3}[）)]|\d{1,3}[、．.·]|[（(]\d{1,3}[）)])$/
const HEADING_PREFIX = /^(?:第[零一二三四五六七八九十百千万0-9]+[章节部分编条款]|[一二三四五六七八九十]{1,3}[、．.·]|[（(][一二三四五六七八九十]{1,3}[）)]|\d{1,3}[、．.·]|[（(]\d{1,3}[）)]|\d{1,3}\.\s+[A-Za-z])/

function splitByEnglishItems(part) {
  const parts = []
  ENGLISH_ITEM_PATTERN.lastIndex = 0
  let cursor = 0
  let match
  while ((match = ENGLISH_ITEM_PATTERN.exec(part)) !== null) {
    if (match.index > cursor) {
      const segment = part.slice(cursor, match.index).trim()
      if (segment) parts.push(segment)
    }
    cursor = match.index
  }
  const rest = part.slice(cursor).trim()
  if (rest) parts.push(rest)
  return parts
}

function splitByChineseHeadings(part) {
  const parts = []
  CHINESE_HEADING_PATTERN.lastIndex = 0
  let cursor = 0
  let match
  while ((match = CHINESE_HEADING_PATTERN.exec(part)) !== null) {
    if (match.index > cursor) {
      const segment = part.slice(cursor, match.index).trim()
      if (segment) parts.push(segment)
    }
    cursor = match.index
  }
  const rest = part.slice(cursor).trim()
  if (rest) parts.push(rest)
  return parts
}

function splitBilingualPart(part) {
  const tokens = []
  TOKEN_PATTERN.lastIndex = 0
  let match
  while ((match = TOKEN_PATTERN.exec(part)) !== null) {
    const text = match[0]
    const lang = CJK_CHAR.test(text) || CHINESE_PUNCT.test(text) ? 'zh' : LATIN_CHAR.test(text) ? 'en' : ''
    tokens.push({ text, lang })
  }
  for (let i = 0; i < tokens.length; i += 1) {
    if (tokens[i].lang) continue
    let prevLang = ''
    let nextLang = ''
    for (let j = i - 1; j >= 0; j -= 1) {
      if (tokens[j].lang) {
        prevLang = tokens[j].lang
        break
      }
    }
    for (let j = i + 1; j < tokens.length; j += 1) {
      if (tokens[j].lang) {
        nextLang = tokens[j].lang
        break
      }
    }
    if (nextLang === 'en' && ENGLISH_NUMBER_PREFIX.test(tokens[i].text)) {
      tokens[i].lang = 'en'
      continue
    }
    if (nextLang === 'zh' && CHINESE_NUMBER_PREFIX.test(tokens[i].text)) {
      tokens[i].lang = 'zh'
      continue
    }
    tokens[i].lang = prevLang && prevLang === nextLang ? prevLang : prevLang || nextLang || 'en'
  }
  const en = []
  const zh = []
  tokens.forEach((token) => {
    if (token.lang === 'zh') zh.push(token.text)
    else en.push(token.text)
  })
  return {
    en: en.join(''),
    zh: zh.join('')
  }
}

function splitTranscriptByLang(text) {
  const en = []
  const zh = []
  let pendingMarker = ''
  String(text || '').split(/\r\n|\r|\n/).forEach((line) => {
    const value = line.trim()
    if (!value) return
    const parts = splitByEnglishItems(value)
      .flatMap((part) => part.split(CHINESE_ITEM_START))
      .flatMap(splitByChineseHeadings)
      .map((part) => part.trim())
      .filter(Boolean)
    parts.forEach((part) => {
      if (BIG_HEADING.test(part) || SOURCE_TITLE.test(part)) return
      if (pendingMarker && HEADING_PREFIX.test(part)) pendingMarker = ''
      if (STANDALONE_HEADING_MARKER.test(part)) {
        pendingMarker = part
        return
      }
      const result = splitBilingualPart(part)
      const markerGap = pendingMarker && pendingMarker.endsWith('.') ? ' ' : ''
      if (result.en) {
        en.push(pendingMarker ? pendingMarker + markerGap + result.en.trimStart() : result.en)
        pendingMarker = ''
      }
      if (result.zh) {
        zh.push(pendingMarker ? pendingMarker + markerGap + result.zh.trimStart() : result.zh)
        pendingMarker = ''
      }
    })
  })
  return {
    en: en.join('\n'),
    zh: zh.join('\n')
  }
}

const WEEK_START = new Date(2026, 0, 5)

function getWeekIndex(date = new Date()) {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const weekday = day.getDay() || 7
  day.setDate(day.getDate() - weekday + 1)
  day.setHours(0, 0, 0, 0)
  return Math.floor((day.getTime() - WEEK_START.getTime()) / (7 * 24 * 60 * 60 * 1000))
}

function buildWeeklyTasks() {
  const total = lessons.value.length
  if (!total) return []
  const weekIndex = getWeekIndex()
  const start = (((weekIndex * 7) % total) + total) % total
  const tasks = []
  for (let i = 0; i < Math.min(7, total); i += 1) {
    const lesson = lessons.value[(start + i) % total]
    tasks.push({
      ...lesson,
      dayNum: String(i + 1).padStart(2, '0'),
      day: `第${i + 1}天`
    })
  }
  return tasks
}

function scrollToStudio() {
  const el = studioSection.value && (studioSection.value.$el || studioSection.value)
  if (el && el.scrollIntoView) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function applyLesson(lesson, autoPlay = false) {
  currentLesson.value = lesson || null
  if (!currentLesson.value) return
  currentIndex.value = weeklyTasks.value.findIndex((task) => task.id === currentLesson.value.id)
  transcripts.value = {
    en: currentLesson.value.transcriptEn || '',
    zh: currentLesson.value.transcriptZh || ''
  }
  quizQuestions.value = currentLesson.value.questions.map(q => ({
    question: q.question,
    options: q.options || [],
    answer: q.answer
  }))
  selectedAnswers.value = {}
  playerTitle.value = currentLesson.value.title
  playerProgress.value = 0
  playerCurrentTime.value = '00:00'
  playerTotalTime.value = '00:00'
  isPlaying.value = false
  if (audioInstance) {
    audioInstance.pause()
    audioInstance = null
  }
  if (autoPlay) {
    nextTick(scrollToStudio)
    togglePlay()
  }
  if (!currentLesson.value.contentLoaded) {
    isTranscriptLoading.value = true
    loadLessonDetail(currentLesson.value.id)
  } else {
    isTranscriptLoading.value = false
  }
}

function selectLesson(index, autoPlay = false) {
  applyLesson(weeklyTasks.value[index] || null, autoPlay)
}

function selectLessonById(id, autoPlay = false) {
  const lesson = lessons.value.find((item) => item.id === id) || null
  applyLesson(lesson, autoPlay)
}

function updateLessonDetail(id, patch) {
  const lessonIndex = lessons.value.findIndex((item) => item.id === id)
  if (lessonIndex >= 0) {
    Object.assign(lessons.value[lessonIndex], patch)
  }
  weeklyTasks.value = weeklyTasks.value.map((task) => task.id === id ? { ...task, ...patch } : task)
  if (currentLesson.value && currentLesson.value.id === id) {
    Object.assign(currentLesson.value, patch)
    transcripts.value = {
      en: patch.transcriptEn || '',
      zh: patch.transcriptZh || ''
    }
  }
}

async function loadLessonDetail(id) {
  const lesson = lessons.value.find((item) => item.id === id)
  if (!lesson || lesson.contentLoaded) return
  activeTranscriptId = id
  isTranscriptLoading.value = true
  try {
    const resourcesObj = uniCloud.importObject('resources', { customUI: true })
    const r = (await resourcesObj.get({ id })) || {}
    if (r.errCode !== 0) {
      if (activeTranscriptId === id) {
        updateLessonDetail(id, { contentLoaded: true })
      }
      return
    }
    const doc = r.doc || {}
    const enSource = doc.content || doc.description || ''
    const zhSource = doc.description || doc.content || ''
    const enPart = splitTranscriptByLang(enSource)
    const zhPart = splitTranscriptByLang(zhSource)
    const patch = {
      transcriptEn: enPart.en || zhPart.en,
      transcriptZh: enPart.zh || zhPart.zh,
      questions: (doc.questions || []).map(q => ({
        question: q.stem || '',
        options: q.options || [],
        answer: q.answer
      })),
      contentLoaded: true
    }
    if (activeTranscriptId === id) {
      updateLessonDetail(id, patch)
    }
  } catch (e) {
    if (activeTranscriptId === id) {
      updateLessonDetail(id, { contentLoaded: true })
    }
  } finally {
    if (activeTranscriptId === id) {
      isTranscriptLoading.value = false
    }
  }
}

async function loadListeningLessons() {
  try {
    const resourcesObj = uniCloud.importObject('resources', { customUI: true })
    const r = (await resourcesObj.listPublic({ type: 'listening' })) || {}
    if (r.errCode !== 0) {
      uni.showToast({ title: r.errMsg || '听力资源加载失败', icon: 'none' })
      return
    }
    lessons.value = (r.list || []).map((doc) => ({
      id: doc._id,
      difficulty: mapDifficulty(doc.meta),
      difficultyText: mapDifficultyText(doc.meta),
      title: doc.title || '未命名听力',
      progress: 0,
      status: 'active',
      statusText: '待学习',
      audioUrl: doc.audioUrl || doc.fileUrl || '',
      transcriptEn: '',
      transcriptZh: '',
      questions: [],
      contentLoaded: false
    }))
    weeklyTasks.value = buildWeeklyTasks()
    if (lessons.value.length) selectLesson(0)
  } catch (e) {
    uni.showToast({ title: (e && e.errMsg) || '听力资源加载失败', icon: 'none' })
  }
}

const togglePlay = () => {
  if (!currentLesson.value || !currentLesson.value.audioUrl) {
    uni.showToast({ title: '当前听力未配置音频地址', icon: 'none' })
    return
  }
  if (!audioInstance && typeof Audio !== 'undefined') {
    audioInstance = new Audio(currentLesson.value.audioUrl)
    audioInstance.playbackRate = playbackRate.value
    audioInstance.addEventListener('loadedmetadata', () => {
      playerTotalTime.value = formatTime(audioInstance.duration)
    })
    audioInstance.addEventListener('timeupdate', () => {
      playerCurrentTime.value = formatTime(audioInstance.currentTime)
      playerTotalTime.value = formatTime(audioInstance.duration)
      if (audioInstance.duration) {
        playerProgress.value = Math.round((audioInstance.currentTime / audioInstance.duration) * 100)
      }
    })
    audioInstance.addEventListener('ended', () => {
      isPlaying.value = false
    })
  }
  if (!audioInstance) {
    uni.showToast({ title: '当前环境不支持音频播放', icon: 'none' })
    return
  }
  if (isPlaying.value) {
    audioInstance.pause()
    isPlaying.value = false
  } else {
    audioInstance.play()
      .then(() => {
        isPlaying.value = true
      })
      .catch(() => {
        uni.showToast({ title: '音频播放失败，请检查地址', icon: 'none' })
      })
  }
}

const selectAnswer = (qIndex, oIndex) => {
  selectedAnswers.value[qIndex] = oIndex
}

const submitAnswers = () => {
  if (!quizQuestions.value.length) {
    uni.showToast({ title: '暂无习题', icon: 'none' })
    return
  }
  let correct = 0
  quizQuestions.value.forEach((question, qIndex) => {
    const selectedIndex = selectedAnswers.value[qIndex]
    if (selectedIndex === undefined) return
    const selected = String.fromCharCode(65 + selectedIndex)
    const answer = String(question.answer || '').trim().toUpperCase()
    if (selected === answer) correct += 1
  })
  const accuracy = Math.round((correct / quizQuestions.value.length) * 100)
  uni.showToast({ title: `答对 ${correct}/${quizQuestions.value.length} 题`, icon: 'none' })
  historyRecords.value.unshift({
    level: accuracy >= 80 ? 'high' : accuracy >= 60 ? 'mid' : 'low',
    strokeDashoffset: String(263.89 - (accuracy / 100) * 263.89),
    accuracy,
    title: currentLesson.value ? currentLesson.value.title : '听力练习',
    date: todayDateText.value,
    duration: '--'
  })
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

// 滚动动画
onMounted(() => {
  // 不再需要 Lucide 图标初始化，现在使用 CSS mask-based 图标

  // 模拟 IntersectionObserver 的滚动显示
  setTimeout(() => {
    visibleSections.value = [true, true, true]
  }, 100)
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
  loadListeningLessons()
})
</script>

<style scoped>
/* ============================================
   每周法律英语听力实训 - 样式
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

/* === Transition curve (共享给该页面其他动画使用) === */
:root {
  --lt-ease: cubic-bezier(.2,.8,.2,1);
}

.app-topbar-titles {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.app-topbar-breadcrumb {
  font-size: 12px;
  color: var(--rule-muted-foreground);
}

.lt-empty {
  padding: 28px 16px;
  border: 1px dashed var(--rule-border);
  border-radius: 12px;
  color: var(--rule-muted-foreground);
  font-size: 13px;
  text-align: center;
}

/* === Section common === */
.lc-section {
  margin-bottom: 64px;
  opacity: 0;
  transform: translateY(30px) scale(0.98);
  transition: opacity 0.7s var(--lt-ease), transform 0.7s var(--lt-ease);
}

.lc-section:last-child {
  margin-bottom: 0;
}

.lc-section.is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.lc-section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 32px;
}

.lt-all-tasks-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid var(--rule-border);
  border-radius: 9999px;
  background: var(--rule-card);
  color: var(--rule-primary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.lt-all-tasks-btn:hover {
  background: var(--rule-primary-tint-3);
  border-color: var(--rule-primary-tint-2);
  box-shadow: 0 4px 12px -6px rgba(37, 99, 235, 0.35);
}

.lt-all-tasks-btn-count {
  min-width: 20px;
  padding: 1px 7px;
  border-radius: 9999px;
  background: var(--rule-primary-tint-1);
  color: var(--rule-primary);
  font-size: 12px;
  text-align: center;
}

.lc-section-title-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
}

.lc-section-bar {
  width: 6px;
  height: 28px;
  border-radius: 3px;
  flex-shrink: 0;
  background: linear-gradient(180deg, var(--rule-primary), rgba(37, 99, 235, 0.05));
}

.lc-section-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--rule-foreground);
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.lc-section-subtitle {
  font-size: 14px;
  color: var(--rule-muted-foreground);
  margin-top: 4px;
}

/* === Hero title block === */
.lt-hero {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  background: linear-gradient(120deg, #0F2E6B 0%, #1D4ED8 55%, #2563EB 100%);
  border-radius: 20px;
  padding: 40px 48px;
  margin-bottom: 64px;
  box-shadow: 0 20px 50px -20px rgba(37, 99, 235, 0.5);
}

.lt-hero::before {
  content: '';
  position: absolute;
  top: -60%;
  right: -10%;
  width: 60%;
  height: 220%;
  pointer-events: none;
  background: radial-gradient(circle, rgba(255,255,255,0.14), transparent 70%);
}

.lt-hero::after {
  content: '';
  position: absolute;
  left: -60px;
  bottom: -140px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.08), transparent 65%);
}

.lt-hero > * {
  position: relative;
  z-index: 1;
}

.lt-hero-main {
  min-width: 0;
}

.lt-hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: rgba(255,255,255,0.16);
  border: 1px solid rgba(255,255,255,0.28);
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  color: var(--rule-primary-foreground);
  backdrop-filter: blur(4px);
}

.lt-hero-tag-icon {
  width: 12px;
  height: 12px;
  background: #fff;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z'/><path d='M16 9a5 5 0 0 1 0 6'/><path d='M19.364 18.364a9 9 0 0 0 0-12.728'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z'/><path d='M16 9a5 5 0 0 1 0 6'/><path d='M19.364 18.364a9 9 0 0 0 0-12.728'/></svg>") center/contain no-repeat;
}

.lt-hero-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--rule-primary-foreground);
  letter-spacing: -0.02em;
  margin: 16px 0 8px;
  line-height: 1.3;
}

.lt-hero-subtitle {
  font-size: 14px;
  color: var(--rule-primary-tint-1);
  margin: 0;
  line-height: 1.6;
}

.lt-hero-stats {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-top: 24px;
}

.lt-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.lt-stat-num {
  font-size: 24px;
  font-weight: 800;
  color: var(--rule-primary-foreground);
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}

.lt-stat-label {
  font-size: 12px;
  color: rgba(255,255,255,0.7);
}

.lt-stat-sep {
  width: 1px;
  height: 32px;
  background: rgba(255,255,255,0.25);
}

/* === Hero 耳机装饰 === */
.lt-hero-art {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 220px;
}

.lt-earphones {
  position: relative;
  width: 170px;
  height: 150px;
  filter: drop-shadow(0 22px 28px rgba(2,20,70,0.45));
  animation: lt-float 4.5s ease-in-out infinite;
}

@keyframes lt-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.lt-earphone {
  position: absolute;
  background: linear-gradient(160deg, #93C5FD, #DBEAFE);
  border-radius: 14px;
}

.lt-earphone-band {
  top: 4px;
  left: 26px;
  width: 118px;
  height: 46px;
  border-radius: 60px 60px 12px 12px;
  background: linear-gradient(160deg, #60A5FA, #2563EB);
  border: none;
}

.lt-earphone-left {
  top: 44px;
  left: 4px;
  width: 44px;
  height: 72px;
  border-radius: 18px 18px 30px 30px;
}

.lt-earphone-right {
  top: 44px;
  right: 4px;
  width: 44px;
  height: 72px;
  border-radius: 18px 18px 30px 30px;
}

.lt-eq {
  position: absolute;
  left: 50%;
  top: 58px;
  transform: translateX(-50%);
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 40px;
  padding: 8px 10px;
  background: rgba(255,255,255,0.9);
  border-radius: 12px;
  box-shadow: 0 8px 20px -6px rgba(2,20,70,0.35);
}

.lt-eq-bar {
  width: 5px;
  border-radius: 3px;
  background: linear-gradient(180deg, var(--rule-primary), #60A5FA);
  height: 6px;
  transform-origin: bottom;
}

.lt-eq .lt-eq-bar.is-playing {
  animation: lt-eq-bounce 0.9s ease-in-out infinite;
}

.lt-eq .lt-eq-bar.is-playing:nth-child(1) { animation-delay: 0s; }
.lt-eq .lt-eq-bar.is-playing:nth-child(2) { animation-delay: 0.15s; }
.lt-eq .lt-eq-bar.is-playing:nth-child(3) { animation-delay: 0.3s; }
.lt-eq .lt-eq-bar.is-playing:nth-child(4) { animation-delay: 0.45s; }
.lt-eq .lt-eq-bar.is-playing:nth-child(5) { animation-delay: 0.6s; }

@keyframes lt-eq-bounce {
  0%, 100% { height: 8px; }
  30% { height: 32px; }
  60% { height: 16px; }
  80% { height: 26px; }
}

.lt-art-dot {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.18);
}

.lt-art-dot-1 { width: 46px; height: 46px; top: 10px; right: 0; }
.lt-art-dot-2 { width: 26px; height: 26px; bottom: 16px; left: 8px; background: rgba(255,255,255,0.12); }

/* === Task cards === */
.lt-task-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.lt-all-tasks {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  max-height: 360px;
  overflow-y: auto;
  margin-top: 18px;
  padding-right: 4px;
}

.lt-all-task {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 52px;
  padding: 10px 14px;
  border: 1px solid var(--rule-border);
  border-radius: 12px;
  background: var(--rule-card);
  color: var(--rule-foreground);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

.lt-all-task:hover {
  transform: translateY(-1px);
  background: var(--rule-primary-tint-3);
  border-color: var(--rule-primary-tint-2);
}

.lt-all-task.is-active {
  border-color: var(--rule-primary);
  background: var(--rule-primary-tint-3);
}

.lt-all-task-index {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 700;
  color: var(--rule-primary);
}

.lt-all-task-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  font-weight: 600;
}

.lt-all-task-meta {
  flex-shrink: 0;
  font-size: 12px;
  color: var(--rule-muted-foreground);
}

.lt-all-task-arrow {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='m9 18 6-6-6-6'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='m9 18 6-6-6-6'/></svg>") center/contain no-repeat;
}

.lt-task-card {
  position: relative;
  background: linear-gradient(135deg, var(--rule-card), var(--rule-primary-tint-3));
  border: 1px solid rgba(226, 232, 240, 0.55);
  border-radius: 16px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 1px 2px rgba(15,23,42,0.04), 0 10px 28px -14px rgba(15,23,42,0.10);
  transition: transform 0.3s var(--lt-ease), box-shadow 0.3s var(--lt-ease), border-color 0.3s var(--lt-ease);
}

.lt-task-card:hover {
  transform: translateY(-6px);
  border-color: rgba(37, 99, 235, 0.3);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.12), 0 22px 44px -14px rgba(37, 99, 235, 0.38);
}

.lt-task-card.is-done:hover {
  border-color: rgba(22, 163, 74, 0.35);
  box-shadow: 0 4px 8px rgba(22, 163, 74, 0.12), 0 22px 44px -14px rgba(22, 163, 74, 0.38);
}

.lt-task-card.is-active {
  border: 2px solid transparent;
  background: linear-gradient(135deg, var(--rule-card), var(--rule-primary-tint-3)) padding-box,
              linear-gradient(135deg, var(--rule-primary), var(--rule-primary-active)) border-box;
}

.lt-task-card.is-active::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: -1;
  box-shadow: 0 18px 38px -10px rgba(37, 99, 235, 0.42);
  animation: lt-pulse-glow 2.4s ease-in-out infinite;
}

@keyframes lt-pulse-glow {
  0%, 100% { opacity: 0.65; }
  50% { opacity: 1; }
}

.lt-task-badge {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--rule-ink-3), var(--rule-muted-foreground));
  color: var(--rule-primary-foreground);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 5px 12px -3px rgba(148, 163, 184, 0.55);
}

.lt-task-card.is-done .lt-task-badge {
  background: linear-gradient(135deg, var(--state-success), rgba(22, 163, 74, 0.88));
  box-shadow: 0 6px 14px -4px rgba(22, 163, 74, 0.48);
}

.lt-task-card.is-active .lt-task-badge {
  background: linear-gradient(135deg, var(--rule-primary), var(--rule-primary-active));
  box-shadow: 0 6px 14px -4px rgba(37, 99, 235, 0.48);
}

.lt-task-top {
  display: flex;
  align-items: center;
  gap: 12px;
}

.lt-task-day {
  font-size: 14px;
  font-weight: 600;
  color: var(--rule-ink-2);
}

.lt-task-card.is-active .lt-task-day {
  color: var(--rule-primary);
}

.lt-task-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--rule-foreground);
  line-height: 1.4;
  min-height: 42px;
}

.lt-task-progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.lt-progress-track {
  flex: 1;
  height: 8px;
  background: var(--rule-muted);
  border-radius: 9999px;
  overflow: hidden;
}

.lt-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--rule-primary), var(--rule-primary-active));
  border-radius: 9999px;
  transition: width 0.8s var(--lt-ease);
}

.lt-task-card.is-done .lt-progress-fill {
  background: linear-gradient(90deg, var(--state-success), rgba(22, 163, 74, 0.85));
}

.lt-progress-pct {
  font-size: 12px;
  font-weight: 700;
  color: var(--rule-primary);
  font-variant-numeric: tabular-nums;
  min-width: 36px;
  text-align: right;
}

.lt-task-card.is-done .lt-progress-pct {
  color: var(--state-success);
}

/* === Difficulty tags === */
.lt-diff {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 9999px;
  margin-left: auto;
}

.lt-diff-beginner {
  background: var(--state-success-tint);
  color: var(--state-success);
}

.lt-diff-intermediate {
  background: var(--state-warning-tint);
  color: var(--state-warning);
}

.lt-diff-advanced {
  background: var(--state-error-tint);
  color: var(--state-error);
}

/* === Status tags === */
.lt-status {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 14px;
  border-radius: 9999px;
  width: fit-content;
}

.lt-status-done {
  background: var(--state-success-tint);
  color: var(--state-success);
}

.lt-status-active {
  background: var(--rule-primary-tint-1);
  color: var(--rule-primary);
}

.lt-status-pending {
  background: var(--rule-muted);
  color: var(--rule-muted-foreground);
}

/* === Studio (floating islands) === */
.lt-studio {
  background: var(--rule-surface-2);
  border-radius: 20px;
  padding: 16px;
  box-shadow: var(--rule-shadow-2);
}

.lt-studio-player {
  background: linear-gradient(135deg, var(--rule-primary-active), var(--rule-primary));
  border-radius: 14px;
  padding: 32px;
  margin-bottom: 16px;
  box-shadow: 0 20px 44px -16px rgba(37, 99, 235, 0.52);
}

.lt-player-top {
  display: flex;
  align-items: center;
  gap: 20px;
}

.lt-play-btn {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--rule-card);
  border: none;
  color: var(--rule-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0 8px 22px -4px rgba(255,255,255,0.45);
  transition: transform 0.3s var(--lt-ease), box-shadow 0.3s var(--lt-ease);
}

.lt-play-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 12px 30px -4px rgba(255,255,255,0.55);
}

.lt-play-btn svg {
  width: 26px;
  height: 26px;
  margin-left: 2px;
}

.lt-player-info {
  flex: 1;
  min-width: 0;
}

.lt-player-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.lt-player-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--rule-primary-foreground);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lt-eq-sm {
  position: static;
  transform: none;
  height: 26px;
  padding: 6px 8px;
  background: rgba(255,255,255,0.16);
  border: 1px solid rgba(255,255,255,0.22);
  box-shadow: none;
  flex-shrink: 0;
}

.lt-eq-sm .lt-eq-bar {
  width: 3px;
  height: 5px;
  background: #fff;
}

.lt-eq-sm.is-on .lt-eq-bar {
  animation: lt-eq-bounce-sm 0.8s ease-in-out infinite;
}

.lt-eq-sm.is-on .lt-eq-bar:nth-child(1) { animation-delay: 0s; }
.lt-eq-sm.is-on .lt-eq-bar:nth-child(2) { animation-delay: 0.2s; }
.lt-eq-sm.is-on .lt-eq-bar:nth-child(3) { animation-delay: 0.4s; }
.lt-eq-sm.is-on .lt-eq-bar:nth-child(4) { animation-delay: 0.6s; }

@keyframes lt-eq-bounce-sm {
  0%, 100% { height: 5px; }
  30% { height: 18px; }
  60% { height: 9px; }
  80% { height: 14px; }
}

.lt-player-bar {
  display: flex;
  align-items: center;
  gap: 14px;
}

.lt-progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(255,255,255,0.25);
  border-radius: 9999px;
  cursor: pointer;
  position: relative;
}

.lt-player-fill {
  height: 100%;
  background: var(--rule-primary-foreground);
  border-radius: 9999px;
  transition: width 0.2s ease;
}

.lt-player-time {
  font-size: 12px;
  color: var(--rule-primary-tint-1);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.lt-player-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.lt-ctrl-btn {
  height: 36px;
  min-width: 36px;
  padding: 0 12px;
  border-radius: 9999px;
  background: rgba(255,255,255,0.16);
  border: 1px solid rgba(255,255,255,0.22);
  color: var(--rule-primary-foreground);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  transition: background 0.3s var(--lt-ease);
}

.lt-ctrl-btn:hover {
  background: rgba(255,255,255,0.3);
}

.lt-ctrl-btn svg {
  width: 16px;
  height: 16px;
}

/* === Studio panels === */
.lt-studio-panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.lt-panel {
  background: var(--rule-card);
  border-radius: 14px;
  padding: 24px 28px;
  box-shadow: 0 2px 8px -2px rgba(15,23,42,0.06);
}

.lt-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.lt-panel-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--rule-foreground);
  display: flex;
  align-items: center;
  gap: 10px;
}

.lt-panel-title::before {
  content: '';
  width: 4px;
  height: 18px;
  border-radius: 2px;
  background: linear-gradient(180deg, var(--rule-primary), var(--rule-primary-active));
}

.lt-quiz-count {
  font-size: 12px;
  font-weight: 600;
  color: var(--rule-primary);
  background: var(--rule-primary-tint-3);
  padding: 4px 12px;
  border-radius: 9999px;
}

/* === Language toggle === */
.lt-lang-toggle {
  display: inline-flex;
  gap: 4px;
  background: var(--rule-muted);
  padding: 3px;
  border-radius: 9999px;
}

.lt-lang-tag {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 14px;
  border-radius: 9999px;
  cursor: pointer;
  transition: background 0.3s var(--lt-ease), color 0.3s var(--lt-ease), box-shadow 0.3s var(--lt-ease);
}

.lt-lang-tag.is-active {
  background: var(--rule-card);
  color: var(--rule-primary);
  box-shadow: 0 2px 6px -1px rgba(15,23,42,0.14);
}

.lt-lang-tag:not(.is-active) {
  color: var(--rule-muted-foreground);
}

/* === Transcript === */
.lt-transcript {
  font-size: 14px;
  line-height: 1.85;
  color: var(--rule-ink-2);
  margin: 0;
  max-height: 320px;
  overflow-y: auto;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  overscroll-behavior: contain;
  padding-left: 18px;
  padding-right: 8px;
  padding-bottom: 8px;
  border-left: 3px solid;
  border-image: linear-gradient(180deg, var(--rule-primary), var(--rule-primary-tint-2)) 1;
  font-family: var(--rule-font-sans);
}

/* === Quiz options === */
.lt-quiz-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.lt-quiz-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lt-quiz-q {
  font-size: 14px;
  font-weight: 600;
  color: var(--rule-foreground);
  line-height: 1.5;
}

.lt-quiz-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lt-quiz-option {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
  color: var(--rule-ink-2);
  background: var(--rule-surface-2);
  border: 1.5px solid transparent;
  transition: background 0.3s var(--lt-ease), border-color 0.3s var(--lt-ease), color 0.3s var(--lt-ease), transform 0.3s var(--lt-ease);
}

.lt-quiz-option:hover {
  background: var(--rule-primary-tint-3);
  color: var(--rule-foreground);
  border-color: var(--rule-primary-tint-2);
  transform: translateX(2px);
}

.lt-quiz-radio {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--rule-border);
  flex-shrink: 0;
  transition: border-color 0.3s var(--lt-ease), background 0.3s var(--lt-ease), box-shadow 0.3s var(--lt-ease);
}

.lt-quiz-option.is-selected {
  background: var(--rule-primary-tint-3);
  color: var(--rule-primary);
  border-color: var(--rule-primary);
}

.lt-quiz-option.is-selected::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10px;
  bottom: 10px;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: linear-gradient(180deg, var(--rule-primary), var(--rule-primary-active));
}

.lt-quiz-option.is-selected .lt-quiz-radio {
  border-color: var(--rule-primary);
  background: linear-gradient(135deg, var(--rule-primary), var(--rule-primary-active));
  box-shadow: inset 0 0 0 3px var(--rule-card), 0 0 12px rgba(37, 99, 235, 0.55);
}

.lt-submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(135deg, var(--rule-primary), var(--rule-primary-active));
  color: var(--rule-primary-foreground);
  padding: 14px 24px;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  width: 100%;
  margin-top: 24px;
  box-shadow: 0 8px 20px -4px rgba(37, 99, 235, 0.42);
  transition: transform 0.3s var(--lt-ease), box-shadow 0.3s var(--lt-ease);
}

.lt-submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px -4px rgba(37, 99, 235, 0.56);
}

.lt-submit-btn svg {
  width: 16px;
  height: 16px;
  transition: transform 0.3s var(--lt-ease);
}

.lt-submit-btn:hover svg {
  transform: translateX(4px);
}

/* === History cards === */
.lt-history-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.lt-history-card {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, var(--rule-card), var(--rule-primary-tint-3));
  border: 1px solid rgba(226, 232, 240, 0.55);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  box-shadow: 0 1px 2px rgba(15,23,42,0.04), 0 10px 28px -14px rgba(15,23,42,0.10);
  transition: transform 0.3s var(--lt-ease), box-shadow 0.3s var(--lt-ease);
}

.lt-history-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.lt-card-high::before {
  background: linear-gradient(90deg, var(--state-success), transparent);
}

.lt-card-mid::before {
  background: linear-gradient(90deg, var(--rule-primary), transparent);
}

.lt-card-low::before {
  background: linear-gradient(90deg, var(--state-warning), transparent);
}

.lt-card-high:hover {
  transform: translateY(-6px);
  box-shadow: 0 22px 44px -14px rgba(22, 163, 74, 0.38);
}

.lt-card-mid:hover {
  transform: translateY(-6px);
  box-shadow: 0 22px 44px -14px rgba(37, 99, 235, 0.38);
}

.lt-card-low:hover {
  transform: translateY(-6px);
  box-shadow: 0 22px 44px -14px rgba(217, 119, 6, 0.38);
}

.lt-history-ring-wrap {
  position: relative;
  width: 96px;
  height: 96px;
}

.lt-history-ring {
  width: 96px;
  height: 96px;
  transform: rotate(-90deg);
}

.lt-ring-track {
  fill: none;
  stroke: var(--rule-muted);
  stroke-width: 8;
}

.lt-ring-fill {
  fill: none;
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s var(--lt-ease);
}

.lt-card-high .lt-ring-fill {
  stroke: var(--state-success);
}

.lt-card-mid .lt-ring-fill {
  stroke: var(--rule-primary);
}

.lt-card-low .lt-ring-fill {
  stroke: var(--state-warning);
}

.lt-history-ring-pct {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.lt-card-high .lt-history-ring-pct {
  color: var(--state-success);
}

.lt-card-mid .lt-history-ring-pct {
  color: var(--rule-primary);
}

.lt-card-low .lt-history-ring-pct {
  color: var(--state-warning);
}

.lt-history-acc-label {
  font-size: 12px;
  color: var(--rule-muted-foreground);
}

.lt-history-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--rule-foreground);
  line-height: 1.4;
}

.lt-history-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.lt-history-date,
.lt-history-time {
  font-size: 12px;
  color: var(--rule-muted-foreground);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
}

.lt-history-date svg,
.lt-history-time svg {
  width: 14px;
  height: 14px;
}

/* === Responsive === */
@media (max-width: 1024px) {
  .lt-task-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .lt-history-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .lt-studio-panels {
    grid-template-columns: 1fr;
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
  
  .lt-all-tasks {
    grid-template-columns: 1fr;
  }
  
  .lt-hero {
    flex-direction: column;
    align-items: stretch;
    gap: 28px;
    padding: 32px 24px;
  }
  
  .lt-hero-art {
    width: 100%;
    height: 170px;
    transform: scale(0.9);
  }
  
  .lt-hero-stats {
    gap: 20px;
  }
  
  .lt-player-top {
    flex-wrap: wrap;
  }
  
  .lt-player-controls {
    width: 100%;
    justify-content: flex-end;
  }
}

@media (max-width: 640px) {
  .lt-task-grid {
    grid-template-columns: 1fr;
  }
  
  .lt-history-grid {
    grid-template-columns: 1fr;
  }
  
  .lt-hero {
    padding: 32px 24px;
  }
  
  .lt-hero-title {
    font-size: 24px;
  }
  
  .lt-studio-player {
    padding: 24px;
  }
  
  .lt-panel {
    padding: 20px;
  }
  
  .lt-studio {
    padding: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .lc-section {
    transition-duration: 0.01ms;
  }
  
  .lt-task-card:hover,
  .lt-history-card:hover {
    transform: none;
  }
  
  .lt-play-btn:hover {
    transform: none;
  }
  
  .lt-progress-fill,
  .lt-ring-fill {
    transition: none;
  }
  
  .lt-task-card.is-active::before {
    animation: none;
  }
  
  .lt-submit-btn:hover svg {
    transform: none;
  }
  
  .lt-quiz-option:hover {
    transform: none;
  }
}
</style>
