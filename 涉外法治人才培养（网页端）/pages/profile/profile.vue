<template>
  <view class="profile-shell">
    <!-- ===== App Shell (Sidebar + Main) ===== -->
    <view class="app-shell">
      <!-- ===== Left Sidebar ===== -->
      <aside class="app-sidebar">
        <view class="app-sidebar-logo">
          <view class="app-sidebar-logo-icon">
            <view class="ls-svg-glyph" aria-hidden="true"></view>
          </view>
          <text class="app-sidebar-logo-text">涉外法治人才培养</text>
        </view>

        <nav class="app-sidebar-nav">
          <view class="app-nav-item" @tap="navigateTo('/pages/survey/survey')">
            <view class="navi-icon navi-icon-survey"></view>
            <text>问卷测评</text>
          </view>
          <view class="app-nav-item" @tap="navigateTo('/pages/report/report')">
            <view class="navi-icon navi-icon-chart"></view>
            <text>数据中心</text>
          </view>
          <view class="app-nav-item" @tap="navigateTo('/pages/legal-db/legal-db')">
            <view class="navi-icon navi-icon-book"></view>
            <text>法律库</text>
          </view>
          <view class="app-nav-item" @tap="navigateTo('/pages/ai-assistant/ai-assistant')">
            <view class="navi-icon navi-icon-bot"></view>
            <text>AI助手</text>
          </view>
          <view class="app-nav-item" @tap="navigateTo('/pages/learning-center/learning-center')">
            <view class="navi-icon navi-icon-book-open"></view>
            <text>学习中心</text>
          </view>
        </nav>

        <view class="app-sidebar-user">
          <view class="app-sidebar-user-inner" @tap="navigateTo('/pages/profile/profile')">
            <view class="app-sidebar-user-avatar">{{ avatarChar }}</view>
            <view style="min-width:0;flex:1">
              <text class="app-sidebar-user-name">{{ displayName }}</text>
              <text class="app-sidebar-user-role">{{ displayRole }}</text>
            </view>
          </view>
          <view class="app-sidebar-logout" @tap="handleLogout">
            <view class="app-sidebar-logout-icon"></view>
            <text class="app-sidebar-logout-text">退出登录</text>
          </view>
        </view>
      </aside>

      <!-- ===== Main Content Area ===== -->
      <view class="app-main">
        <header class="app-topbar">
          <text class="app-topbar-title">个人中心</text>
          <text class="app-topbar-meta">{{ todayDateText }}</text>
        </header>

        <main class="app-content">
          <view class="pc-main">

            <!-- 1. Profile Header Card -->
            <view class="pc-profile-card">
              <view class="pc-profile-avatar">{{ avatarChar }}</view>
              <text class="pc-profile-name">{{ displayName }}</text>
              <view class="pc-profile-role">{{ displayRole }}</view>
              <view class="pc-edit-btn" @tap="handleEditProfile">
                <view class="pc-edit-icon"></view>
                <text>编辑资料</text>
              </view>
              <text class="pc-profile-since">加入时间：{{ joinDate }}</text>
            </view>

            <!-- 2. Basic Information -->
            <view class="pc-card">
              <view class="pc-section-title">
                <view class="pc-accent-bar"></view>
                <text>基本信息</text>
              </view>
              <view class="pc-info-grid">
                <view class="pc-info-item" v-for="(item, idx) in basicInfo" :key="idx">
                  <text class="pc-info-label">{{ item.label }}</text>
                  <text class="pc-info-value">{{ item.value }}</text>
                </view>
              </view>
            </view>

            <!-- 3. Assessment History -->
            <view class="pc-card">
              <view class="pc-section-title">
                <view class="pc-accent-bar"></view>
                <text>测评记录</text>
              </view>
              <view style="overflow-x:auto;">
                <table class="pc-table">
                  <thead>
                    <tr>
                      <th>日期</th>
                      <th>测评名称</th>
                      <th>分数</th>
                      <th>等级</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="!assessmentHistory.length">
                      <td colspan="4" class="pc-empty">暂无测评记录，完成测评后数据会展示在这里</td>
                    </tr>
                    <tr v-for="(row, idx) in assessmentHistory" :key="idx">
                      <td>{{ row.date }}</td>
                      <td>{{ row.name }}</td>
                      <td class="col-score">{{ row.score }}分</td>
                      <td>
                        <text class="pc-grade" :class="row.gradeClass">{{ row.grade }}</text>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </view>
            </view>

            <!-- 4. Account Settings -->
            <view class="pc-card">
              <view class="pc-section-title">
                <view class="pc-accent-bar"></view>
                <text>账号安全</text>
              </view>
              <view class="pc-settings-list">
                <view class="pc-settings-item" @tap="handleChangePassword">
                  <view class="pc-settings-left">
                    <view class="pc-settings-icon">
                      <view class="pc-icon pc-icon-key"></view>
                    </view>
                    <text class="pc-settings-label">修改密码</text>
                  </view>
                  <view class="pc-settings-right">
                    <view class="pc-chevron"></view>
                  </view>
                </view>
                <view class="pc-settings-item" v-if="emailBound">
                  <view class="pc-settings-left">
                    <view class="pc-settings-icon">
                      <view class="pc-icon pc-icon-mail"></view>
                    </view>
                    <text class="pc-settings-label">绑定邮箱</text>
                  </view>
                  <view class="pc-settings-right">
                    <view class="pc-settings-status is-ok">
                      <text>{{ emailBound }}</text>
                      <view class="pc-icon-check-sm"></view>
                    </view>
                  </view>
                </view>
                <view class="pc-settings-item">
                  <view class="pc-settings-left">
                    <view class="pc-settings-icon">
                      <view class="pc-icon pc-icon-bell"></view>
                    </view>
                    <text class="pc-settings-label">消息通知</text>
                  </view>
                  <view class="pc-settings-right">
                    <view class="pc-settings-status is-ok">
                      <text>已开启</text>
                      <view class="pc-icon-check-sm"></view>
                    </view>
                  </view>
                </view>
                <view class="pc-settings-item" @tap="handlePrivacy">
                  <view class="pc-settings-left">
                    <view class="pc-settings-icon">
                      <view class="pc-icon pc-icon-shield"></view>
                    </view>
                    <text class="pc-settings-label">隐私设置</text>
                  </view>
                  <view class="pc-settings-right">
                    <view class="pc-chevron"></view>
                  </view>
                </view>
              </view>
            </view>

            <!-- 编辑资料弹窗 -->
            <view v-if="editVisible" class="pc-modal-mask" @tap.self="editVisible = false">
              <view class="pc-modal">
                <view class="pc-modal-head">
                  <text class="pc-modal-title">编辑资料</text>
                  <text class="pc-modal-close" @tap="editVisible = false">×</text>
                </view>
                <view class="pc-modal-body">
                  <view class="pc-field">
                    <text class="pc-field-label">姓名</text>
                    <input class="pc-field-input" v-model="editForm.name" placeholder="选填" />
                  </view>
                  <view class="pc-field">
                    <text class="pc-field-label">手机号</text>
                    <input class="pc-field-input" type="number" maxlength="11" v-model="editForm.phone" placeholder="选填" />
                  </view>
                  <view class="pc-field">
                    <text class="pc-field-label">邮箱</text>
                    <input class="pc-field-input" v-model="editForm.email" placeholder="选填" />
                  </view>
                  <view class="pc-field">
                    <text class="pc-field-label">性别</text>
                    <view class="pc-radio-row">
                      <view class="pc-radio" :class="{ 'is-active': editForm.gender === '男' }" @tap="editForm.gender = '男'">男</view>
                      <view class="pc-radio" :class="{ 'is-active': editForm.gender === '女' }" @tap="editForm.gender = '女'">女</view>
                      <view class="pc-radio" :class="{ 'is-active': editForm.gender === '' }" @tap="editForm.gender = ''">保密</view>
                    </view>
                  </view>
                  <view class="pc-field">
                    <text class="pc-field-label">所在地区</text>
                    <input class="pc-field-input" v-model="editForm.region" placeholder="选填" />
                  </view>
                  <view class="pc-field">
                    <text class="pc-field-label">职业</text>
                    <input class="pc-field-input" v-model="editForm.position" placeholder="选填" />
                  </view>
                </view>
                <view class="pc-modal-foot">
                  <view class="pc-modal-btn pc-modal-cancel" @tap="editVisible = false">取消</view>
                  <view class="pc-modal-btn pc-modal-save" @tap="handleSaveEdit">{{ saving ? '保存中...' : '保存' }}</view>
                </view>
              </view>
            </view>

            <!-- 修改密码弹窗 -->
            <view v-if="passwordVisible" class="pc-modal-mask" @tap.self="passwordVisible = false">
              <view class="pc-modal">
                <view class="pc-modal-head">
                  <text class="pc-modal-title">修改密码</text>
                  <text class="pc-modal-close" @tap="passwordVisible = false">×</text>
                </view>
                <view class="pc-modal-body">
                  <view class="pc-field">
                    <text class="pc-field-label">当前密码</text>
                    <input class="pc-field-input" type="password" v-model="passwordForm.oldPassword" placeholder="请输入当前密码" />
                  </view>
                  <view class="pc-field">
                    <text class="pc-field-label">新密码</text>
                    <input class="pc-field-input" type="password" v-model="passwordForm.newPassword" placeholder="至少 6 位" />
                  </view>
                  <view class="pc-field">
                    <text class="pc-field-label">确认新密码</text>
                    <input class="pc-field-input" type="password" v-model="passwordForm.confirmPassword" placeholder="再次输入新密码" />
                  </view>
                </view>
                <view class="pc-modal-foot">
                  <view class="pc-modal-btn pc-modal-cancel" @tap="passwordVisible = false">取消</view>
                  <view class="pc-modal-btn pc-modal-save" @tap="handleSavePassword">{{ savingPwd ? '提交中...' : '确认修改' }}</view>
                </view>
              </view>
            </view>

          </view>
        </main>
      </view>
    </view>
  </view>
</template>

<script>
import { requireLogin, getDisplayName, getLevelText } from '@/utils/auth.js'
export default {
  name: 'Profile',
  onLoad() {
    if (!requireLogin()) return
    this.userInfo = uni.getStorageSync('userInfo') || {}
  },
  onShow() {
    if (requireLogin()) this.loadResults()
  },
  data() {
    return {
      userInfo: {},
      editVisible: false,
      saving: false,
      editForm: { name: '', phone: '', email: '', gender: '', region: '', position: '' },
      // 修改密码弹窗
      passwordVisible: false,
      savingPwd: false,
      passwordForm: { oldPassword: '', newPassword: '', confirmPassword: '' },
      // 测评记录：后续接入 survey 云对象后从云端拉取
      assessmentHistory: []
    }
  },
  computed: {
    todayDateText() {
      const now = new Date()
      const y = now.getFullYear()
      const m = String(now.getMonth() + 1).padStart(2, '0')
      const d = String(now.getDate()).padStart(2, '0')
      return `${y}年${m}月${d}日`
    },
    // 显示名：填了姓名显示姓名，否则显示登录账号
    displayName() {
      return getDisplayName()
    },
    displayRole() {
      return getLevelText()
    },
    avatarChar() {
      return (this.displayName || '用').slice(0, 1)
    },
    joinDate() {
      const ts = this.userInfo.createDate
      if (!ts) return '未知'
      const d = new Date(ts)
      return `${d.getFullYear()}年${d.getMonth() + 1}月`
    },
    // 绑定了邮箱则显示"已绑定"，否则不显示该行
    emailBound() {
      return this.userInfo.email ? '已绑定' : ''
    },
    // 基本信息：已填显示，未填显示 -
    basicInfo() {
      const u = this.userInfo
      return [
        { label: '姓名', value: u.name || '-' },
        { label: '登录账号', value: u.account || '-' },
        { label: '等级', value: u.levelText || u.level || '-' },
        { label: '性别', value: u.gender || '-' },
        { label: '手机', value: u.phone || '-' },
        { label: '邮箱', value: u.email || '-' },
        { label: '所在地区', value: u.region || '-' },
        { label: '职业', value: u.position || '-' }
      ]
    }
  },
  methods: {
    loadResults() {
      const token = uni.getStorageSync('token')
      if (!token) return
    const surveyObj = uniCloud.importObject('survey', { customUI: true })
      surveyObj.myResults({ token, page: 1, pageSize: 20 })
        .then((r) => {
          r = r || {}
          if (r.errCode !== 0) {
            uni.showToast({ title: r.errMsg || '测评记录加载失败', icon: 'none' })
            return
          }
          this.assessmentHistory = (r.list || []).map(item => ({
            id: item._id || item.id,
            date: this.formatDate(item.createDate),
            name: item.mode === 'special' ? (item.specialCategory || '专项测评') : '综合测评',
            score: Number(item.score) || 0,
            grade: item.level || '未评级',
            gradeClass: this.gradeClass(Number(item.score) || 0)
          }))
        })
        .catch((err) => {
          console.error('[profile] loadResults error:', err)
          uni.showToast({ title: (err && err.errMsg) || '测评记录加载失败', icon: 'none' })
        })
    },
    formatDate(ts) {
      if (!ts) return '-'
      const d = new Date(ts)
      if (isNaN(d.getTime())) return String(ts)
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    },
    gradeClass(score) {
      if (score >= 90) return 'pc-grade-excellent'
      if (score >= 70) return 'pc-grade-good'
      return ''
    },
    navigateTo(url) {
      uni.navigateTo({ url })
    },
    handleEditProfile() {
      const u = this.userInfo
      this.editForm = {
        name: u.name || '',
        phone: u.phone || '',
        email: u.email || '',
        gender: u.gender || '',
        region: u.region || '',
        position: u.position || ''
      }
      this.editVisible = true
    },
    handleSaveEdit() {
      const token = uni.getStorageSync('token')
      if (!token) {
        uni.showToast({ title: '请先登录', icon: 'none' })
        return
      }
      const phone = (this.editForm.phone || '').trim()
      if (phone && !/^1\d{10}$/.test(phone)) {
        uni.showToast({ title: '手机号格式不正确', icon: 'none' })
        return
      }
      const email = (this.editForm.email || '').trim()
      if (email && !/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(email)) {
        uni.showToast({ title: '邮箱格式不正确', icon: 'none' })
        return
      }
      this.saving = true
      const usersObj = uniCloud.importObject('users', { customUI: true })
      usersObj.updateProfile({ token, data: { ...this.editForm } })
        .then((r) => {
          r = r || {}
          if (r.errCode !== 0) {
            uni.showToast({ title: r.errMsg || '保存失败', icon: 'none' })
            this.saving = false
            return
          }
          uni.setStorageSync('userInfo', r.userInfo)
          this.userInfo = r.userInfo
          this.editVisible = false
          this.saving = false
          uni.showToast({ title: '保存成功', icon: 'success' })
        })
        .catch((err) => {
          console.error('[profile] updateProfile 调用失败:', err)
          uni.showToast({ title: (err && err.errMsg) || '网络异常，请稍后重试', icon: 'none' })
          this.saving = false
        })
    },
    handleChangePassword() {
      this.passwordForm = { oldPassword: '', newPassword: '', confirmPassword: '' }
      this.passwordVisible = true
    },
    handleSavePassword() {
      const { oldPassword, newPassword, confirmPassword } = this.passwordForm
      if (!oldPassword || !newPassword || !confirmPassword) {
        uni.showToast({ title: '请填写完整', icon: 'none' })
        return
      }
      if (String(newPassword).length < 6) {
        uni.showToast({ title: '新密码至少 6 位', icon: 'none' })
        return
      }
      if (newPassword !== confirmPassword) {
        uni.showToast({ title: '两次输入的新密码不一致', icon: 'none' })
        return
      }
      const token = uni.getStorageSync('token')
      if (!token) {
        uni.showToast({ title: '请先登录', icon: 'none' })
        return
      }
      this.savingPwd = true
      const usersObj = uniCloud.importObject('users', { customUI: true })
      usersObj.changePassword({ token, oldPassword, newPassword })
        .then((r) => {
          r = r || {}
          this.savingPwd = false
          if (r.errCode !== 0) {
            uni.showToast({ title: r.errMsg || '修改失败', icon: 'none' })
            return
          }
          this.passwordVisible = false
          this.passwordForm = { oldPassword: '', newPassword: '', confirmPassword: '' }
          uni.showToast({ title: '密码修改成功', icon: 'success' })
        })
        .catch((err) => {
          console.error('[profile] changePassword 调用失败:', err)
          this.savingPwd = false
          uni.showToast({ title: (err && err.errMsg) || '网络异常，请稍后重试', icon: 'none' })
        })
    },
    handlePrivacy() {
      uni.showToast({ title: '隐私设置', icon: 'none' })
    },
    handleLogout() {
      uni.showModal({
        title: '确认退出',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            uni.removeStorageSync('userInfo')
            uni.removeStorageSync('token')
            uni.redirectTo({ url: '/pages/login/login' })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
/* ============================================================
   Brand Design Tokens
   ============================================================ */
.profile-shell {
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

  min-height: 100vh;
  background: var(--rule-background);
  color: var(--rule-foreground);
  font-family: "Inter", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: "cv11", "ss01";
}

/* ============================================================
   Shell Layout
   ============================================================ */
.app-shell { display: flex; min-height: 100vh; background: var(--rule-background); }

/* ===== Sidebar ===== */
.app-sidebar {
  position: fixed; left: 0; top: 0; height: 100vh; width: 240px;
  display: flex; flex-direction: column;
  background: var(--rule-card);
  border-right: 1px solid var(--rule-border);
  z-index: 40; flex-shrink: 0;
}
.app-sidebar-logo {
  display: flex; align-items: center; gap: 10px;
  padding: 20px 24px;
  border-bottom: 1px solid var(--rule-border);
  color: inherit;
}

.app-sidebar-logo-icon {
  width: 36px; height: 36px; border-radius: 8px;
  background: var(--rule-primary);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; overflow: hidden;
}
.ls-svg-glyph {
  width: 20px; height: 20px; background: #fff;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M7 21h10'/><path d='M12 3v18'/><path d='M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M7 21h10'/><path d='M12 3v18'/><path d='M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2'/></svg>") center/contain no-repeat;
}
.app-sidebar-logo-text {
  font-size: 15px; font-weight: 600;
  color: var(--rule-foreground);
  white-space: nowrap;
}

.app-sidebar-nav {
  flex: 1; padding: 16px 12px;
  display: flex; flex-direction: column;
  gap: 4px; overflow-y: auto;
}
.app-nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px; border-radius: 8px;
  font-size: 14px; font-weight: 500;
  color: var(--rule-ink-2);
  transition: background 0.15s ease, color 0.15s ease;
  cursor: pointer;
}
.app-nav-item:hover { background: var(--rule-muted); color: var(--rule-foreground); }

.navi-icon {
  width: 20px; height: 20px; flex-shrink: 0;
  background: currentColor; display: inline-block;
}
.navi-icon-survey {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><rect width='8' height='4' x='8' y='2' rx='1'/><path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'/><path d='M12 11h4'/><path d='M12 16h4'/><circle cx='9' cy='11' r='1.2'/><circle cx='9' cy='16' r='1.2'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><rect width='8' height='4' x='8' y='2' rx='1'/><path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'/><path d='M12 11h4'/><path d='M12 16h4'/><circle cx='9' cy='11' r='1.2'/><circle cx='9' cy='16' r='1.2'/></svg>") center/contain no-repeat;
}
.navi-icon-chart {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M3 3v18h18'/><path d='M18 17V9'/><path d='M13 17V5'/><path d='M8 17v-3'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M3 3v18h18'/><path d='M18 17V9'/><path d='M13 17V5'/><path d='M8 17v-3'/></svg>") center/contain no-repeat;
}
.navi-icon-book {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>") center/contain no-repeat;
}
.navi-icon-bot {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M12 8V4H8'/><rect width='16' height='12' x='4' y='8' rx='2'/><path d='M2 14h2'/><path d='M20 14h2'/><path d='M15 13v2'/><path d='M9 13v2'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M12 8V4H8'/><rect width='16' height='12' x='4' y='8' rx='2'/><path d='M2 14h2'/><path d='M20 14h2'/><path d='M15 13v2'/><path d='M9 13v2'/></svg>") center/contain no-repeat;
}
.navi-icon-book-open {
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/%3E%3Cpath d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/%3E%3C/svg%3E") center/contain no-repeat;
          mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/%3E%3Cpath d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/%3E%3C/svg%3E") center/contain no-repeat;
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
  background: var(--rule-primary-tint-1); color: var(--rule-primary);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 600; flex-shrink: 0;
}
.app-sidebar-user-name {
  display: block; font-size: 13px; font-weight: 500;
  color: var(--rule-foreground);
}
.app-sidebar-user-role {
  display: block; font-size: 12px;
  color: var(--rule-muted-foreground);
}

/* ===== Sidebar Logout Button ===== */
.app-sidebar-logout {
  display: flex; align-items: center; gap: 8px;
  margin: 8px 12px 0; padding: 10px 12px;
  border-radius: 8px; cursor: pointer;
  color: var(--rule-ink-2);
  transition: background 0.15s ease, color 0.15s ease;
}
.app-sidebar-logout:hover {
  background: var(--state-error-tint);
  color: var(--state-error);
}
.app-sidebar-logout-icon {
  width: 16px; height: 16px; flex-shrink: 0;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>") center/contain no-repeat;
}
.app-sidebar-logout-text {
  font-size: 13px; font-weight: 500;
}

/* ===== Main ===== */
.app-main {
  flex: 1; margin-left: 240px;
  display: flex; flex-direction: column;
  min-height: 100vh; min-width: 0;
}
.app-topbar {
  height: 64px; border-bottom: 1px solid var(--rule-border);
  background: var(--rule-card);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 32px; flex-shrink: 0;
}
.app-topbar-title { font-size: 18px; font-weight: 600; color: var(--rule-foreground); }
.app-topbar-meta { font-size: 13px; color: var(--rule-muted-foreground); }
.app-content { flex: 1; padding: 32px; }

/* ============================================================
   Personal Center Page Styles
   ============================================================ */
.pc-main {
  width: 100%; max-width: 920px; margin: 0 auto;
  display: flex; flex-direction: column; gap: 24px;
}

/* ===== Profile Header Card ===== */
.pc-profile-card {
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: var(--rule-radius-large);
  padding: 32px;
  box-shadow: var(--rule-shadow-1);
  display: flex; flex-direction: column; align-items: center;
  gap: 12px; text-align: center;
}
.pc-profile-avatar {
  width: 80px; height: 80px; border-radius: 9999px;
  background: var(--rule-primary-tint-1); color: var(--rule-primary);
  display: flex; align-items: center; justify-content: center;
  font-size: 32px; font-weight: 700; letter-spacing: -0.02em;
}
.pc-profile-name {
  font-size: 24px; font-weight: 700; color: var(--rule-foreground);
  letter-spacing: -0.01em; line-height: 1.2;
}
.pc-profile-role {
  display: inline-flex; align-items: center;
  padding: 4px 12px; border-radius: 9999px;
  background: var(--rule-primary-tint-3); color: var(--rule-primary);
  font-size: 13px; font-weight: 500;
}
.pc-edit-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: var(--rule-radius-medium);
  border: 1px solid var(--rule-border); background: var(--rule-card);
  color: var(--rule-foreground); font-size: 14px; font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease;
}
.pc-edit-btn:hover { border-color: var(--rule-primary); color: var(--rule-primary); }
.pc-edit-icon {
  width: 16px; height: 16px; background: currentColor;
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M12 20h9'/><path d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z'/></svg>");
          mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M12 20h9'/><path d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z'/></svg>");
  -webkit-mask-size: contain; mask-size: contain;
  -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
  -webkit-mask-position: center; mask-position: center;
}
.pc-profile-since { font-size: 13px; color: var(--rule-muted-foreground); }

/* ===== Generic Info Card ===== */
.pc-card {
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: var(--rule-radius-large);
  padding: 28px;
  box-shadow: var(--rule-shadow-1);
}
.pc-section-title {
  display: flex; align-items: center; gap: 10px;
  font-size: 16px; font-weight: 600; color: var(--rule-foreground);
  margin-bottom: 20px;
}
.pc-accent-bar {
  display: inline-block; width: 3px; height: 16px;
  background: var(--rule-primary); border-radius: 2px; flex-shrink: 0;
}

/* ===== Basic Info Grid ===== */
.pc-info-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px 32px;
}
.pc-info-item { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.pc-info-label { font-size: 13px; color: var(--rule-muted-foreground); }
.pc-info-value { font-size: 15px; color: var(--rule-foreground); word-break: break-word; }

/* ===== Assessment History Table ===== */
.pc-table { width: 100%; border-collapse: collapse; }
.pc-table th {
  text-align: left; padding: 12px;
  font-size: 13px; font-weight: 500; color: var(--rule-muted-foreground);
  border-bottom: 1px solid var(--rule-border); white-space: nowrap;
}
.pc-table td {
  padding: 12px; font-size: 14px; color: var(--rule-foreground);
  border-bottom: 1px solid var(--rule-border);
}
.pc-table tbody tr:last-child td { border-bottom: none; }
.col-score { font-variant-numeric: tabular-nums; white-space: nowrap; }
.pc-grade {
  display: inline-flex; align-items: center;
  padding: 3px 10px; border-radius: 9999px;
  font-size: 12px; font-weight: 500; white-space: nowrap;
}
.pc-grade-excellent {
  background: var(--state-success-tint); color: var(--state-success);
}
.pc-grade-good {
  background: var(--rule-primary-tint-3); color: var(--rule-primary);
}

/* ===== Account Settings ===== */
.pc-settings-list { display: flex; flex-direction: column; }
.pc-settings-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 8px; border-bottom: 1px solid var(--rule-border);
  cursor: pointer; transition: background-color 0.15s ease;
  border-radius: var(--rule-radius-small);
}
.pc-settings-item:last-child { border-bottom: none; }
.pc-settings-item:hover { background: var(--rule-muted); }
.pc-settings-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
.pc-settings-icon {
  width: 36px; height: 36px; border-radius: var(--rule-radius-medium);
  background: var(--rule-surface-2);
  display: flex; align-items: center; justify-content: center;
  color: var(--rule-ink-2); flex-shrink: 0;
}
.pc-icon {
  width: 18px; height: 18px; background: currentColor;
  -webkit-mask-size: contain; mask-size: contain;
  -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
  -webkit-mask-position: center; mask-position: center;
}
.pc-icon-key {
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><circle cx='7.5' cy='15.5' r='5.5'/><path d='m21 2-9.6 9.6'/><path d='m15.5 7.5 3 3L22 7l-3-3'/></svg>");
          mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><circle cx='7.5' cy='15.5' r='5.5'/><path d='m21 2-9.6 9.6'/><path d='m15.5 7.5 3 3L22 7l-3-3'/></svg>");
}
.pc-icon-mail {
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><rect width='20' height='16' x='2' y='4' rx='2'/><path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'/></svg>");
          mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><rect width='20' height='16' x='2' y='4' rx='2'/><path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'/></svg>");
}
.pc-icon-bell {
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9'/><path d='M10.3 21a1.94 1.94 0 0 0 3.4 0'/></svg>");
          mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9'/><path d='M10.3 21a1.94 1.94 0 0 0 3.4 0'/></svg>");
}
.pc-icon-shield {
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'/></svg>");
          mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'/></svg>");
}
.pc-icon-check-sm {
  width: 14px; height: 14px; background: currentColor;
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'/><polyline points='22 4 12 14.01 9 11.01'/></svg>");
          mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'/><polyline points='22 4 12 14.01 9 11.01'/></svg>");
  -webkit-mask-size: contain; mask-size: contain;
  -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
  -webkit-mask-position: center; mask-position: center;
}
.pc-settings-label { font-size: 14px; font-weight: 500; color: var(--rule-foreground); }
.pc-settings-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.pc-settings-status {
  font-size: 13px; color: var(--rule-muted-foreground);
  display: inline-flex; align-items: center; gap: 4px;
}
.pc-settings-status.is-ok { color: var(--state-success); }
.pc-chevron {
  width: 16px; height: 16px; background: var(--rule-ink-3);
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='9 18 15 12 9 6'/></svg>");
          mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='9 18 15 12 9 6'/></svg>");
  -webkit-mask-size: contain; mask-size: contain;
  -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
  -webkit-mask-position: center; mask-position: center;
  flex-shrink: 0;
}

/* ===== Assessment Empty ===== */
.pc-empty {
  text-align: center;
  color: var(--rule-muted-foreground);
  padding: 28px 12px !important;
}

/* ===== Edit Modal ===== */
.pc-modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 24px;
}
.pc-modal {
  width: 100%;
  max-width: 460px;
  max-height: 86vh;
  overflow-y: auto;
  background: var(--rule-card);
  border-radius: 16px;
  box-shadow: var(--rule-shadow-3);
  padding: 24px 28px;
}
.pc-modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.pc-modal-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--rule-foreground);
}
.pc-modal-close {
  font-size: 24px;
  line-height: 1;
  color: var(--rule-ink-3);
  cursor: pointer;
  padding: 0 4px;
}
.pc-modal-close:hover { color: var(--rule-foreground); }
.pc-modal-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.pc-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.pc-field-label {
  font-size: 13px;
  color: var(--rule-muted-foreground);
}
.pc-field-input {
  height: 42px;
  border: 1px solid var(--rule-input);
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  color: var(--rule-foreground);
  background: var(--rule-surface);
  outline: none;
}
.pc-field-input:focus {
  border-color: var(--rule-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}
.pc-radio-row {
  display: flex;
  gap: 10px;
}
.pc-radio {
  padding: 7px 18px;
  border-radius: 9999px;
  border: 1px solid var(--rule-input);
  font-size: 13px;
  color: var(--rule-ink-2);
  cursor: pointer;
  transition: all 0.15s ease;
}
.pc-radio:hover { border-color: var(--rule-primary); color: var(--rule-primary); }
.pc-radio.is-active {
  background: var(--rule-primary);
  border-color: var(--rule-primary);
  color: #fff;
}
.pc-modal-foot {
  display: flex;
  gap: 12px;
  margin-top: 22px;
}
.pc-modal-btn {
  flex: 1;
  height: 42px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}
.pc-modal-cancel {
  border: 1px solid var(--rule-input);
  color: var(--rule-ink-2);
  background: var(--rule-card);
}
.pc-modal-cancel:hover { border-color: var(--rule-ink-3); }
.pc-modal-save {
  background: var(--rule-primary);
  color: #fff;
}
.pc-modal-save:hover { background: var(--rule-primary-hover); }

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .app-sidebar { transform: translateX(-100%); transition: transform 0.3s; }
  .app-main { margin-left: 0; }
  .app-content { padding: 16px; }
  .pc-info-grid { grid-template-columns: 1fr; }
  .pc-card, .pc-profile-card { padding: 20px; }
}
@media (prefers-reduced-motion: reduce) {
  * { transition-duration: 0.01ms !important; }
}
</style>
