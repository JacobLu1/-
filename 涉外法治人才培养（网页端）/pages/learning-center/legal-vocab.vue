<template>
  <view class="legal-vocab">
    <view class="page-shell">
      <header class="page-topbar">
        <view class="back-btn" @tap="goBack">
          <view class="back-arrow"></view>
          <text>返回</text>
        </view>
        <text class="page-title">词汇积累</text>
        <text class="page-total">共 {{ vocabTotal }} 词</text>
      </header>

      <main class="page-content">
        <view class="vocab-cards">
          <view class="vocab-card unlearned" :class="{ active: activeCard === 'unlearned' }" @tap="switchCard('unlearned')">
            <view class="card-num">{{ stats.unlearned }}</view>
            <view class="card-label">未学习词汇</view>
            <view class="card-desc">尚未开始学习</view>
          </view>
          <view class="vocab-card review" :class="{ active: activeCard === 'review' }" @tap="switchCard('review')">
            <view class="card-num">{{ stats.review }}</view>
            <view class="card-label">待复习词汇</view>
            <view class="card-desc">到期需要巩固</view>
          </view>
          <view class="vocab-card starred" :class="{ active: activeCard === 'starred' }" @tap="switchCard('starred')">
            <view class="card-num">{{ stats.starred }}</view>
            <view class="card-label">收藏词汇</view>
            <view class="card-desc">我的重点收藏</view>
          </view>
        </view>

        <view class="list-head">
          <text class="list-title">{{ activeTitle }}</text>
          <text class="list-count">{{ activeWords.length }} 词</text>
        </view>

        <view v-if="activeWords.length" class="word-list">
          <view class="word-row" v-for="word in activeWords" :key="word.id" @tap="onWordTap(word)">
            <view class="word-main">
              <text class="word-en">{{ word.en }}</text>
              <text class="word-level">{{ word.level || '法律英语' }}</text>
              <text class="word-cn">{{ word.cn }}</text>
            </view>
            <view class="word-actions">
              <view class="action-btn star-btn" :class="{ active: isStarredWord(word) }" @tap.stop="toggleStar(word)">
                {{ isStarredWord(word) ? '已收藏' : '收藏' }}
              </view>
              <view v-if="activeCard !== 'starred'" class="action-btn known-btn" @tap.stop="markWord(word, true)">
                {{ isLearnedWord(word) ? '已掌握' : '认识' }}
              </view>
              <view v-if="activeCard !== 'starred'" class="action-btn again-btn" @tap.stop="markWord(word, false)">
                {{ isLearnedWord(word) ? '再复习' : '不认识' }}
              </view>
            </view>
          </view>
        </view>
        <view v-else class="empty-state">
          <view class="empty-title">{{ activeTitle }}</view>
          <view class="empty-desc">{{ emptyText }}</view>
        </view>
      </main>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { requireLogin } from '@/utils/auth.js'
import {
  loadVocabProgress,
  saveVocabProgress,
  mapWord,
  getVocabStats,
  isLearned,
  isDueReview,
  isStarred,
  markWordProgress,
  toggleWordStar
} from '@/utils/vocab.js'

const vocabPool = ref([])
const progressMap = ref({})
const activeCard = ref('unlearned')
const loading = ref(false)

const stats = computed(() => getVocabStats(vocabPool.value, progressMap.value))
const vocabTotal = computed(() => stats.value.total)

const activeWords = computed(() => {
  const p = progressMap.value
  if (activeCard.value === 'review') {
    return vocabPool.value
      .filter(w => isDueReview(p[w.id]))
      .sort((a, b) => ((p[a.id] && p[a.id].reviewAt) || 0) - ((p[b.id] && p[b.id].reviewAt) || 0))
  }
  if (activeCard.value === 'unlearned') {
    return vocabPool.value.filter(w => !isLearned(p[w.id]))
  }
  if (activeCard.value === 'starred') {
    return vocabPool.value.filter(w => isStarred(p[w.id]))
  }
  return []
})

const activeTitle = computed(() => {
  if (activeCard.value === 'review') return '待复习词汇'
  if (activeCard.value === 'unlearned') return '未学习词汇'
  return '收藏词汇'
})

const emptyText = computed(() => {
  if (!vocabPool.value.length) return '资源库中还没有“词汇积累”内容，请在管理端维护后重试'
  if (activeCard.value === 'review') return '当前没有到期待复习的词汇，先学习未学习词汇吧'
  if (activeCard.value === 'unlearned') return '未学习词汇已全部完成'
  return '还没有收藏词汇，点击列表中的收藏即可加入'
})

function switchCard(card) {
  activeCard.value = card
}

function isStarredWord(word) {
  return isStarred(progressMap.value[word.id])
}

function isLearnedWord(word) {
  return isLearned(progressMap.value[word.id])
}

function toggleStar(word) {
  progressMap.value = toggleWordStar(progressMap.value, word)
  saveVocabProgress(progressMap.value)
}

function markWord(word, known) {
  progressMap.value = markWordProgress(progressMap.value, word, known)
  saveVocabProgress(progressMap.value)
  uni.showToast({ title: known ? '已加入复习计划' : '已加入待复习', icon: 'none' })
}

function onWordTap(word) {
  uni.showToast({ title: `${word.en}：${word.cn}`, icon: 'none' })
}

async function loadVocabResources() {
  if (loading.value) return
  loading.value = true
  try {
    const resourcesObj = uniCloud.importObject('resources', { customUI: true })
    const r = (await resourcesObj.listPublic({ type: 'vocabulary' })) || {}
    if (r.errCode === 0) {
      vocabPool.value = (r.list || []).filter(d => d.type === 'vocabulary').map(mapWord)
    }
  } catch (e) {
    uni.showToast({ title: (e && e.errMsg) || '词汇资源加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function goBack() {
  uni.navigateBack({
    fail: () => {
      uni.navigateTo({ url: '/pages/learning-center/legal-english' })
    }
  })
}

onLoad(() => {
  if (!requireLogin()) return
  progressMap.value = loadVocabProgress()
  loadVocabResources()
})
</script>

<style scoped>
.legal-vocab {
  min-height: 100vh;
  background: #F8FAFC;
  color: #0F172A;
  font-family: "Inter", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
}

.page-shell {
  min-height: 100vh;
}

.page-topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 24px;
  background: rgba(255, 255, 255, .94);
  border-bottom: 1px solid #E2E8F0;
  backdrop-filter: blur(8px);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 72px;
  font-size: 14px;
  color: #475569;
  cursor: pointer;
}

.back-arrow {
  width: 18px;
  height: 18px;
  background: #475569;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m12 19-7-7 7-7'/><path d='M19 12H5'/></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m12 19-7-7 7-7'/><path d='M19 12H5'/></svg>") center/contain no-repeat;
}

.page-title {
  font-size: 18px;
  font-weight: 700;
  color: #0F172A;
}

.page-total {
  min-width: 72px;
  text-align: right;
  font-size: 13px;
  color: #64748B;
}

.page-content {
  max-width: 1160px;
  margin: 0 auto;
  padding: 24px;
}

.vocab-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.vocab-card {
  padding: 20px;
  border: 1px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: transform .15s ease, border-color .15s ease, box-shadow .15s ease;
}

.vocab-card:hover {
  transform: translateY(-2px);
}

.vocab-card.review {
  background: #FFFBEB;
  border-color: #FDE68A;
}

.vocab-card.unlearned {
  background: #EFF6FF;
  border-color: #BFDBFE;
}

.vocab-card.starred {
  background: #F0FDFA;
  border-color: #99F6E4;
}

.vocab-card.active {
  box-shadow: 0 12px 32px -12px rgba(15, 23, 42, .18);
}

.vocab-card.active.review {
  border-color: #D97706;
}

.vocab-card.active.unlearned {
  border-color: #2563EB;
}

.vocab-card.active.starred {
  border-color: #0F766E;
}

.card-num {
  font-size: 32px;
  line-height: 1.1;
  font-weight: 800;
}

.review .card-num { color: #D97706; }
.unlearned .card-num { color: #2563EB; }
.starred .card-num { color: #0F766E; }

.card-label {
  margin-top: 12px;
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
}

.card-desc {
  margin-top: 6px;
  font-size: 13px;
  color: #64748B;
}

.list-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 28px 0 12px;
}

.list-title {
  font-size: 18px;
  font-weight: 700;
  color: #0F172A;
}

.list-count {
  font-size: 13px;
  color: #64748B;
}

.word-list {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 6px 20px;
}

.word-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #E2E8F0;
  cursor: pointer;
}

.word-row:last-child {
  border-bottom: none;
}

.word-main {
  min-width: 0;
  flex: 1;
}

.word-en {
  display: block;
  font-size: 17px;
  font-weight: 700;
  color: #0F172A;
}

.word-level {
  display: inline-block;
  margin-top: 6px;
  padding: 2px 8px;
  border-radius: 9999px;
  background: #F1F5F9;
  font-size: 12px;
  color: #64748B;
}

.word-cn {
  display: block;
  margin-top: 8px;
  font-size: 14px;
  line-height: 1.6;
  color: #334155;
}

.word-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: opacity .15s ease, transform .15s ease;
}

.action-btn:hover {
  opacity: .88;
  transform: translateY(-1px);
}

.star-btn {
  color: #0F766E;
  background: #F0FDFA;
  border: 1px solid #99F6E4;
}

.star-btn.active {
  color: #FFFFFF;
  background: #0F766E;
  border-color: #0F766E;
}

.known-btn {
  color: #FFFFFF;
  background: #16A34A;
}

.again-btn {
  color: #DC2626;
  background: #FEE2E2;
  border: 1px solid #FECACA;
}

.empty-state {
  margin-top: 16px;
  padding: 40px 24px;
  border: 1px dashed #CBD5E1;
  border-radius: 12px;
  text-align: center;
}

.empty-title {
  font-size: 16px;
  font-weight: 700;
  color: #334155;
}

.empty-desc {
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.7;
  color: #64748B;
}

@media (max-width: 768px) {
  .page-topbar {
    padding: 0 16px;
  }
  .page-content {
    padding: 16px;
  }
  .vocab-cards {
    grid-template-columns: 1fr;
  }
  .word-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .word-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

@media (max-width: 480px) {
  .page-total {
    min-width: auto;
  }
  .card-num {
    font-size: 28px;
  }
}
</style>
