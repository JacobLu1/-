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
    </view>

    <view class="lt-scroll">
      <!-- 听力播放 -->
      <view class="sec reveal d1">
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

      <!-- 听力任务 -->
      <view class="sec reveal d3">
        <view class="sec-head">
          <view class="t">
            <view class="bar"></view>
            <text>听力任务</text>
          </view>
          <text class="sec-sub">共 {{ lessons.length }} 课，点击切换</text>
        </view>
        <view v-if="!lessons.length" class="lt-empty">暂无听力任务</view>
        <view v-else class="task-list">
          <view
            class="task-item"
            :class="{ 'is-done': lesson.status === 'done', 'is-active': currentLesson && currentLesson.id === lesson.id }"
            v-for="(lesson, index) in lessons"
            :key="lesson.id"
            hover-class="task-item-hover"
            @click="selectLessonById(lesson.id, true)"
          >
            <text class="task-index">{{ String(index + 1).padStart(2, '0') }}</text>
            <view class="task-main">
              <text class="task-title">{{ lesson.title }}</text>
              <text class="task-meta">{{ lesson.difficultyText }} · {{ lesson.statusText }}</text>
            </view>
            <text class="ri-play-circle-line task-play"></text>
          </view>
        </view>
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
      lessons: [],
      currentLesson: null,
      transcripts: { en: '', zh: '' },
      isTranscriptLoading: false,
      activeTranscriptId: ''
    }
  },
  computed: {
    currentTranscript() {
      return this.transcripts[this.currentLang]
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
          difficultyText: doc.meta || '中级',
          title: doc.title || '未命名听力',
          status: 'active',
          statusText: '待学习',
          audioUrl: doc.audioUrl || doc.fileUrl || '',
          transcriptEn: '',
          transcriptZh: '',
          contentLoaded: false
        }))
        if (this.lessons.length) this.selectLessonById(this.lessons[0].id)
      } catch (e) {
        uni.showToast({ title: (e && e.errMsg) || '听力资源加载失败', icon: 'none' })
      }
    },
    applyLesson(lesson, autoPlay = false) {
      this.currentLesson = lesson || null
      if (!this.currentLesson) return
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
        this._scrollToStudio = false
        uni.pageScrollTo({ scrollTop: 0, duration: 240 })
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
        const enRaw = String(doc.content || '').trim()
        const zhRaw = String(doc.description || '').trim()
        // 与网页端保持一致：管理端已按字段分开存储（content 为英文原文、description 为中文译文），
        // 这里直接按字段取用，不再逐词猜语言（猜分正是中英文错位的来源）。
        // 只有老数据把中英文混在同一个 content 里时才回退到按语言拆分：
        // 判据是英文正文里中文字符占比很高，而新导入的英文正文只在主题标题里出现个别中文。
        const cjkCount = (enRaw.match(/[\u3400-\u9fff]/g) || []).length
        const isMixed = !!enRaw && cjkCount / enRaw.length > 0.15
        const mixedPart = isMixed ? this.splitTranscriptByLang(enRaw) : { en: '', zh: '' }
        const patch = {
          transcriptEn: isMixed ? mixedPart.en : enRaw,
          transcriptZh: isMixed ? mixedPart.zh : zhRaw,
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
        })
      }
      if (this.isPlaying) {
        this._audioInstance.pause()
        this.isPlaying = false
      } else {
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
      const patch = { status: 'done', statusText: '已完成' }
      this.lessons = this.lessons.map((item) => item.id === lesson.id ? { ...item, ...patch } : item)
      if (this.currentLesson && this.currentLesson.id === lesson.id) {
        this.currentLesson = { ...this.currentLesson, ...patch }
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

/* 听力任务（紧凑列表） */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 22rpx 20rpx;
  border-radius: 24rpx;
  background: var(--glass-2);
  border: 2rpx solid var(--glass-border-soft);
  box-shadow: var(--glass-shadow-sm);
}

.task-item.is-done .task-index {
  background: linear-gradient(135deg, #34D399, #16A34A);
}

.task-item.is-active {
  border-color: var(--brand);
  background: rgba(46, 123, 224, 0.08);
}

.task-item.is-active .task-index {
  background: linear-gradient(135deg, #5B9DF9, #2E7BE0);
}

.task-item-hover {
  opacity: 0.88;
  transform: scale(0.99);
}

.task-index {
  flex-shrink: 0;
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #B9C9DE, #7A92B0);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  font-weight: 700;
}

.task-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.task-title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-meta {
  font-size: 20rpx;
  color: var(--muted);
}

.task-play {
  font-size: 38rpx;
  color: var(--brand);
  flex-shrink: 0;
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

.lt-empty {
  padding: 40rpx 24rpx;
  border-radius: 28rpx;
  border: 2rpx dashed rgba(120, 160, 210, 0.35);
  background: #f7faff;
  color: #7A92B0;
  font-size: 24rpx;
  text-align: center;
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
