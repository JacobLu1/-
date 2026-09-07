<template>
  <view class="lt-page">
    <view class="sticky-top">
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

      <!-- 固定顶部区：概览卡（下滑不消失） -->
      <view class="lt-fixed">
        <view class="hero">
          <view class="hero-top">
            <view class="hero-info">
              <view class="hero-title">每周法律英语听力实训</view>
              <view class="hero-sub">每日一课，听读结合，巩固涉外法律英语能力</view>
            </view>
          </view>
          <view class="hero-progress-row">
            <text class="ri-checkbox-circle-fill hero-check"></text>
            <text class="hero-progress-text">{{ heroProgressText }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- TODO: scroll-into-view replaced by native scroll -->
    <view class="lt-scroll">
      <!-- 每日听力任务 -->
      <view class="sec reveal d1">
        <view class="sec-head">
          <view class="t">
            <view class="bar"></view>
            <text>每日听力任务</text>
          </view>
          <text class="sec-sub">按日安排，循序渐进</text>
        </view>
        <view class="all-task-btn" hover-class="all-task-btn-hover" @click="showAllLessons = !showAllLessons">
          <text>{{ showAllLessons ? '收起全部' : '全部任务' }}</text>
          <text class="ri-arrow-down-s-line" :class="{ 'is-open': showAllLessons }"></text>
        </view>
        <view v-if="!weeklyTasks.length" class="lt-empty">暂无听力任务</view>
        <view class="task-grid">
          <view
            class="task-card"
            :class="[{ 'is-done': task.status === 'done', 'is-active': currentIndex === i }]"
            v-for="(task, i) in weeklyTasks"
            :key="i"
            hover-class="task-hover"
            @click="selectLesson(i, true)"
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
        <scroll-view v-if="showAllLessons && lessons.length" scroll-y class="all-task-scroll">
          <view
            class="all-task-item"
            :class="{ 'is-active': currentLesson && currentLesson.id === lesson.id }"
            v-for="(lesson, index) in lessons"
            :key="lesson.id"
            hover-class="all-task-hover"
            @click="selectLessonById(lesson.id, true)"
          >
            <text class="all-task-index">{{ String(index + 1).padStart(2, '0') }}</text>
            <view class="all-task-main">
              <text class="all-task-title">{{ lesson.title }}</text>
              <text class="all-task-meta">{{ lesson.difficultyText }} · {{ lesson.statusText }}</text>
            </view>
            <text class="ri-play-circle-line all-task-play"></text>
          </view>
        </scroll-view>
      </view>

      <!-- 听力播放 -->
      <view id="studio" class="sec reveal d2">
        <view class="sec-head">
          <view class="t">
            <view class="bar"></view>
            <text>听力播放</text>
          </view>
          <text class="sec-sub">当前练习 · {{ playerTitle }}</text>
        </view>

        <!-- 播放器 -->
        <view class="player-card">
          <view class="player-top">
            <view class="play-btn" hover-class="play-hover" @click="togglePlay">
              <view class="play-ico" :class="isPlaying ? 'is-pause' : ''"></view>
            </view>
            <view class="player-info">
              <text class="player-title">{{ playerTitle }}</text>
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
      </view>

      <!-- 中英对照文本 -->
      <view class="sec reveal d2">
        <view class="sec-head">
          <view class="t">
            <view class="bar"></view>
            <text>中英对照文本</text>
          </view>
          <text class="sec-sub">原文 / 译文对照学习</text>
        </view>

        <view class="panel">
          <view class="panel-head">
            <view class="panel-title">
              <view class="bar-sm"></view>
              <text>{{ currentLang === 'en' ? '英文原文' : '中文翻译' }}</text>
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
          <scroll-view scroll-y class="transcript-scroll">
            <text v-if="currentTranscript" class="transcript">{{ currentTranscript }}</text>
            <text v-else-if="isTranscriptLoading" class="transcript transcript-empty">原文加载中...</text>
            <text v-else class="transcript transcript-empty">{{ currentLang === 'zh' ? '暂无中文文本' : '暂无听力原文' }}</text>
          </scroll-view>
        </view>
      </view>

      <!-- 听力记录 -->
      <view class="sec reveal d3">
        <view class="sec-head">
          <view class="t">
            <view class="bar"></view>
            <text>听力记录</text>
          </view>
          <text class="sec-sub">查看过往练习情况</text>
        </view>
        <view v-if="!historyRecords.length" class="lt-empty">暂无听力记录，快去完成今日任务吧</view>
        <view class="history-list">
          <view class="history-item" v-for="(r, i) in historyRecords" :key="i">
            <view class="history-ico" :class="'history-ico-' + r.status">
              <text class="ri-mic-line"></text>
            </view>
            <view class="history-main">
              <text class="history-title">{{ r.title }}</text>
              <view class="history-meta">
                <text class="ri-calendar-line"></text>
                <text>{{ r.date }} · 时长 {{ r.duration }}</text>
              </view>
            </view>
            <text class="history-status" :class="'hstatus-' + r.status">{{ r.statusText }}</text>
          </view>
        </view>
      </view>

      <!-- 底部提示 -->
      <view class="lt-tip">
        <text class="ri-sparkling-2-line"></text>
        <text>坚持每日听力训练，法律英语稳步提升</text>
      </view>
    </view>
  </view>
</template>

<script>
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

function splitTranscriptText(text) {
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

export default {
  data() {
    return {
      statusBarHeight: 0,
      isPlaying: false,
      playerTitle: '暂无练习内容',
      playerProgress: 0,
      playerCurrentTime: '00:00',
      playerTotalTime: '--:--',
      playbackRate: '1.0x',
      currentLang: 'en',
      weeklyTasks: [],
      lessons: [],
      currentLesson: null,
      currentIndex: -1,
      transcripts: { en: '', zh: '' },
      historyRecords: [],
      scrollIntoView: '',
      showAllLessons: false,
      isTranscriptLoading: false,
      activeTranscriptId: ''
    }
  },
  computed: {
    currentTranscript() {
      return this.transcripts[this.currentLang]
    },
    weeklyDoneCount() {
      return this.weeklyTasks.filter((task) => task.status === 'done').length
    },
    heroProgressText() {
      const total = this.weeklyTasks.length || 7
      return '本周已完成 ' + this.weeklyDoneCount + '/' + total + ' 项听力任务，坚持每日训练巩固法律英语'
    }
  },
  onLoad() {
    this.statusBarHeight = this.getStatusBarHeight()
    this.loadListeningLessons()
  },
  onUnload() {
    if (this._audioInstance) {
      this._audioInstance.destroy()
      this._audioInstance = null
    }
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
    splitTranscriptByLang(text) {
      return splitTranscriptText(text)
    },
    getWeekIndex(date) {
      const current = date || new Date()
      const day = new Date(current.getFullYear(), current.getMonth(), current.getDate())
      const weekday = day.getDay() || 7
      day.setDate(day.getDate() - weekday + 1)
      day.setHours(0, 0, 0, 0)
      const weekStart = new Date(2026, 0, 5)
      return Math.floor((day.getTime() - weekStart.getTime()) / (7 * 24 * 60 * 60 * 1000))
    },
    buildWeeklyTasks() {
      const total = this.lessons.length
      if (!total) return []
      const weekIndex = this.getWeekIndex(new Date())
      const start = (((weekIndex * 7) % total) + total) % total
      const tasks = []
      for (let i = 0; i < Math.min(7, total); i += 1) {
        const lesson = this.lessons[(start + i) % total]
        tasks.push({
          ...lesson,
          dayNum: String(i + 1).padStart(2, '0'),
          day: '第' + (i + 1) + '天'
        })
      }
      return tasks
    },
    async loadListeningLessons() {
      try {
        const resourcesObj = uniCloud.importObject('resources', { customUI: true })
        const r = (await resourcesObj.listPublic({ type: 'listening' })) || {}
        if (r.errCode !== 0) {
          uni.showToast({ title: r.errMsg || '听力资源加载失败', icon: 'none' })
          return
        }
        this.lessons = (r.list || []).map((doc) => ({
          id: doc._id,
          difficulty: 'mid',
          difficultyText: doc.meta || '中级',
          title: doc.title || '未命名听力',
          progress: 0,
          status: 'active',
          statusText: '待学习',
          audioUrl: doc.audioUrl || doc.fileUrl || '',
          transcriptEn: '',
          transcriptZh: '',
          contentLoaded: false
        }))
        this.weeklyTasks = this.buildWeeklyTasks()
        if (this.lessons.length) this.selectLesson(0)
      } catch (e) {
        uni.showToast({ title: (e && e.errMsg) || '听力资源加载失败', icon: 'none' })
      }
    },
    applyLesson(lesson, autoPlay = false) {
      this.currentLesson = lesson || null
      if (!this.currentLesson) return
      this.currentIndex = this.weeklyTasks.findIndex((task) => task.id === this.currentLesson.id)
      this.transcripts = {
        en: this.currentLesson.transcriptEn || '',
        zh: this.currentLesson.transcriptZh || ''
      }
      this.playerTitle = this.currentLesson.title
      this.playerProgress = 0
      this.playerCurrentTime = '00:00'
      this.playerTotalTime = '--:--'
      this.isPlaying = false
      if (this._audioInstance) {
        this._audioInstance.destroy()
        this._audioInstance = null
      }
      if (this._scrollToStudio) {
        this.scrollIntoView = ''
        this.$nextTick(() => {
          this.scrollIntoView = 'studio'
        })
        this._scrollToStudio = false
      }
      if (autoPlay) {
        if (this.currentLesson.audioUrl) {
          this.togglePlay()
        } else {
          uni.showToast({ title: '当前听力未配置音频地址', icon: 'none' })
        }
      }
      if (!this.currentLesson.contentLoaded) {
        this.isTranscriptLoading = true
        this.loadLessonDetail(this.currentLesson.id)
      } else {
        this.isTranscriptLoading = false
      }
    },
    selectLesson(index, autoPlay = false) {
      this._scrollToStudio = true
      this.applyLesson(this.weeklyTasks[index] || null, autoPlay)
    },
    selectLessonById(id, autoPlay = false) {
      const lesson = this.lessons.find((item) => item.id === id) || null
      this._scrollToStudio = true
      this.applyLesson(lesson, autoPlay)
    },
    updateLessonDetail(id, patch) {
      const lessonIndex = this.lessons.findIndex((item) => item.id === id)
      if (lessonIndex >= 0) {
        this.lessons[lessonIndex] = { ...this.lessons[lessonIndex], ...patch }
      }
      this.weeklyTasks = this.weeklyTasks.map((task) => task.id === id ? { ...task, ...patch } : task)
      if (this.currentLesson && this.currentLesson.id === id) {
        this.currentLesson = { ...this.currentLesson, ...patch }
        this.transcripts = {
          en: patch.transcriptEn || '',
          zh: patch.transcriptZh || ''
        }
      }
    },
    async loadLessonDetail(id) {
      const lesson = this.lessons.find((item) => item.id === id)
      if (!lesson || lesson.contentLoaded) return
      this.activeTranscriptId = id
      this.isTranscriptLoading = true
      try {
        const resourcesObj = uniCloud.importObject('resources', { customUI: true })
        const r = (await resourcesObj.get({ id })) || {}
        if (r.errCode !== 0) {
          if (this.activeTranscriptId === id) {
            this.updateLessonDetail(id, { contentLoaded: true })
          }
          return
        }
        const doc = r.doc || {}
        const enSource = doc.content || doc.description || ''
        const zhSource = doc.description || doc.content || ''
        const enPart = this.splitTranscriptByLang(enSource)
        const zhPart = this.splitTranscriptByLang(zhSource)
        const patch = {
          transcriptEn: enPart.en || zhPart.en,
          transcriptZh: enPart.zh || zhPart.zh,
          contentLoaded: true
        }
        if (this.activeTranscriptId === id) {
          this.updateLessonDetail(id, patch)
        }
      } catch (e) {
        if (this.activeTranscriptId === id) {
          this.updateLessonDetail(id, { contentLoaded: true })
        }
      } finally {
        if (this.activeTranscriptId === id) {
          this.isTranscriptLoading = false
        }
      }
    },
    togglePlay() {
      if (!this.currentLesson || !this.currentLesson.audioUrl) {
        uni.showToast({ title: '当前听力未配置音频地址', icon: 'none' })
        return
      }
      if (!this._audioInstance) {
        this._audioInstance = uni.createInnerAudioContext()
        this._audioInstance.src = this.currentLesson.audioUrl
        this._audioInstance.onTimeUpdate(() => {
          this.playerCurrentTime = this.formatTime(this._audioInstance.currentTime)
          this.playerTotalTime = this.formatTime(this._audioInstance.duration)
          if (this._audioInstance.duration) {
            this.playerProgress = Math.round((this._audioInstance.currentTime / this._audioInstance.duration) * 100)
          }
        })
        this._audioInstance.onEnded(() => {
          this.isPlaying = false
          this.markLessonDone(this.currentLesson)
          this.updateHistoryOnEnded(this.currentLesson)
        })
      }
      if (this.isPlaying) {
        this._audioInstance.pause()
        this.isPlaying = false
      } else {
        this.recordListeningStart(this.currentLesson)
        this._audioInstance.play()
        this.isPlaying = true
      }
    },
    formatTime(seconds) {
      if (!Number.isFinite(seconds) || seconds < 0) return '00:00'
      const m = Math.floor(seconds / 60)
      const s = Math.floor(seconds % 60)
      return (m < 10 ? '0' + m : String(m)) + ':' + (s < 10 ? '0' + s : String(s))
    },
    markLessonDone(lesson) {
      if (!lesson) return
      const patch = { status: 'done', statusText: '已完成', progress: 100 }
      this.lessons = this.lessons.map((item) => item.id === lesson.id ? { ...item, ...patch } : item)
      this.weeklyTasks = this.weeklyTasks.map((task) => task.id === lesson.id ? { ...task, ...patch } : task)
      if (this.currentLesson && this.currentLesson.id === lesson.id) {
        this.currentLesson = { ...this.currentLesson, ...patch }
      }
    },
    recordListeningStart(lesson) {
      if (!lesson) return
      const today = new Date().toISOString().slice(0, 10)
      if (this.historyRecords.some((r) => r.id === lesson.id && r.date === today)) return
      this.historyRecords.unshift({
        id: lesson.id,
        title: lesson.title,
        date: today,
        duration: '--:--',
        status: 'active',
        statusText: '学习中'
      })
    },
    updateHistoryOnEnded(lesson) {
      if (!lesson) return
      const total = this._audioInstance && this._audioInstance.duration ? this.formatTime(this._audioInstance.duration) : '--:--'
      const exists = this.historyRecords.some((r) => r.id === lesson.id)
      if (exists) {
        this.historyRecords = this.historyRecords.map((r) => {
          if (r.id !== lesson.id) return r
          return { ...r, duration: total, status: 'done', statusText: '已完成' }
        })
      } else {
        this.historyRecords.unshift({
          id: lesson.id,
          title: lesson.title,
          date: new Date().toISOString().slice(0, 10),
          duration: total,
          status: 'done',
          statusText: '已完成'
        })
      }
    }
  }
}
</script>

<style>
/* 设计变量 */
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

.lt-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.sticky-top {
  position: sticky;
  top: 0;
  z-index: 100;
}

.status-bar {
  width: 100%;
  background: #ffffff;
}

/* 导航栏 */
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

/* 固定顶部区：概览卡（下滑不消失） */
.lt-fixed {
  flex-shrink: 0;
  padding: 20rpx 32rpx 8rpx;
  background: #f2f6fd;
  z-index: 10;
}

/* 概览卡 */
.hero {
  border-radius: 40rpx;
  padding: 32rpx 32rpx 28rpx;
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
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.3;
}

.hero-sub {
  margin-top: 6rpx;
  font-size: 21rpx;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.5;
}

.hero-progress-row {
  margin-top: 20rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
  position: relative;
  z-index: 1;
  padding: 16rpx 20rpx;
  border-radius: var(--r-sm);
  background: rgba(255, 255, 255, 0.12);
}

.hero-check {
  font-size: 28rpx;
  color: #FDE68A;
  flex-shrink: 0;
}

.hero-progress-text {
  font-size: 23rpx;
  color: rgba(255, 255, 255, 0.92);
  line-height: 1.5;
}

/* 滚动区 */
.lt-scroll {
  padding: 8rpx 32rpx 60rpx;
  box-sizing: border-box;
}

.lt-scroll .sec:first-child {
  margin-top: 24rpx;
}

/* 区块标题 */
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

.all-task-btn {
  display: inline-flex;
  align-items: center;
  gap: 6rpx;
  margin-bottom: 20rpx;
  padding: 10rpx 20rpx;
  border-radius: var(--r-pill);
  background: rgba(46, 123, 224, 0.10);
  color: var(--brand);
  font-size: 22rpx;
  font-weight: 600;
  width: fit-content;
}

.all-task-btn-hover {
  opacity: 0.7;
}

.all-task-btn .is-open {
  transform: rotate(180deg);
}

/* 每日任务 */
.task-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.all-task-scroll {
  max-height: 560rpx;
  margin-top: 20rpx;
}

.all-task-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 22rpx 20rpx;
  margin-bottom: 16rpx;
  border-radius: 24rpx;
  background: var(--glass-2);
  border: 2rpx solid var(--glass-border-soft);
  box-shadow: var(--glass-shadow-sm);
}

.all-task-item.is-active {
  border-color: var(--brand);
  background: rgba(46, 123, 224, 0.08);
}

.all-task-hover {
  opacity: 0.88;
  transform: scale(0.99);
}

.all-task-index {
  flex-shrink: 0;
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #5B9DF9, #2E7BE0);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  font-weight: 700;
}

.all-task-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.all-task-title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.all-task-meta {
  font-size: 20rpx;
  color: var(--muted);
}

.all-task-play {
  font-size: 38rpx;
  color: var(--brand);
  flex-shrink: 0;
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

/* 播放器 */
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

/* 面板（中英文本） */
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
.transcript-scroll {
  max-height: 560rpx;
  overflow: hidden;
}

.transcript {
  display: block;
  font-size: 25rpx;
  line-height: 1.85;
  color: var(--ink-2);
  white-space: pre-wrap;
  word-break: break-word;
  padding-left: 20rpx;
  padding-right: 12rpx;
  padding-bottom: 8rpx;
  border-left: 6rpx solid rgba(91, 157, 249, 0.45);
}

.transcript-empty {
  color: var(--muted);
}

/* 听力记录 */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx;
  border-radius: 28rpx;
  background: var(--glass-2);
  border: 2rpx solid var(--glass-border-soft);
  box-shadow: var(--glass-shadow-sm);
}

.history-ico {
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  background: rgba(46, 123, 224, 0.10);
  color: var(--brand);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  flex-shrink: 0;
}

.history-ico-done {
  background: var(--green-soft);
  color: #16A34A;
}

.history-main {
  flex: 1;
  min-width: 0;
}

.history-title {
  display: block;
  font-size: 27rpx;
  font-weight: 600;
  color: var(--ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-meta {
  margin-top: 8rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 21rpx;
  color: var(--muted);
}

.history-meta .ri-calendar-line {
  font-size: 24rpx;
}

.history-status {
  flex-shrink: 0;
  font-size: 20rpx;
  font-weight: 600;
  padding: 6rpx 16rpx;
  border-radius: var(--r-pill);
}

.hstatus-active {
  background: rgba(46, 123, 224, 0.12);
  color: var(--brand);
}

.hstatus-done {
  background: var(--green-soft);
  color: #15803D;
}

.lt-empty {
  padding: 40rpx 24rpx;
  border-radius: 28rpx;
  border: 2rpx dashed rgba(120, 160, 210, 0.35);
  background: #f7faff;
  color: #7A92B0;
  font-size: 24rpx;
  text-align: center;
}

/* 底部提示 */
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

/* 入场动画 */
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
