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
        <view class="app-nav-item is-active" @tap="navigateTo('/pages/admin/question-bank')">
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

    <!-- ===== Main Content Area ===== -->
    <view class="app-main">
      <header class="app-topbar">
        <view class="app-topbar-titles">
          <text class="app-topbar-title">题库管理</text>
          <text class="app-topbar-breadcrumb">管理端 / 题库</text>
        </view>
        <text class="app-topbar-meta">{{ todayDateText }}</text>
      </header>
      <main class="app-content">

        <!-- ===== Section 1: 题库概览统计 ===== -->
        <section class="dc-section" :class="{ 'is-visible': visibleSections[0] }" aria-label="题库概览统计">
          <view class="qb-kpi-grid">
            <view class="qb-kpi-card">
              <view class="qb-kpi-card-head">
                <text class="qb-kpi-card-label">题目总数</text>
                <view class="qb-kpi-card-icon"><view class="navi-icon navi-icon-file-text"></view></view>
              </view>
              <text class="qb-kpi-card-value">{{ kpiTotal }}</text>
              <view class="qb-kpi-card-foot">
                <view class="navi-icon navi-icon-trending-up-sm"></view>
                <text>question 集合实时统计</text>
              </view>
            </view>
            <view class="qb-kpi-card">
              <view class="qb-kpi-card-head">
                <text class="qb-kpi-card-label">单选题</text>
                <view class="qb-kpi-card-icon"><view class="navi-icon navi-icon-check-square"></view></view>
              </view>
              <text class="qb-kpi-card-value">{{ kpiSingle }}</text>
              <view class="qb-kpi-card-foot">
                <view class="navi-icon navi-icon-pie-chart"></view>
                <text>type = single</text>
              </view>
            </view>
            <view class="qb-kpi-card qb-accent-success">
              <view class="qb-kpi-card-head">
                <text class="qb-kpi-card-label">多选题</text>
                <view class="qb-kpi-card-icon"><view class="navi-icon navi-icon-list-checks"></view></view>
              </view>
              <text class="qb-kpi-card-value">{{ kpiMulti }}</text>
              <view class="qb-kpi-card-foot">
                <view class="navi-icon navi-icon-pie-chart"></view>
                <text>type = multi</text>
              </view>
            </view>
            <view class="qb-kpi-card qb-accent-warning">
              <view class="qb-kpi-card-head">
                <text class="qb-kpi-card-label">主观/判断题</text>
                <view class="qb-kpi-card-icon"><view class="navi-icon navi-icon-briefcase"></view></view>
              </view>
              <text class="qb-kpi-card-value">{{ kpiSubjective }}</text>
              <view class="qb-kpi-card-foot">
                <view class="navi-icon navi-icon-pie-chart"></view>
                <text>judge + subjective</text>
              </view>
            </view>
          </view>
        </section>

        <!-- ===== Section 2: 筛选与搜索工具栏 ===== -->
        <section class="dc-section" :class="{ 'is-visible': visibleSections[1] }" aria-label="筛选与搜索工具栏">
          <view v-if="formVisible" class="qb-form-card">
            <view class="qb-section-header">
              <view class="qb-section-title-wrap">
                <view class="qb-section-bar"></view>
                <view>
                  <text class="qb-section-title">{{ editingId ? '编辑题目' : '新建题目' }}</text>
                  <text class="qb-section-subtitle">保存后测评页实时读取已上线题目</text>
                </view>
              </view>
            </view>
            <view class="qb-form-row">
              <view class="qb-form-field">
                <text class="qb-form-label">题型</text>
                <view class="qb-pills">
                  <view class="qb-pill" :class="{ 'is-active': formType === 'single' }" @tap="formType = 'single'">单选题</view>
                  <view class="qb-pill" :class="{ 'is-active': formType === 'multi' }" @tap="formType = 'multi'">多选题</view>
                  <view class="qb-pill" :class="{ 'is-active': formType === 'judge' }" @tap="formType = 'judge'">判断题</view>
                  <view class="qb-pill" :class="{ 'is-active': formType === 'subjective' }" @tap="formType = 'subjective'">主观题</view>
                </view>
              </view>
              <view class="qb-form-field">
                <text class="qb-form-label">难度</text>
                <view class="qb-pills">
                  <view class="qb-pill" :class="{ 'is-active': formDifficulty === 'easy' }" @tap="formDifficulty = 'easy'">初级</view>
                  <view class="qb-pill" :class="{ 'is-active': formDifficulty === 'mid' }" @tap="formDifficulty = 'mid'">中级</view>
                  <view class="qb-pill" :class="{ 'is-active': formDifficulty === 'hard' }" @tap="formDifficulty = 'hard'">高级</view>
                </view>
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
              <view class="qb-form-field qb-form-grow">
                <text class="qb-form-label">题目内容</text>
                <textarea class="qb-textarea" v-model="formTitle" placeholder="请输入完整题干"></textarea>
              </view>
            </view>
            <view class="qb-form-row">
              <view class="qb-form-field qb-form-grow">
                <text class="qb-form-label">选项（单选/多选，每行一个，如 A. 合同订立地）</text>
                <textarea v-if="formType === 'single' || formType === 'multi'" class="qb-textarea qb-textarea-sm" v-model="formOptions" placeholder="A. 选项内容&#10;B. 选项内容"></textarea>
                <view v-else class="qb-form-hint">判断题和主观题无需选项</view>
              </view>
              <view class="qb-form-field">
                <text class="qb-form-label">能力维度</text>
                <input class="qb-input" v-model="formDimension" placeholder="如 国际私法" />
              </view>
              <view class="qb-form-field">
                <text class="qb-form-label">答案</text>
                <input class="qb-input" v-model="formAnswer" :placeholder="formType === 'multi' ? '如 A,B,C' : (formType === 'judge' ? '对 或 错' : '参考答案')" />
              </view>
            </view>
            <view v-if="formType === 'subjective'" class="qb-form-row">
              <view class="qb-form-field">
                <text class="qb-form-label">主观题型</text>
                <view class="qb-pills">
                  <view class="qb-pill" :class="{ 'is-active': formSubType === 'essay' }" @tap="formSubType = 'essay'">论述题</view>
                  <view class="qb-pill" :class="{ 'is-active': formSubType === 'case' }" @tap="formSubType = 'case'">案例分析题</view>
                </view>
              </view>
            </view>
            <view v-if="formType === 'subjective'" class="qb-form-row">
              <view class="qb-form-field qb-form-grow">
                <text class="qb-form-label">案例材料</text>
                <textarea class="qb-textarea qb-textarea-sm" v-model="formCaseText" placeholder="可留空"></textarea>
              </view>
              <view class="qb-form-field qb-form-grow">
                <text class="qb-form-label">作答提示</text>
                <textarea class="qb-textarea qb-textarea-sm" v-model="formPlaceholder" placeholder="可留空"></textarea>
              </view>
            </view>
            <view class="qb-form-actions">
              <view class="qb-action-btn qb-action-del" @tap="closeForm">取消</view>
              <view class="qb-create-btn" @tap="saveQuestion">保存题目</view>
            </view>
          </view>
          <view class="qb-toolbar">
            <view class="qb-toolbar-row">
              <view class="qb-search">
                <view class="qb-search-icon"><view class="navi-icon navi-icon-search"></view></view>
                <input type="text" class="qb-search-input" placeholder="搜索题目关键词..." v-model="searchQuery" />
              </view>
              <view class="qb-filter-group">
                <text class="qb-filter-label">题型</text>
                <view class="qb-pills">
                  <view class="qb-pill" :class="{ 'is-active': typeFilter === 'all' }" @tap="typeFilter = 'all'">全部</view>
                  <view class="qb-pill" :class="{ 'is-active': typeFilter === 'single' }" @tap="typeFilter = 'single'">单选题</view>
                  <view class="qb-pill" :class="{ 'is-active': typeFilter === 'multi' }" @tap="typeFilter = 'multi'">多选题</view>
                  <view class="qb-pill" :class="{ 'is-active': typeFilter === 'case' }" @tap="typeFilter = 'case'">案例分析题</view>
                </view>
              </view>
              <view class="qb-filter-group">
                <text class="qb-filter-label">难度</text>
                <view class="qb-pills">
                  <view class="qb-pill" :class="{ 'is-active': diffFilter === 'all' }" @tap="diffFilter = 'all'">全部</view>
                  <view class="qb-pill" :class="{ 'is-active': diffFilter === 'easy' }" @tap="diffFilter = 'easy'">初级</view>
                  <view class="qb-pill" :class="{ 'is-active': diffFilter === 'mid' }" @tap="diffFilter = 'mid'">中级</view>
                  <view class="qb-pill" :class="{ 'is-active': diffFilter === 'hard' }" @tap="diffFilter = 'hard'">高级</view>
                </view>
              </view>
              <view class="qb-create-btn" @tap="handleCreateQuestion">
                <view class="navi-icon navi-icon-plus" style="width:16px;height:16px;background:var(--rule-primary-foreground)"></view>
                <text>新建题目</text>
              </view>
            </view>
          </view>
        </section>

        <!-- ===== Section 3: 题目列表表格 ===== -->
        <section class="dc-section" :class="{ 'is-visible': visibleSections[2] }" aria-label="题目列表">
          <view class="qb-section-header">
            <view class="qb-section-title-wrap">
              <view class="qb-section-bar"></view>
              <view>
                <text class="qb-section-title">题目列表</text>
                <text class="qb-section-subtitle">共 {{ questions.length }} 题</text>
              </view>
            </view>
          </view>
          <view class="qb-table-card">
            <view class="qb-table-container">
              <table class="qb-table">
                <thead>
                  <tr>
                    <th scope="col">题目编号</th>
                    <th scope="col">题目内容</th>
                    <th scope="col">题型</th>
                    <th scope="col">难度</th>
                    <th scope="col">所属维度</th>
                    <th scope="col">创建时间</th>
                    <th scope="col">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="q in pagedQuestions" :key="q.id">
                    <td class="qb-qid">{{ q.id }}</td>
                    <td class="qb-qcontent"><text class="qb-qcontent-text">{{ q.content }}</text></td>
                    <td><text :class="['qb-type-tag', q.typeClass]">{{ q.typeLabel }}</text></td>
                    <td><text :class="['qb-diff-tag', q.diffClass]">{{ q.diffLabel }}</text></td>
                    <td class="qb-dim">{{ q.dimension }}</td>
                    <td class="qb-date">{{ q.date }}</td>
                    <td>
                      <view class="qb-actions">
                        <view class="qb-action-btn qb-action-edit" @tap="handleEdit(q)">
                          <view class="navi-icon navi-icon-pencil"></view>
                          <text>编辑</text>
                        </view>
                        <view class="qb-action-btn qb-action-del" @tap="handleDelete(q)">
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

        <!-- ===== Section 4: 分页 ===== -->
        <section class="dc-section" :class="{ 'is-visible': visibleSections[3] }" aria-label="分页">
          <view class="qb-pagination">
            <view class="qb-page-btn" :class="{ disabled: currentPage === 1 }" @tap="prevPage">
              <view class="navi-icon navi-icon-chevron-left"></view>
            </view>
            <view
              v-for="page in pages"
              :key="page"
              class="qb-page-btn"
              :class="{ 'is-active': currentPage === page }"
              @tap="goToPage(page)"
            >{{ page }}</view>
            <text v-if="totalPages > 5" class="qb-page-ellipsis">...</text>
            <view class="qb-page-btn" :class="{ disabled: currentPage === totalPages }" @tap="nextPage">
              <view class="navi-icon navi-icon-chevron-right"></view>
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
const typeFilter = ref('all')
const diffFilter = ref('all')
const currentPage = ref(1)
const pageSize = ref(8)
const questions = ref([])
const statsData = reactive({ total: 0, single: 0, multi: 0, judge: 0, subjective: 0 })

const TYPE_LABELS = { single: '单选题', multi: '多选题', judge: '判断题', subjective: '主观题' }
const TYPE_CLASS = { single: 'qb-type-single', multi: 'qb-type-multi', judge: 'qb-type-case', subjective: 'qb-type-case' }
const DIFF_LABELS = { easy: '初级', mid: '中级', hard: '高级' }
const DIFF_CLASS = { easy: 'qb-diff-easy', mid: 'qb-diff-mid', hard: 'qb-diff-hard' }

const kpiTotal = computed(() => statsData.total)
const kpiSingle = computed(() => statsData.single)
const kpiMulti = computed(() => statsData.multi)
const kpiSubjective = computed(() => statsData.judge + statsData.subjective)

const filteredQuestions = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return questions.value.filter(item => {
    const matchType = typeFilter.value === 'all' ||
      item.type === typeFilter.value ||
      (typeFilter.value === 'case' && item.type === 'subjective' && item.subType === 'case')
    const matchDiff = diffFilter.value === 'all' || item.difficulty === diffFilter.value
    const matchQuery = !q || item.title.toLowerCase().includes(q) || String(item.dimension || '').toLowerCase().includes(q)
    return matchType && matchDiff && matchQuery
  })
})
const totalPages = computed(() => Math.max(1, Math.ceil(filteredQuestions.value.length / pageSize.value)))
const pagedQuestions = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredQuestions.value.slice(start, start + pageSize.value)
})

const todayDateText = computed(() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}年${m}月${d}日`
})

/* ===== 题目表单 ===== */
const formVisible = ref(false)
const editingId = ref('')
const formType = ref('single')
const formSubType = ref('essay')
const formTitle = ref('')
const formOptions = ref('')
const formAnswer = ref('')
const formDimension = ref('国际私法')
const formDifficulty = ref('mid')
const formStatus = ref('审核中')
const formCaseText = ref('')
const formPlaceholder = ref('')

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

function answerText(q) {
  if (q.type === 'judge') return q.answer ? '对' : '错'
  if (Array.isArray(q.answer)) return q.answer.join(',')
  return q.answer === undefined || q.answer === null || q.answer === '' ? '-' : String(q.answer)
}

function toRow(doc) {
  return {
    id: doc._id,
    title: doc.title,
    content: doc.title,
    type: doc.type,
    typeLabel: doc.type === 'subjective'
      ? (doc.subType === 'case' || (!doc.subType && doc.caseText) ? '案例分析题' : '论述题')
      : TYPE_LABELS[doc.type] || doc.type,
    typeClass: TYPE_CLASS[doc.type] || 'qb-type-case',
    diffLabel: DIFF_LABELS[doc.difficulty] || '中级',
    diffClass: DIFF_CLASS[doc.difficulty] || 'qb-diff-mid',
    dimension: doc.dimension || '综合',
    date: formatDate(doc.createDate),
    status: doc.status || '审核中',
    difficulty: doc.difficulty || 'mid',
    answer: doc.answer,
    answerText: answerText(doc),
    options: Array.isArray(doc.options) ? doc.options : [],
    subType: doc.subType || '',
    caseText: doc.caseText || '',
    placeholder: doc.placeholder || ''
  }
}

async function loadQuestions() {
  try {
    const questionsObj = uniCloud.importObject('questions')
    const r = (await questionsObj.list({ adminToken: getAdminToken(), type: 'all', page: 1, pageSize: 200 })) || {}
    if (r.errCode === 0) {
      questions.value = (r.list || []).map(toRow)
    } else {
      uni.showToast({ title: r.errMsg || '题目加载失败', icon: 'none' })
    }
  } catch (e) {
    uni.showToast({ title: (e && e.errMsg) || '题目加载失败', icon: 'none' })
  }
}

async function loadStats() {
  try {
    const questionsObj = uniCloud.importObject('questions')
    const r = (await questionsObj.stats({ adminToken: getAdminToken() })) || {}
    if (r.errCode === 0) {
      statsData.total = r.total || 0
      statsData.single = r.single || 0
      statsData.multi = r.multi || 0
      statsData.judge = r.judge || 0
      statsData.subjective = r.subjective || 0
    }
  } catch (e) {
    uni.showToast({ title: (e && e.errMsg) || '统计加载失败', icon: 'none' })
  }
}

const pages = computed(() => {
  const result = []
  const max = Math.min(totalPages.value, 5)
  for (let i = 1; i <= max; i++) result.push(i)
  return result
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
  formType.value = 'single'
  formSubType.value = 'essay'
  formTitle.value = ''
  formOptions.value = ''
  formAnswer.value = ''
  formDimension.value = '国际私法'
  formDifficulty.value = 'mid'
  formStatus.value = '审核中'
  formCaseText.value = ''
  formPlaceholder.value = ''
}

const handleCreateQuestion = () => {
  resetForm()
  formVisible.value = true
}

const handleEdit = (q) => {
  editingId.value = q.id
  formType.value = q.type || 'single'
  formSubType.value = q.subType === 'case' ? 'case' : (q.caseText ? 'case' : 'essay')
  formTitle.value = q.title || ''
  formOptions.value = (q.options || []).map(o => `${o.key}. ${o.text}`).join('\n')
  formAnswer.value = q.type === 'judge' ? (q.answer ? '对' : '错') : (Array.isArray(q.answer) ? q.answer.join(',') : (q.answer || ''))
  formDimension.value = q.dimension || '国际私法'
  formDifficulty.value = q.difficulty || 'mid'
  formStatus.value = q.status || '审核中'
  formCaseText.value = q.caseText || ''
  formPlaceholder.value = q.placeholder || ''
  formVisible.value = true
}

const closeForm = () => {
  formVisible.value = false
  resetForm()
}

function parseOptions(text) {
  return String(text || '').split('\n').map(s => s.trim()).filter(Boolean).map((line, index) => {
    const m = line.match(/^([A-Za-z])[.、）)]?\s*(.*)$/)
    const key = m ? m[1].toUpperCase() : String.fromCharCode(65 + index)
    const text = m ? (m[2] || line) : line
    return { key, text }
  })
}

const saveQuestion = async () => {
  const title = formTitle.value.trim()
  if (!title) {
    uni.showToast({ title: '请输入题目内容', icon: 'none' })
    return
  }
  const isSubjective = formType.value === 'subjective'
  const data = {
    type: formType.value,
    subType: isSubjective ? formSubType.value : '',
    title,
    options: (formType.value === 'single' || formType.value === 'multi') ? parseOptions(formOptions.value) : [],
    answer: formType.value === 'judge' ? (formAnswer.value.trim() === '对' || formAnswer.value.trim() === 'true') : formAnswer.value.trim(),
    dimension: formDimension.value.trim() || '综合',
    difficulty: formDifficulty.value,
    caseText: formCaseText.value,
    placeholder: formPlaceholder.value,
    status: formStatus.value
  }
  try {
    const questionsObj = uniCloud.importObject('questions')
    const r = editingId.value
      ? (await questionsObj.update({ adminToken: getAdminToken(), id: editingId.value, data })) || {}
      : (await questionsObj.add({ adminToken: getAdminToken(), data })) || {}
    if (r.errCode === 0) {
      uni.showToast({ title: '已保存', icon: 'success' })
      closeForm()
      await loadQuestions()
      await loadStats()
    } else {
      uni.showToast({ title: r.errMsg || '保存失败', icon: 'none' })
    }
  } catch (e) {
    uni.showToast({ title: (e && e.errMsg) || '保存失败', icon: 'none' })
  }
}

const handleDelete = (q) => {
  uni.showModal({
    title: '确认删除',
    content: `确定要删除题目「${q.title}」吗？`,
    confirmColor: '#DC2626',
    success: async (res) => {
      if (res.confirm) {
        try {
          const questionsObj = uniCloud.importObject('questions')
          const r = (await questionsObj.remove({ adminToken: getAdminToken(), id: q.id })) || {}
          if (r.errCode === 0) {
            uni.showToast({ title: '已删除', icon: 'success' })
            await loadQuestions()
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

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const goToPage = (page) => {
  currentPage.value = page
}

onMounted(() => {
  if (!requireAdmin()) return
  loadQuestions()
  loadStats()
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
.navi-icon-clipboard-check {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><rect width='8' height='4' x='8' y='2' rx='1'/><path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'/><path d='m9 14 2 2 4-4'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><rect width='8' height='4' x='8' y='2' rx='1'/><path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'/><path d='m9 14 2 2 4-4'/></svg>") center/contain no-repeat;
}
.navi-icon-logout {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>") center/contain no-repeat;
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

/* ===== Question Form ===== */
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
.qb-form-hint { font-size: 13px; color: var(--rule-muted-foreground); padding: 12px 4px; }
.qb-form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 18px; }

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
.qb-dim { color: var(--rule-ink-2); white-space: nowrap; }
.qb-date { color: var(--rule-muted-foreground); font-variant-numeric: tabular-nums; white-space: nowrap; font-size: 13px; }

/* type tags */
.qb-type-tag { display: inline-flex; align-items: center; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: var(--rule-radius-full); white-space: nowrap; }
.qb-type-single { background: var(--rule-primary-tint-1); color: var(--rule-primary); }
.qb-type-multi { background: var(--state-success-tint); color: var(--state-success); }
.qb-type-case { background: var(--state-warning-tint); color: var(--state-warning); }

/* difficulty tags */
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

/* ===== Pagination ===== */
.qb-pagination { display: flex; justify-content: flex-end; align-items: center; gap: 6px; }
.qb-page-btn {
  min-width: 36px; height: 36px; padding: 0 12px;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 600; color: var(--rule-ink-2);
  border-radius: var(--rule-radius-full);
  border: 1px solid var(--rule-border); background: var(--rule-card);
  cursor: pointer; font-variant-numeric: tabular-nums;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}
.qb-page-btn:hover:not(.is-active):not(.disabled) { border-color: var(--rule-primary-tint-2); color: var(--rule-primary); transform: translateY(-1px); }
.qb-page-btn.is-active {
  background: linear-gradient(135deg, var(--rule-primary), var(--rule-primary-active));
  color: var(--rule-primary-foreground); border-color: transparent;
  box-shadow: 0 4px 10px -2px color-mix(in srgb, var(--rule-primary) 42%, transparent);
}
.qb-page-btn.disabled { opacity: 0.5; cursor: not-allowed; }
.qb-page-btn .navi-icon { width: 16px; height: 16px; }
.qb-page-ellipsis { padding: 0 4px; color: var(--rule-muted-foreground); font-size: 13px; }

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
  .qb-pagination { justify-content: center; }
}
@media (max-width: 640px) {
  .qb-kpi-grid { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .dc-section { transition-duration: 0.01ms; }
  .qb-kpi-card:hover, .qb-create-btn:hover { transform: none; }
}
</style>
