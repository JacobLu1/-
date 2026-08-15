<template>
  <view class="reading-page">
    <header class="page-topbar">
      <view class="back-btn" @tap="goBack">
        <view class="back-arrow"></view>
        <text>返回</text>
      </view>
      <text class="page-title">文本阅读</text>
      <text class="page-total">共 {{ readings.length }} 篇</text>
    </header>

    <main class="page-content">
      <view v-if="loading" class="empty-state">正在加载阅读资源...</view>
      <view v-else-if="!readings.length" class="empty-state">
        <view class="empty-title">暂无文本阅读资源</view>
        <view class="empty-desc">请在管理端录入 `reading` 类型资源并上线</view>
      </view>
      <view v-else class="reading-list">
        <view
          class="reading-card"
          v-for="item in readings"
          :key="item.id"
          @tap="toggleDetail(item.id)"
        >
          <view class="reading-head">
            <view class="reading-title">{{ item.title }}</view>
            <view class="reading-meta">{{ item.category || '未分类' }} · {{ item.meta || '未设置难度' }}</view>
          </view>
          <view v-if="item.description" class="reading-summary">{{ item.description }}</view>

          <view v-if="expandedId === item.id" class="reading-body">
            <view class="reading-content" v-if="item.content">{{ item.content }}</view>
            <view class="reading-content" v-else>暂无正文，请打开原文链接。</view>
            <view v-if="item.fileUrl" class="reading-link" @tap.stop="openOriginal(item.fileUrl)">打开原文</view>
          </view>
        </view>
      </view>
    </main>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { requireLogin } from '@/utils/auth.js'

const readings = ref([])
const loading = ref(false)
const expandedId = ref('')

async function loadReadings() {
  if (loading.value) return
  loading.value = true
  try {
    const resourcesObj = uniCloud.importObject('resources', { customUI: true })
    const r = (await resourcesObj.listPublic({ type: 'reading' })) || {}
    if (r.errCode === 0) {
      readings.value = (r.list || []).map(doc => ({
        id: doc._id,
        title: doc.title || '',
        category: doc.cat || '',
        meta: doc.meta || '',
        description: doc.description || '',
        content: doc.content || '',
        fileUrl: doc.fileUrl || ''
      }))
    }
  } catch (e) {
    uni.showToast({ title: (e && e.errMsg) || '阅读资源加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function toggleDetail(id) {
  expandedId.value = expandedId.value === id ? '' : id
}

function openOriginal(url) {
  if (!url) {
    uni.showToast({ title: '暂无原文链接', icon: 'none' })
    return
  }
  window.open(url, '_blank')
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
  loadReadings()
})
</script>

<style scoped>
.reading-page {
  min-height: 100vh;
  background: #F8FAFC;
  color: #0F172A;
  font-family: "Inter", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
}

.page-topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 28px;
  background: rgba(255,255,255,.92);
  border-bottom: 1px solid #E2E8F0;
  backdrop-filter: blur(12px);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #2563EB;
  cursor: pointer;
}

.back-arrow {
  width: 14px;
  height: 14px;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'><path d='m15 18-6-6 6-6'/></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'><path d='m15 18-6-6 6-6'/></svg>") center/contain no-repeat;
}

.page-title {
  flex: 1;
  font-size: 17px;
  font-weight: 700;
}

.page-total {
  font-size: 13px;
  color: #64748B;
}

.page-content {
  max-width: 960px;
  margin: 0 auto;
  padding: 28px;
}

.reading-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reading-card {
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  padding: 22px;
  cursor: pointer;
  box-shadow: 0 10px 28px -18px rgba(15,23,42,.16);
  transition: border-color .2s ease, box-shadow .2s ease;
}

.reading-card:hover {
  border-color: #BFDBFE;
  box-shadow: 0 16px 34px -20px rgba(37,99,235,.32);
}

.reading-title {
  font-size: 17px;
  font-weight: 700;
  line-height: 1.45;
}

.reading-meta {
  margin-top: 8px;
  font-size: 12px;
  color: #64748B;
}

.reading-summary {
  margin-top: 12px;
  font-size: 14px;
  line-height: 1.7;
  color: #475569;
}

.reading-body {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #E2E8F0;
}

.reading-content {
  font-size: 14px;
  line-height: 1.9;
  color: #0F172A;
  white-space: pre-wrap;
  word-break: break-word;
}

.reading-link {
  display: inline-flex;
  margin-top: 16px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #2563EB;
  background: #EFF6FF;
  border: 1px solid #BFDBFE;
  border-radius: 9999px;
}

.empty-state {
  padding: 80px 20px;
  text-align: center;
  font-size: 14px;
  color: #64748B;
}

.empty-title {
  font-size: 17px;
  font-weight: 700;
  color: #0F172A;
}

.empty-desc {
  margin-top: 8px;
  font-size: 13px;
}

@media (max-width: 768px) {
  .page-topbar { padding: 0 18px; }
  .page-content { padding: 18px; }
  .reading-card { padding: 18px; }
}
</style>
