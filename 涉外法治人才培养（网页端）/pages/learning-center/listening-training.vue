﻿﻿﻿﻿﻿<template>
  <div class="app-shell">
      <!-- 左侧导航栏 -->
      <aside class="app-sidebar">
        <view class="app-sidebar-logo">
          <view class="app-sidebar-logo-icon">
            <image class="ls-svg-img" src="/static/logo.png" mode="aspectFit"></image>
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

    <!-- 主内容区 -->
    <view class="app-main">
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
        <div class="le-layout">
          <!-- 左列：课程信息 + 播放器 + 双语文本 -->
          <div class="le-main">

            <!-- 课程信息 -->
            <section class="le-card le-lesson-info">
              <div class="le-lesson-top">
                <div class="le-lesson-summary">
                  <div class="le-breadcrumb">
                    <span>听力训练</span>
                    <svg class="le-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    <span>第 {{ currentIndex + 1 }} 课</span>
                  </div>
                  <h1 class="le-lesson-title">{{ playerTitle }}</h1>
                  <p class="le-lesson-subtitle">{{ currentSubtitle }}</p>
                </div>
                <div class="le-lesson-tags">
                <span class="le-tag">
                  <svg class="le-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                  听力训练
                </span>
                <span class="le-tag">
                  <svg class="le-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                  {{ currentDifficultyText }}
                </span>
                <span class="le-tag">
                  <svg class="le-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  {{ playerTotalTime || '--:--' }}
                </span>
                </div>
              </div>

              <div class="le-lesson-divider"></div>

              <div class="le-player-row">
                <button class="le-play-btn" type="button" aria-label="播放/暂停" @click="togglePlay">
                  <svg v-if="!isPlaying" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
                  <svg v-else viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"></rect><rect x="14" y="4" width="4" height="16" rx="1"></rect></svg>
                </button>
                <div class="le-player-body">
                  <div class="le-player-meta">
                    <span class="le-player-name">Lesson {{ currentIndex + 1 }} — {{ playerTitle }}</span>
                    <div class="le-player-tools">
                      <button class="le-speed-btn" type="button" @click="cycleRate">{{ playbackRate }}x</button>
                      <button class="le-ico-btn" type="button" aria-label="上一课" @click="prevLesson">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
                      </button>
                      <button class="le-ico-btn" type="button" aria-label="下一课" @click="nextLesson">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
                      </button>
                      <button class="le-ico-btn" type="button" aria-label="音量">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                      </button>
                    </div>
                  </div>
                  <div class="le-progress">
                    <span class="le-progress-time">{{ playerCurrentTime }}</span>
                    <div class="le-progress-track">
                      <div class="le-progress-fill" :style="{width: playerProgress + '%'}"></div>
                    </div>
                    <span class="le-progress-time">{{ playerTotalTime }}</span>
                  </div>
                </div>
              </div>
            </section>

            <!-- 双语文本 -->
            <section class="le-card le-bilingual">
              <div class="le-tabs">
                <button class="le-tab" :class="{'is-active': textView === 'both'}" type="button" @click="setTextView('both')">
                  <svg class="le-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg>
                  双语对照
                </button>
                <button class="le-tab" :class="{'is-active': textView === 'en'}" type="button" @click="setTextView('en')">English</button>
                <button class="le-tab" :class="{'is-active': textView === 'zh'}" type="button" @click="setTextView('zh')">中文</button>
              </div>
              <div class="le-bilingual-body" :class="{'is-single': textView !== 'both'}">
                <div v-if="textView !== 'zh'" class="le-text-col">
                  <div class="le-text-head">
                    <svg class="le-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                    English Original
                  </div>
                  <template v-if="transcriptParagraphs.en.length">
                    <p v-for="(para, i) in transcriptParagraphs.en" :key="'en' + i" class="le-text">{{ para }}</p>
                  </template>
                  <p v-else-if="isTranscriptLoading" class="le-text le-text-empty">原文加载中...</p>
                  <p v-else class="le-text le-text-empty">暂无英文原文</p>
                </div>
                <div v-if="textView !== 'en'" class="le-text-col le-text-col-zh">
                  <div class="le-text-head">
                    <svg class="le-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                    中文译文
                  </div>
                  <template v-if="transcriptParagraphs.zh.length">
                    <p v-for="(para, i) in transcriptParagraphs.zh" :key="'zh' + i" class="le-text">{{ para }}</p>
                  </template>
                  <p v-else-if="isTranscriptLoading" class="le-text le-text-empty">原文加载中...</p>
                  <p v-else class="le-text le-text-empty">暂无中文译文</p>
                </div>
              </div>
            </section>
          </div>

          <!-- 右列：本周任务清单 -->
          <aside class="le-side">
            <section class="le-card le-checklist">
              <div class="le-checklist-head">
                <div class="le-checklist-title">
                  <svg class="le-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  本周任务清单
                </div>
                <span class="le-checklist-week">第 {{ weekIndex + 1 }} 周</span>
              </div>

              <div class="le-checklist-progress">
                <div class="le-checklist-progress-head">
                  <span>完成进度</span>
                  <span class="le-checklist-progress-num">{{ completedCount }} / {{ weeklyTasks.length }}</span>
                </div>
                <div class="le-progress-track le-progress-track-lg">
                  <div class="le-progress-fill" :style="{width: (weeklyTasks.length ? Math.round(completedCount / weeklyTasks.length * 100) : 0) + '%'}"></div>
                </div>
              </div>

              <div class="le-task-list">
                <div v-for="(task, index) in weeklyTasks" :key="index"
                     class="le-task"
                     :class="{
                       'is-done': task.status === 'done',
                       'is-active': currentIndex === index
                     }"
                     @click="selectLesson(index)">
                  <svg v-if="task.status === 'done'" class="le-task-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <svg v-else-if="currentIndex === index" class="le-task-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="1"></circle></svg>
                  <svg v-else class="le-task-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>
                  <div class="le-task-body">
                    <div class="le-task-line">
                      <span class="le-task-day">{{ task.dayName || task.day }}</span>
                      <span class="le-task-title" :class="{'is-done': task.status === 'done'}">{{ task.title }}</span>
                    </div>
                    <span class="le-task-sub">{{ task.difficultyText }} · {{ task.statusText }}</span>
                  </div>
                  <span v-if="currentIndex === index" class="le-task-badge">进行中</span>
                </div>
                <div v-if="!weeklyTasks.length" class="le-empty">暂无听力任务</div>
              </div>

              <div class="le-checklist-foot">
                <div class="le-checklist-foot-label">
                  <svg class="le-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
                  本周累计听力
                </div>
                <span class="le-checklist-foot-num">--</span>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </view>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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
const textView = ref('both')

// 听力资源
const lessons = ref([])
const currentLesson = ref(null)
const currentIndex = ref(-1)
const weeklyTasks = ref([])
const isTranscriptLoading = ref(false)
let audioInstance = null
let activeTranscriptId = ''

// 文本数据
const transcripts = ref({
  en: '',
  zh: ''
})

// 按行拆分段落，供双语对照逐段展示
const transcriptParagraphs = computed(() => ({
  en: transcripts.value.en.split(/\r?\n/).map(t => t.trim()).filter(Boolean),
  zh: transcripts.value.zh.split(/\r?\n/).map(t => t.trim()).filter(Boolean)
}))

// 当前课程信息
const currentSubtitle = computed(() => currentLesson.value ? `法律英语听力 · ${currentLesson.value.difficultyText}` : '')
const currentDifficultyText = computed(() => currentLesson.value ? currentLesson.value.difficultyText : '--')
const weekIndex = computed(() => getWeekIndex())

// 统计计算
const completedCount = computed(() => weeklyTasks.value.filter(t => t.status === 'done').length)

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
  const DAY_NAMES = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const tasks = []
  for (let i = 0; i < Math.min(7, total); i += 1) {
    const lesson = lessons.value[(start + i) % total]
    tasks.push({
      ...lesson,
      dayNum: String(i + 1).padStart(2, '0'),
      day: `第${i + 1}天`,
      dayName: DAY_NAMES[i] || `第${i + 1}天`
    })
  }
  return tasks
}

function preloadAudioDuration(audioUrl) {
  if (!audioUrl || typeof Audio === 'undefined') return
  const probe = new Audio()
  probe.preload = 'metadata'
  probe.src = audioUrl
  probe.addEventListener('loadedmetadata', () => {
    if (probe.duration && !isNaN(probe.duration)) {
      playerTotalTime.value = formatTime(probe.duration)
    }
    probe.remove()
  }, { once: true })
  probe.addEventListener('error', () => { probe.remove() }, { once: true })
}

function applyLesson(lesson, autoPlay = false) {
  currentLesson.value = lesson || null
  if (!currentLesson.value) return
  currentIndex.value = weeklyTasks.value.findIndex((task) => task.id === currentLesson.value.id)
  transcripts.value = {
    en: currentLesson.value.transcriptEn || '',
    zh: currentLesson.value.transcriptZh || ''
  }
  playerTitle.value = currentLesson.value.title
  playerProgress.value = 0
  playerCurrentTime.value = '00:00'
  playerTotalTime.value = '00:00'
  isPlaying.value = false
  if (audioInstance) {
    audioInstance.pause()
    audioInstance = null
  }
  if (currentLesson.value.audioUrl) {
    preloadAudioDuration(currentLesson.value.audioUrl)
  }
  if (autoPlay) {
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

const LISTENING_CACHE_KEY = 'lt_lessons_cache'
const LISTENING_CACHE_TTL = 10 * 60 * 1000

async function loadListeningLessons() {
  const now = Date.now()
  // 缓存命中：直接渲染
  try {
    const cached = uni.getStorageSync(LISTENING_CACHE_KEY)
    if (cached && cached.expireAt && cached.expireAt > now && Array.isArray(cached.list)) {
      lessons.value = cached.list
      weeklyTasks.value = buildWeeklyTasks()
      if (lessons.value.length) selectLesson(0)
      return
    }
  } catch (e) {}

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
    try {
      uni.setStorageSync(LISTENING_CACHE_KEY, { expireAt: now + LISTENING_CACHE_TTL, list: lessons.value })
    } catch (e) {}
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
    const audio = new Audio(currentLesson.value.audioUrl)
    audioInstance = audio
    audio.playbackRate = playbackRate.value
    audio.addEventListener('loadedmetadata', () => {
      if (audio === audioInstance && audio.duration) {
        playerTotalTime.value = formatTime(audio.duration)
      }
    })
    audio.addEventListener('timeupdate', () => {
      if (audio !== audioInstance) return
      playerCurrentTime.value = formatTime(audio.currentTime)
      playerTotalTime.value = formatTime(audio.duration)
      if (audio.duration) {
        playerProgress.value = Math.round((audio.currentTime / audio.duration) * 100)
      }
    })
    audio.addEventListener('ended', () => {
      if (audio === audioInstance) isPlaying.value = false
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

const RATES = [1.0, 1.25, 1.5, 2.0]

const setTextView = (mode) => {
  textView.value = mode
}

const cycleRate = () => {
  const idx = RATES.indexOf(playbackRate.value)
  playbackRate.value = RATES[(idx + 1) % RATES.length]
  if (audioInstance) {
    audioInstance.playbackRate = playbackRate.value
  }
}

const prevLesson = () => {
  if (!currentLesson.value || weeklyTasks.value.length <= 1) return
  selectLesson(Math.max(0, currentIndex.value - 1))
}

const nextLesson = () => {
  if (!currentLesson.value || weeklyTasks.value.length <= 1) return
  selectLesson(Math.min(weeklyTasks.value.length - 1, currentIndex.value + 1))
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
/* 每周法律英语听力实训 - 样式 */

/* 品牌主题色变量 */
.app-shell {
  /* 品牌主色 */
  --rule-primary: #2563EB;
  --rule-primary-hover: #1D4ED8;
  --rule-primary-active: #1E40AF;
  --rule-primary-foreground: #FFFFFF;
  --rule-primary-tint-1: #DBEAFE;
  --rule-primary-tint-2: #BFDBFE;
  --rule-primary-tint-3: #EFF6FF;

  /* 语义色 */
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

  /* 圆角 */
  --rule-radius-small: 4px;
  --rule-radius-medium: 8px;
  --rule-radius-large: 16px;
  --rule-radius-full: 9999px;

  --state-success: #16A34A;
  --state-success-tint: #DCFCE7;
  --state-warning: #D97706;
  --state-warning-tint: #FEF3C7;
  --state-error: #DC2626;
  --state-error-tint: #FEE2E2;
  --state-info: #2563EB;
  --state-info-tint: #DBEAFE;

  /* 中性色 */
  --rule-ink: #0F172A;
  --rule-ink-2: #475569;
  --rule-ink-3: #94A3B8;
  --rule-line: #E2E8F0;
  --rule-surface: #FFFFFF;
  --rule-surface-2: #F8FAFC;

  /* 阴影 */
  --rule-shadow-1: 0 1px 2px rgba(15,23,42,.04), 0 1px 1px rgba(15,23,42,.02);
  --rule-shadow-2: 0 8px 24px -8px rgba(15,23,42,.12);
  --rule-shadow-3: 0 24px 60px -20px rgba(15,23,42,.20);

  /* 基础整体布局 */
  display: flex;
  min-height: 100vh;
  background: var(--rule-background);
  color: var(--rule-foreground);
  font-family: "Inter", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 侧边导航栏 */
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
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.ls-svg-img {
  width: 32px;
  height: 32px;
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

/* 导航图标（基于遮罩的 SVG） */
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

/* 侧边栏用户信息 */
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

/* 缓动曲线（该页面其他动画共用） */
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

/* ===== 法律英语听力训练 — 主内容样式（参考设计稿复刻） ===== */

/* 整体布局：左列 + 右侧 380px 任务栏 */
.le-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 32px;
  align-items: start;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
}

.le-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
}

.le-card {
  background: #FFFFFF;
  border: 1px solid #E0E5EE;
  border-radius: 16px;
  box-sizing: border-box;
}

/* 通用小图标 */
.le-svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* —— 课程信息 —— */
.le-lesson-info { padding: 20px 28px; }

/* 课程信息横向单行排版：标题区在左、标签靠右 */
.le-lesson-top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.le-lesson-summary {
  flex: 1;
  min-width: 0;
}

.le-lesson-divider {
  height: 1px;
  background: #E0E5EE;
  margin: 20px 0 24px;
}

.le-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #9AABC0;
  margin-bottom: 12px;
}
.le-breadcrumb .le-svg { width: 12px; height: 12px; }

.le-lesson-title {
  font-size: 28px;
  font-weight: 600;
  line-height: 1.3;
  color: #1B2436;
  margin: 0 0 8px;
}

.le-lesson-subtitle {
  font-size: 18px;
  color: #5A6B82;
  margin: 0 0 16px;
}

.le-lesson-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px;
  flex-shrink: 0;
  margin-bottom: 4px;
}

.le-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 8px;
  background: #EFF2F7;
  font-size: 13px;
  color: #5A6B82;
}
.le-tag .le-svg { width: 14px; height: 14px; }

/* —— 音频播放器（已并入课程信息卡片） —— */
.le-player-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.le-play-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--rule-primary);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: opacity 0.2s;
}
.le-play-btn:hover { opacity: 0.9; }
.le-play-btn svg { width: 20px; height: 20px; color: #FFFFFF; }

.le-player-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.le-player-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.le-player-name {
  font-size: 14px;
  color: #5A6B82;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.le-player-tools {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.le-speed-btn {
  font-size: 13px;
  color: #5A6B82;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  background: #FFFFFF;
  cursor: pointer;
  transition: color 0.2s;
}
/* 清掉 uni-app 按钮自带的灰盒子与边框伪元素 */
.le-speed-btn::after {
  display: none;
  border: none;
  background: none;
}
.le-speed-btn:hover { color: var(--rule-primary); }

.le-ico-btn {
  border: none;
  background: none;
  cursor: pointer;
  color: #9AABC0;
  padding: 0;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}
.le-ico-btn::after {
  display: none;
  border: none;
  background: none;
}
.le-ico-btn:hover { color: var(--rule-primary); }
.le-ico-btn svg { width: 16px; height: 16px; }

/* 进度条 */
.le-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.le-progress-time {
  font-size: 12px;
  color: #9AABC0;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

.le-progress-track {
  flex: 1;
  height: 6px;
  background: #EFF2F7;
  border-radius: 999px;
  overflow: hidden;
}

.le-progress-fill {
  height: 100%;
  background: var(--rule-primary);
  border-radius: 999px;
  transition: width 0.2s ease;
}

.le-progress-track-lg { height: 8px; }

/* —— 双语文本 —— */
.le-bilingual { overflow: hidden; }

.le-tabs {
  display: flex;
  align-items: center;
  padding: 0 24px;
  border-bottom: 1px solid #E0E5EE;
}

.le-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #9AABC0;
  background: #FFFFFF;
  border: none;
  border-bottom: 2px solid transparent;
  border-radius: 0;
  cursor: pointer;
  transition: color 0.2s;
}
/* 清掉 uni-app 按钮自带的灰盒子与边框伪元素 */
.le-tab::after {
  display: none;
  border: none;
  background: none;
}
.le-tab .le-svg { width: 16px; height: 16px; }
.le-tab.is-active {
  color: var(--rule-primary);
  border-bottom-color: var(--rule-primary);
}
.le-tab:not(.is-active):hover { color: #1B2436; }

.le-bilingual-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.le-bilingual-body.is-single { grid-template-columns: 1fr; }

.le-text-col { padding: 24px; }

.le-text-col-zh {
  background: #F7F8FB;
  border-left: 1px solid #E0E5EE;
}
.le-bilingual-body.is-single .le-text-col-zh { border-left: none; }

.le-text-head {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #9AABC0;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 16px;
}

.le-text {
  font-size: 15px;
  line-height: 1.7;
  color: #1B2436;
  margin: 0 0 16px;
}
.le-text:last-child { margin-bottom: 0; }
.le-text-col-zh .le-text { line-height: 1.8; }

.le-text-empty { color: #9AABC0; }

/* —— 右侧任务清单 —— */
/* 固定在内容区顶部（topbar 64px + 内容上边距），滚动时不再上移、不被 hero 遮挡 */
.le-side {
  min-width: 0;
  position: sticky;
  top: 96px;
  height: calc(100vh - 128px);
  display: flex;
  align-items: center;
}

.le-checklist {
  width: 100%;
  padding: 8px 24px;
}

.le-checklist-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

.le-checklist-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1B2436;
}
.le-checklist-title .le-svg { color: var(--rule-primary); }

.le-checklist-week {
  font-size: 13px;
  color: #9AABC0;
}

.le-checklist-progress { margin-bottom: 20px; }

.le-checklist-progress-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
  color: #5A6B82;
}

.le-checklist-progress-num {
  font-weight: 500;
  color: var(--rule-primary);
}

.le-task-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.le-task {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.le-task:hover { background: #EFF2F7; }
.le-task.is-active {
  background: #EFF2F7;
  border: 1px solid rgba(43, 74, 124, 0.2);
}

.le-task-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
.le-task.is-done .le-task-icon { color: #2D7A52; }
.le-task.is-active .le-task-icon { color: var(--rule-primary); }
.le-task:not(.is-done):not(.is-active) .le-task-icon { color: #9AABC0; }

.le-task-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.le-task-line {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.le-task-day {
  font-size: 12px;
  color: #9AABC0;
  width: 32px;
  flex-shrink: 0;
}
.le-task.is-active .le-task-day { color: var(--rule-primary); font-weight: 500; }

.le-task-title {
  font-size: 14px;
  color: #1B2436;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.le-task.is-done .le-task-title {
  color: #9AABC0;
  text-decoration: line-through;
}
.le-task.is-active .le-task-title { font-weight: 500; }

.le-task-sub {
  font-size: 12px;
  color: #9AABC0;
}
.le-task.is-active .le-task-sub { color: #5A6B82; }

.le-task-badge {
  font-size: 11px;
  font-weight: 500;
  color: #FFFFFF;
  background: var(--rule-primary);
  padding: 2px 8px;
  border-radius: 4px;
  flex-shrink: 0;
}

.le-empty {
  padding: 24px 0;
  text-align: center;
  font-size: 13px;
  color: #9AABC0;
}

.le-checklist-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #E0E5EE;
}

.le-checklist-foot-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #5A6B82;
}

.le-checklist-foot-num {
  font-size: 14px;
  font-weight: 600;
  color: #1B2436;
  font-variant-numeric: tabular-nums;
}

/* —— 响应式 —— */
@media (max-width: 1100px) {
  .le-layout { grid-template-columns: 1fr; }
  .le-side { order: -1; position: static; height: auto; display: block; transform: none; }
}

@media (max-width: 768px) {
  .le-bilingual-body { grid-template-columns: 1fr; }
  .le-text-col-zh { border-left: none; border-top: 1px solid #E0E5EE; }
  .le-player-meta { flex-direction: column; align-items: flex-start; gap: 8px; }
  .le-lesson-top { flex-direction: column; align-items: flex-start; }
  .le-lesson-tags { justify-content: flex-start; }
  .le-lesson-title { font-size: 24px; }
  .le-lesson-subtitle { font-size: 16px; }
}

@media (max-width: 480px) {
  .le-lesson-tags { gap: 8px; }
  .le-tag { font-size: 12px; }
}
</style>
