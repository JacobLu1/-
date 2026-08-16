<template>
  <view class="vocab-language">
    <view class="page-shell">
      <header class="page-topbar">
        <view class="back-btn" @tap="goBack">
          <view class="back-arrow"></view>
          <text>返回</text>
        </view>
        <text class="page-title">词汇积累</text>
        <text class="page-total">选择语言</text>
      </header>

      <main class="page-content">
        <view class="intro">
          <text class="intro-title">按语言分类学习</text>
          <text class="intro-desc">选择一门语言，进入对应的法律词汇积累</text>
        </view>

        <view class="lang-grid">
          <view
            class="lang-card"
            :class="lang.colorClass"
            v-for="lang in langCards"
            :key="lang.name"
            @tap="goToLang(lang.name)"
          >
            <view class="lang-card-top">
              <view class="lang-code">{{ lang.code }}</view>
              <view class="lang-count">{{ lang.count }} 词</view>
            </view>
            <text class="lang-name">{{ lang.name }}</text>
            <text class="lang-desc">{{ lang.desc }}</text>
            <view class="lang-go">进入词汇</view>
          </view>
        </view>

        <view v-if="loading" class="loading-state">正在统计各语言词汇...</view>
      </main>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { requireLogin } from '@/utils/auth.js'
import { normalizeLang } from '@/utils/vocab.js'

const LANGUAGES = [
  { name: '英语', code: 'EN', desc: '涉外法律英语基础词汇', colorClass: 'lang-en' },
  { name: '德语', code: 'DE', desc: '德国法常用法律表达', colorClass: 'lang-de' },
  { name: '法语', code: 'FR', desc: '法国法与欧盟法术语', colorClass: 'lang-fr' },
  { name: '拉丁语', code: 'LA', desc: '拉丁法律格言与术语', colorClass: 'lang-la' },
  { name: '西班牙语', code: 'ES', desc: '西班牙语法律词汇', colorClass: 'lang-es' }
]

const vocabPool = ref([])
const loading = ref(false)

const langCards = computed(() => LANGUAGES.map(lang => ({
  ...lang,
  count: vocabPool.value.filter(doc => normalizeLang(doc.lang) === lang.name).length
})))

async function loadVocabResources() {
  if (loading.value) return
  loading.value = true
  try {
    const resourcesObj = uniCloud.importObject('resources', { customUI: true })
    const r = (await resourcesObj.listPublic({ type: 'vocabulary' })) || {}
    if (r.errCode === 0) {
      vocabPool.value = (r.list || []).filter(d => d.type === 'vocabulary')
    }
  } catch (e) {
    uni.showToast({ title: (e && e.errMsg) || '词汇资源加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function goToLang(lang) {
  uni.navigateTo({
    url: `/pages/learning-center/legal-vocab?lang=${encodeURIComponent(lang)}`
  })
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
  loadVocabResources()
})
</script>

<style scoped>
.vocab-language {
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

.intro {
  padding: 24px;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  background: #FFFFFF;
}

.intro-title {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #0F172A;
}

.intro-desc {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  color: #64748B;
}

.lang-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.lang-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 20px;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  background: #FFFFFF;
  cursor: pointer;
  transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
}

.lang-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 30px -16px rgba(15, 23, 42, .22);
}

.lang-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.lang-code {
  height: 32px;
  padding: 0 10px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  font-weight: 800;
}

.lang-count {
  font-size: 12px;
  font-weight: 600;
  color: #64748B;
  white-space: nowrap;
}

.lang-name {
  margin-top: 20px;
  font-size: 22px;
  font-weight: 800;
  color: #0F172A;
}

.lang-desc {
  display: block;
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.6;
  color: #64748B;
  min-height: 42px;
}

.lang-go {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #E2E8F0;
  font-size: 13px;
  font-weight: 600;
  color: #2563EB;
}

.lang-en .lang-code {
  background: #DBEAFE;
  color: #1D4ED8;
}

.lang-en:hover {
  border-color: #93C5FD;
}

.lang-de .lang-code {
  background: #FEF3C7;
  color: #B45309;
}

.lang-de:hover {
  border-color: #FCD34D;
}

.lang-fr .lang-code {
  background: #FCE7F3;
  color: #BE185D;
}

.lang-fr:hover {
  border-color: #F9A8D4;
}

.lang-la .lang-code {
  background: #EDE9FE;
  color: #6D28D9;
}

.lang-la:hover {
  border-color: #C4B5FD;
}

.lang-es .lang-code {
  background: #DCFCE7;
  color: #15803D;
}

.lang-es:hover {
  border-color: #86EFAC;
}

.loading-state {
  margin-top: 16px;
  padding: 24px;
  border: 1px dashed #CBD5E1;
  border-radius: 12px;
  text-align: center;
  font-size: 13px;
  color: #64748B;
}

@media (max-width: 1024px) {
  .lang-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .page-topbar {
    padding: 0 16px;
  }
  .page-content {
    padding: 16px;
  }
  .lang-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .page-total {
    min-width: auto;
  }
  .lang-grid {
    grid-template-columns: 1fr;
  }
  .lang-desc {
    min-height: 0;
  }
}
</style>
