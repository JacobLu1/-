<template>
  <view class="le-page">
    <!-- 状态栏安全区占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    <!-- 自定义导航栏 -->
    <view class="le-nav">
      <view class="le-back" hover-class="le-back-hover" @click="goBack">
        <text class="le-back-arrow">‹</text>
        <text>返回</text>
      </view>
      <text class="le-nav-title">法律英语</text>
      <view class="le-nav-right"></view>
    </view>

    <scroll-view scroll-y class="le-scroll" show-scrollbar="false">
      <!-- 能力概览卡 -->
      <view class="hero">
        <view class="hero-top">
          <view class="hero-info">
            <view class="hero-title">法律英语</view>
            <view class="hero-sub">涉外法律人才核心语言能力</view>
          </view>
          <view class="hero-lvl">L3</view>
        </view>
        <view class="hero-pct-row">
          <text class="hero-pct-label">掌握度</text>
          <text class="hero-pct-val">{{ overallPercent }}%</text>
        </view>
        <view class="hero-prog">
          <view class="hero-prog-inner" :style="{ width: overallPercent + '%' }"></view>
        </view>
        <view class="hero-stats">
          <view class="hero-stat" v-for="(stat, i) in stats" :key="i">
            <text class="hero-stat-ico" :class="stat.icon"></text>
            <view>
              <view class="hero-stat-val">{{ stat.val }}</view>
              <view class="hero-stat-label">{{ stat.label }}</view>
            </view>
          </view>
        </view>
      </view>

      <!-- 学习模块 -->
      <view class="sec">
        <view class="sec-head">
          <view class="t">
            <view class="bar"></view>
            <text>学习模块</text>
          </view>
        </view>
        <view v-if="!modules.length" class="res-empty">暂无学习模块</view>
        <view class="mod-grid">
          <view
            class="mod-card"
            v-for="(mod, idx) in modules"
            :key="idx"
            hover-class="mod-hover"
            @click="onModule(mod)"
          >
            <view class="mod-ico" :class="'mod-ico-' + (idx + 1)">
              <text :class="mod.icon"></text>
            </view>
            <view class="mod-name">{{ mod.name }}</view>
            <view class="mod-lv">{{ mod.level }}</view>
            <view class="mod-prog">
              <view class="mod-prog-inner" :style="{ width: mod.percent + '%' }"></view>
            </view>
            <view class="mod-foot">
              <text class="mod-pct">{{ mod.percent }}%</text>
              <text class="mod-go ri-arrow-right-s-line"></text>
            </view>
          </view>
        </view>
      </view>

      <!-- 法律英语资源 -->
      <view class="sec">
        <view class="sec-head">
          <view class="t">
            <view class="bar"></view>
            <text>法律英语资源</text>
          </view>
          <view class="sec-more">
            <text>{{ englishResources.length }} 项</text>
          </view>
        </view>
        <view v-if="!englishResources.length" class="res-empty">暂无资源</view>
        <view class="mod-grid">
          <view
            class="mod-card"
            v-for="(res, idx) in englishResources"
            :key="idx"
            hover-class="mod-hover"
            @click="onResource(res)"
          >
            <view class="mod-ico" :class="'mod-ico-' + ((idx % 4) + 1)">
              <text :class="res.icon"></text>
            </view>
            <view class="mod-name">{{ res.title }}</view>
            <view class="mod-lv">{{ res.level }}</view>
            <text class="mod-desc">{{ res.description || '暂无简介' }}</text>
          </view>
        </view>
      </view>

      <!-- 今日词汇 -->
      <view class="sec">
        <view class="sec-head">
          <view class="t">
            <view class="bar"></view>
            <text>今日词汇</text>
          </view>
          <view class="sec-more" @click="onMoreWords">
            <text>更多</text>
            <text class="ri-arrow-right-s-line"></text>
          </view>
        </view>
        <view v-if="words.length" class="word-card">
          <view
            class="word-row"
            v-for="(word, idx) in words"
            :key="idx"
            hover-class="word-hover"
            @click="onWord(word)"
          >
            <view class="word-phon">{{ word.phonetic }}</view>
            <view class="word-en">{{ word.en }}</view>
            <view class="word-cn">{{ word.cn }}</view>
            <text class="word-star" :class="word.starred ? 'ri-star-fill starred' : 'ri-star-line'" @click.stop="toggleStar(word)"></text>
          </view>
        </view>
        <view v-else class="res-empty">暂无词汇数据</view>
      </view>

      <!-- 底部提示 -->
      <view class="le-tip">
        <text class="ri-sparkling-2-line"></text>
        <text>坚持每日学习，法律英语稳步提升</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { resolveResourceUrl } from '@/utils/video-config.js'

export default {
  data() {
    return {
      statusBarHeight: 0,
      resourceLoading: false,
      englishResources: [],
      overallPercent: 0,
      stats: [],
      modules: [],
      words: []
    }
  },
  onLoad() {
    this.statusBarHeight = this.getStatusBarHeight()
    this.loadEnglishResources()
  },
  methods: {
    async loadEnglishResources() {
      if (this.resourceLoading) return
      this.resourceLoading = true
      try {
        const resourcesObj = uniCloud.importObject('resources')
        const r = (await resourcesObj.listPublic({ type: 'english' })) || {}
        if (r.errCode !== 0) {
          uni.showToast({ title: r.errMsg || '资源加载失败', icon: 'none' })
          return
        }
        const list = r.list || []
        this.englishResources = list.map((d) => ({
          id: d._id,
          title: d.title || '未命名资源',
          category: d.cat || '未分类',
          level: d.meta || '',
          fileUrl: d.fileUrl || '',
          description: d.description || '',
          icon: this.resourceIcon(d.cat)
        }))
        const catCount = {}
        const moduleIcons = {
          '词汇积累': 'ri-book-open-line',
          '术语精讲': 'ri-file-list-3-line',
          '听力训练': 'ri-mic-line',
          '实战练习': 'ri-question-answer-line'
        }
        list.forEach(d => {
          const name = d.cat || '其他'
          catCount[name] = (catCount[name] || 0) + 1
        })
        this.modules = Object.keys(catCount).map((name, index) => ({
          name,
          level: 'L' + Math.min(index + 2, 4),
          percent: 0,
          icon: moduleIcons[name] || 'ri-book-line',
          url: name === '听力训练' ? '/pages/legal-english/listening-training' : ''
        }))
        this.stats = [
          { icon: 'ri-file-list-3-line', val: String(list.length), label: '英语资源' },
          { icon: 'ri-bookmark-line', val: String(this.modules.length), label: '学习模块' }
        ]
      } catch (e) {
        uni.showToast({ title: (e && e.errMsg) || '资源加载失败', icon: 'none' })
      } finally {
        this.resourceLoading = false
      }
    },
    resourceIcon(cat) {
      if (cat === '词汇积累') return 'ri-book-open-line'
      if (cat === '术语精讲') return 'ri-file-list-3-line'
      if (cat === '听力训练') return 'ri-mic-line'
      if (cat === '实战练习') return 'ri-question-answer-line'
      return 'ri-book-line'
    },
    onResource(res) {
      const url = resolveResourceUrl(res.fileUrl)
      if (!url) {
        uni.showToast({ title: '该资源暂未配置文件地址', icon: 'none' })
        return
      }
      uni.setClipboardData({
        data: url,
        success: () => uni.showToast({ title: '资源地址已复制，可在浏览器打开', icon: 'none' })
      })
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
    goBack() {
      uni.navigateBack({
        fail: () => {
          uni.switchTab({ url: '/pages/index/index' })
        }
      })
    },
    onModule(mod) {
      if (mod.url) {
        uni.navigateTo({ url: mod.url })
        return
      }
      uni.showToast({ title: '「' + mod.name + '」建设中，敬请期待', icon: 'none' })
    },
    onMoreWords() {
      uni.showToast({ title: '更多词汇即将上线', icon: 'none' })
    },
    onWord(word) {
      uni.showToast({ title: word.en + '：' + word.cn, icon: 'none' })
    },
    toggleStar(word) {
      word.starred = !word.starred
    }
  }
}
</script>

<style>
/* ============ Design Tokens ============ */
page {
  --brand: #2E7BE0;
  --brand-deep: #2E7BE0;
  --blue-600: #2563EB;
  --ink: #16314F;
  --muted: #7A92B0;
  --glass-2: rgba(255, 255, 255, 0.68);
  --glass-border-soft: rgba(255, 255, 255, 0.45);
  --glass-shadow-sm: 0 12rpx 36rpx rgba(46, 123, 224, 0.10);
  --r-md: 36rpx;
  --r-pill: 999rpx;
  background-color: #f2f6fd;
}

/* ============ 页面 ============ */
.le-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.status-bar {
  width: 100%;
  background: #ffffff;
}

/* ===== 导航栏 ===== */
.le-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 24rpx;
  background: #ffffff;
  border-bottom: 1rpx solid #e8eef8;
}

.le-back {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: 12rpx 16rpx;
  margin-left: -16rpx;
  font-size: 28rpx;
  color: #2E7BE0;
}

.le-back-hover {
  opacity: 0.6;
}

.le-back-arrow {
  font-size: 44rpx;
  line-height: 1;
  margin-top: -6rpx;
}

.le-nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1b2233;
}

.le-nav-right {
  width: 120rpx;
}

/* ===== 滚动区 ===== */
.le-scroll {
  flex: 1;
  height: 0;
  padding: 24rpx 32rpx 40rpx;
  box-sizing: border-box;
}

/* ===== 能力概览卡 ===== */
.hero {
  border-radius: 40rpx;
  padding: 36rpx 32rpx 32rpx;
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
  font-size: 36rpx;
  font-weight: 700;
  color: #ffffff;
}

.hero-sub {
  margin-top: 6rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.78);
}

.hero-lvl {
  height: 48rpx;
  padding: 0 20rpx;
  border-radius: var(--r-pill);
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
}

.hero-pct-row {
  margin-top: 28rpx;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.hero-pct-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.hero-pct-val {
  font-size: 44rpx;
  font-weight: 800;
  color: #ffffff;
}

.hero-prog {
  margin-top: 12rpx;
  height: 12rpx;
  border-radius: var(--r-pill);
  background: rgba(255, 255, 255, 0.22);
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.hero-prog-inner {
  display: block;
  height: 100%;
  border-radius: var(--r-pill);
  background: linear-gradient(90deg, #FDE68A, #F59E0B);
}

.hero-stats {
  margin-top: 28rpx;
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.hero-stat {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.hero-stat-ico {
  font-size: 36rpx;
  color: rgba(255, 255, 255, 0.9);
}

.hero-stat-val {
  font-size: 28rpx;
  font-weight: 700;
  color: #ffffff;
}

.hero-stat-label {
  margin-top: 2rpx;
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.7);
}

/* ===== 区块标题 ===== */
.sec {
  margin-top: 36rpx;
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
  color: #16314F;
}

.sec-more {
  display: flex;
  align-items: center;
  gap: 2rpx;
  font-size: 24rpx;
  color: #7A92B0;
}

/* ===== 学习模块 ===== */
.mod-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.mod-card {
  border-radius: 28rpx;
  background: var(--glass-2);
  border: 2rpx solid var(--glass-border-soft);
  box-shadow: var(--glass-shadow-sm);
  padding: 24rpx;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.mod-hover {
  transform: scale(0.96);
}

.mod-ico {
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  color: #ffffff;
}

.mod-ico-1 { background: linear-gradient(135deg, #5B9DF9, #2E7BE0); }
.mod-ico-2 { background: linear-gradient(135deg, #8B5CF6, #6D28D9); }
.mod-ico-3 { background: linear-gradient(135deg, #06B6D4, #0891B2); }
.mod-ico-4 { background: linear-gradient(135deg, #F59E0B, #D97706); }

.mod-name {
  margin-top: 16rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #16314F;
}

.mod-lv {
  margin-top: 4rpx;
  font-size: 20rpx;
  color: #7A92B0;
}

.mod-prog {
  margin-top: 14rpx;
  height: 8rpx;
  border-radius: var(--r-pill);
  background: rgba(120, 160, 210, 0.18);
  overflow: hidden;
}

.mod-prog-inner {
  display: block;
  height: 100%;
  border-radius: var(--r-pill);
  background: linear-gradient(90deg, #5B9DF9, #2563EB);
}

.mod-foot {
  margin-top: 10rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mod-pct {
  font-size: 22rpx;
  color: #7A92B0;
  font-weight: 600;
}

.mod-go {
  font-size: 28rpx;
  color: #2E7BE0;
}

.mod-desc {
  display: -webkit-box;
  margin-top: 12rpx;
  font-size: 22rpx;
  line-height: 1.5;
  color: #7A92B0;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.res-empty {
  padding: 40rpx 24rpx;
  border-radius: 28rpx;
  border: 2rpx dashed rgba(120, 160, 210, 0.35);
  background: var(--glass-2);
  color: #7A92B0;
  font-size: 24rpx;
  text-align: center;
}

/* ===== 今日词汇 ===== */
.word-card {
  border-radius: 28rpx;
  background: var(--glass-2);
  border: 2rpx solid var(--glass-border-soft);
  box-shadow: var(--glass-shadow-sm);
  padding: 8rpx 24rpx;
}

.word-row {
  display: flex;
  align-items: center;
  padding: 22rpx 0;
  border-bottom: 2rpx solid rgba(120, 160, 210, 0.12);
}

.word-row:last-child {
  border-bottom: none;
}

.word-hover {
  opacity: 0.7;
}

.word-phon {
  width: 200rpx;
  font-size: 22rpx;
  color: #7A92B0;
}

.word-en {
  flex: 1;
  min-width: 0;
  font-size: 28rpx;
  font-weight: 600;
  color: #16314F;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.word-cn {
  margin-right: 16rpx;
  font-size: 26rpx;
  color: #2E7BE0;
  font-weight: 600;
}

.word-star {
  font-size: 34rpx;
  color: #C9D6EA;
}

.word-star.starred {
  color: #F59E0B;
}

/* ===== 底部提示 ===== */
.le-tip {
  margin-top: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  color: #7A92B0;
  font-size: 24rpx;
}

.le-tip text:first-child {
  font-size: 26rpx;
  color: #2E7BE0;
}
</style>
