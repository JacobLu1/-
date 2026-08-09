<template>
  <view class="ai-shell">
    <!-- ===== Brand CSS Variables (from AI助手.html) ===== -->
    <view class="css-vars" aria-hidden="true"></view>

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
          <view class="app-nav-item is-active" data-nav-key="ai-assistant">
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
            <view class="app-sidebar-user-avatar">{{ userInitial }}</view>
            <view style="min-width:0;flex:1">
              <text class="app-sidebar-user-name">{{ userName }}</text>
              <text class="app-sidebar-user-role">{{ userRole }}</text>
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
          <text class="app-topbar-title">AI助手</text>
          <text class="app-topbar-meta">{{ todayDateText }}</text>
        </header>

        <main class="app-content">
          <section class="chat-container" aria-label="法治AI助手对话">
            <!-- Chat Header -->
            <view class="chat-header">
              <view class="chat-header-left">
                <view class="chat-avatar-lg" aria-hidden="true">
                  <view class="avatar-lg-icon"></view>
                </view>
                <view class="chat-header-info">
                  <text class="chat-name">法治AI助手</text>
                  <view class="chat-status">
                    <view class="chat-status-dot" aria-hidden="true"></view>
                    <text>在线 · 随时为您解答</text>
                  </view>
                </view>
              </view>
              <view class="clear-btn" @tap="clearCurrentChat">
                <view class="clear-btn-icon"></view>
                <text>清空对话</text>
              </view>
            </view>

            <!-- Messages Area -->
            <scroll-view
              scroll-y
              class="messages-area"
              role="log"
              aria-live="polite"
              aria-label="对话记录"
              :scroll-into-view="scrollIntoView"
              :scroll-with-animation="true"
            >
              <!-- Welcome / empty state -->
              <view v-if="messages.length === 0" id="msg-welcome" class="welcome-empty">
                <view class="msg msg-ai">
                  <view class="msg-avatar msg-avatar-ai" aria-hidden="true">
                    <view class="avatar-small-icon"></view>
                  </view>
                  <view class="bubble bubble-ai">
                    <text>您好！我是涉外法治AI助手，可以为您解答涉外法律相关问题。请问有什么可以帮助您的？</text>
                  </view>
                </view>
              </view>

              <!-- Dynamic Messages -->
              <template v-for="(msg, idx) in messages" :key="'msg-' + idx">
                <!-- User Message -->
                <view v-if="msg.role === 'user'" :id="'msg-' + idx" class="msg msg-user">
                  <view class="msg-avatar msg-avatar-user" aria-hidden="true">{{ userInitial }}</view>
                  <view class="bubble bubble-user">
                    <text>{{ msg.content }}</text>
                  </view>
                </view>

                <!-- AI Response -->
                <view v-else-if="msg.role === 'ai'" :id="'msg-' + idx" class="msg msg-ai">
                  <view class="msg-avatar msg-avatar-ai" aria-hidden="true">
                    <view class="avatar-small-icon"></view>
                  </view>
                  <view class="bubble bubble-ai">
                    <text v-if="msg.title" class="bubble-title">{{ msg.title }}</text>
                    <text class="bubble-text">{{ msg.content }}</text>
                    <view v-if="msg.points && msg.points.length" class="bubble-points">
                      <view class="bp-item" v-for="(point, pIdx) in msg.points" :key="pIdx">
                        <text class="bp-label">{{ pIdx + 1 }}. {{ point.label }}：</text>{{ point.text }}
                      </view>
                    </view>
                    <view v-if="msg.tip" class="bubble-tip">
                      <text class="tip-label">提示：</text>
                      <text class="tip-text">{{ msg.tip }}</text>
                    </view>
                    <view class="bubble-actions">
                      <text class="ba-like" :class="{ liked: msg.liked }" @tap="toggleLike(idx)">
                        {{ msg.liked ? '已赞' : '有帮助' }}
                      </text>
                      <text class="ba-copy" @tap="copyMessage(msg.content)">复制内容</text>
                    </view>
                  </view>
                </view>

                <!-- Loading / Typing -->
                <view v-else-if="msg.role === 'loading'" :id="'msg-' + idx" class="msg msg-ai">
                  <view class="msg-avatar msg-avatar-ai" aria-hidden="true">
                    <view class="avatar-small-icon"></view>
                  </view>
                  <view class="bubble bubble-ai" aria-label="AI正在输入">
                    <view class="typing-dots" aria-hidden="true">
                      <view class="typing-dot"></view>
                      <view class="typing-dot"></view>
                      <view class="typing-dot"></view>
                    </view>
                  </view>
                </view>
              </template>
            </scroll-view>

            <!-- Chat Footer: Suggested Questions + Input -->
            <view class="chat-footer">
              <view class="suggested-questions" role="group" aria-label="推荐问题">
                <text class="chip" :class="{ disabled: isLoading }" @tap="sendSuggestion('涉外婚姻的法律适用问题有哪些？')">涉外婚姻的法律适用</text>
                <text class="chip" :class="{ disabled: isLoading }" @tap="sendSuggestion('国际货物买卖合同的核心要点？')">国际货物买卖合同要点</text>
                <text class="chip" :class="{ disabled: isLoading }" @tap="sendSuggestion('外国仲裁裁决的承认与执行条件？')">外国仲裁裁决的承认与执行</text>
                <text class="chip" :class="{ disabled: isLoading }" @tap="sendSuggestion('涉外民事诉讼的管辖规则？')">涉外民事诉讼管辖</text>
              </view>
              <view class="input-area">
                <label for="chat-input-field" class="sr-only">输入您的问题</label>
                <input
                  id="chat-input-field"
                  class="chat-input"
                  type="text"
                  v-model="inputText"
                  :placeholder="isLoading ? 'AI正在回答，请稍候...' : '输入您的问题...'"
                  :disabled="isLoading"
                  autocomplete="off"
                  :maxlength="2000"
                  @confirm="sendMessage"
                />
                <button class="send-btn" :class="{ disabled: !canSend }" @tap="sendMessage" aria-label="发送">
                  <view class="send-btn-icon"></view>
                  <text>发送</text>
                </button>
              </view>
            </view>
          </section>
        </main>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { requireLogin, getDisplayName, getLevelText } from '@/utils/auth.js'

/* ============================================================
   AI Response Data
   ============================================================ */
const AI_RESPONSES = [
  {
    title: '涉外仲裁协议效力分析',
    content: '处理涉外仲裁协议效力时，核心在于确定"准据法"。通常遵循以下三层逻辑：',
    points: [
      { label: '当事人意思自治原则', text: '首先查看协议中是否明确约定了适用于仲裁协议本身的法律。' },
      { label: '仲裁地法', text: '若无明确约定，通常适用仲裁机构所在地或仲裁地（Seat of Arbitration）法律。' },
      { label: '《纽约公约》标准', text: '根据1958年《纽约公约》，协议必须是书面的，且争议事项具有可仲裁性。' }
    ],
    tip: '在中国司法实践中，根据《涉外民事关系法律适用法》第18条，如无约定，适用仲裁机构所在地法律或者仲裁地法律。'
  },
  {
    title: 'RCEP 原产地规则解读',
    content: '《区域全面经济伙伴关系协定》（RCEP）的原产地规则采用累积规则机制，这是其区别于其他自贸协定的核心创新点。',
    points: [
      { label: '完全获得标准', text: '货物在缔约方境内完全使用当地原材料或非原产材料经充分加工后取得原产地资格。' },
      { label: '区域价值成分', text: '使用来自RCEP成员方的材料价值占最终产品离岸价格的40%以上。' },
      { label: '累积规则', text: '允许在生产过程中使用来自其他RCEP成员方的原产材料。' }
    ],
    tip: '建议企业提前进行供应链梳理和原产地规划，充分利用RCEP累积规则降低关税成本。'
  },
  {
    title: '跨境数据传输合规框架',
    content: '当前跨境数据传输涉及多重法规约束体系，企业需建立全面的合规管理机制。',
    points: [
      { label: '中国《网络安全法》', text: '关键信息基础设施运营者需进行安全评估；个人信息出境需通过安全评估或标准合同。' },
      { label: '欧盟 GDPR', text: '向欧盟传输个人数据需有合法依据（如 SCC、BCR 等），且需保障数据主体权利。' },
      { label: '美国 CLOUD Act', text: '可能触发美国政府的数据调取权，与GDPR存在潜在冲突。' }
    ],
    tip: '建议采用数据本地化存储+匿名化/去标识化的组合策略，并定期开展 DPIA（数据保护影响评估）。'
  }
]

/* ============================================================
   Reactive State
   ============================================================ */
const inputText = ref('')
const currentChat = ref(0)
const scrollIntoView = ref('')
const messages = ref([])
const responseIndex = ref(0)

const chatHistory = ref([
  { title: '关于信用证的法律适用', messages: [] },
  { title: '跨境并购合规咨询', messages: [] },
  { title: '涉外仲裁协议效力', messages: [] },
  { title: '技术进出口限制查询', messages: [] },
  { title: '国际贸易争端解决', messages: [] }
])

// User info (hardcoded demo)
const userInitial = computed(() => (userName.value || '用').slice(0, 1))
const userName = ref(getDisplayName())
const userRole = ref(getLevelText())

/* ============================================================
   Computed
   ============================================================ */
const canSend = computed(() => inputText.value.trim().length > 0 && !isLoading.value)
const isLoading = computed(() => {
  return messages.value.length > 0 && messages.value[messages.value.length - 1].role === 'loading'
})

const todayDateText = computed(() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}年${m}月${d}日`
})

/* ============================================================
   Methods
   ============================================================ */
function navigateTo(url) {
  uni.navigateTo({ url })
}

function handleLogout() {
  uni.showModal({
    title: '确认退出',
    content: '您确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        try {
          uni.removeStorageSync('token')
          uni.removeStorageSync('userInfo')
          uni.removeStorageSync('adminToken')
          uni.removeStorageSync('adminInfo')
        } catch (e) {
          console.error('清除存储失败:', e)
        }
        uni.reLaunch({
          url: '/pages/login/login',
          fail: (err) => {
            console.error('跳转失败:', err)
            uni.showToast({ title: '退出失败，请重试', icon: 'none' })
          }
        })
      }
    }
  })
}

function sendMessage() {
  if (!canSend.value) return

  const text = inputText.value.trim()
  if (!text) return

  const now = new Date()
  const timeStr = formatTime(now)

  messages.value.push({
    role: 'user',
    content: text,
    time: timeStr
  })

  inputText.value = ''

  nextTick(() => {
    messages.value.push({ role: 'loading' })
    simulateAIResponse(text)
    scrollToBottom()
  })
}

function simulateAIResponse(userText) {
  setTimeout(() => {
    messages.value.pop() // remove loading

    const response = AI_RESPONSES[responseIndex.value % AI_RESPONSES.length]
    responseIndex.value++

    const now = new Date()
    messages.value.push({
      role: 'ai',
      title: response.title,
      content: response.content,
      points: response.points,
      tip: response.tip,
      time: formatTime(now),
      liked: false
    })

    saveChatHistory()
    scrollToBottom()
  }, 1500 + Math.random() * 1000)
}

function scrollToBottom() {
  nextTick(() => {
    if (messages.value.length > 0) {
      // 先清空再赋值，确保即使目标消息下标不变（如加载气泡被回复替换）也能重新触发滚动
      scrollIntoView.value = ''
      nextTick(() => {
        scrollIntoView.value = 'msg-' + (messages.value.length - 1)
      })
    }
  })
}

function sendSuggestion(text) {
  if (isLoading.value) return
  inputText.value = text
  sendMessage()
}

function toggleLike(index) {
  if (index < messages.value.length) {
    messages.value[index].liked = !messages.value[index].liked
  }
}

function copyMessage(content) {
  uni.setClipboardData({
    data: content,
    success: () => {
      uni.showToast({ title: '已复制到剪贴板', icon: 'success' })
    }
  })
}

function clearCurrentChat() {
  if (messages.value.length === 0) return
  uni.showModal({
    title: '清空对话',
    content: '确定要清空当前对话的所有消息吗？',
    success: (res) => {
      if (res.confirm) {
        messages.value = []
        if (currentChat.value < chatHistory.value.length) {
          chatHistory.value[currentChat.value].messages = []
        }
        scrollIntoView.value = 'msg-welcome'
      }
    }
  })
}

function saveChatHistory() {
  if (currentChat.value < chatHistory.value.length) {
    chatHistory.value[currentChat.value].messages = JSON.parse(JSON.stringify(messages.value))
  }
}

function formatTime(date) {
  const h = date.getHours().toString().padStart(2, '0')
  const m = date.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}

/* ============================================================
   Lifecycle
   ============================================================ */
onMounted(() => {
  // Initialize with welcome state
  scrollIntoView.value = 'msg-welcome'
})

onLoad(() => {
  // 登录鉴权：未登录跳转登录页
  if (!requireLogin()) return
})
</script>

<style scoped>
/* ============================================================
   Brand Design Tokens (from AI助手.html)
   ============================================================ */
.ai-shell {
  /* === Brand Primary === */
  --rule-primary: #2563EB;
  --rule-primary-hover: #1D4ED8;
  --rule-primary-active: #1E40AF;
  --rule-primary-foreground: #FFFFFF;
  --rule-primary-tint-1: #DBEAFE;
  --rule-primary-tint-2: #BFDBFE;
  --rule-primary-tint-3: #EFF6FF;

  /* === Semantic === */
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

  /* === Radius === */
  --rule-radius-small: 4px;
  --rule-radius-medium: 8px;
  --rule-radius-large: 16px;
  --rule-radius-full: 9999px;

  /* === State Colors === */
  --state-success: #16A34A;
  --state-success-tint: #DCFCE7;
  --state-warning: #D97706;
  --state-warning-tint: #FEF3C7;
  --state-error: #DC2626;
  --state-error-tint: #FEE2E2;
  --state-info: #2563EB;
  --state-info-tint: #DBEAFE;

  /* === Neutrals === */
  --rule-ink: #0F172A;
  --rule-ink-2: #475569;
  --rule-ink-3: #94A3B8;
  --rule-line: #E2E8F0;
  --rule-surface: #FFFFFF;
  --rule-surface-2: #F8FAFC;

  /* === Shadows === */
  --rule-shadow-1: 0 1px 2px rgba(15,23,42,.04), 0 1px 1px rgba(15,23,42,.02);
  --rule-shadow-2: 0 8px 24px -8px rgba(15,23,42,.12);
  --rule-shadow-3: 0 24px 60px -20px rgba(15,23,42,.20);

  min-height: 100vh;
  background: var(--rule-background);
  color: var(--rule-foreground);
  font-family: "Inter", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ============================================================
   Shell Layout
   ============================================================ */
.app-shell {
  display: flex;
  min-height: 100vh;
  background: var(--rule-background);
}

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
  flex-shrink: 0;
  overflow: hidden;
}

.ls-svg-glyph {
  width: 20px; height: 20px;
  background: #fff;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M7 21h10'/><path d='M12 3v18'/><path d='M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M7 21h10'/><path d='M12 3v18'/><path d='M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2'/></svg>") center/contain no-repeat;
}

.app-sidebar-logo-text {
  font-size: 15px; font-weight: 600;
  color: var(--rule-foreground);
  white-space: nowrap;
}

.app-sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  display: flex; flex-direction: column;
  gap: 4px;
  overflow-y: auto;
}

.app-nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px; font-weight: 500;
  color: var(--rule-ink-2);
  transition: background 0.15s ease, color 0.15s ease;
  cursor: pointer;
}
.app-nav-item:hover { background: var(--rule-muted); color: var(--rule-foreground); }
.app-nav-item.is-active {
  background: var(--rule-primary);
  color: #FFFFFF;
}
.app-nav-item.is-active:hover { background: var(--rule-primary-hover); color: #fff; }

/* Nav icons (mask-based SVGs) */
.navi-icon {
  width: 20px; height: 20px; flex-shrink: 0;
  background: currentColor;
  display: inline-block;
}
.app-nav-item.is-active .navi-icon { background: #fff; }

.navi-icon-home {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M3 10.5 12 3l9 7.5'/><path d='M5 9.5V21h14V9.5'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M3 10.5 12 3l9 7.5'/><path d='M5 9.5V21h14V9.5'/></svg>") center/contain no-repeat;
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
.app-sidebar-user {
  padding: 16px 12px;
  border-top: 1px solid var(--rule-border);
}
.app-sidebar-user-inner {
  display: flex; align-items: center; gap: 12px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 8px;
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
  font-size: 13px; font-weight: 500;
  color: var(--rule-foreground);
  display: block;
}
.app-sidebar-user-role {
  font-size: 12px; color: var(--rule-muted-foreground);
  display: block;
}

.app-sidebar-logout {
  display: flex; align-items: center; gap: 8px;
  margin: 8px 12px 0; padding: 10px 12px;
  border-radius: 8px; cursor: pointer;
  color: var(--rule-ink-2); font-size: 13px;
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
  font-size: 13px;
  font-weight: 500;
}

/* ===== Main ===== */
.app-main {
  flex: 1; margin-left: 240px;
  display: flex; flex-direction: column;
  min-height: 100vh; min-width: 0;
}

.app-topbar {
  height: 64px;
  border-bottom: 1px solid var(--rule-border);
  background: var(--rule-card);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 32px; flex-shrink: 0;
}
.app-topbar-title {
  font-size: 18px; font-weight: 600;
  color: var(--rule-foreground);
}
.app-topbar-meta {
  font-size: 13px;
  color: var(--rule-muted-foreground);
}

.app-content {
  flex: 1;
  padding: 32px;
}

/* ============================================================
   Chat Container (from AI助手.html)
   ============================================================ */
.chat-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px - 64px);
  min-height: 480px;
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 12px 40px -12px rgba(15, 23, 42, 0.12);
}

/* ---- Chat Header ---- */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 28px;
  background: var(--rule-card);
  border-bottom: 1px solid var(--rule-border);
  flex-shrink: 0;
}
.chat-header-left {
  display: flex; align-items: center; gap: 12px; min-width: 0;
}
.chat-header-info {
  display: flex; flex-direction: column; gap: 3px; min-width: 0;
}

.chat-avatar-lg {
  width: 40px; height: 40px; border-radius: var(--rule-radius-full);
  background: var(--rule-primary);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.avatar-lg-icon {
  width: 22px; height: 22px;
  background: #fff;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M12 8V4H8'/><rect width='16' height='12' x='4' y='8' rx='2'/><path d='M2 14h2'/><path d='M20 14h2'/><path d='M15 13v2'/><path d='M9 13v2'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M12 8V4H8'/><rect width='16' height='12' x='4' y='8' rx='2'/><path d='M2 14h2'/><path d='M20 14h2'/><path d='M15 13v2'/><path d='M9 13v2'/></svg>") center/contain no-repeat;
}

.chat-name {
  font-size: 15px; font-weight: 600;
  color: var(--rule-foreground);
  line-height: 1.3;
}
.chat-status {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; color: var(--state-success);
  line-height: 1.4;
}
.chat-status-dot {
  width: 7px; height: 7px; border-radius: var(--rule-radius-full);
  background: var(--state-success); flex-shrink: 0;
  animation: presence-pulse 2.4s ease-in-out infinite;
}

/* Clear button */
.clear-btn {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 500; color: var(--rule-muted-foreground);
  background: transparent; border: none;
  padding: 6px 10px; border-radius: var(--rule-radius-medium);
  white-space: nowrap; cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}
.clear-btn:hover { color: var(--rule-foreground); background: var(--rule-muted); }
.clear-btn:active { opacity: 0.8; }

.clear-btn-icon {
  width: 15px; height: 15px; flex-shrink: 0;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M3 6h18'/><path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6'/><path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2'/><line x1='10' x2='10' y1='11' y2='17'/><line x1='14' x2='14' y1='11' y2='17'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M3 6h18'/><path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6'/><path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2'/><line x1='10' x2='10' y1='11' y2='17'/><line x1='14' x2='14' y1='11' y2='17'/></svg>") center/contain no-repeat;
}

/* ---- Messages Area ---- */
.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 28px 40px;
  background: var(--rule-background);
  display: flex;
  flex-direction: column;
}

.welcome-empty {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

/* Message row */
.msg {
  display: flex;
  gap: 12px;
  max-width: 100%;
  align-items: flex-start;
  /* 注意：scroll-view 在 H5 会内层包裹，.messages-area 上的 gap 不生效，需用外边距控制消息间距 */
  margin-bottom: 48px;
}
.msg:last-child {
  margin-bottom: 0;
}
.msg.msg-user {
  flex-direction: row-reverse;
}

/* Message avatar */
.msg-avatar {
  width: 34px;
  height: 34px;
  border-radius: var(--rule-radius-full);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
}
.msg-avatar-ai {
  background: linear-gradient(135deg, var(--rule-primary), var(--rule-primary-active));
  box-shadow: 0 4px 12px -2px color-mix(in srgb, var(--rule-primary) 40%, transparent);
}
.msg-avatar-user {
  background: linear-gradient(135deg, var(--rule-primary-tint-1), var(--rule-primary-tint-2));
  color: var(--rule-primary);
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 4px 12px -2px color-mix(in srgb, var(--rule-primary-tint-1) 80%, transparent);
}

.avatar-small-icon {
  width: 19px;
  height: 19px;
  background: #fff;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M12 8V4H8'/><rect width='16' height='12' x='4' y='8' rx='2'/><path d='M2 14h2'/><path d='M20 14h2'/><path d='M15 13v2'/><path d='M9 13v2'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M12 8V4H8'/><rect width='16' height='12' x='4' y='8' rx='2'/><path d='M2 14h2'/><path d='M20 14h2'/><path d='M15 13v2'/><path d='M9 13v2'/></svg>") center/contain no-repeat;
}

/* Bubbles */
.bubble {
  padding: 10px 16px;
  max-width: 68%;
  word-break: break-word;
  overflow-wrap: break-word;
  font-size: 14.5px;
  line-height: 1.6;
}
.bubble-ai {
  background: var(--rule-card);
  color: var(--rule-foreground);
  border: 1px solid var(--rule-border);
  border-radius: 14px;
  border-bottom-left-radius: 5px;
  box-shadow: 0 2px 8px -2px rgba(15, 23, 42, 0.06);
}
.bubble-user {
  background: linear-gradient(135deg, var(--rule-primary), var(--rule-primary-hover));
  color: var(--rule-primary-foreground);
  border-radius: 14px;
  border-bottom-right-radius: 5px;
  box-shadow: 0 4px 14px -4px color-mix(in srgb, var(--rule-primary) 50%, transparent);
}

/* Bubble inner content */
.bubble-title {
  font-size: 14px; font-weight: 700;
  color: var(--rule-foreground);
  display: block;
  margin-bottom: 6px;
}
.bubble-text {
  display: block;
  margin-bottom: 6px;
  color: var(--rule-foreground);
}
.bubble-points {
  display: flex; flex-direction: column; gap: 5px;
  margin-bottom: 6px;
}
.bp-item {
  font-size: 14px; color: var(--rule-ink-2); line-height: 1.6;
}
.bp-label {
  font-weight: 600; color: var(--rule-primary);
}
.bubble-tip {
  background: var(--state-success-tint);
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 6px;
}
.tip-label {
  font-weight: 600; color: var(--state-success);
  font-size: 13px;
}
.tip-text {
  font-size: 13px; color: #047857; line-height: 1.55;
}
.bubble-actions {
  display: flex; gap: 14px; align-items: center;
  margin-top: 4px;
  padding-top: 4px;
}
.ba-like, .ba-copy {
  font-size: 12px; color: var(--rule-muted-foreground);
  cursor: pointer; transition: color 0.15s;
}
.ba-like.liked { color: var(--state-error); }
.ba-like:active, .ba-copy:active { opacity: 0.7; }

/* ---- Typing Indicator ---- */
.typing-dots {
  display: flex; align-items: center; gap: 5px; padding: 4px 0;
}
.typing-dot {
  width: 8px; height: 8px; border-radius: var(--rule-radius-full);
  background: var(--rule-muted-foreground);
  animation: typing-bounce 1.2s ease-in-out infinite;
}
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

/* ---- Chat Footer ---- */
.chat-footer {
  flex-shrink: 0;
  background: var(--rule-card);
  border-top: 1px solid var(--rule-border);
  padding: 20px 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.suggested-questions {
  display: flex; flex-wrap: wrap; gap: 10px;
}
.chip {
  display: inline-flex; align-items: center;
  background: var(--rule-primary-tint-3);
  color: var(--rule-primary);
  border: 1px solid var(--rule-primary-tint-1);
  border-radius: var(--rule-radius-full);
  padding: 8px 16px;
  font-size: 13px; font-weight: 500; line-height: 1.4;
  cursor: pointer; white-space: nowrap;
  transition: background 0.15s, border-color 0.15s, transform 0.15s;
}
.chip:hover {
  background: var(--rule-primary-tint-1);
  transform: translateY(-1px);
}
.chip:active { opacity: 0.8; transform: translateY(0); }
.chip.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
.chip.disabled:hover {
  background: var(--rule-primary-tint-3);
  transform: none;
}

.input-area {
  display: flex; gap: 14px; align-items: stretch;
}
.chat-input {
  flex: 1; height: 48px;
  border: 1px solid var(--rule-border);
  border-radius: 12px;
  padding: 0 20px;
  font-size: 15px; color: var(--rule-foreground);
  background: var(--rule-background);
  min-width: 0;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
}
.chat-input::placeholder { color: var(--rule-muted-foreground); }
.chat-input:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
.chat-input:focus {
  outline: none;
  border-color: var(--rule-primary);
  background: var(--rule-card);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.send-btn {
  display: inline-flex; align-items: center; gap: 10px;
  height: 48px; padding: 0 24px;
  background: var(--rule-primary); color: #fff;
  border: none; border-radius: 12px;
  font-size: 15px; font-weight: 600;
  white-space: nowrap; cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 12px -4px color-mix(in srgb, var(--rule-primary) 50%, transparent);
}
.send-btn.disabled {
  background: var(--rule-muted-foreground);
  cursor: not-allowed;
  box-shadow: none;
}
.send-btn:not(.disabled):hover {
  background: var(--rule-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px -6px color-mix(in srgb, var(--rule-primary) 60%, transparent);
}
.send-btn:not(.disabled):active {
  transform: translateY(0);
  background: var(--rule-primary-active);
  opacity: 1;
}

.send-btn-icon {
  width: 18px; height: 18px; flex-shrink: 0;
  background: #fff;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z'/><path d='m21.854 2.147-10.94 10.939'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z'/><path d='m21.854 2.147-10.94 10.939'/></svg>") center/contain no-repeat;
}

.sr-only {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}

/* ---- Keyframes ---- */
@keyframes presence-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}
@keyframes typing-bounce {
  0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
  30% { opacity: 1; transform: translateY(-3px); }
}

/* ---- Reduced motion ---- */
@media (prefers-reduced-motion: reduce) {
  .chat-status-dot,
  .typing-dot { animation: none; }
  .send-btn, .chip, .clear-btn { transition: none; }
  .send-btn:hover { transform: none; }
}

/* ---- Touch devices ---- */
@media (hover: none) {
  .send-btn:not(.disabled):hover { transform: none; background: var(--rule-primary); }
}

/* ---- Responsive ---- */
@media (max-width: 768px) {
  .app-sidebar { transform: translateX(-100%); transition: transform 0.3s; }
  .app-main { margin-left: 0; }
  .app-content { padding: 16px; }
  .chat-container {
    height: calc(100vh - 64px - 32px);
    border-radius: 16px;
    min-height: 440px;
  }
  .chat-header { padding: 16px 20px; }
  .messages-area {
    padding: 20px 16px;
  }
  .msg { gap: 8px; margin-bottom: 36px; }
  .msg-avatar { width: 30px; height: 30px; }
  .chat-footer { padding: 14px 16px 18px; gap: 12px; }
  .bubble { max-width: 78%; padding: 8px 14px; font-size: 14px; line-height: 1.55; }
  .chat-input { height: 44px; }
  .send-btn { height: 44px; padding: 0 20px; }
}
</style>
