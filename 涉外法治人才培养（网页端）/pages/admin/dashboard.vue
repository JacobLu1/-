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
        <view class="app-nav-item is-active" @tap="navigateTo('/pages/admin/dashboard')">
          <view class="navi-icon navi-icon-dashboard"></view>
          <text>数据总览</text>
        </view>
        <view class="app-nav-item" @tap="navigateTo('/pages/admin/question-bank')">
          <view class="navi-icon navi-icon-file-question"></view>
          <text>题库管理</text>
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
          <text class="app-topbar-title">数据总览</text>
          <text class="app-topbar-breadcrumb">管理端控制台</text>
        </view>
        <text class="app-topbar-meta">{{ todayDateText }}</text>
      </header>
      <main class="app-content">

        <!-- ===== Section 1: Core KPI Cards ===== -->
        <section class="dc-section" :class="{ 'is-visible': visibleSections[0] }" aria-label="核心数据指标">
          <view class="kpi-grid">
            <view class="kpi-card">
              <view class="kpi-card-head">
                <text class="kpi-card-label">注册用户数</text>
                <view class="kpi-card-icon"><view class="navi-icon navi-icon-users"></view></view>
              </view>
              <text class="kpi-card-value">1,286</text>
              <view class="kpi-card-trend">
                <view class="navi-icon navi-icon-arrow-up-right"></view>
                <text>+128 较上月</text>
              </view>
            </view>
            <view class="kpi-card">
              <view class="kpi-card-head">
                <text class="kpi-card-label">累计测评次数</text>
                <view class="kpi-card-icon"><view class="navi-icon navi-icon-clipboard-list"></view></view>
              </view>
              <text class="kpi-card-value">3,742</text>
              <view class="kpi-card-trend">
                <view class="navi-icon navi-icon-arrow-up-right"></view>
                <text>+612 较上月</text>
              </view>
            </view>
            <view class="kpi-card">
              <view class="kpi-card-head">
                <text class="kpi-card-label">平均测评得分</text>
                <view class="kpi-card-icon"><view class="navi-icon navi-icon-trending-up"></view></view>
              </view>
              <text class="kpi-card-value">78.6</text>
              <view class="kpi-card-trend">
                <view class="navi-icon navi-icon-arrow-up-right"></view>
                <text>+2.3分 较上月</text>
              </view>
            </view>
            <view class="kpi-card">
              <view class="kpi-card-head">
                <text class="kpi-card-label">题库题目总数</text>
                <view class="kpi-card-icon"><view class="navi-icon navi-icon-file-text"></view></view>
              </view>
              <text class="kpi-card-value">568</text>
              <view class="kpi-card-trend is-primary">
                <view class="navi-icon navi-icon-arrow-up-right"></view>
                <text>+24 较上月</text>
              </view>
            </view>
          </view>
        </section>

        <!-- ===== Section 2: Trend & Distribution Charts ===== -->
        <section class="dc-section" :class="{ 'is-visible': visibleSections[1] }" aria-label="测评趋势与分布">
          <view class="charts-row">
            <!-- Left: Bar chart -->
            <view class="chart-card">
              <view class="chart-card-header">
                <view>
                  <text class="chart-card-title">平台测评趋势</text>
                  <text class="chart-card-subtitle">近6个月</text>
                </view>
              </view>
              <view class="ad-bar-chart" aria-label="平台测评趋势柱状图">
                <view class="ad-bar-area">
                  <view class="ad-bar-col"><text class="ad-bar-value">560</text><view class="ad-bar" style="height:75.5%"></view></view>
                  <view class="ad-bar-col"><text class="ad-bar-value">620</text><view class="ad-bar" style="height:83.6%"></view></view>
                  <view class="ad-bar-col"><text class="ad-bar-value">580</text><view class="ad-bar" style="height:78.2%"></view></view>
                  <view class="ad-bar-col"><text class="ad-bar-value">720</text><view class="ad-bar" style="height:97%"></view></view>
                  <view class="ad-bar-col"><text class="ad-bar-value">680</text><view class="ad-bar" style="height:91.6%"></view></view>
                  <view class="ad-bar-col"><text class="ad-bar-value">742</text><view class="ad-bar" style="height:100%"></view></view>
                </view>
                <view class="ad-bar-labels">
                  <text class="ad-bar-label">1月</text><text class="ad-bar-label">2月</text><text class="ad-bar-label">3月</text>
                  <text class="ad-bar-label">4月</text><text class="ad-bar-label">5月</text><text class="ad-bar-label">6月</text>
                </view>
              </view>
            </view>
            <!-- Right: User Type Distribution -->
            <view class="chart-card">
              <view class="chart-card-header">
                <view>
                  <text class="chart-card-title">用户类型分布</text>
                  <text class="chart-card-subtitle">按角色统计</text>
                </view>
              </view>
              <view class="ad-donut-wrap">
                <view class="ad-donut">
                  <svg viewBox="0 0 200 200" role="img" aria-label="用户类型分布环形图">
                    <g transform="rotate(-90 100 100)">
                      <circle cx="100" cy="100" r="80" fill="none" stroke-width="32" class="ad-seg-1" stroke-dasharray="326.73 502.65" stroke-dashoffset="0"/>
                      <circle cx="100" cy="100" r="80" fill="none" stroke-width="32" class="ad-seg-2" stroke-dasharray="90.48 502.65" stroke-dashoffset="-326.73"/>
                      <circle cx="100" cy="100" r="80" fill="none" stroke-width="32" class="ad-seg-3" stroke-dasharray="60.32 502.65" stroke-dashoffset="-417.21"/>
                      <circle cx="100" cy="100" r="80" fill="none" stroke-width="32" class="ad-seg-4" stroke-dasharray="25.13 502.65" stroke-dashoffset="-477.52"/>
                    </g>
                    <text x="100" y="94" text-anchor="middle" font-size="13" class="ad-donut-label">总用户</text>
                    <text x="100" y="118" text-anchor="middle" font-size="22" font-weight="700" class="ad-donut-total">1,286</text>
                  </svg>
                </view>
                <view class="ad-legend">
                  <view class="ad-legend-item"><view class="ad-legend-dot ad-dot-1"></view><text class="ad-legend-label">学生</text><text class="ad-legend-value">65%</text></view>
                  <view class="ad-legend-item"><view class="ad-legend-dot ad-dot-2"></view><text class="ad-legend-label">研究员</text><text class="ad-legend-value">18%</text></view>
                  <view class="ad-legend-item"><view class="ad-legend-dot ad-dot-3"></view><text class="ad-legend-label">教师</text><text class="ad-legend-value">12%</text></view>
                  <view class="ad-legend-item"><view class="ad-legend-dot ad-dot-4"></view><text class="ad-legend-label">管理员</text><text class="ad-legend-value">5%</text></view>
                </view>
              </view>
            </view>
          </view>
        </section>

        <!-- ===== Section 3: Recent Assessment Records Table ===== -->
        <section class="dc-section" :class="{ 'is-visible': visibleSections[2] }" aria-label="近期测评记录">
          <view class="table-card">
            <view class="chart-card-header">
              <view>
                <text class="chart-card-title">近期测评记录</text>
                <text class="chart-card-subtitle">最近10条</text>
              </view>
              <text class="chart-card-link">查看全部</text>
            </view>
            <view class="table-container">
              <table class="dc-table">
                <thead>
                  <tr>
                    <th scope="col">用户姓名</th>
                    <th scope="col">所属机构</th>
                    <th scope="col">测评维度</th>
                    <th scope="col">得分</th>
                    <th scope="col">测评时间</th>
                    <th scope="col">状态</th>
                    <th scope="col">缺口值</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>张明</td><td>华东政法大学</td><td>国际商法</td>
                    <td class="score-num score-high">85</td><td>2026-07-30 14:23</td>
                    <td><text class="status-tag status-done">已完成</text></td>
                    <td class="gap-cell">已达标</td>
                  </tr>
                  <tr>
                    <td>李芳</td><td>中国政法大学</td><td>国际投资法</td>
                    <td class="score-num score-high">92</td><td>2026-07-30 13:45</td>
                    <td><text class="status-tag status-done">已完成</text></td>
                    <td class="gap-cell gap-excellent">已达标</td>
                  </tr>
                  <tr>
                    <td>王强</td><td>西南政法大学</td><td>国际仲裁</td>
                    <td class="score-num score-mid">71</td><td>2026-07-30 11:20</td>
                    <td><text class="status-tag status-done">已完成</text></td>
                    <td class="gap-cell gap-warning">-19.3%</td>
                  </tr>
                  <tr>
                    <td>赵雪</td><td>外交学院</td><td>海商法</td>
                    <td class="score-num score-high">88</td><td>2026-07-30 10:15</td>
                    <td><text class="status-tag status-done">已完成</text></td>
                    <td class="gap-cell gap-excellent">已达标</td>
                  </tr>
                  <tr>
                    <td>陈伟</td><td>武汉大学</td><td>知识产权法</td>
                    <td class="score-num score-mid">76</td><td>2026-07-29 16:30</td>
                    <td><text class="status-tag status-done">已完成</text></td>
                    <td class="gap-cell gap-warning">-10.6%</td>
                  </tr>
                  <tr>
                    <td>刘洋</td><td>吉林大学</td><td>国际私法</td>
                    <td class="score-num score-low">63</td><td>2026-07-29 15:10</td>
                    <td><text class="status-tag status-done">已完成</text></td>
                    <td class="gap-cell gap-critical">-25.9%</td>
                  </tr>
                  <tr>
                    <td>孙琳</td><td>厦门大学</td><td>WTO法</td>
                    <td class="score-num score-high">90</td><td>2026-07-29 14:05</td>
                    <td><text class="status-tag status-done">已完成</text></td>
                    <td class="gap-cell gap-excellent">已达标</td>
                  </tr>
                  <tr>
                    <td>周杰</td><td>中山大学</td><td>跨境合规</td>
                    <td class="score-num score-mid">81</td><td>2026-07-29 11:45</td>
                    <td><text class="status-tag status-active">进行中</text></td>
                    <td class="gap-cell">-</td>
                  </tr>
                </tbody>
              </table>
            </view>
          </view>
        </section>

        <!-- ===== Section 4: Ability Gap Distribution ===== -->
        <section class="dc-section" :class="{ 'is-visible': visibleSections[3] }" aria-label="能力缺口分布">
          <view class="chart-card">
            <view class="chart-card-header">
              <view>
                <text class="chart-card-title">能力缺口分布</text>
                <text class="chart-card-subtitle">目标达成率分析</text>
              </view>
            </view>
            <view class="ad-gap-wrap-full">
              <view class="ad-gap-list-full">
                <view v-for="(item, index) in abilityGaps" :key="index" class="ad-gap-row-full">
                  <view class="ad-gap-head-full">
                    <text class="ad-gap-name-full">{{ item.name }}</text>
                    <view class="ad-gap-scores-full">
                      <text class="ad-gap-actual">实际: {{ item.actualScore }}</text>
                      <text class="ad-gap-target">目标: {{ item.targetScore }}</text>
                    </view>
                  </view>
                  <view class="ad-gap-track-full">
                    <view class="ad-gap-fill"
                          :style="{width: Math.max(0, 100 - item.gapPct) + '%'}"
                          :class="{'is-excellent': item.gapPct <= 0, 'is-warning': item.gapPct > 10}">
                    </view>
                  </view>
                  <view class="ad-gap-info-full">
                    <text class="ad-gap-label">缺口值</text>
                    <text class="ad-gap-value" :class="{'is-excellent': item.gapPct <= 0, 'is-warning': item.gapPct > 10}">
                      {{ item.gapPct > 0 ? '-' + item.gapPct.toFixed(1) + '%' : '已达标' }}
                    </text>
                  </view>
                </view>
              </view>
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

// 能力缺口数据定义
/**
 * 能力缺口计算公式：
 * 缺口值 = (目标得分 - 实际得分) / 目标得分 * 100
 *
 * 参数说明：
 * - actualScore: 实际得分（0-100）
 * - targetScore: 目标得分（默认85分，可根据重要性调整）
 * - weight: 权重系数（1.0-2.0，用于标识该领域的重要性）
 * - gapValue: 缺口值（目标-实际）
 * - gapPct: 缺口百分比（缺口值/目标 * 100）
 */

const abilityData = ref([
  { name: '国际商法', actualScore: 82.3, targetScore: 85, weight: 1.0 },
  { name: '国际投资法', actualScore: 76.8, targetScore: 85, weight: 1.2 },
  { name: '国际仲裁', actualScore: 79.1, targetScore: 88, weight: 1.3 },
  { name: '海商法', actualScore: 74.5, targetScore: 82, weight: 1.1 },
  { name: '知识产权法', actualScore: 80.6, targetScore: 85, weight: 1.0 },
  { name: 'WTO法', actualScore: 71.2, targetScore: 80, weight: 1.4 }
])

// 计算能力缺口
const abilityGaps = computed(() => {
  return abilityData.value.map(item => {
    const gapValue = item.targetScore - item.actualScore
    const gapPct = (gapValue / item.targetScore) * 100

    return {
      name: item.name,
      actualScore: item.actualScore,
      targetScore: item.targetScore,
      weight: item.weight,
      gapValue: gapValue,
      gapPct: gapPct,
      isAchieved: gapPct <= 0 // 是否达标
    }
  })
})

// 计算整体平均缺口
const averageGap = computed(() => {
  const totalWeight = abilityGaps.value.reduce((sum, item) => sum + item.weight, 0)
  const weightedGap = abilityGaps.value.reduce((sum, item) => sum + item.gapPct * item.weight, 0)
  return weightedGap / totalWeight
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

onMounted(() => {
  if (!requireAdmin()) return
  // Scroll reveal simulation
  setTimeout(() => {
    visibleSections.value = [true, true, true, true]
  }, 100)

  // 模拟数据实时更新（每30秒更新一次）
  setInterval(() => {
    updateAbilityData()
  }, 30000)
})

// 数据更新函数：模拟实际得分变化
const updateAbilityData = () => {
  abilityData.value = abilityData.value.map(item => {
    // 模拟得分波动（±2分）
    const fluctuation = (Math.random() - 0.5) * 4
    const newScore = Math.max(0, Math.min(100, item.actualScore + fluctuation))

    return {
      ...item,
      actualScore: parseFloat(newScore.toFixed(1))
    }
  })
}
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

:root { --ad-ease: cubic-bezier(.2,.8,.2,1); }

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
  box-shadow: 0 6px 14px -4px color-mix(in srgb, var(--rule-primary) 48%, transparent);
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
  cursor: pointer; transition: background 0.15s ease, color 0.15s ease;
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
.navi-icon-arrow-up-right {
  width: 14px; height: 14px;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><line x1='7' y1='17' x2='17' y2='7'/><polyline points='7 7 17 7 17 17'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><line x1='7' y1='17' x2='17' y2='7'/><polyline points='7 7 17 7 17 17'/></svg>") center/contain no-repeat;
}
.navi-icon-clipboard-list {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><rect width='8' height='4' x='8' y='2' rx='1'/><path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'/><path d='M12 11h4'/><path d='M12 16h4'/><circle cx='9' cy='11' r='1.2'/><circle cx='9' cy='16' r='1.2'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><rect width='8' height='4' x='8' y='2' rx='1'/><path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'/><path d='M12 11h4'/><path d='M12 16h4'/><circle cx='9' cy='11' r='1.2'/><circle cx='9' cy='16' r='1.2'/></svg>") center/contain no-repeat;
}
.navi-icon-trending-up {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><polyline points='22 7 13.5 15.5 8.5 10.5 2 17'/><polyline points='16 7 22 7 22 13'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><polyline points='22 7 13.5 15.5 8.5 10.5 2 17'/><polyline points='16 7 22 7 22 13'/></svg>") center/contain no-repeat;
}
.navi-icon-file-text {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'/><polyline points='14 2 14 8 20 8'/><line x1='16' y1='13' x2='8' y2='13'/><line x1='16' y1='17' x2='8' y2='17'/><line x1='10' y1='9' x2='8' y2='9'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'/><polyline points='14 2 14 8 20 8'/><line x1='16' y1='13' x2='8' y2='13'/><line x1='16' y1='17' x2='8' y2='17'/><line x1='10' y1='9' x2='8' y2='9'/></svg>") center/contain no-repeat;
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
.app-topbar-meta { font-size: 13px; color: var(--rule-muted-foreground); }
.app-content { flex: 1; padding: 28px 32px; max-width: 1400px; margin: 0 auto; width: 100%; box-sizing: border-box; }

/* ===== Scroll Reveal ===== */
.dc-section {
  margin-bottom: 28px; opacity: 0; transform: translateY(24px) scale(0.99);
  transition: opacity 0.7s var(--ad-ease), transform 0.7s var(--ad-ease);
}
.dc-section:last-child { margin-bottom: 0; }
.dc-section.is-visible { opacity: 1; transform: translateY(0) scale(1); }

/* ===== KPI Cards ===== */
.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.kpi-card {
  position: relative; overflow: hidden;
  background: linear-gradient(135deg, var(--rule-card), var(--rule-primary-tint-3));
  border: 1px solid color-mix(in srgb, var(--rule-border) 55%, transparent);
  border-radius: 16px; padding: 24px;
  display: flex; flex-direction: column; gap: 16px; min-width: 0;
  box-shadow: 0 1px 2px color-mix(in srgb, var(--rule-ink) 4%, transparent), 0 10px 28px -14px color-mix(in srgb, var(--rule-ink) 8%, transparent);
  transition: transform 0.3s var(--ad-ease), box-shadow 0.3s var(--ad-ease), border-color 0.3s var(--ad-ease);
}
.kpi-card:hover {
  transform: translateY(-6px);
  border-color: color-mix(in srgb, var(--rule-primary) 30%, transparent);
  box-shadow: 0 4px 8px color-mix(in srgb, var(--rule-primary) 12%, transparent), 0 22px 44px -14px color-mix(in srgb, var(--rule-primary) 38%, transparent);
}
.kpi-card::after {
  content: ''; position: absolute; top: -40%; right: -20%;
  width: 60%; height: 180%; pointer-events: none;
  background: radial-gradient(circle, color-mix(in srgb, var(--rule-primary) 8%, transparent), transparent 70%);
}
.kpi-card > * { position: relative; z-index: 1; }
.kpi-card-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.kpi-card-label { font-size: 13px; color: var(--rule-muted-foreground); font-weight: 500; }
.kpi-card-icon {
  width: 40px; height: 40px; border-radius: 10px;
  background: linear-gradient(135deg, var(--rule-primary), var(--rule-primary-active));
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 6px 14px -4px color-mix(in srgb, var(--rule-primary) 48%, transparent);
}
.kpi-card-icon .navi-icon { width: 20px; height: 20px; background: var(--rule-primary-foreground); }
.kpi-card-value { font-size: 30px; font-weight: 700; line-height: 1.1; color: var(--rule-foreground); font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }
.kpi-card-trend { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: var(--state-success); font-weight: 600; }
.kpi-card-trend.is-primary { color: var(--rule-primary); }

/* ===== Chart Cards ===== */
.charts-row { display: grid; grid-template-columns: 3fr 2fr; gap: 20px; }
.chart-card {
  background: linear-gradient(135deg, var(--rule-card), var(--rule-primary-tint-3));
  border: 1px solid color-mix(in srgb, var(--rule-border) 55%, transparent);
  border-radius: 16px; padding: 24px;
  display: flex; flex-direction: column; min-width: 0;
  box-shadow: 0 1px 2px color-mix(in srgb, var(--rule-ink) 4%, transparent), 0 10px 28px -14px color-mix(in srgb, var(--rule-ink) 8%, transparent);
  transition: transform 0.3s var(--ad-ease), box-shadow 0.3s var(--ad-ease), border-color 0.3s var(--ad-ease);
}
.chart-card:hover {
  border-color: color-mix(in srgb, var(--rule-primary) 25%, transparent);
  box-shadow: 0 4px 8px color-mix(in srgb, var(--rule-primary) 10%, transparent), 0 18px 38px -14px color-mix(in srgb, var(--rule-primary) 30%, transparent);
}
.chart-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 24px; }
.chart-card-title { font-size: 16px; font-weight: 600; color: var(--rule-foreground); }
.chart-card-subtitle { font-size: 13px; color: var(--rule-muted-foreground); display: block; margin-top: 4px; }
.chart-card-link { font-size: 13px; font-weight: 500; color: var(--rule-primary); cursor: pointer; white-space: nowrap; }

/* ===== Bar Chart ===== */
.ad-bar-chart { display: flex; flex-direction: column; gap: 12px; }
.ad-bar-area { display: flex; align-items: flex-end; justify-content: space-between; gap: 14px; height: 220px; border-bottom: 1px solid var(--rule-border); padding-bottom: 4px; }
.ad-bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; gap: 6px; min-width: 0; }
.ad-bar-value { font-size: 12px; font-weight: 600; color: var(--rule-ink-2); font-variant-numeric: tabular-nums; }
.ad-bar { width: 100%; max-width: 42px; border-radius: 8px 8px 0 0; background: linear-gradient(180deg, var(--rule-primary), var(--rule-primary-active)); box-shadow: 0 6px 16px -6px color-mix(in srgb, var(--rule-primary) 55%, transparent); min-height: 6px; transition: filter 0.3s var(--ad-ease); }
.ad-bar-col:hover .ad-bar { filter: brightness(1.1); }
.ad-bar-labels { display: flex; justify-content: space-between; gap: 14px; }
.ad-bar-label { flex: 1; text-align: center; font-size: 12px; color: var(--rule-muted-foreground); }

/* ===== Donut Chart ===== */
.ad-donut-wrap { display: flex; align-items: center; gap: 24px; flex: 1; }
.ad-donut { width: 180px; height: 180px; flex-shrink: 0; position: relative; }
.ad-donut svg { width: 100%; height: 100%; }
.ad-seg-1 { stroke: var(--rule-primary); }
.ad-seg-2 { stroke: var(--state-success); }
.ad-seg-3 { stroke: var(--state-warning); }
.ad-seg-4 { stroke: var(--rule-ink-3); }
.ad-donut-label { fill: var(--rule-muted-foreground); }
.ad-donut-total { fill: var(--rule-foreground); }
.ad-legend { display: flex; flex-direction: column; gap: 14px; flex: 1; min-width: 0; }
.ad-legend-item { display: flex; align-items: center; gap: 10px; font-size: 13px; }
.ad-legend-dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
.ad-dot-1 { background: var(--rule-primary); }
.ad-dot-2 { background: var(--state-success); }
.ad-dot-3 { background: var(--state-warning); }
.ad-dot-4 { background: var(--rule-ink-3); }
.ad-legend-label { color: var(--rule-ink-2); flex: 1; }
.ad-legend-value { font-weight: 700; color: var(--rule-foreground); font-variant-numeric: tabular-nums; }

/* ===== Ability Gap Distribution (Full Width) ===== */
.ad-gap-wrap-full {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.ad-gap-list-full {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.ad-gap-row-full {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ad-gap-head-full {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.ad-gap-name-full {
  font-size: 14px;
  font-weight: 600;
  color: var(--rule-foreground);
  flex: 1;
}

.ad-gap-scores-full {
  display: flex;
  gap: 12px;
  font-size: 12px;
}

.ad-gap-actual {
  color: var(--rule-ink-2);
  font-variant-numeric: tabular-nums;
}

.ad-gap-target {
  color: var(--rule-muted-foreground);
  font-variant-numeric: tabular-nums;
}

.ad-gap-track-full {
  height: 8px;
  background: var(--rule-muted);
  border-radius: var(--rule-radius-full);
  overflow: hidden;
}

.ad-gap-fill {
  height: 100%;
  border-radius: var(--rule-radius-full);
  background: linear-gradient(90deg, var(--rule-primary), var(--rule-primary-active));
  box-shadow: 0 2px 8px -2px color-mix(in srgb, var(--rule-primary) 50%, transparent);
  transition: width 1s var(--ad-ease);
}

.ad-gap-fill.is-excellent {
  background: linear-gradient(90deg, var(--state-success), #22C55E);
  box-shadow: 0 2px 8px -2px color-mix(in srgb, var(--state-success) 50%, transparent);
}

.ad-gap-fill.is-warning {
  background: linear-gradient(90deg, var(--state-warning), #F59E0B);
  box-shadow: 0 2px 8px -2px color-mix(in srgb, var(--state-warning) 50%, transparent);
}

.ad-gap-info-full {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.ad-gap-label {
  color: var(--rule-muted-foreground);
}

.ad-gap-value {
  font-weight: 700;
  color: var(--rule-primary);
  font-variant-numeric: tabular-nums;
}

.ad-gap-value.is-excellent {
  color: var(--state-success);
}

.ad-gap-value.is-warning {
  color: var(--state-warning);
}

/* ===== Table Card ===== */
.table-card {
  background: linear-gradient(135deg, var(--rule-card), var(--rule-primary-tint-3));
  border: 1px solid color-mix(in srgb, var(--rule-border) 55%, transparent);
  border-radius: 16px; padding: 24px; min-width: 0;
  box-shadow: 0 1px 2px color-mix(in srgb, var(--rule-ink) 4%, transparent), 0 10px 28px -14px color-mix(in srgb, var(--rule-ink) 8%, transparent);
  transition: border-color 0.3s var(--ad-ease), box-shadow 0.3s var(--ad-ease);
}
.table-card:hover { border-color: color-mix(in srgb, var(--rule-primary) 25%, transparent); box-shadow: 0 4px 8px color-mix(in srgb, var(--rule-primary) 10%, transparent), 0 18px 38px -14px color-mix(in srgb, var(--rule-primary) 30%, transparent); }
.table-container { overflow-x: auto; }
.dc-table { width: 100%; border-collapse: collapse; min-width: 820px; }
.dc-table thead th { font-size: 13px; font-weight: 500; color: var(--rule-muted-foreground); text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--rule-border); white-space: nowrap; }
.dc-table tbody td { font-size: 14px; color: var(--rule-foreground); padding: 14px 16px; border-bottom: 1px solid var(--rule-border); }
.dc-table tbody tr:last-child td { border-bottom: none; }
.dc-table tbody tr { transition: background 0.15s ease; }
.dc-table tbody tr:hover { background: var(--rule-primary-tint-3); }
.score-num { font-variant-numeric: tabular-nums; font-weight: 700; }
.score-high { color: var(--state-success); }
.score-mid { color: var(--rule-primary); }
.score-low { color: var(--state-warning); }
.status-tag { display: inline-flex; align-items: center; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: var(--rule-radius-full); white-space: nowrap; }
.status-done { background: var(--state-success-tint); color: var(--state-success); }
.status-active { background: var(--rule-primary-tint-1); color: var(--rule-primary); }

/* ===== Gap Cell Styles ===== */
.gap-cell {
  font-size: 13px;
  font-weight: 600;
  color: var(--rule-muted-foreground);
  font-variant-numeric: tabular-nums;
}

.gap-cell.gap-excellent {
  color: var(--state-success);
}

.gap-cell.gap-warning {
  color: var(--state-warning);
}

.gap-cell.gap-critical {
  color: var(--state-error);
}

/* ===== Responsive ===== */
@media (max-width: 1024px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
  .charts-row { grid-template-columns: 1fr; }
  .ad-donut-wrap { flex-direction: column; align-items: center; }
  .ad-gap-list-full { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .app-sidebar { transform: translateX(-100%); transition: transform 0.3s ease; }
  .app-sidebar.open { transform: translateX(0); }
  .app-main { margin-left: 0; }
  .app-topbar { padding: 0 20px; }
  .app-content { padding: 20px; }
}
@media (max-width: 640px) {
  .kpi-grid { grid-template-columns: 1fr; }
  .ad-bar-area { height: 180px; gap: 8px; }
  .ad-bar { max-width: 28px; }
}
@media (prefers-reduced-motion: reduce) {
  .kpi-card, .chart-card, .table-card, .dc-table tbody tr, .ad-bar, .ad-ability-fill, .ad-gap-fill { transition-duration: 0.01ms; }
  .kpi-card:hover, .chart-card:hover { transform: none; }
  .dc-section { opacity: 1; transform: none; }
}
</style>
