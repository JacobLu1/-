<template>
  <view class="ldd-page">
    <view class="sticky-top">
      <!-- 状态栏安全区占位 -->
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
      <!-- 自定义导航栏 -->
      <view class="ldd-nav">
        <view class="ldd-back" hover-class="ldd-back-hover" @click="goBack">
          <text class="ldd-back-arrow">‹</text>
          <text>返回法律库</text>
        </view>
        <text class="ldd-nav-title">法规详情</text>
        <view class="ldd-nav-right"></view>
      </view>
    </view>

    <!-- TODO: scroll-into-view replaced by native scroll -->
    <view class="ldd-scroll">
      <view v-if="loading" class="ldd-state">正在加载法规全文...</view>
      <template v-else-if="doc.title">
        <!-- 文献头 -->
        <view class="ldd-head">
          <view class="ldd-head-meta">
            <text class="ldd-tag">{{ doc.category }}</text>
            <text class="ldd-tag" v-if="doc.docType">{{ doc.docType }}</text>
            <text class="ldd-tag ldd-tag-soft" v-for="r in (doc.regions || [])" :key="r">{{ r }}</text>
          </view>
          <view class="ldd-title">{{ doc.title }}</view>
          <view class="ldd-head-sub" v-if="doc.source || doc.date">
            <text v-if="doc.source">来源：{{ doc.source }}</text>
            <text v-if="doc.source && doc.date" class="ldd-dot">·</text>
            <text v-if="doc.date">{{ doc.date }} 施行</text>
          </view>
          <view class="ldd-tags" v-if="doc.tags && doc.tags.length">
            <text class="ldd-tag-mini" v-for="tag in doc.tags" :key="tag">{{ tag }}</text>
          </view>
          <text class="ldd-summary" v-if="doc.summary">{{ doc.summary }}</text>
        </view>

        <!-- 目录 -->
        <view class="ldd-toc" v-if="tocItems.length">
          <view class="ldd-toc-head">
            <text class="ldd-toc-title">目录</text>
            <text class="ldd-toc-count">{{ articleCount }} 条</text>
          </view>
          <scroll-view scroll-x class="ldd-toc-scroll" show-scrollbar="false" :enable-flex="true">
            <view
              class="ldd-toc-item"
              v-for="(item, idx) in tocItems"
              :key="idx"
              @click="jumpTo(item)"
            >
              <text v-if="item.num">{{ item.num }}</text>
              <text v-if="item.title && item.title !== '正文'" class="ldd-toc-name">{{ item.title }}</text>
            </view>
          </scroll-view>
        </view>

        <!-- 条文正文 -->
        <view class="ldd-articles">
          <view
            v-for="(art, idx) in articles"
            :key="idx"
            :id="'ldd-art-' + idx"
            class="ldd-art"
            :class="{ 'is-chapter': art.type === 'chapter', 'is-preface': art.type === 'preface' }"
          >
            <view v-if="art.type === 'chapter'" class="ldd-chapter-title">
              {{ art.num }}<text v-if="art.title" class="ldd-chapter-name"> · {{ art.title }}</text>
            </view>
            <view v-else-if="art.type === 'preface'" class="ldd-preface-title">{{ art.title }}</view>
            <view v-else class="ldd-art-line">
              <text class="ldd-art-num">{{ art.num }}</text>
              <text class="ldd-art-title" v-if="art.title">{{ art.title }}</text>
            </view>
            <text class="ldd-art-text" v-if="art.text">{{ art.text }}</text>
          </view>
        </view>
      </template>
      <view v-else class="ldd-state">法规不存在或未上线</view>
    </view>
  </view>
</template>

<script>
const CN_NUM = '一二三四五六七八九十百千万亿兆零两廿卅卌'
const NUM = `${CN_NUM}\\d`
const SEP = '[、，,\\.。：:·\\s]*'
const chapterRegex = new RegExp(`^第([${NUM}]+)章${SEP}(.*)$`)
const articleRegex = new RegExp(`^第([${NUM}]+)条${SEP}(.*)$`)

export default {
  data() {
    return {
      statusBarHeight: 0,
      loading: true,
      doc: {},
      articles: [],
      scrollTarget: ''
    }
  },
  computed: {
    tocItems() {
      return this.articles
        .map((a, i) => ({ ...a, index: i }))
        .filter((a) => a.type !== 'article')
    },
    articleCount() {
      return this.articles.filter((a) => a.type === 'article').length
    }
  },
  onLoad(options) {
    this.statusBarHeight = this.getStatusBarHeight()
    this.loadDoc(options && options.id)
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
      const pages = getCurrentPages()
      if (pages.length > 1) {
        uni.navigateBack()
      } else {
        uni.redirectTo({ url: '/pages/legal-db/legal-db' })
      }
    },
    async loadDoc(id) {
      this.loading = true
      try {
        const knowledgeObj = uniCloud.importObject('knowledge', { customUI: true })
        const r = (await knowledgeObj.get({ id })) || {}
        if (r.errCode !== 0) {
          uni.showToast({ title: r.errMsg || '法规加载失败', icon: 'none' })
          this.loading = false
          return
        }
        this.doc = r.doc || {}
        this.articles = this.parseArticles(this.doc.content)
      } catch (e) {
        uni.showToast({ title: (e && e.errMsg) || '法规加载失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    // 将法规全文解析为章节/前言/条文结构，普通段落并入当前条文
    parseArticles(content) {
      const lines = String(content || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
      const items = []
      let cur = null
      for (const line of lines) {
        const chapterM = line.match(chapterRegex)
        const articleM = line.match(articleRegex)
        if (chapterM) {
          items.push({ type: 'chapter', num: chapterM[1], title: chapterM[2], text: '' })
          cur = null
        } else if (articleM) {
          cur = { type: 'article', num: articleM[1], title: articleM[2], text: '' }
          items.push(cur)
        } else if (/^前言|^序言|^总则|^附则/.test(line)) {
          items.push({ type: 'preface', num: '', title: line, text: '' })
          cur = null
        } else if (cur) {
          cur.text += (cur.text ? '\n' : '') + line
        } else if (items.length) {
          const last = items[items.length - 1]
          if (last.type === 'article') {
            last.text += (last.text ? '\n' : '') + line
          } else {
            items.push({ type: 'preface', num: '', title: line, text: '' })
          }
        } else {
          items.push({ type: 'preface', num: '', title: line, text: '' })
        }
      }
      return items
    },
    jumpTo(item) {
      this.scrollTarget = ''
      setTimeout(() => {
        this.scrollTarget = 'ldd-art-' + item.index
      }, 20)
    }
  }
}
</script>

<style scoped>
page {
  --brand: #2E7BE0;
  --brand-deep: #1B5BB5;
  --ink: #1b2233;
  --ink-2: #5a6b82;
  --muted: #9aabc0;
  --line: #e8eef8;
  --bg: #f2f6fd;
  background-color: var(--bg);
  color: var(--ink);
  font-size: 28rpx;
}

.ldd-page {
  /* 变量需定义在可被 scoped 匹配的元素上（page 上的变量在 scoped 下会失效） */
  --brand: #2E7BE0;
  --brand-deep: #1B5BB5;
  --ink: #1b2233;
  --ink-2: #5a6b82;
  --muted: #9aabc0;
  --line: #e8eef8;
  --bg: #f2f6fd;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg);
  color: var(--ink);
  font-size: 28rpx;
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
.ldd-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 24rpx;
  background: #ffffff;
  border-bottom: 1rpx solid var(--line);
}
.ldd-back {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: 12rpx 16rpx;
  margin-left: -16rpx;
  font-size: 28rpx;
  color: var(--brand);
}
.ldd-back-hover { opacity: 0.6; }
.ldd-back-arrow {
  font-size: 44rpx;
  line-height: 1;
  margin-top: -6rpx;
}
.ldd-nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--ink);
}
.ldd-nav-right { width: 180rpx; }

.ldd-scroll {
  box-sizing: border-box;
  padding: 24rpx;
}

/* 文献头 */
.ldd-head {
  background: #ffffff;
  border-radius: 28rpx;
  padding: 28rpx;
  box-shadow: 0 12rpx 36rpx rgba(46, 123, 224, 0.08);
}
.ldd-head-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-bottom: 16rpx;
}
.ldd-tag {
  font-size: 22rpx;
  color: #ffffff;
  background: var(--brand);
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
}
.ldd-tag-soft {
  color: var(--brand);
  background: rgba(46, 123, 224, 0.10);
}
.ldd-title {
  font-size: 36rpx;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 14rpx;
}
.ldd-head-sub {
  display: flex;
  flex-wrap: wrap;
  font-size: 24rpx;
  color: var(--muted);
  margin-bottom: 14rpx;
}
.ldd-dot { margin: 0 10rpx; }
.ldd-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-bottom: 16rpx;
}
.ldd-tag-mini {
  font-size: 22rpx;
  color: var(--ink-2);
  background: #f2f6fd;
  padding: 4rpx 14rpx;
  border-radius: 8rpx;
}
.ldd-summary {
  display: block;
  font-size: 26rpx;
  color: var(--ink-2);
  line-height: 1.7;
}

/* 目录 */
.ldd-toc {
  margin-top: 20rpx;
  background: #ffffff;
  border-radius: 28rpx;
  padding: 24rpx 0 24rpx 24rpx;
  box-shadow: 0 12rpx 36rpx rgba(46, 123, 224, 0.08);
}
.ldd-toc-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding-right: 24rpx;
  margin-bottom: 16rpx;
}
.ldd-toc-title {
  font-size: 28rpx;
  font-weight: 600;
}
.ldd-toc-count {
  font-size: 22rpx;
  color: var(--muted);
}
.ldd-toc-scroll {
  white-space: nowrap;
}
.ldd-toc-item {
  display: inline-flex;
  align-items: center;
  gap: 6rpx;
  padding: 10rpx 20rpx;
  margin-right: 12rpx;
  border-radius: 30rpx;
  background: #f2f6fd;
  color: var(--ink-2);
  font-size: 24rpx;
}
.ldd-toc-name {
  max-width: 280rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 条文正文 */
.ldd-articles {
  margin-top: 20rpx;
  background: #ffffff;
  border-radius: 28rpx;
  padding: 28rpx;
  box-shadow: 0 12rpx 36rpx rgba(46, 123, 224, 0.08);
}
.ldd-art {
  padding: 14rpx 0;
}
.ldd-art.is-chapter {
  margin-top: 20rpx;
  padding-top: 26rpx;
  border-top: 2rpx solid var(--line);
}
.ldd-art.is-chapter:first-child {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}
.ldd-chapter-title {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--brand-deep);
}
.ldd-chapter-name {
  font-weight: 600;
  color: var(--ink);
}
.ldd-preface-title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--ink);
}
.ldd-art-line {
  display: flex;
  align-items: baseline;
  gap: 10rpx;
}
.ldd-art-num {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--brand);
  flex-shrink: 0;
}
.ldd-art-title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--ink);
}
.ldd-art-text {
  display: block;
  margin-top: 8rpx;
  font-size: 26rpx;
  color: var(--ink-2);
  line-height: 1.8;
  white-space: pre-wrap;
}

.ldd-state {
  padding: 120rpx 0;
  text-align: center;
  font-size: 26rpx;
  color: var(--muted);
}
</style>
