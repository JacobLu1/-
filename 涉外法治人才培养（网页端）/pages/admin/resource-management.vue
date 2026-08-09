<template>
  <view class="app-shell">
    <!-- ===== Left Sidebar ===== -->
    <aside class="app-sidebar">
      <view class="app-sidebar-logo">
        <view class="app-sidebar-logo-icon">
          <view class="ls-svg-glyph" aria-hidden="true"></view>
        </view>
        <view class="app-sidebar-logo-text">
          <text>涉外法治人才培养平台</text>
          <text>管理端</text>
        </view>
      </view>

      <nav class="app-sidebar-nav">
        <view class="app-nav-item" @tap="navigateTo('/pages/admin/dashboard')">
          <view class="navi-icon navi-icon-dashboard"></view>
          <text>数据总览</text>
        </view>
        <view class="app-nav-item" @tap="navigateTo('/pages/admin/question-bank')">
          <view class="navi-icon navi-icon-file-question"></view>
          <text>题库管理</text>
        </view>
        <view class="app-nav-item" @tap="navigateTo('/pages/admin/knowledge-management')">
          <view class="navi-icon navi-icon-book"></view>
          <text>知识库管理</text>
        </view>
        <view class="app-nav-item" @tap="navigateTo('/pages/admin/user-management')">
          <view class="navi-icon navi-icon-users"></view>
          <text>用户管理</text>
        </view>
        <view class="app-nav-item is-active" @tap="navigateTo('/pages/admin/resource-management')">
          <view class="navi-icon navi-icon-folder"></view>
          <text>资源管理</text>
        </view>
        <view class="app-nav-divider"></view>
        <view class="app-nav-item" @tap="handleLogout">
          <view class="navi-icon navi-icon-logout"></view>
          <text>退出登录</text>
        </view>
      </nav>

      <view class="app-sidebar-user">
        <view class="app-sidebar-user-inner">
          <view class="app-sidebar-user-avatar">管</view>
          <view style="min-width:0;flex:1">
            <text class="app-sidebar-user-name">管理员</text>
            <text class="app-sidebar-user-role">系统管理员</text>
          </view>
        </view>
      </view>
    </aside>

    <!-- ===== Main Content Area ===== -->
    <view class="app-main">
      <header class="app-topbar">
        <view class="app-topbar-titles">
          <text class="app-topbar-title">资源管理</text>
          <text class="app-topbar-breadcrumb">管理端 / 资源</text>
        </view>
        <text class="app-topbar-meta">{{ todayDateText }}</text>
      </header>
      <main class="app-content">

        <!-- ===== Section 1: 资源概览统计 ===== -->
        <section class="dc-section" :class="{ 'is-visible': visibleSections[0] }" aria-label="资源概览统计">
          <view class="qb-section-header">
            <view class="qb-section-title-wrap">
              <view class="qb-section-bar"></view>
              <view>
                <text class="qb-section-title">资源概览</text>
                <text class="qb-section-subtitle">学习中心资源整体情况</text>
              </view>
            </view>
          </view>
          <view class="qb-kpi-grid">
            <view class="qb-kpi-card">
              <view class="qb-kpi-card-head">
                <text class="qb-kpi-card-label">资源总数</text>
                <view class="qb-kpi-card-icon"><view class="navi-icon navi-icon-folder"></view></view>
              </view>
              <text class="qb-kpi-card-value">{{ kpiTotal }}</text>
              <view class="qb-kpi-card-foot">
                <view class="navi-icon navi-icon-trending-up-sm"></view>
                <text>resource 集合实时统计</text>
              </view>
            </view>
            <view class="qb-kpi-card qb-accent-success">
              <view class="qb-kpi-card-head">
                <text class="qb-kpi-card-label">视频资源</text>
                <view class="qb-kpi-card-icon"><view class="navi-icon navi-icon-video"></view></view>
              </view>
              <text class="qb-kpi-card-value">{{ kpiVideo }}</text>
              <view class="qb-kpi-card-foot">
                <view class="navi-icon navi-icon-trending-up-sm"></view>
                <text>type = video</text>
              </view>
            </view>
            <view class="qb-kpi-card qb-accent-warning">
              <view class="qb-kpi-card-head">
                <text class="qb-kpi-card-label">法律英语资源</text>
                <view class="qb-kpi-card-icon"><view class="navi-icon navi-icon-book-open"></view></view>
              </view>
              <text class="qb-kpi-card-value">{{ kpiEnglish }}</text>
              <view class="qb-kpi-card-foot">
                <view class="navi-icon navi-icon-trending-up-sm"></view>
                <text>type = english</text>
              </view>
            </view>
            <view class="qb-kpi-card">
              <view class="qb-kpi-card-head">
                <text class="qb-kpi-card-label">文档资料</text>
                <view class="qb-kpi-card-icon"><view class="navi-icon navi-icon-file-text"></view></view>
              </view>
              <text class="qb-kpi-card-value">{{ kpiDoc }}</text>
              <view class="qb-kpi-card-foot">
                <view class="navi-icon navi-icon-trending-up-sm"></view>
                <text>当前未启用</text>
              </view>
            </view>
          </view>
        </section>

        <!-- ===== Section 2: 资源上传 ===== -->
        <section class="dc-section" :class="{ 'is-visible': visibleSections[1] }" aria-label="资源上传">
          <view class="qb-section-header">
            <view class="qb-section-title-wrap">
              <view class="qb-section-bar"></view>
              <view>
                <text class="qb-section-title">录入学习资源</text>
                <text class="qb-section-subtitle">支持视频、法律英语等学习资源，参考学习中心内容</text>
              </view>
            </view>
          </view>
          <view class="rm-upload-card">
            <view class="rm-upload-row">
              <view class="rm-form-field">
                <text class="rm-form-label">资源类型</text>
                <view class="qb-pills">
                  <view class="qb-pill" :class="{ 'is-active': uploadType === 'video' }" @tap="uploadType = 'video'">视频资源</view>
                  <view class="qb-pill" :class="{ 'is-active': uploadType === 'english' }" @tap="uploadType = 'english'">法律英语</view>
                </view>
              </view>
              <view class="rm-form-field rm-form-field-grow">
                <text class="rm-form-label">资源标题</text>
                <input class="rm-input" v-model="uploadTitle" placeholder="请输入资源标题，如：国际商事仲裁实务精讲" />
              </view>
              <view class="rm-form-field">
                <text class="rm-form-label">时长 / 大小</text>
                <input class="rm-input rm-input-sm" v-model="uploadMeta" placeholder="如 45:30 或 2.4MB" />
              </view>
            </view>

            <view class="rm-upload-row">
              <view class="rm-form-field rm-form-field-grow">
                <text class="rm-form-label">资源地址 / 文件名</text>
                <input class="rm-input" v-model="uploadUrl" placeholder="完整 URL 或文件名，如 video_intl_arbitration_0.mp4" />
              </view>
              <view class="rm-form-field">
                <text class="rm-form-label">封面 URL</text>
                <input class="rm-input" v-model="uploadCover" placeholder="可留空" />
              </view>
            </view>
            <view class="rm-upload-row">
              <view class="rm-form-field rm-form-field-grow">
                <text class="rm-form-label">资源简介</text>
                <input class="rm-input" v-model="uploadDescription" placeholder="可选，用于学习中心展示" />
              </view>
            </view>

            <view class="rm-dropzone">
              <view class="navi-icon navi-icon-link rm-dropzone-icon"></view>
              <text class="rm-dropzone-title">资源地址字段</text>
              <text class="rm-dropzone-sub">填写完整 URL（如云存储地址）或文件名；文件名会按 video-config 基址拼接</text>
            </view>

            <view class="rm-upload-foot">
              <text class="rm-upload-tip">保存后将进入审核，通过后在学习中心展示</text>
              <view class="qb-create-btn" @tap="doUpload">
                <view class="navi-icon navi-icon-upload-cloud"></view>
                <text>保存资源</text>
              </view>
            </view>
          </view>
        </section>

        <!-- ===== Section 3: 视频资源管理 ===== -->
        <section class="dc-section" :class="{ 'is-visible': visibleSections[2] }" aria-label="视频资源管理">
          <view class="qb-section-header">
            <view class="qb-section-title-wrap">
              <view class="qb-section-bar"></view>
              <view>
                <text class="qb-section-title">视频资源管理</text>
                <text class="qb-section-subtitle">共 {{ videos.length }} 个视频资源</text>
              </view>
            </view>
          </view>
          <view class="qb-toolbar">
            <view class="qb-toolbar-row">
              <view class="qb-search">
                <view class="navi-icon navi-icon-search qb-search-icon"></view>
                <input class="qb-search-input" v-model="videoSearch" placeholder="搜索视频资源标题" />
              </view>
              <view class="qb-filter-group">
                <text class="qb-filter-label">分类</text>
                <view class="qb-pills">
                  <view class="qb-pill" :class="{ 'is-active': videoFilter === 'all' }" @tap="videoFilter = 'all'">全部</view>
                  <view class="qb-pill" :class="{ 'is-active': videoFilter === '国际仲裁' }" @tap="videoFilter = '国际仲裁'">国际仲裁</view>
                  <view class="qb-pill" :class="{ 'is-active': videoFilter === 'WTO法' }" @tap="videoFilter = 'WTO法'">WTO法</view>
                  <view class="qb-pill" :class="{ 'is-active': videoFilter === '跨境投资' }" @tap="videoFilter = '跨境投资'">跨境投资</view>
                  <view class="qb-pill" :class="{ 'is-active': videoFilter === '海商法' }" @tap="videoFilter = '海商法'">海商法</view>
                </view>
              </view>
            </view>
          </view>
          <view class="qb-table-card">
            <view class="qb-table-container">
              <table class="qb-table">
                <thead>
                  <tr>
                    <th scope="col">编号</th>
                    <th scope="col">资源标题</th>
                    <th scope="col">分类</th>
                    <th scope="col">时长</th>
                    <th scope="col">上传时间</th>
                    <th scope="col">状态</th>
                    <th scope="col">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="v in filteredVideos" :key="v.id">
                    <td><text class="qb-qid">{{ v.id }}</text></td>
                    <td class="qb-qcontent"><text class="qb-qcontent-text">{{ v.title }}</text></td>
                    <td><text class="qb-type-tag" :class="v.tagClass">{{ v.category }}</text></td>
                    <td><text class="qb-date">{{ v.duration }}</text></td>
                    <td><text class="qb-date">{{ v.date }}</text></td>
                    <td><text class="qb-diff-tag" :class="v.statusClass">{{ v.status }}</text></td>
                    <td>
                      <view class="qb-actions">
                        <view class="qb-action-btn qb-action-edit" @tap="handleEdit(v)">
                          <view class="navi-icon navi-icon-pencil"></view>
                          <text>编辑</text>
                        </view>
                        <view class="qb-action-btn qb-action-del" @tap="handleDelete('video', v)">
                          <view class="navi-icon navi-icon-trash-2"></view>
                          <text>删除</text>
                        </view>
                      </view>
                    </td>
                  </tr>
                </tbody>
              </table>
            </view>
          </view>
        </section>

        <!-- ===== Section 4: 法律英语资源管理 ===== -->
        <section class="dc-section" :class="{ 'is-visible': visibleSections[3] }" aria-label="法律英语资源管理">
          <view class="qb-section-header">
            <view class="qb-section-title-wrap">
              <view class="qb-section-bar"></view>
              <view>
                <text class="qb-section-title">法律英语资源管理</text>
                <text class="qb-section-subtitle">共 {{ englishResources.length }} 个法律英语资源</text>
              </view>
            </view>
          </view>
          <view class="qb-toolbar">
            <view class="qb-toolbar-row">
              <view class="qb-filter-group">
                <text class="qb-filter-label">类型</text>
                <view class="qb-pills">
                  <view class="qb-pill" :class="{ 'is-active': englishFilter === 'all' }" @tap="englishFilter = 'all'">全部</view>
                  <view class="qb-pill" :class="{ 'is-active': englishFilter === '词汇积累' }" @tap="englishFilter = '词汇积累'">词汇积累</view>
                  <view class="qb-pill" :class="{ 'is-active': englishFilter === '术语精讲' }" @tap="englishFilter = '术语精讲'">术语精讲</view>
                  <view class="qb-pill" :class="{ 'is-active': englishFilter === '听力训练' }" @tap="englishFilter = '听力训练'">听力训练</view>
                  <view class="qb-pill" :class="{ 'is-active': englishFilter === '实战练习' }" @tap="englishFilter = '实战练习'">实战练习</view>
                </view>
              </view>
            </view>
          </view>
          <view class="qb-table-card">
            <view class="qb-table-container">
              <table class="qb-table">
                <thead>
                  <tr>
                    <th scope="col">编号</th>
                    <th scope="col">资源标题</th>
                    <th scope="col">类型</th>
                    <th scope="col">难度</th>
                    <th scope="col">上传时间</th>
                    <th scope="col">状态</th>
                    <th scope="col">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="e in filteredEnglish" :key="e.id">
                    <td><text class="qb-qid">{{ e.id }}</text></td>
                    <td class="qb-qcontent"><text class="qb-qcontent-text">{{ e.title }}</text></td>
                    <td><text class="qb-type-tag" :class="e.typeClass">{{ e.type }}</text></td>
                    <td><text class="qb-diff-tag" :class="e.diffClass">{{ e.diffLabel }}</text></td>
                    <td><text class="qb-date">{{ e.date }}</text></td>
                    <td><text class="qb-diff-tag" :class="e.statusClass">{{ e.status }}</text></td>
                    <td>
                      <view class="qb-actions">
                        <view class="qb-action-btn qb-action-edit" @tap="handleEdit(e)">
                          <view class="navi-icon navi-icon-pencil"></view>
                          <text>编辑</text>
                        </view>
                        <view class="qb-action-btn qb-action-del" @tap="handleDelete('english', e)">
                          <view class="navi-icon navi-icon-trash-2"></view>
                          <text>删除</text>
                        </view>
                      </view>
                    </td>
                  </tr>
                </tbody>
              </table>
            </view>
          </view>
        </section>

      </main>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { requireAdmin } from '@/utils/auth.js'

const visibleSections = ref([false, false, false, false])
const todayDateText = computed(() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}年${m}月${d}日`
})

/* ===== 上传表单 ===== */
const uploadType = ref('video')
const uploadTitle = ref('')
const uploadMeta = ref('')
const uploadUrl = ref('')
const uploadCover = ref('')
const uploadDescription = ref('')

/* ===== 视频资源 ===== */
const videoSearch = ref('')
const videoFilter = ref('all')
const videos = ref([])

const filteredVideos = computed(() => {
  const q = videoSearch.value.trim().toLowerCase()
  return videos.value.filter(v => {
    const matchCategory = videoFilter.value === 'all' || v.category === videoFilter.value
    const matchQuery = !q || v.title.toLowerCase().includes(q) || v.id.toLowerCase().includes(q)
    return matchCategory && matchQuery
  })
})

/* ===== 法律英语资源 ===== */
const englishFilter = ref('all')
const englishResources = ref([])

const filteredEnglish = computed(() => {
  if (englishFilter.value === 'all') return englishResources.value
  return englishResources.value.filter(e => e.type === englishFilter.value)
})

/* ===== 资源概览 KPI ===== */
const kpiTotal = computed(() => videos.value.length + englishResources.value.length)
const kpiVideo = computed(() => videos.value.length)
const kpiEnglish = computed(() => englishResources.value.length)
const kpiDoc = computed(() => 0)

/* ===== 云端数据 ===== */
function getAdminToken() {
  return uni.getStorageSync('adminToken')
}

// 云文档 → 页面表格行
function toVideoItem(doc) {
  return { id: doc._id, title: doc.title, category: doc.cat, tagClass: doc.tagClass, duration: doc.meta, date: doc.date, status: doc.status, statusClass: doc.statusClass, fileUrl: doc.fileUrl || '', cover: doc.cover || '', description: doc.description || '' }
}
function toEnglishItem(doc) {
  return { id: doc._id, title: doc.title, type: doc.cat, typeClass: doc.tagClass, diffLabel: doc.meta, diffClass: doc.diffClass, date: doc.date, status: doc.status, statusClass: doc.statusClass, fileUrl: doc.fileUrl || '', cover: doc.cover || '', description: doc.description || '' }
}

async function loadAll() {
  try {
    const resourcesObj = uniCloud.importObject('resources', { customUI: true })
    const r = (await resourcesObj.list({ adminToken: getAdminToken(), type: 'all' })) || {}
    if (r.errCode === 0) {
      videos.value = (r.list || []).filter(d => d.type === 'video').map(toVideoItem)
      englishResources.value = (r.list || []).filter(d => d.type === 'english').map(toEnglishItem)
    }
  } catch (e) {
    uni.showToast({ title: (e && e.errMsg) || '资源加载失败', icon: 'none' })
  }
}

/* ===== 方法 ===== */
const navigateTo = (url) => {
  uni.navigateTo({ url })
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

let payload = {}

const doUpload = async () => {
  const title = uploadTitle.value.trim()
  if (!title) {
    uni.showToast({ title: '请输入资源标题', icon: 'none' })
    return
  }
  const now = new Date()
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const meta = uploadMeta.value.trim()

  if (uploadType.value === 'video') {
    payload = {
      title,
      cat: '待分类',
      tagClass: 'qb-type-case',
      meta: meta || '--:--',
      diffClass: '',
      fileUrl: uploadUrl.value.trim(),
      cover: uploadCover.value.trim(),
      description: uploadDescription.value.trim(),
      status: '审核中',
      statusClass: 'qb-diff-mid'
    }
  } else if (uploadType.value === 'english') {
    payload = {
      title,
      cat: '待分类',
      tagClass: 'qb-type-case',
      meta: '待定',
      diffClass: 'qb-diff-mid',
      fileUrl: uploadUrl.value.trim(),
      cover: uploadCover.value.trim(),
      description: uploadDescription.value.trim(),
      status: '审核中',
      statusClass: 'qb-diff-mid'
    }
  } else {
    uni.showToast({ title: '文档资料上传功能建设中', icon: 'none' })
    return
  }

  let r
  try {
    const resourcesObj = uniCloud.importObject('resources', { customUI: true })
    r = (await resourcesObj.add({ adminToken: getAdminToken(), type: uploadType.value, data: { ...payload, date } })) || {}
  } catch (e) {
    uni.showToast({ title: (e && e.errMsg) || '上传失败', icon: 'none' })
    return
  }
  if (r.errCode !== 0) {
    uni.showToast({ title: r.errMsg || '上传失败', icon: 'none' })
    return
  }

  // 本地即时插入（保持原体验），成功后重新拉取云端保持一致
  if (uploadType.value === 'video') {
    videos.value.unshift({ id: r.id, title, category: '待分类', tagClass: 'qb-type-case', duration: meta || '--:--', date, status: '审核中', statusClass: 'qb-diff-mid', fileUrl: uploadUrl.value.trim(), cover: uploadCover.value.trim(), description: uploadDescription.value.trim() })
  } else {
    englishResources.value.unshift({ id: r.id, title, type: '待分类', typeClass: 'qb-type-case', diffLabel: '待定', diffClass: 'qb-diff-mid', date, status: '审核中', statusClass: 'qb-diff-mid', fileUrl: uploadUrl.value.trim(), cover: uploadCover.value.trim(), description: uploadDescription.value.trim() })
  }

  uploadTitle.value = ''
  uploadMeta.value = ''
  uploadUrl.value = ''
  uploadCover.value = ''
  uploadDescription.value = ''
  uni.showToast({ title: '保存成功，等待审核', icon: 'success' })
}

const handleEdit = (item) => {
  uni.showModal({
    title: '编辑资源',
    editable: true,
    content: item.title,
    placeholderText: '请输入标题',
    success: (r1) => {
      if (!r1.confirm) return
      const title = (r1.content || '').trim()
      uni.showModal({
        title: '编辑分类',
        editable: true,
        content: item.category || item.type || '',
        placeholderText: '请输入分类',
        success: (r2) => {
          if (!r2.confirm) return
          const cat = (r2.content || '').trim()
          uni.showModal({
            title: '编辑资源地址',
            editable: true,
            content: item.fileUrl || '',
            placeholderText: '完整 URL 或文件名',
            success: (rUrl) => {
              if (!rUrl.confirm) return
              const fileUrl = (rUrl.content || '').trim()
              uni.showModal({
                title: '编辑资源简介',
                editable: true,
                content: item.description || '',
                placeholderText: '请输入简介',
                success: (rDesc) => {
                  if (!rDesc.confirm) return
                  const description = (rDesc.content || '').trim()
                  uni.showModal({
                    title: '编辑资源',
                    content: `当前状态：${item.status}。是否切换为「${item.status === '已上线' ? '审核中' : '已上线'}」？`,
                    confirmText: '切换状态',
                    cancelText: '仅保存信息',
                    success: async (r3) => {
                      const data = { title, cat, fileUrl, description, status: item.status, statusClass: item.statusClass }
                      if (r3.confirm) {
                        data.status = item.status === '已上线' ? '审核中' : '已上线'
                        data.statusClass = data.status === '已上线' ? 'qb-diff-easy' : 'qb-diff-mid'
                      }
                      try {
    const resourcesObj = uniCloud.importObject('resources', { customUI: true })
                        const r = (await resourcesObj.update({ adminToken: getAdminToken(), id: item.id, data })) || {}
                        if (r.errCode === 0) {
                          item.title = title
                          item.fileUrl = fileUrl
                          item.description = description
                          item.status = data.status
                          item.statusClass = data.statusClass
                          if (item.category !== undefined) item.category = cat
                          else item.type = cat
                          uni.showToast({ title: '已保存', icon: 'success' })
                        } else {
                          uni.showToast({ title: r.errMsg || '保存失败', icon: 'none' })
                        }
                      } catch (e) {
                        uni.showToast({ title: (e && e.errMsg) || '保存失败', icon: 'none' })
                      }
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  })
}

const handleDelete = (type, item) => {
  uni.showModal({
    title: '确认删除',
    content: `确定要删除资源「${item.title}」吗？`,
    confirmColor: '#DC2626',
    success: async (res) => {
      if (!res.confirm) return
      try {
    const resourcesObj = uniCloud.importObject('resources', { customUI: true })
        const r = (await resourcesObj.remove({ adminToken: getAdminToken(), id: item.id })) || {}
        if (r.errCode === 0) {
          if (type === 'video') {
            videos.value = videos.value.filter(v => v.id !== item.id)
          } else {
            englishResources.value = englishResources.value.filter(e => e.id !== item.id)
          }
          uni.showToast({ title: '已删除', icon: 'success' })
        } else {
          uni.showToast({ title: r.errMsg || '删除失败', icon: 'none' })
        }
      } catch (e) {
        uni.showToast({ title: (e && e.errMsg) || '删除失败', icon: 'none' })
      }
    }
  })
}

onMounted(() => {
  if (!requireAdmin()) return
  loadAll()
  setTimeout(() => {
    visibleSections.value = [true, true, true, true]
  }, 100)
})
</script>

<style scoped>
/* ============================================
   Brand CSS Variables
   ============================================ */
.app-shell {
  --rule-primary: #2563EB;
  --rule-primary-hover: #1D4ED8;
  --rule-primary-active: #1E40AF;
  --rule-primary-foreground: #FFFFFF;
  --rule-primary-tint-1: #DBEAFE;
  --rule-primary-tint-2: #BFDBFE;
  --rule-primary-tint-3: #EFF6FF;
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
  --rule-ink: #0F172A;
  --rule-ink-2: #475569;
  --rule-ink-3: #94A3B8;
  --rule-line: #E2E8F0;
  --rule-surface: #FFFFFF;
  --rule-surface-2: #F8FAFC;
  --rule-shadow-1: 0 1px 2px rgba(15,23,42,.04), 0 1px 1px rgba(15,23,42,.02);
  --rule-shadow-2: 0 8px 24px -8px rgba(15,23,42,.12);
  --rule-shadow-3: 0 24px 60px -20px rgba(15,23,42,.20);
  --rule-font-mono: "JetBrains Mono", "SF Mono", "Consolas", monospace;
  display: flex;
  min-height: 100vh;
  background: var(--rule-background);
  color: var(--rule-foreground);
  font-family: "Inter", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

:root { --qb-ease: cubic-bezier(.2,.8,.2,1); }

/* ===== Sidebar ===== */
.app-sidebar {
  position: fixed; left: 0; top: 0; height: 100vh; width: 240px;
  display: flex; flex-direction: column;
  background: var(--rule-card); border-right: 1px solid var(--rule-border);
  z-index: 40; flex-shrink: 0;
}
.app-sidebar-logo {
  display: flex; align-items: center; gap: 10px;
  padding: 20px 24px; border-bottom: 1px solid var(--rule-border);
  color: inherit;
}
.app-sidebar-logo-icon {
  width: 36px; height: 36px; border-radius: 8px;
  background: linear-gradient(135deg, var(--rule-primary), var(--rule-primary-active));
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; overflow: hidden;
  box-shadow: 0 4px 10px -2px color-mix(in srgb, var(--rule-primary) 40%, transparent);
}
.ls-svg-glyph {
  width: 20px; height: 20px; background: #fff;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M7 21h10'/><path d='M12 3v18'/><path d='M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M7 21h10'/><path d='M12 3v18'/><path d='M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2'/></svg>") center/contain no-repeat;
}
.app-sidebar-logo-text {
  display: flex; flex-direction: column; line-height: 1.4;
}
.app-sidebar-logo-text text:first-child {
  font-size: 15px; font-weight: 600; color: var(--rule-foreground);
  white-space: nowrap;
}
.app-sidebar-logo-text text:last-child {
  font-size: 12px; font-weight: 500; color: var(--rule-ink-3);
}
.app-sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; }
.app-nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px; border-radius: 8px;
  font-size: 14px; font-weight: 500; color: var(--rule-ink-2);
  cursor: pointer; transition: background 0.2s ease, color 0.2s ease;
}
.app-nav-item:hover { background: var(--rule-muted); color: var(--rule-foreground); }
.app-nav-item.is-active { background: linear-gradient(135deg, var(--rule-primary), var(--rule-primary-active)); color: #fff; box-shadow: 0 6px 14px -4px color-mix(in srgb, var(--rule-primary) 45%, transparent); }
.app-nav-item.is-active:hover { background: var(--rule-primary-hover); color: #fff; }
.app-nav-item.is-active .navi-icon { background: #fff; }
.app-nav-divider { height: 1px; background: var(--rule-border); margin: 8px 4px; }

.navi-icon { width: 20px; height: 20px; flex-shrink: 0; background: currentColor; display: inline-block; }

.navi-icon-dashboard {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><rect width='7' height='9' x='3' y='3' rx='1'/><rect width='7' height='5' x='14' y='3' rx='1'/><rect width='7' height='9' x='14' y='12' rx='1'/><rect width='7' height='5' x='3' y='16' rx='1'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><rect width='7' height='9' x='3' y='3' rx='1'/><rect width='7' height='5' x='14' y='3' rx='1'/><rect width='7' height='9' x='14' y='12' rx='1'/><rect width='7' height='5' x='3' y='16' rx='1'/></svg>") center/contain no-repeat;
}
.navi-icon-file-question {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'/><polyline points='14 2 14 8 20 8'/><path d='M9 12.01h6'/><path d='M9 16.01h3'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'/><polyline points='14 2 14 8 20 8'/><path d='M9 12.01h6'/><path d='M9 16.01h3'/></svg>") center/contain no-repeat;
}
.navi-icon-book {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>") center/contain no-repeat;
}
.navi-icon-users {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M22 21v-2a4 4 0 0 0-3-3.87'/><path d='M16 3.13a4 4 0 0 1 0 7.75'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M22 21v-2a4 4 0 0 0-3-3.87'/><path d='M16 3.13a4 4 0 0 1 0 7.75'/></svg>") center/contain no-repeat;
}
.navi-icon-folder {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'/></svg>") center/contain no-repeat;
}
.navi-icon-logout {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>") center/contain no-repeat;
}
.navi-icon-video {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><rect width='18' height='18' x='3' y='3' rx='2'/><path d='M7 3v18'/><path d='M17 3v18'/><path d='M3 7.5h4'/><path d='M3 12h18'/><path d='M3 16.5h4'/><path d='M17 7.5h4'/><path d='M17 16.5h4'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><rect width='18' height='18' x='3' y='3' rx='2'/><path d='M7 3v18'/><path d='M17 3v18'/><path d='M3 7.5h4'/><path d='M3 12h18'/><path d='M3 16.5h4'/><path d='M17 7.5h4'/><path d='M17 16.5h4'/></svg>") center/contain no-repeat;
}
.navi-icon-book-open {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>") center/contain no-repeat;
}
.navi-icon-file-text {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'/><polyline points='14 2 14 8 20 8'/><line x1='16' y1='13' x2='8' y2='13'/><line x1='16' y1='17' x2='8' y2='17'/><line x1='10' y1='9' x2='8' y2='9'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'/><polyline points='14 2 14 8 20 8'/><line x1='16' y1='13' x2='8' y2='13'/><line x1='16' y1='17' x2='8' y2='17'/><line x1='10' y1='9' x2='8' y2='9'/></svg>") center/contain no-repeat;
}
.navi-icon-trending-up-sm {
  width: 14px; height: 14px;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='22 7 13.5 15.5 8.5 10.5 2 17'/><polyline points='16 7 22 7 22 13'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='22 7 13.5 15.5 8.5 10.5 2 17'/><polyline points='16 7 22 7 22 13'/></svg>") center/contain no-repeat;
}
.navi-icon-search {
  width: 18px; height: 18px;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><circle cx='11' cy='11' r='8'/><path d='m21 21-4.3-4.3'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><circle cx='11' cy='11' r='8'/><path d='m21 21-4.3-4.3'/></svg>") center/contain no-repeat;
}
.navi-icon-upload-cloud {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242'/><path d='M12 12v9'/><path d='m16 16-4-4-4 4'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242'/><path d='M12 12v9'/><path d='m16 16-4-4-4 4'/></svg>") center/contain no-repeat;
}
.navi-icon-pencil {
  width: 14px; height: 14px;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z'/><path d='m15 5 4 4'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z'/><path d='m15 5 4 4'/></svg>") center/contain no-repeat;
}
.navi-icon-trash-2 {
  width: 14px; height: 14px;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><polyline points='3 6 5 6 21 6'/><path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'/><line x1='10' y1='11' x2='10' y2='17'/><line x1='14' y1='11' x2='14' y2='17'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><polyline points='3 6 5 6 21 6'/><path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'/><line x1='10' y1='11' x2='10' y2='17'/><line x1='14' y1='11' x2='14' y2='17'/></svg>") center/contain no-repeat;
}

/* ===== Sidebar User ===== */
.app-sidebar-user { padding: 16px 12px; border-top: 1px solid var(--rule-border); }
.app-sidebar-user-inner {
  display: flex; align-items: center; gap: 12px;
  padding: 8px 12px; cursor: pointer; border-radius: 8px;
  transition: background 0.15s ease;
}
.app-sidebar-user-inner:hover { background: var(--rule-muted); }
.app-sidebar-user-avatar {
  width: 32px; height: 32px; border-radius: 9999px;
  background: linear-gradient(135deg, var(--rule-primary), var(--rule-primary-active));
  color: var(--rule-primary-foreground);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 600; flex-shrink: 0;
}
.app-sidebar-user-name { display: block; font-size: 13px; font-weight: 500; color: var(--rule-foreground); }
.app-sidebar-user-role { display: block; font-size: 12px; color: var(--rule-muted-foreground); }

/* ===== Main ===== */
.app-main { flex: 1; margin-left: 240px; display: flex; flex-direction: column; min-height: 100vh; min-width: 0; }
.app-topbar {
  height: 64px; border-bottom: 1px solid var(--rule-border);
  background: var(--rule-card); display: flex; align-items: center;
  justify-content: space-between; padding: 0 32px; flex-shrink: 0;
  position: sticky; top: 0; z-index: 30;
}
.app-topbar-titles { display: flex; flex-direction: column; gap: 2px; }
.app-topbar-title { font-size: 18px; font-weight: 600; color: var(--rule-foreground); }
.app-topbar-breadcrumb { font-size: 12px; color: var(--rule-muted-foreground); }
.app-topbar-meta { font-size: 13px; color: var(--rule-muted-foreground);font-variant-numeric:tabular-nums; }
.app-content { flex: 1; padding: 28px 32px; max-width: 1400px; margin: 0 auto; width: 100%; box-sizing: border-box; }

/* ===== Scroll Reveal ===== */
.dc-section {
  margin-bottom: 28px; opacity: 0; transform: translateY(24px);
  transition: opacity 0.7s var(--qb-ease), transform 0.7s var(--qb-ease);
}
.dc-section:last-child { margin-bottom: 0; }
.dc-section.is-visible { opacity: 1; transform: translateY(0); }

/* ===== Section Header ===== */
.qb-section-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
.qb-section-title-wrap { display: flex; align-items: center; gap: 14px; }
.qb-section-bar {
  width: 6px; height: 22px; border-radius: 3px; flex-shrink: 0;
  background: linear-gradient(180deg, var(--rule-primary), var(--rule-primary-active));
}
.qb-section-title { font-size: 17px; font-weight: 700; color: var(--rule-foreground); letter-spacing: -0.01em; line-height: 1.3; }
.qb-section-subtitle { font-size: 13px; color: var(--rule-muted-foreground); display: block; margin-top: 2px; }

/* ===== KPI Cards ===== */
.qb-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.qb-kpi-card {
  position: relative; overflow: hidden;
  background: linear-gradient(135deg, var(--rule-card), var(--rule-primary-tint-3));
  border: 1px solid color-mix(in srgb, var(--rule-border) 55%, transparent);
  border-radius: 16px; padding: 24px;
  display: flex; flex-direction: column; gap: 14px; min-width: 0;
  box-shadow: 0 1px 2px color-mix(in srgb, var(--rule-ink) 4%, transparent), 0 10px 28px -14px color-mix(in srgb, var(--rule-ink) 10%, transparent);
  transition: transform 0.3s var(--qb-ease), box-shadow 0.3s var(--qb-ease), border-color 0.3s var(--qb-ease);
}
.qb-kpi-card:hover {
  transform: translateY(-6px);
  border-color: color-mix(in srgb, var(--rule-primary) 30%, transparent);
  box-shadow: 0 4px 8px color-mix(in srgb, var(--rule-primary) 12%, transparent), 0 22px 44px -14px color-mix(in srgb, var(--rule-primary) 38%, transparent);
}
.qb-kpi-card::before {
  content: ''; position: absolute; top: 0; right: 0;
  width: 130px; height: 130px; border-radius: 50%; pointer-events: none;
  background: radial-gradient(circle, color-mix(in srgb, var(--rule-primary) 12%, transparent), transparent 70%);
  transform: translate(40px, -40px);
}
.qb-kpi-card.qb-accent-success:hover {
  border-color: color-mix(in srgb, var(--state-success) 30%, transparent);
  box-shadow: 0 4px 8px color-mix(in srgb, var(--state-success) 12%, transparent), 0 22px 44px -14px color-mix(in srgb, var(--state-success) 38%, transparent);
}
.qb-kpi-card.qb-accent-success::before { background: radial-gradient(circle, color-mix(in srgb, var(--state-success) 12%, transparent), transparent 70%); }
.qb-kpi-card.qb-accent-warning:hover {
  border-color: color-mix(in srgb, var(--state-warning) 30%, transparent);
  box-shadow: 0 4px 8px color-mix(in srgb, var(--state-warning) 12%, transparent), 0 22px 44px -14px color-mix(in srgb, var(--state-warning) 38%, transparent);
}
.qb-kpi-card.qb-accent-warning::before { background: radial-gradient(circle, color-mix(in srgb, var(--state-warning) 12%, transparent), transparent 70%); }
.qb-kpi-card-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; position: relative; z-index: 1; }
.qb-kpi-card-label { font-size: 13px; color: var(--rule-muted-foreground); font-weight: 500; }
.qb-kpi-card-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  background: linear-gradient(135deg, var(--rule-primary), var(--rule-primary-active));
  box-shadow: 0 6px 14px -4px color-mix(in srgb, var(--rule-primary) 48%, transparent);
}
.qb-kpi-card-icon .navi-icon { width: 22px; height: 22px; background: var(--rule-primary-foreground); }
.qb-kpi-card.qb-accent-success .qb-kpi-card-icon { background: linear-gradient(135deg, var(--state-success), color-mix(in srgb, var(--state-success) 70%, var(--rule-ink))); box-shadow: 0 6px 14px -4px color-mix(in srgb, var(--state-success) 48%, transparent); }
.qb-kpi-card.qb-accent-warning .qb-kpi-card-icon { background: linear-gradient(135deg, var(--state-warning), color-mix(in srgb, var(--state-warning) 70%, var(--rule-ink))); box-shadow: 0 6px 14px -4px color-mix(in srgb, var(--state-warning) 48%, transparent); }
.qb-kpi-card-value { font-size: 32px; font-weight: 700; line-height: 1.1; color: var(--rule-foreground); font-variant-numeric: tabular-nums; letter-spacing: -0.02em; position: relative; z-index: 1; }
.qb-kpi-card-foot { font-size: 12px; color: var(--rule-muted-foreground); position: relative; z-index: 1; display: inline-flex; align-items: center; gap: 6px; }

/* ===== Toolbar ===== */
.qb-toolbar {
  background: linear-gradient(135deg, var(--rule-card), var(--rule-primary-tint-3));
  border: 1px solid color-mix(in srgb, var(--rule-border) 55%, transparent);
  border-radius: 16px; padding: 18px 22px;
  box-shadow: 0 1px 2px color-mix(in srgb, var(--rule-ink) 4%, transparent), 0 10px 28px -14px color-mix(in srgb, var(--rule-ink) 10%, transparent);
}
.qb-toolbar-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.qb-search { position: relative; flex: 1 1 240px; min-width: 220px; }
.qb-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--rule-muted-foreground); }
.qb-search-input {
  width: 100%; height: 42px; padding: 0 16px 0 42px;
  border-radius: var(--rule-radius-full);
  border: 1px solid var(--rule-border); background: var(--rule-card);
  color: var(--rule-foreground); font-size: 14px;
  outline: none; box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.qb-search-input::placeholder { color: var(--rule-muted-foreground); }
.qb-search-input:focus { border-color: var(--rule-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--rule-primary) 18%, transparent); }

.qb-filter-group { display: inline-flex; align-items: center; gap: 8px; }
.qb-filter-label { font-size: 13px; color: var(--rule-muted-foreground); font-weight: 500; white-space: nowrap; }
.qb-pills { display: inline-flex; gap: 4px; background: var(--rule-muted); padding: 4px; border-radius: var(--rule-radius-full); }
.qb-pill {
  font-size: 13px; font-weight: 500; padding: 6px 14px;
  border-radius: var(--rule-radius-full); cursor: pointer;
  color: var(--rule-muted-foreground);
  background: transparent; white-space: nowrap;
  transition: background 0.25s var(--qb-ease), color 0.25s var(--qb-ease), box-shadow 0.25s var(--qb-ease);
}
.qb-pill:hover { color: var(--rule-foreground); }
.qb-pill.is-active {
  background: linear-gradient(135deg, var(--rule-primary), var(--rule-primary-active));
  color: var(--rule-primary-foreground);
  box-shadow: 0 4px 10px -2px color-mix(in srgb, var(--rule-primary) 42%, transparent);
}

.qb-create-btn {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 14px; font-weight: 600;
  background: linear-gradient(135deg, var(--rule-primary), var(--rule-primary-active));
  color: var(--rule-primary-foreground);
  padding: 10px 20px; border-radius: var(--rule-radius-full);
  cursor: pointer; white-space: nowrap;
  box-shadow: 0 8px 20px -4px color-mix(in srgb, var(--rule-primary) 42%, transparent);
  transition: transform 0.3s var(--qb-ease), box-shadow 0.3s var(--qb-ease);
}
.qb-create-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px -4px color-mix(in srgb, var(--rule-primary) 56%, transparent); }
.qb-create-btn .navi-icon { width: 16px; height: 16px; background: var(--rule-primary-foreground); }

/* ===== Table Card ===== */
.qb-table-card {
  background: linear-gradient(135deg, var(--rule-card), var(--rule-primary-tint-3));
  border: 1px solid color-mix(in srgb, var(--rule-border) 55%, transparent);
  border-radius: 16px; padding: 24px;
  box-shadow: 0 1px 2px color-mix(in srgb, var(--rule-ink) 4%, transparent), 0 10px 28px -14px color-mix(in srgb, var(--rule-ink) 10%, transparent);
}
.qb-table-container { overflow-x: auto; }
.qb-table { width: 100%; border-collapse: collapse; min-width: 920px; }
.qb-table thead th {
  font-size: 13px; font-weight: 600; color: var(--rule-muted-foreground);
  text-align: left; padding: 12px 16px;
  border-bottom: 1px solid var(--rule-border); white-space: nowrap;
}
.qb-table tbody td {
  font-size: 14px; color: var(--rule-foreground);
  padding: 14px 16px; border-bottom: 1px solid var(--rule-border);
  vertical-align: middle;
}
.qb-table tbody tr:last-child td { border-bottom: none; }
.qb-table tbody tr { transition: background 0.2s ease; }
.qb-table tbody tr:hover { background: color-mix(in srgb, var(--rule-primary) 5%, transparent); }
.qb-qid { font-family: var(--rule-font-mono); font-size: 13px; font-weight: 600; color: var(--rule-primary); white-space: nowrap; }
.qb-qcontent { color: var(--rule-ink-2); max-width: 340px; }
.qb-qcontent-text { display: inline-block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: middle; }
.qb-date { color: var(--rule-muted-foreground); font-variant-numeric: tabular-nums; white-space: nowrap; font-size: 13px; }

/* type tags */
.qb-type-tag { display: inline-flex; align-items: center; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: var(--rule-radius-full); white-space: nowrap; }
.qb-type-single { background: var(--rule-primary-tint-1); color: var(--rule-primary); }
.qb-type-multi { background: var(--state-success-tint); color: var(--state-success); }
.qb-type-case { background: var(--state-warning-tint); color: var(--state-warning); }

/* difficulty / status tags */
.qb-diff-tag { display: inline-flex; align-items: center; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: var(--rule-radius-full); white-space: nowrap; }
.qb-diff-easy { background: var(--state-success-tint); color: var(--state-success); }
.qb-diff-mid { background: var(--state-warning-tint); color: var(--state-warning); }
.qb-diff-hard { background: var(--state-error-tint); color: var(--state-error); }

/* action buttons */
.qb-actions { display: inline-flex; gap: 8px; white-space: nowrap; }
.qb-action-btn {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 12px; font-weight: 600; padding: 5px 12px;
  border-radius: var(--rule-radius-full);
  cursor: pointer; background: transparent;
  transition: background 0.2s ease, border-color 0.2s ease;
}
.qb-action-btn .navi-icon { width: 14px; height: 14px; }
.qb-action-edit { color: var(--rule-primary); }
.qb-action-edit:hover { background: var(--rule-primary-tint-3); }
.qb-action-del { color: var(--state-error); }
.qb-action-del:hover { background: var(--state-error-tint); }

/* ===== Upload Card ===== */
.rm-upload-card {
  background: linear-gradient(135deg, var(--rule-card), var(--rule-primary-tint-3));
  border: 1px solid color-mix(in srgb, var(--rule-border) 55%, transparent);
  border-radius: 16px; padding: 24px;
  box-shadow: 0 1px 2px color-mix(in srgb, var(--rule-ink) 4%, transparent), 0 10px 28px -14px color-mix(in srgb, var(--rule-ink) 10%, transparent);
}
.rm-upload-row {
  display: flex; align-items: flex-end; gap: 20px; flex-wrap: wrap;
}
.rm-form-field { display: flex; flex-direction: column; gap: 8px; }
.rm-form-field-grow { flex: 1 1 260px; min-width: 220px; }
.rm-form-label { font-size: 13px; font-weight: 600; color: var(--rule-ink-2); }
.rm-input {
  height: 42px; padding: 0 14px;
  border-radius: var(--rule-radius-medium);
  border: 1px solid var(--rule-border); background: var(--rule-card);
  color: var(--rule-foreground); font-size: 14px;
  outline: none; box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.rm-input-sm { width: 150px; }
.rm-input::placeholder { color: var(--rule-muted-foreground); }
.rm-input:focus { border-color: var(--rule-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--rule-primary) 18%, transparent); }

.rm-dropzone {
  margin-top: 20px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 6px; padding: 32px 20px;
  border: 2px dashed color-mix(in srgb, var(--rule-primary) 30%, transparent);
  border-radius: var(--rule-radius-large);
  background: color-mix(in srgb, var(--rule-primary-tint-3) 55%, transparent);
  cursor: pointer;
  transition: border-color 0.25s var(--qb-ease), background 0.25s var(--qb-ease), transform 0.25s var(--qb-ease);
}
.rm-dropzone:hover {
  border-color: var(--rule-primary);
  background: var(--rule-primary-tint-3);
  transform: translateY(-1px);
}
.rm-dropzone-icon {
  width: 34px; height: 34px;
  background: var(--rule-primary);
}
.rm-dropzone-title { font-size: 15px; font-weight: 600; color: var(--rule-ink); }
.rm-dropzone-sub { font-size: 13px; color: var(--rule-muted-foreground); }

.rm-upload-foot {
  margin-top: 20px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
}
.rm-upload-tip { font-size: 12px; color: var(--rule-muted-foreground); }

/* ===== Responsive ===== */
@media (max-width: 1024px) {
  .qb-kpi-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .app-sidebar { transform: translateX(-100%); transition: transform 0.3s ease; }
  .app-sidebar.open { transform: translateX(0); }
  .app-main { margin-left: 0; }
  .app-content { padding: 20px; }
  .qb-toolbar-row { flex-direction: column; align-items: stretch; }
  .qb-filter-group { width: 100%; flex-wrap: wrap; }
  .qb-create-btn { width: 100%; justify-content: center; }
}
@media (max-width: 640px) {
  .qb-kpi-grid { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .dc-section { transition-duration: 0.01ms; }
  .qb-kpi-card:hover, .qb-create-btn:hover, .rm-dropzone:hover { transform: none; }
}
</style>
