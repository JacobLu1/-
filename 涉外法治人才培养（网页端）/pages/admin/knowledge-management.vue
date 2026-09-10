<template>
  <view class="app-shell">
    <!-- 左侧导航栏 -->
    <aside class="app-sidebar">
      <view class="app-sidebar-logo">
        <view class="app-sidebar-logo-icon">
          <image class="ls-svg-img" src="/static/logo.png" mode="aspectFit"></image>
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
        <view class="app-nav-item" @tap="navigateTo('/pages/admin/user-management')">
          <view class="navi-icon navi-icon-users"></view>
          <text>用户管理</text>
        </view>
        <view class="app-nav-item" @tap="navigateTo('/pages/admin/question-bank')">
          <view class="navi-icon navi-icon-file-question"></view>
          <text>题库管理</text>
        </view>
        <view class="app-nav-item is-active" @tap="navigateTo('/pages/admin/knowledge-management')">
          <view class="navi-icon navi-icon-book"></view>
          <text>法律库管理</text>
        </view>
        <view class="app-nav-item" @tap="navigateTo('/pages/admin/resource-management')">
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

    <!-- 主内容区 -->
    <view class="app-main">
      <header class="app-topbar">
        <view class="app-topbar-titles">
          <text class="app-topbar-title">法律库管理</text>
          <text class="app-topbar-breadcrumb">管理端 / 知识库</text>
        </view>
        <text class="app-topbar-meta">{{ todayDateText }}</text>
      </header>
      <main class="app-content">

        <!-- 知识库概览统计 -->
        <section class="dc-section" :class="{ 'is-visible': visibleSections[0] }" aria-label="知识库概览统计">
          <view class="res-kpi-strip">
            <view class="res-kpi-item res-kpi-total">
              <view class="res-kpi-icon"><view class="navi-icon navi-icon-file-text"></view></view>
              <view class="res-kpi-body">
                <text class="res-kpi-value">{{ kpiTotal }}</text>
                <text class="res-kpi-label">知识总数</text>
              </view>
            </view>
            <view class="res-kpi-item res-kpi-video">
              <view class="res-kpi-icon"><view class="navi-icon navi-icon-check-square"></view></view>
              <view class="res-kpi-body">
                <text class="res-kpi-value">{{ kpiOnline }}</text>
                <text class="res-kpi-label">已上线</text>
              </view>
            </view>
            <view class="res-kpi-item res-kpi-vocabulary">
              <view class="res-kpi-icon"><view class="navi-icon navi-icon-list-checks"></view></view>
              <view class="res-kpi-body">
                <text class="res-kpi-value">{{ kpiReview }}</text>
                <text class="res-kpi-label">审核中</text>
              </view>
            </view>
            <view class="res-kpi-item res-kpi-case">
              <view class="res-kpi-icon"><view class="navi-icon navi-icon-briefcase"></view></view>
              <view class="res-kpi-body">
                <text class="res-kpi-value">{{ kpiCategory }}</text>
                <text class="res-kpi-label">分类数</text>
              </view>
            </view>
          </view>
        </section>

        <!-- 筛选、搜索与知识条目录入 -->
        <section class="dc-section" :class="{ 'is-visible': visibleSections[1] }" aria-label="筛选、搜索与知识条目录入">
          <!-- 批量导入知识条目 -->
          <view class="qb-batch-card">
            <view class="qb-section-header">
              <view class="qb-section-title-wrap">
                <view class="qb-section-bar"></view>
                <view>
                  <text class="qb-section-title">批量导入知识条目</text>
                  <text class="qb-section-subtitle">支持多条文档：#title= 开始一条，#key=value 设置元数据（category/docType/regions/tags/source/date/summary），其余行作为正文；导入后直接上线</text>
                </view>
              </view>
              <view class="qb-batch-actions">
                <view class="qb-file-btn" @tap="chooseBatchFile">
                  <view class="navi-icon navi-icon-upload"></view>
                  <text>选择 txt 文件</text>
                </view>
              </view>
            </view>
            <textarea
              class="qb-textarea qb-batch-textarea"
              v-model="batchText"
              placeholder="格式示例：&#10;#title=日本国宪法&#10;#category=综合&#10;#docType=法律&#10;#regions=日本&#10;#tags=宪法,日本&#10;#source=日本国驻华大使馆译&#10;#date=1947-05-03&#10;#summary=1946年11月3日公布、1947年5月3日施行…&#10;（此处粘贴正文，可包含换行）&#10;&#10;#title=第二条文档标题&#10;#category=国际公法&#10;（第二条文档正文…）"
            ></textarea>
            <view class="qb-batch-foot">
              <text v-if="batchParseCount > 0" class="qb-batch-count">已识别 {{ batchParseCount }} 条知识条目</text>
              <text v-else class="qb-batch-count qb-batch-count-muted">尚未识别到知识条目</text>
              <view class="qb-create-btn qb-create-btn-success" :class="{ 'is-disabled': batchImporting }" @tap="handleBatchImport">
                <view class="navi-icon navi-icon-check-circle"></view>
                <text>{{ batchImporting ? '导入中...' : '一键导入' }}</text>
              </view>
            </view>
            <text v-if="batchResult" class="qb-batch-result" :class="{ 'is-error': batchResult.error }">{{ batchResult.message }}</text>
          </view>
          <view v-if="formVisible" class="qb-form-card">
            <view class="qb-section-header">
              <view class="qb-section-title-wrap">
                <view class="qb-section-bar"></view>
                <view>
                  <text class="qb-section-title">{{ editingId ? '编辑知识条目' : '新建知识条目' }}</text>
                  <text class="qb-section-subtitle">保存后法律库实时读取已上线条目</text>
                </view>
              </view>
            </view>
            <view class="qb-form-row">
              <view class="qb-form-field qb-form-grow">
                <text class="qb-form-label">标题</text>
                <input class="qb-input" v-model="formTitle" placeholder="请输入法规、条约、案例或指南标题" />
              </view>
              <view class="qb-form-field">
                <text class="qb-form-label">分类</text>
                <view class="qb-pills" style="flex-wrap:wrap">
                  <view class="qb-pill" :class="{ 'is-active': formCategory === item }" v-for="item in categoryOptions" :key="item" @tap="formCategory = item; formCategoryCustom = ''">{{ item }}</view>
                </view>
                <input class="qb-input" style="margin-top:8px;max-width:260px" v-model="formCategoryCustom" placeholder="新分类（可选）" @input="formCategory = formCategoryCustom" />
              </view>
              <view class="qb-form-field">
                <text class="qb-form-label">状态</text>
                <view class="qb-pills">
                  <view class="qb-pill" :class="{ 'is-active': formStatus === '已上线' }" @tap="formStatus = '已上线'">已上线</view>
                  <view class="qb-pill" :class="{ 'is-active': formStatus === '审核中' }" @tap="formStatus = '审核中'">审核中</view>
                </view>
              </view>
            </view>
            <view class="qb-form-row">
              <view class="qb-form-field">
                <text class="qb-form-label">文档类型</text>
                <input class="qb-input" v-model="formDocType" placeholder="如 法律、国际条约、案例" />
              </view>
              <view class="qb-form-field">
                <text class="qb-form-label">来源</text>
                <input class="qb-input" v-model="formSource" placeholder="如 全国人大常委会" />
              </view>
              <view class="qb-form-field">
                <text class="qb-form-label">发布日期</text>
                <input class="qb-input" v-model="formDate" placeholder="YYYY-MM-DD" />
              </view>
            </view>
            <view class="qb-form-row">
              <view class="qb-form-field">
                <text class="qb-form-label">领域标签</text>
                <input class="qb-input" v-model="formFields" placeholder="逗号分隔，如 国际贸易法,国际私法" />
              </view>
              <view class="qb-form-field">
                <text class="qb-form-label">地区</text>
                <input class="qb-input" v-model="formRegions" placeholder="逗号分隔，如 中国,欧盟" />
              </view>
              <view class="qb-form-field">
                <text class="qb-form-label">关键词</text>
                <input class="qb-input" v-model="formTags" placeholder="逗号分隔，如 CISG,国际贸易" />
              </view>
            </view>
            <view class="qb-form-row">
              <view class="qb-form-field qb-form-grow">
                <text class="qb-form-label">摘要</text>
                <textarea class="qb-textarea qb-textarea-sm" v-model="formSummary" placeholder="用于法律库列表展示"></textarea>
              </view>
            </view>
            <view class="qb-form-row">
              <view class="qb-form-field qb-form-grow">
                <text class="qb-form-label">正文</text>
                <textarea class="qb-textarea" v-model="formContent" placeholder="请输入完整正文，可包含换行"></textarea>
              </view>
            </view>
            <view class="qb-form-row">
              <view class="qb-form-field qb-form-grow">
                <text class="qb-form-label">附件/原文 URL</text>
                <input class="qb-input" v-model="formFileUrl" placeholder="可留空" />
              </view>
            </view>
            <view class="qb-form-actions">
              <view class="qb-action-btn qb-action-del" @tap="closeForm">取消</view>
              <view class="qb-create-btn" @tap="saveDoc">保存知识条目</view>
            </view>
          </view>
          <view class="qb-toolbar">
            <view class="qb-toolbar-row">
              <view class="qb-search">
                <view class="qb-search-icon"><view class="navi-icon navi-icon-search"></view></view>
                <input type="text" class="qb-search-input" placeholder="搜索知识条目标题..." v-model="searchQuery" />
              </view>
              <view class="qb-filter-group">
                <text class="qb-filter-label">分类</text>
                <view class="qb-pills" style="flex-wrap:wrap">
                  <view class="qb-pill" :class="{ 'is-active': categoryFilter === 'all' }" @tap="categoryFilter = 'all'">全部</view>
                  <view class="qb-pill" :class="{ 'is-active': categoryFilter === item }" v-for="item in categoryOptions" :key="item" @tap="categoryFilter = item">{{ item }}</view>
                </view>
              </view>
              <view class="qb-filter-group">
                <text class="qb-filter-label">状态</text>
                <view class="qb-pills">
                  <view class="qb-pill" :class="{ 'is-active': statusFilter === 'all' }" @tap="statusFilter = 'all'">全部</view>
                  <view class="qb-pill" :class="{ 'is-active': statusFilter === '已上线', 'is-status-on': statusFilter === '已上线' }" @tap="statusFilter = '已上线'">已上线</view>
                  <view class="qb-pill" :class="{ 'is-active': statusFilter === '审核中', 'is-status-pending': statusFilter === '审核中' }" @tap="statusFilter = '审核中'">审核中</view>
                </view>
              </view>
              <view class="qb-create-btn" @tap="handleCreateDoc">
                <view class="navi-icon navi-icon-plus" style="width:16px;height:16px;background:var(--rule-primary-foreground)"></view>
                <text>新建知识条目</text>
              </view>
            </view>
          </view>
        </section>

        <!-- 知识条目列表表格 -->
        <section class="dc-section" :class="{ 'is-visible': visibleSections[2] }" aria-label="知识条目列表">
          <view class="qb-section-header">
            <view class="qb-section-title-wrap">
              <view class="qb-section-bar"></view>
              <view>
                <text class="qb-section-title">知识条目列表</text>
                <text class="qb-section-subtitle">共 {{ documents.length }} 条</text>
              </view>
            </view>
          </view>
          <view class="qb-table-card">
            <view class="qb-table-container">
              <table class="qb-table">
                <thead>
                  <tr>
                    <th scope="col" class="qb-col-id">编号</th>
                    <th scope="col" class="qb-col-title">标题</th>
                    <th scope="col" class="qb-col-cat">分类</th>
                    <th scope="col" class="qb-col-doc-type">文档类型</th>
                    <th scope="col" class="qb-col-status">状态</th>
                    <th scope="col" class="qb-col-date">发布日期</th>
                    <th scope="col" class="qb-col-ops">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(doc, index) in pagedDocs" :key="doc.id">
                    <td class="qb-qid" :title="doc.id">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                    <td class="qb-qcontent"><text class="qb-qcontent-text" :title="doc.title">{{ doc.title }}</text></td>
                    <td><text class="qb-type-tag qb-type-multi" :title="doc.category">{{ doc.category }}</text></td>
                    <td><text class="qb-date" :title="doc.docType || '-'">{{ doc.docType || '-' }}</text></td>
                    <td><text :class="['qb-diff-tag', doc.status === '已上线' ? 'qb-diff-easy' : 'qb-diff-mid']">{{ doc.status }}</text></td>
                    <td class="qb-date">{{ doc.date || '-' }}</td>
                    <td>
                      <view class="qb-actions">
                        <view class="qb-action-btn qb-action-edit" @tap="handleEdit(doc)">
                          <view class="navi-icon navi-icon-pencil"></view>
                          <text>编辑</text>
                        </view>
                        <view class="qb-action-btn qb-action-del" @tap="handleDelete(doc)">
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

        <!-- 分页 -->
        <section class="dc-section" :class="{ 'is-visible': visibleSections[3] }" aria-label="分页">
          <view class="qb-pagination">
            <view class="qb-pagination-info">
              共 {{ filteredDocs.length }} 条，每页 {{ pageSize }} 条，当前第 {{ currentPage }} / {{ totalPages }} 页
            </view>
            <view class="qb-pagination-buttons">
              <view
                class="qb-page-btn"
                :class="{ 'is-disabled': currentPage <= 1 }"
                @tap="changePage(currentPage - 1)"
              >上一页</view>
              <view
                class="qb-page-item"
                v-for="page in visiblePageNumbers"
                :key="page"
              >
                <view v-if="page === '...'" class="qb-page-ellipsis">...</view>
                <view
                  v-else
                  class="qb-page-btn"
                  :class="{ 'is-active': page === currentPage }"
                  @tap="changePage(page)"
                >{{ page }}</view>
              </view>
              <view
                class="qb-page-btn"
                :class="{ 'is-disabled': currentPage >= totalPages }"
                @tap="changePage(currentPage + 1)"
              >下一页</view>
            </view>
          </view>
        </section>

      </main>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { requireAdmin } from '@/utils/auth.js'

const visibleSections = ref([false, false, false, false])
const searchQuery = ref('')
const categoryFilter = ref('all')
const statusFilter = ref('all')
const currentPage = ref(1)
const pageSize = ref(8)
const documents = ref([])
const statsData = reactive({ total: 0, online: 0, review: 0, category: 0 })

const categoryOptions = ref(['综合'])

const kpiTotal = computed(() => statsData.total)
const kpiOnline = computed(() => statsData.online)
const kpiReview = computed(() => statsData.review)
const kpiCategory = computed(() => statsData.category || categoryOptions.value.length)

const filteredDocs = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return documents.value.filter(item => {
    const matchCategory = categoryFilter.value === 'all' || item.category === categoryFilter.value
    const matchStatus = statusFilter.value === 'all' || item.status === statusFilter.value
    const matchQuery = !q || item.title.toLowerCase().includes(q) || String(item.summary || '').toLowerCase().includes(q)
    return matchCategory && matchStatus && matchQuery
  })
})
const totalPages = computed(() => Math.max(1, Math.ceil(filteredDocs.value.length / pageSize.value)))
const pagedDocs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredDocs.value.slice(start, start + pageSize.value)
})

const todayDateText = computed(() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}年${m}月${d}日`
})

/* 知识条目表单 */
const formVisible = ref(false)
const editingId = ref('')
const formTitle = ref('')
const formCategory = ref('综合')
const formCategoryCustom = ref('')
const formDocType = ref('')
const formSource = ref('')
const formDate = ref('')
const formFields = ref('')
const formRegions = ref('')
const formTags = ref('')
const formSummary = ref('')
const formContent = ref('')
const formFileUrl = ref('')
const formStatus = ref('审核中')

/* 批量导入知识条目 */
const batchText = ref('')
const batchImporting = ref(false)
const batchResult = ref(null)

const batchParseCount = computed(() => parseBatchDocsText(batchText.value).length)

function parseBatchDocsText(text) {
  const lines = String(text || '').split(/\r?\n/)
  const docs = []
  let cur = null
  for (const line of lines) {
    const m = line.match(/^#([a-zA-Z]+)\s*=\s*(.*)$/)
    if (m) {
      const key = m[1].trim()
      const val = m[2].trim()
      if (key === 'title') {
        cur = { title: val }
        docs.push(cur)
      } else if (cur) {
        cur[key] = val
      }
      continue
    }
    if (cur) cur._body = (cur._body || '') + line + '\n'
  }
  return docs.filter(d => d.title)
}

function chooseBatchFile() {
  uni.chooseFile({
    count: 1,
    extension: ['txt', 'text'],
    success(res) {
      const file = res.tempFiles && res.tempFiles[0]
      if (!file) return
      if (file.size > 2 * 1024 * 1024) {
        batchResult.value = { error: true, message: '文件过大，请控制在 2MB 以内' }
        return
      }
      const path = file.path || file.tempFilePath
      if (path && path.startsWith('blob:')) {
        fetch(path).then(r => r.text()).then(t => {
          batchText.value = t
          batchResult.value = null
        }).catch(() => {
          batchResult.value = { error: true, message: '读取文件失败，请改为复制粘贴文本' }
        })
        return
      }
      uni.getFileSystemManager().readFile({
        filePath: path,
        encoding: 'utf8',
        success(r) {
          batchText.value = r.data || ''
          batchResult.value = null
        },
        fail() {
          batchResult.value = { error: true, message: '读取文件失败，请改为复制粘贴文本' }
        }
      })
    }
  })
}

async function handleBatchImport() {
  if (batchImporting.value) return
  const text = batchText.value.trim()
  if (!text) {
    batchResult.value = { error: true, message: '请先粘贴或选择知识条目文本' }
    return
  }
  batchImporting.value = true
  batchResult.value = null
  try {
    const knowledgeObj = uniCloud.importObject('knowledge', { customUI: true })
    const r = (await knowledgeObj.batchCreate({ adminToken: getAdminToken(), text })) || {}
    if (r.errCode !== 0) {
      batchResult.value = { error: true, message: r.errMsg || '批量导入失败' }
    } else {
      batchResult.value = { error: false, message: `导入完成：新增 ${r.count} 条知识条目` }
      batchText.value = ''
      await loadDocs()
      await loadStats()
    }
  } catch (e) {
    batchResult.value = { error: true, message: (e && e.errMsg) || '批量导入失败，请确认 knowledge 云对象已重新部署' }
  } finally {
    batchImporting.value = false
  }
}

function getAdminToken() {
  return uni.getStorageSync('adminToken')
}

function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (isNaN(d.getTime())) return String(value)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function toRow(doc) {
  return {
    id: doc._id,
    title: doc.title,
    category: doc.category || '综合',
    docType: doc.docType || '',
    summary: doc.summary || '',
    fields: Array.isArray(doc.fields) ? doc.fields : [],
    regions: Array.isArray(doc.regions) ? doc.regions : [],
    tags: Array.isArray(doc.tags) ? doc.tags : [],
    source: doc.source || '',
    date: doc.date || formatDate(doc.createDate),
    fileUrl: doc.fileUrl || '',
    content: doc.content || '',
    status: doc.status || '审核中',
    createDate: doc.createDate || 0
  }
}

async function loadCategoryOptions() {
  try {
    const knowledgeObj = uniCloud.importObject('knowledge', { customUI: true })
    const r = (await knowledgeObj.getCategories({ status: '' })) || {}
    if (r.errCode === 0 && Array.isArray(r.list)) {
      const names = r.list.map(x => String(x || '').trim()).filter(Boolean)
      categoryOptions.value = names.length ? names : ['综合']
      return
    }
  } catch (e) {}
  const names = [...new Set(documents.value.map(d => d.category || '综合'))]
  categoryOptions.value = names.length ? names : ['综合']
}

async function loadDocs() {
  try {
    const knowledgeObj = uniCloud.importObject('knowledge', { customUI: true })
    const r = (await knowledgeObj.list({ adminToken: getAdminToken(), category: 'all', keyword: '', status: '', page: 1, pageSize: 200 })) || {}
    if (r.errCode === 0) {
      documents.value = (r.list || []).map(toRow)
      await loadCategoryOptions()
    } else {
      uni.showToast({ title: r.errMsg || '知识条目加载失败', icon: 'none' })
    }
  } catch (e) {
    uni.showToast({ title: (e && e.errMsg) || '知识条目加载失败', icon: 'none' })
  }
}

async function loadStats() {
  try {
    const knowledgeObj = uniCloud.importObject('knowledge', { customUI: true })
    const r = (await knowledgeObj.stats({ adminToken: getAdminToken() })) || {}
    if (r.errCode === 0) {
      statsData.total = r.total || 0
      statsData.online = r.online || 0
      statsData.review = r.review || 0
      statsData.category = Object.keys(r.categories || {}).filter(key => (r.categories[key] || 0) > 0).length
    }
  } catch (e) {
    uni.showToast({ title: (e && e.errMsg) || '统计加载失败', icon: 'none' })
  }
}

const visiblePageNumbers = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  // 页数少时直接显示全部页码
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  // 页数多时固定首末页，中间窗口跟随当前页滚动，窗口外以省略号代替
  const items = []
  if (current > 3) items.push(1, '...')
  const start = Math.max(1, current - 1)
  const end = Math.min(total, current + 1)
  for (let p = start; p <= end; p += 1) items.push(p)
  if (current < total - 2) items.push('...', total)
  return items
})

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

function resetForm() {
  editingId.value = ''
  formTitle.value = ''
  formCategory.value = '综合'
  formCategoryCustom.value = ''
  formDocType.value = ''
  formSource.value = ''
  formDate.value = ''
  formFields.value = ''
  formRegions.value = ''
  formTags.value = ''
  formSummary.value = ''
  formContent.value = ''
  formFileUrl.value = ''
  formStatus.value = '审核中'
}

const handleCreateDoc = () => {
  resetForm()
  formVisible.value = true
}

const handleEdit = async (doc) => {
  editingId.value = doc.id
  formTitle.value = doc.title || ''
  formCategory.value = doc.category || '综合'
  formCategoryCustom.value = ''
  formDocType.value = doc.docType || ''
  formSource.value = doc.source || ''
  formDate.value = doc.date || ''
  formFields.value = (doc.fields || []).join(',')
  formRegions.value = (doc.regions || []).join(',')
  formTags.value = (doc.tags || []).join(',')
  formSummary.value = doc.summary || ''
  formContent.value = doc.content || ''
  formFileUrl.value = doc.fileUrl || ''
  formStatus.value = doc.status || '审核中'
  formVisible.value = true
  // 列表接口已裁掉正文以加速加载，编辑时按需拉取完整正文
  try {
    const knowledgeObj = uniCloud.importObject('knowledge', { customUI: true })
    const r = (await knowledgeObj.detail({ adminToken: getAdminToken(), id: doc.id })) || {}
    if (r.errCode === 0 && r.doc && r.doc.content) {
      formContent.value = r.doc.content
    }
  } catch (e) {}
}

const closeForm = () => {
  formVisible.value = false
  resetForm()
}

const saveDoc = async () => {
  const title = formTitle.value.trim()
  if (!title) {
    uni.showToast({ title: '请输入标题', icon: 'none' })
    return
  }
  const categoryValue = String(formCategoryCustom.value || formCategory.value || '').trim()
  if (!categoryValue) {
    uni.showToast({ title: '请选择或填写知识分类', icon: 'none' })
    return
  }
  const data = {
    title,
    category: categoryValue,
    docType: formDocType.value.trim(),
    source: formSource.value.trim(),
    date: formDate.value.trim(),
    fields: formFields.value,
    regions: formRegions.value,
    tags: formTags.value,
    summary: formSummary.value,
    content: formContent.value,
    fileUrl: formFileUrl.value.trim(),
    status: formStatus.value
  }
  try {
    const knowledgeObj = uniCloud.importObject('knowledge', { customUI: true })
    const r = editingId.value
      ? (await knowledgeObj.update({ adminToken: getAdminToken(), id: editingId.value, data })) || {}
      : (await knowledgeObj.add({ adminToken: getAdminToken(), data })) || {}
    if (r.errCode === 0) {
      uni.showToast({ title: '已保存', icon: 'success' })
      closeForm()
      await loadDocs()
      await loadStats()
    } else {
      uni.showToast({ title: r.errMsg || '保存失败', icon: 'none' })
    }
  } catch (e) {
    uni.showToast({ title: (e && e.errMsg) || '保存失败', icon: 'none' })
  }
}

const handleDelete = (doc) => {
  uni.showModal({
    title: '确认删除',
    content: `确定要删除知识条目「${doc.title}」吗？`,
    confirmColor: '#DC2626',
    success: async (res) => {
      if (res.confirm) {
        try {
    const knowledgeObj = uniCloud.importObject('knowledge', { customUI: true })
          const r = (await knowledgeObj.remove({ adminToken: getAdminToken(), id: doc.id })) || {}
          if (r.errCode === 0) {
            uni.showToast({ title: '已删除', icon: 'success' })
            await loadDocs()
            await loadStats()
          } else {
            uni.showToast({ title: r.errMsg || '删除失败', icon: 'none' })
          }
        } catch (e) {
          uni.showToast({ title: (e && e.errMsg) || '删除失败', icon: 'none' })
        }
      }
    }
  })
}

const changePage = (page) => {
  const next = Number(page)
  if (!Number.isInteger(next) || next < 1 || next > totalPages.value || next === currentPage.value) return
  currentPage.value = next
}

onMounted(() => {
  if (!requireAdmin()) return
  loadDocs()
  loadStats()
  setTimeout(() => {
    visibleSections.value = [true, true, true, true]
  }, 100)
})
</script>

<style scoped>
/* 品牌主题色变量 */
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

/* 侧边导航栏 */
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
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.ls-svg-img {
  width: 32px;
  height: 32px;
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
.navi-icon-users {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M22 21v-2a4 4 0 0 0-3-3.87'/><path d='M16 3.13a4 4 0 0 1 0 7.75'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M22 21v-2a4 4 0 0 0-3-3.87'/><path d='M16 3.13a4 4 0 0 1 0 7.75'/></svg>") center/contain no-repeat;
}
.navi-icon-logout {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>") center/contain no-repeat;
}
.navi-icon-book {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>") center/contain no-repeat;
}
.navi-icon-folder {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'/></svg>") center/contain no-repeat;
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
.navi-icon-check-square {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><polyline points='9 11 12 14 22 4'/><path d='M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><polyline points='9 11 12 14 22 4'/><path d='M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'/></svg>") center/contain no-repeat;
}
.navi-icon-list-checks {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'/><polyline points='14 2 14 8 20 8'/><path d='m9 15 2 2 4-4'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'/><polyline points='14 2 14 8 20 8'/><path d='m9 15 2 2 4-4'/></svg>") center/contain no-repeat;
}
.navi-icon-pie-chart {
  width: 14px; height: 14px;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M21.21 15.89A10 10 0 1 1 8 2.83'/><path d='M22 12A10 10 0 0 0 12 2v10z'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M21.21 15.89A10 10 0 1 1 8 2.83'/><path d='M22 12A10 10 0 0 0 12 2v10z'/></svg>") center/contain no-repeat;
}
.navi-icon-briefcase {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><rect width='20' height='14' x='2' y='7' rx='2'/><path d='M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2'/><circle cx='12' cy='14' r='1'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><rect width='20' height='14' x='2' y='7' rx='2'/><path d='M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2'/><circle cx='12' cy='14' r='1'/></svg>") center/contain no-repeat;
}
.navi-icon-search {
  width: 18px; height: 18px;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><circle cx='11' cy='11' r='8'/><path d='m21 21-4.3-4.3'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><circle cx='11' cy='11' r='8'/><path d='m21 21-4.3-4.3'/></svg>") center/contain no-repeat;
}
.navi-icon-plus {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='M5 12h14'/><path d='M12 5v14'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='M5 12h14'/><path d='M12 5v14'/></svg>") center/contain no-repeat;
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
.navi-icon-chevron-left {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='15 18 9 12 15 6'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='15 18 9 12 15 6'/></svg>") center/contain no-repeat;
}
.navi-icon-chevron-right {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='9 18 15 12 9 6'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='9 18 15 12 9 6'/></svg>") center/contain no-repeat;
}

/* 侧边栏用户信息 */
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

/* 主内容区 */
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

/* 滚动显现动画 */
.dc-section {
  margin-bottom: 28px; opacity: 0; transform: translateY(24px);
  transition: opacity 0.7s var(--qb-ease), transform 0.7s var(--qb-ease);
}
.dc-section:last-child { margin-bottom: 0; }
.dc-section.is-visible { opacity: 1; transform: translateY(0); }

/* 区块标题栏 */
.qb-section-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
.qb-section-title-wrap { display: flex; align-items: center; gap: 14px; }
.qb-section-bar {
  width: 6px; height: 22px; border-radius: 3px; flex-shrink: 0;
  background: linear-gradient(180deg, var(--rule-primary), var(--rule-primary-active));
}
.qb-section-title { font-size: 17px; font-weight: 700; color: var(--rule-foreground); letter-spacing: -0.01em; line-height: 1.3; }
.qb-section-subtitle { font-size: 13px; color: var(--rule-muted-foreground); display: block; margin-top: 2px; }

/* 指标卡片 */
/* 资源概览指标条 - 单行紧凑布局 */
.res-kpi-strip {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, var(--rule-card), var(--rule-primary-tint-3));
  border: 1px solid color-mix(in srgb, var(--rule-border) 55%, transparent);
  border-radius: 12px;
  box-shadow: 0 1px 2px color-mix(in srgb, var(--rule-ink) 4%, transparent), 0 10px 28px -14px color-mix(in srgb, var(--rule-ink) 10%, transparent);
}
.res-kpi-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
  background: var(--rule-card);
  border: 1px solid color-mix(in srgb, var(--rule-border) 40%, transparent);
  transition: transform 0.2s var(--qb-ease), box-shadow 0.2s var(--qb-ease);
}
.res-kpi-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--rule-ink) 8%, transparent);
}
.res-kpi-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: linear-gradient(135deg, var(--rule-primary), var(--rule-primary-active));
  box-shadow: 0 4px 10px -4px color-mix(in srgb, var(--rule-primary) 48%, transparent);
}
.res-kpi-icon .navi-icon { width: 18px; height: 18px; background: var(--rule-primary-foreground); }
.res-kpi-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.res-kpi-value {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.1;
  color: var(--rule-foreground);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}
.res-kpi-label {
  font-size: 11px;
  color: var(--rule-muted-foreground);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 各类型彩色图标 */
.res-kpi-total .res-kpi-icon { background: linear-gradient(135deg, var(--rule-primary), var(--rule-primary-active)); box-shadow: 0 4px 10px -4px color-mix(in srgb, var(--rule-primary) 48%, transparent); }
.res-kpi-video .res-kpi-icon { background: linear-gradient(135deg, var(--state-success), color-mix(in srgb, var(--state-success) 70%, var(--rule-ink))); box-shadow: 0 4px 10px -4px color-mix(in srgb, var(--state-success) 48%, transparent); }
.res-kpi-vocabulary .res-kpi-icon { background: linear-gradient(135deg, var(--state-warning), color-mix(in srgb, var(--state-warning) 70%, var(--rule-ink))); box-shadow: 0 4px 10px -4px color-mix(in srgb, var(--state-warning) 48%, transparent); }
.res-kpi-reading .res-kpi-icon { background: linear-gradient(135deg, #3B82F6, #1D4ED8); box-shadow: 0 4px 10px -4px rgba(59, 130, 246, 0.48); }
.res-kpi-listening .res-kpi-icon { background: linear-gradient(135deg, #8B5CF6, #6D28D9); box-shadow: 0 4px 10px -4px rgba(139, 92, 246, 0.48); }
.res-kpi-case .res-kpi-icon { background: linear-gradient(135deg, #F59E0B, #D97706); box-shadow: 0 4px 10px -4px rgba(245, 158, 11, 0.48); }

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
.qb-pill.is-active.is-status-on {
  background: var(--state-success);
  color: #fff;
  box-shadow: 0 4px 10px -2px color-mix(in srgb, var(--state-success) 42%, transparent);
}
.qb-pill.is-active.is-status-pending {
  background: var(--state-warning);
  color: #fff;
  box-shadow: 0 4px 10px -2px color-mix(in srgb, var(--state-warning) 42%, transparent);
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

/* 表单卡片 */
.qb-form-card {
  margin-bottom: 18px;
  background: linear-gradient(135deg, var(--rule-card), var(--rule-primary-tint-3));
  border: 1px solid color-mix(in srgb, var(--rule-border) 55%, transparent);
  border-radius: 16px;
  padding: 20px 22px;
  box-shadow: 0 10px 28px -14px color-mix(in srgb, var(--rule-ink) 12%, transparent);
}
.qb-form-row { display: flex; align-items: flex-start; gap: 16px; flex-wrap: wrap; margin-top: 16px; }
.qb-form-field { display: flex; flex-direction: column; gap: 8px; min-width: 180px; }
.qb-form-field.qb-form-grow { flex: 1 1 320px; }
.qb-form-label { font-size: 13px; color: var(--rule-muted-foreground); font-weight: 500; }
.qb-input, .qb-textarea {
  width: 100%;
  border: 1px solid var(--rule-border);
  border-radius: 10px;
  background: var(--rule-card);
  color: var(--rule-foreground);
  font-size: 14px;
  padding: 10px 12px;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.qb-input:focus, .qb-textarea:focus {
  border-color: var(--rule-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--rule-primary) 18%, transparent);
}
.qb-textarea { min-height: 96px; resize: vertical; line-height: 1.6; }
.qb-textarea-sm { min-height: 72px; }
.qb-form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 18px; }

/* 表格卡片 */
.qb-table-card {
  background: linear-gradient(135deg, var(--rule-card), var(--rule-primary-tint-3));
  border: 1px solid color-mix(in srgb, var(--rule-border) 55%, transparent);
  border-radius: 16px; padding: 24px;
  box-shadow: 0 1px 2px color-mix(in srgb, var(--rule-ink) 4%, transparent), 0 10px 28px -14px color-mix(in srgb, var(--rule-ink) 10%, transparent);
}
.qb-table-container { overflow-x: auto; }
/* 法律库列表：固定列宽，表格自适应容器宽度，标题列吸收剩余空间，避免横向滚动 */
.qb-table { width: 100%; border-collapse: collapse; min-width: 0; table-layout: fixed; }
.qb-table th.qb-col-id { width: 72px; }
.qb-table th.qb-col-title { width: auto; }
.qb-table th.qb-col-cat { width: 120px; }
.qb-table th.qb-col-doc-type { width: 96px; }
.qb-table th.qb-col-status { width: 88px; }
.qb-table th.qb-col-date { width: 120px; }
.qb-table th.qb-col-ops { width: 168px; }
.qb-table thead th {
  font-size: 13px; font-weight: 600; color: var(--rule-muted-foreground);
  text-align: left; padding: 12px 12px;
  border-bottom: 1px solid var(--rule-border); white-space: nowrap;
}
.qb-table tbody td {
  font-size: 14px; color: var(--rule-foreground);
  padding: 14px 12px; border-bottom: 1px solid var(--rule-border);
  vertical-align: middle; overflow: hidden;
}
.qb-table tbody tr:last-child td { border-bottom: none; }
.qb-table tbody tr { transition: background 0.2s ease; }
.qb-table tbody tr:hover { background: color-mix(in srgb, var(--rule-primary) 5%, transparent); }
.qb-qid { font-family: var(--rule-font-mono); font-size: 13px; font-weight: 600; color: var(--rule-primary); white-space: nowrap; }
.qb-qcontent { color: var(--rule-ink-2); max-width: none; }
.qb-qcontent-text { display: inline-block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: middle; }
.qb-date { color: var(--rule-muted-foreground); font-variant-numeric: tabular-nums; white-space: nowrap; font-size: 13px; }

/* 类型标签 */
.qb-type-tag { display: inline-flex; align-items: center; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: var(--rule-radius-full); white-space: nowrap; }
.qb-type-multi { background: var(--state-success-tint); color: var(--state-success); }

/* 难度标签 */
.qb-diff-tag { display: inline-flex; align-items: center; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: var(--rule-radius-full); white-space: nowrap; }
.qb-diff-easy { background: var(--state-success-tint); color: var(--state-success); }
.qb-diff-mid { background: var(--state-warning-tint); color: var(--state-warning); }

/* 操作按钮 */
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

/* 分页 */
.qb-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.qb-pagination-info {
  font-size: 13px;
  color: var(--rule-muted-foreground);
  font-variant-numeric: tabular-nums;
}
.qb-pagination-buttons {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.qb-page-item { display: inline-flex; }
.qb-page-btn,
.qb-page-ellipsis {
  min-width: 32px; height: 32px;
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0 10px;
  font-size: 13px; font-weight: 600; color: var(--rule-ink-2);
  border-radius: 8px;
  border: 1px solid var(--rule-border); background: var(--rule-card);
  cursor: pointer; font-variant-numeric: tabular-nums;
  transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease, opacity 0.15s ease;
}
.qb-page-ellipsis { border-color: transparent; background: transparent; cursor: default; }
.qb-page-btn:hover:not(.is-disabled):not(.is-active) { border-color: var(--rule-primary); color: var(--rule-primary); }
.qb-page-btn.is-active {
  background: var(--rule-primary);
  border-color: var(--rule-primary);
  color: #FFFFFF;
}
.qb-page-btn.is-disabled { opacity: 0.45; cursor: not-allowed; }

@media (max-width: 1024px) {
  .res-kpi-strip { flex-wrap: wrap; }
  .res-kpi-item { min-width: calc(50% - 12px); }
}
@media (max-width: 768px) {
  .app-sidebar { transform: translateX(-100%); transition: transform 0.3s ease; }
  .app-main { margin-left: 0; }
  .app-content { padding: 20px; }
  .qb-toolbar-row { flex-direction: column; align-items: stretch; }
  .qb-filter-group { width: 100%; flex-wrap: wrap; }
  .qb-create-btn { width: 100%; justify-content: center; }
}
@media (max-width: 640px) {
  .res-kpi-item { min-width: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .dc-section { transition-duration: 0.01ms; }
  .res-kpi-item:hover, .qb-create-btn:hover { transform: none; }
}

/* 批量导入知识条目 */
.qb-batch-card {
  background: var(--rule-card, #fff);
  border: 1px solid var(--rule-border, #e5e7eb);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.qb-batch-actions { flex-shrink: 0; }
.qb-file-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  color: var(--rule-primary-foreground, #fff);
  background: var(--rule-primary, #2563eb);
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.15s ease;
}
.qb-file-btn:hover { transform: translateY(-1px); opacity: 0.92; }
.qb-file-btn .navi-icon { width: 14px; height: 14px; background: var(--rule-primary-foreground, #fff); }
.qb-batch-textarea { min-height: 240px; font-family: inherit; line-height: 1.7; }
.qb-batch-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.qb-batch-count { font-size: 13px; color: var(--rule-primary, #2563eb); font-weight: 600; }
.qb-batch-count-muted { color: var(--rule-muted-foreground, #6b7280); font-weight: 400; }
.qb-batch-result {
  font-size: 13px;
  color: var(--rule-success, #16a34a);
  font-weight: 600;
  padding: 8px 12px;
  background: rgba(22, 163, 74, 0.08);
  border-radius: 8px;
}
.qb-batch-result.is-error {
  color: var(--rule-error, #dc2626);
  background: rgba(220, 38, 38, 0.08);
}
.qb-create-btn.qb-create-btn-success {
  background: var(--rule-success, #16a34a);
  color: #fff;
  border: none;
}
.qb-create-btn.qb-create-btn-success.is-disabled { opacity: 0.6; pointer-events: none; }
</style>
