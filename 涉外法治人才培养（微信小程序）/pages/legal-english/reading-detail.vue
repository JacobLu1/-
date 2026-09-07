<template>
  <view class="rrd-page">
    <view class="sticky-top">
      <!-- 状态栏安全区占位 -->
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
      <!-- 自定义导航栏 -->
      <view class="rrd-nav">
        <view class="rrd-back" hover-class="rrd-back-hover" @click="goBack">
          <text class="rrd-back-arrow">‹</text>
          <text>返回</text>
        </view>
        <text class="rrd-nav-title">阅读详情</text>
        <view class="rrd-nav-right">
          <text v-if="!loading && doc.title" class="ri-clipboard-line" @click="openOriginal"></text>
        </view>
      </view>
    </view>

    <view class="rrd-scroll">
      <view v-if="loading" class="rrd-state">正在加载正文...</view>
      <template v-else-if="doc.title">
        <!-- 书头部 -->
        <view class="rrd-head">
          <view class="rrd-head-meta">
            <text class="rrd-tag">{{ doc.category || '未分类' }}</text>
            <text class="rrd-tag-soft" v-if="doc.meta">{{ doc.meta }}</text>
          </view>
          <view class="rrd-title">{{ doc.title }}</view>
          <view class="rrd-sub">
            <text v-if="wordCount">全文约 {{ wordCount }} 字</text>
          </view>
          <text v-if="doc.summary" class="rrd-summary">{{ doc.summary }}</text>
        </view>

        <!-- 字号调节 -->
        <view class="rrd-toolbar">
          <text class="rrd-tool-label">字号</text>
          <view class="rrd-tool-btn" @click="changeFontSize(-1)">A−</view>
          <view class="rrd-tool-btn" @click="changeFontSize(1)">A+</view>
          <text class="rrd-tool-num">{{ fontSize }}</text>
        </view>

        <!-- 正文 -->
        <view class="rrd-body" :style="{ fontSize: fontSize + 'rpx', lineHeight: lineHeight + 'rpx' }">
          <text v-if="!paragraphs.length" class="rrd-empty-text">暂无正文，请点击右上角图标复制原文链接。</text>
          <view class="rrd-para" v-for="(para, idx) in paragraphs" :key="idx">{{ para }}</view>
        </view>
      </template>
      <view v-else class="rrd-state">阅读不存在或未上线</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 0,
      loading: true,
      doc: {},
      paragraphs: [],
      fontSize: 30,
      lineHeight: 54,
      wordCount: 0
    }
  },
  onLoad(options) {
    this.statusBarHeight = this.getStatusBarHeight()
    this.loadReading(options && options.id)
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
        uni.navigateTo({ url: '/pages/legal-english/reading-list' })
      }
    },
    async loadReading(id) {
      this.loading = true
      try {
        const resourcesObj = uniCloud.importObject('resources', { customUI: true })
        const r = (await resourcesObj.get({ id })) || {}
        if (r.errCode !== 0) {
          uni.showToast({ title: r.errMsg || '阅读加载失败', icon: 'none' })
          this.loading = false
          return
        }
        const doc = r.doc || {}
        this.doc = {
          title: doc.title || '',
          category: doc.cat || '',
          meta: doc.meta || '',
          summary: doc.description || '',
          content: doc.content || '',
          fileUrl: doc.fileUrl || ''
        }
        this.paragraphs = String(doc.content || '')
          .split(/\r?\n/)
          .map((t) => t.trim())
          .filter(Boolean)
        this.wordCount = this.paragraphs.join('').length
      } catch (e) {
        uni.showToast({ title: (e && e.errMsg) || '阅读加载失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    changeFontSize(delta) {
      const next = this.fontSize + delta * 2
      if (next < 24 || next > 40) return
      this.fontSize = next
      this.lineHeight = Math.round(next * 1.8)
    },
    openOriginal() {
      if (!this.doc.fileUrl) {
        uni.showToast({ title: '暂无原文链接', icon: 'none' })
        return
      }
      uni.setClipboardData({
        data: this.doc.fileUrl,
        success: () => uni.showToast({ title: '原文地址已复制', icon: 'none' })
      })
    }
  }
}
</script>

<style scoped>
page {
  --brand: #2E7BE0;
  --brand-deep: #1B5BB5;
  --ink: #16314F;
  --ink-2: #5a6b82;
  --muted: #9aabc0;
  --line: #e8eef8;
  --bg: #F4F7FC;
  background-color: var(--bg);
  color: var(--ink);
  font-size: 28rpx;
}

.rrd-page {
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
.rrd-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 24rpx;
  background: #ffffff;
  border-bottom: 1rpx solid var(--line);
}
.rrd-back {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: 12rpx 16rpx;
  margin-left: -16rpx;
  font-size: 28rpx;
  color: var(--brand);
}
.rrd-back-hover { opacity: 0.6; }
.rrd-back-arrow {
  font-size: 44rpx;
  line-height: 1;
  margin-top: -6rpx;
}
.rrd-nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--ink);
}
.rrd-nav-right {
  width: 120rpx;
  text-align: right;
  font-size: 32rpx;
  color: var(--brand);
}

.rrd-scroll {
  box-sizing: border-box;
  padding: 24rpx;
}

/* 书头部 */
.rrd-head {
  background: #ffffff;
  border-radius: 28rpx;
  padding: 28rpx;
  box-shadow: 0 12rpx 36rpx rgba(46, 123, 224, 0.08);
}
.rrd-head-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-bottom: 16rpx;
}
.rrd-tag {
  font-size: 22rpx;
  color: #ffffff;
  background: var(--brand);
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
}
.rrd-tag-soft {
  font-size: 22rpx;
  color: var(--brand);
  background: rgba(46, 123, 224, 0.10);
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
}
.rrd-title {
  font-size: 36rpx;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 12rpx;
}
.rrd-sub {
  font-size: 24rpx;
  color: var(--muted);
  margin-bottom: 14rpx;
}
.rrd-summary {
  display: block;
  font-size: 26rpx;
  color: var(--ink-2);
  line-height: 1.7;
}

/* 字号调节工具条 */
.rrd-toolbar {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-top: 20rpx;
  background: #ffffff;
  border-radius: 28rpx;
  padding: 20rpx 24rpx;
  box-shadow: 0 12rpx 36rpx rgba(46, 123, 224, 0.08);
}
.rrd-tool-label {
  font-size: 24rpx;
  color: var(--muted);
}
.rrd-tool-btn {
  padding: 8rpx 22rpx;
  border-radius: 14rpx;
  background: #F2F6FD;
  color: var(--brand);
  font-size: 26rpx;
  font-weight: 600;
}
.rrd-tool-num {
  font-size: 24rpx;
  color: var(--muted);
}

/* 正文 */
.rrd-body {
  margin-top: 20rpx;
  background: #ffffff;
  border-radius: 28rpx;
  padding: 30rpx 28rpx;
  box-shadow: 0 12rpx 36rpx rgba(46, 123, 224, 0.08);
}
.rrd-para {
  margin-bottom: 18rpx;
  color: var(--ink);
  line-height: inherit;
  text-align: justify;
}
.rrd-para:last-child {
  margin-bottom: 0;
}
.rrd-empty-text {
  font-size: 27rpx;
  color: var(--muted);
  line-height: 1.7;
}

.rrd-state {
  padding: 120rpx 0;
  text-align: center;
  font-size: 26rpx;
  color: var(--muted);
}
</style>
