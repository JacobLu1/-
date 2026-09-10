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
        <view class="app-nav-item is-active" @tap="navigateTo('/pages/admin/user-management')">
          <view class="navi-icon navi-icon-users"></view>
          <text>用户管理</text>
        </view>
        <view class="app-nav-item" @tap="navigateTo('/pages/admin/question-bank')">
          <view class="navi-icon navi-icon-file-question"></view>
          <text>题库管理</text>
        </view>
        <view class="app-nav-item" @tap="navigateTo('/pages/admin/knowledge-management')">
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
          <text class="app-topbar-title">用户管理</text>
          <text class="app-topbar-breadcrumb">管理端 / 用户</text>
        </view>
        <text class="app-topbar-meta">{{ todayDateText }}</text>
      </header>
      <main class="app-content">

        <!-- 用户概览统计 -->
        <section class="dc-section" :class="{ 'is-visible': visibleSections[0] }" aria-label="用户概览统计">
          <view class="res-kpi-strip">
            <view class="res-kpi-item res-kpi-total">
              <view class="res-kpi-icon"><view class="navi-icon navi-icon-users"></view></view>
              <view class="res-kpi-body">
                <text class="res-kpi-value">{{ totalUsers }}</text>
                <text class="res-kpi-label">用户总数</text>
              </view>
            </view>
            <view class="res-kpi-item res-kpi-video">
              <view class="res-kpi-icon"><view class="navi-icon navi-icon-user"></view></view>
              <view class="res-kpi-body">
                <text class="res-kpi-value">{{ userCount }}</text>
                <text class="res-kpi-label">普通用户</text>
              </view>
            </view>
            <view class="res-kpi-item res-kpi-vocabulary">
              <view class="res-kpi-icon"><view class="navi-icon navi-icon-shield"></view></view>
              <view class="res-kpi-body">
                <text class="res-kpi-value">{{ adminCount }}</text>
                <text class="res-kpi-label">管理员</text>
              </view>
            </view>
            <view class="res-kpi-item res-kpi-reading">
              <view class="res-kpi-icon"><view class="navi-icon navi-icon-user-plus"></view></view>
              <view class="res-kpi-body">
                <text class="res-kpi-value">{{ weekNewCount }}</text>
                <text class="res-kpi-label">本周新增</text>
              </view>
            </view>
          </view>
        </section>

        <!-- 筛选与搜索工具栏 -->
        <section class="dc-section" :class="{ 'is-visible': visibleSections[1] }" aria-label="筛选与搜索工具栏">
          <view class="qb-toolbar">
            <view class="qb-toolbar-row">
              <view class="qb-search">
                <view class="qb-search-icon"><view class="navi-icon navi-icon-search"></view></view>
                <input type="text" class="qb-search-input" placeholder="搜索账号 / 姓名 / 手机号..." v-model="searchQuery" @confirm="loadUsers(1)" @keyup.enter="loadUsers(1)" />
              </view>
              <view class="qb-filter-group">
                <text class="qb-filter-label">角色</text>
                <view class="qb-pills">
                  <view class="qb-pill" :class="{ 'is-active': roleFilter === 'all' }" @tap="roleFilter = 'all'; loadUsers(1)">全部</view>
                  <view class="qb-pill" :class="{ 'is-active': roleFilter === 'user' }" @tap="roleFilter = 'user'; loadUsers(1)">普通用户</view>
                  <view class="qb-pill" :class="{ 'is-active': roleFilter === 'admin' }" @tap="roleFilter = 'admin'; loadUsers(1)">管理员</view>
                </view>
              </view>
              <view class="qb-create-btn" @tap="handleCreateUser">
                <view class="navi-icon navi-icon-plus" style="width:16px;height:16px;background:var(--rule-primary-foreground)"></view>
                <text>新建用户</text>
              </view>
            </view>
          </view>
        </section>

        <!-- 用户列表表格 -->
        <section class="dc-section" :class="{ 'is-visible': visibleSections[2] }" aria-label="用户列表">
          <view class="qb-section-header">
            <view class="qb-section-title-wrap">
              <view class="qb-section-bar"></view>
              <view>
                <text class="qb-section-title">用户列表</text>
                <text class="qb-section-subtitle">共 {{ listTotal }} 人</text>
              </view>
            </view>
          </view>
          <view class="qb-table-card">
            <view class="qb-table-container">
              <table class="qb-table">
                <thead>
                  <tr>
                    <th scope="col">账号</th>
                    <th scope="col">姓名</th>
                    <th scope="col">角色</th>
                    <th scope="col">等级</th>
                    <th scope="col">手机号</th>
                    <th scope="col">注册时间</th>
                    <th scope="col">最近登录</th>
                    <th scope="col">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="u in users" :key="u._id">
                    <td class="qb-qid">{{ u.account }}</td>
                    <td class="qb-dim">{{ u.name }}</td>
                    <td><text :class="['qb-type-tag', u.role === 'admin' ? 'qb-diff-hard' : 'qb-diff-easy']">{{ u.role === 'admin' ? '管理员' : '普通用户' }}</text></td>
                    <td class="qb-dim">{{ u.level || '-' }}</td>
                    <td class="qb-date">{{ u.phone || '-' }}</td>
                    <td class="qb-date">{{ formatDate(u.createDate) }}</td>
                    <td class="qb-date">{{ formatDate(u.lastLoginDate) }}</td>
                    <td>
                      <view class="qb-actions">
                        <view class="qb-action-btn qb-action-edit" @tap="handleEdit(u)">
                          <view class="navi-icon navi-icon-pencil"></view>
                          <text>编辑</text>
                        </view>
                        <view class="qb-action-btn qb-action-del" @tap="handleDelete(u)">
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
              共 {{ listTotal }} 条，每页 {{ pageSize }} 条，当前第 {{ currentPage }} / {{ totalPages }} 页
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
import { ref, computed, onMounted } from 'vue'
import { requireAdmin } from '@/utils/auth.js'

const visibleSections = ref([false, false, false, false])
const searchQuery = ref('')
const roleFilter = ref('all')
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = ref(8)

const users = ref([])
const totalUsers = ref(0)
const listTotal = ref(0)
const userCount = ref(0)
const adminCount = ref(0)
const weekNewCount = ref(0)
const userPct = computed(() => {
  if (!totalUsers.value) return 0
  return Math.round((userCount.value / totalUsers.value) * 100)
})

const todayDateText = computed(() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}年${m}月${d}日`
})

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

function getAdminToken() {
  return uni.getStorageSync('adminToken')
}

// 用户统计（指标卡片）
async function loadStats() {
  try {
    const usersObj = uniCloud.importObject('users', { customUI: true })
    const r = (await usersObj.stats({ adminToken: getAdminToken() })) || {}
    if (r.errCode === 0) {
      totalUsers.value = r.total || 0
      userCount.value = r.userCount || 0
      adminCount.value = r.adminCount || 0
      weekNewCount.value = r.weekNewCount || 0
    }
  } catch (e) {
    uni.showToast({ title: (e && e.errMsg) || '加载失败', icon: 'none' })
  }
}

// 用户列表（分页 + 搜索 + 角色筛选）
async function loadUsers(page = currentPage.value) {
  try {
    const usersObj = uniCloud.importObject('users', { customUI: true })
    const r = (await usersObj.list({
      adminToken: getAdminToken(),
      page,
      pageSize: pageSize.value,
      keyword: searchQuery.value.trim(),
      role: roleFilter.value === 'all' ? '' : roleFilter.value
    })) || {}
    if (r.errCode === 0) {
      users.value = r.list || []
      listTotal.value = r.total || 0
      totalPages.value = Math.max(1, Math.ceil((r.total || 0) / pageSize.value))
      currentPage.value = page
    }
  } catch (e) {
    uni.showToast({ title: (e && e.errMsg) || '加载失败', icon: 'none' })
  }
}

function formatDate(ts) {
  if (!ts) return '-'
  const d = new Date(Number(ts))
  if (isNaN(d.getTime())) return String(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

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

// 新建用户（依次输入账号 / 姓名 / 密码，角色默认为普通用户）
function handleCreateUser() {
  uni.showModal({
    title: '新建用户',
    editable: true,
    placeholderText: '请输入账号',
    success: (r1) => {
      if (!r1.confirm || !r1.content) return
      const account = r1.content.trim()
      uni.showModal({
        title: '新建用户',
        editable: true,
        placeholderText: '请输入姓名（可留空）',
        success: (r2) => {
          if (!r2.confirm) return
          const name = (r2.content || '').trim()
          uni.showModal({
            title: '新建用户',
            editable: true,
            placeholderText: '请输入密码（至少 6 位）',
            success: async (r3) => {
              if (!r3.confirm) return
              const password = r3.content || ''
              try {
                const usersObj = uniCloud.importObject('users', { customUI: true })
                const r = await usersObj.register({ account, password, name })
                if (!r || r.errCode === 0) {
                  uni.showToast({ title: '创建成功', icon: 'success' })
                  loadUsers(1)
                  loadStats()
                } else {
                  uni.showToast({ title: r.errMsg || '创建失败', icon: 'none' })
                }
              } catch (e) {
                uni.showToast({ title: (e && e.errMsg) || '创建失败', icon: 'none' })
              }
            }
          })
        }
      })
    }
  })
}

// 编辑用户（姓名 + 角色升降级）
function handleEdit(u) {
  uni.showModal({
    title: '编辑用户',
    editable: true,
    content: u.name,
    placeholderText: '请输入姓名',
    success: (r1) => {
      if (!r1.confirm) return
      const name = (r1.content || '').trim()
      uni.showModal({
        title: '编辑用户',
        content: u.role === 'admin' ? `将「${name}」降级为普通用户？` : `将「${name}」设为管理员？`,
        confirmText: u.role === 'admin' ? '降级' : '设为管理员',
        cancelText: '仅改姓名',
        success: async (r2) => {
          const data = { name }
          if (r2.confirm) data.role = u.role === 'admin' ? 'user' : 'admin'
          try {
            const usersObj = uniCloud.importObject('users', { customUI: true })
            const r = await usersObj.update({ adminToken: getAdminToken(), userId: u._id, data })
            if (!r || r.errCode === 0) {
              uni.showToast({ title: '已保存', icon: 'success' })
              loadUsers(currentPage.value)
              loadStats()
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

// 删除用户
function handleDelete(u) {
  uni.showModal({
    title: '确认删除',
    content: `确定要删除用户「${u.name || u.account}」吗？此操作不可恢复。`,
    confirmColor: '#DC2626',
    success: async (res) => {
      if (!res.confirm) return
      try {
        const usersObj = uniCloud.importObject('users', { customUI: true })
        const r = await usersObj.remove({ adminToken: getAdminToken(), userId: u._id })
        if (!r || r.errCode === 0) {
          uni.showToast({ title: '已删除', icon: 'success' })
          loadUsers(currentPage.value)
          loadStats()
        } else {
          uni.showToast({ title: r.errMsg || '删除失败', icon: 'none' })
        }
      } catch (e) {
        uni.showToast({ title: (e && e.errMsg) || '删除失败', icon: 'none' })
      }
    }
  })
}

const changePage = (page) => {
  const next = Number(page)
  if (!Number.isInteger(next) || next < 1 || next > totalPages.value || next === currentPage.value) return
  loadUsers(next)
}

onMounted(() => {
  if (!requireAdmin()) return
  loadStats()
  loadUsers(1)
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
.navi-icon-book {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>") center/contain no-repeat;
}
.navi-icon-users {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M22 21v-2a4 4 0 0 0-3-3.87'/><path d='M16 3.13a4 4 0 0 1 0 7.75'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M22 21v-2a4 4 0 0 0-3-3.87'/><path d='M16 3.13a4 4 0 0 1 0 7.75'/></svg>") center/contain no-repeat;
}
.navi-icon-user {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>") center/contain no-repeat;
}
.navi-icon-shield {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'/></svg>") center/contain no-repeat;
}
.navi-icon-user-plus {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><line x1='19' y1='8' x2='19' y2='14'/><line x1='22' y1='11' x2='16' y2='11'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><line x1='19' y1='8' x2='19' y2='14'/><line x1='22' y1='11' x2='16' y2='11'/></svg>") center/contain no-repeat;
}
.navi-icon-logout {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>") center/contain no-repeat;
}
.navi-icon-folder {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'/></svg>") center/contain no-repeat;
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

/* 表格卡片 */
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
.qb-dim { color: var(--rule-ink-2); white-space: nowrap; }
.qb-date { color: var(--rule-muted-foreground); font-variant-numeric: tabular-nums; white-space: nowrap; font-size: 13px; }

/* 类型标签 */
.qb-type-tag { display: inline-flex; align-items: center; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: var(--rule-radius-full); white-space: nowrap; }

/* 难度标签 */
.qb-diff-easy { background: var(--state-success-tint); color: var(--state-success); }
.qb-diff-hard { background: var(--state-error-tint); color: var(--state-error); }

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
</style>
