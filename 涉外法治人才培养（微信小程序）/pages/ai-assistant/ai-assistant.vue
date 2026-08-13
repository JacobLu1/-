<template>
  <view class="page-wrap">
    <!-- 状态栏安全区占位（iOS刘海屏 / 安卓挖孔屏适配） -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    <!-- Sub-header (返回学习中心, NO tabbar) -->
    <view class="sub-header">
      <view class="back" hover-class="bk-hover" @click="navBack" aria-label="返回">
        <view class="bk-ico"></view>
      </view>
      <text class="title">AI助手</text>
      <view class="spacer"></view>
    </view>

    <!-- Chat scroll area -->
    <scroll-view 
      scroll-y 
      class="chat-area" 
      id="chat" 
      role="log" 
      aria-live="polite" 
      aria-label="对话记录"
      :scroll-into-view="scrollToId"
      scroll-with-animation
    >
      <view class="date-div"><text>今天</text></view>

      <view 
        v-for="(m, i) in messages" 
        :key="m.id"
        :class="['msg', m.role === 'ai' ? 'left' : 'right', m.isTyping ? 'typing' : '']"
        role="listitem"
        :id="'msg-' + m.id"
        :style="{ animationDelay: (reduceMotion ? 0 : m.delay) + 's' }"
      >
        <view v-if="m.role === 'ai'" class="avatar" aria-hidden="true">
          <text class="av-ico ri-robot-3-line"></text>
        </view>
        <view class="bubble">
          <block v-if="m.isTyping">
            <text class="dot"></text><text class="dot"></text><text class="dot"></text>
            <text class="think-tip">思考中{{ m.elapsed ? ' · ' + m.elapsed + 's' : '' }}</text>
          </block>
          <rich-text v-else :nodes="m.html"></rich-text>
        </view>
      </view>

      <view 
        v-for="(f, i) in followChips" 
        :key="'f-' + i"
        class="follow-row"
      >
        <view class="follow-chip" hover-class="fc-hover" :aria-label="'追问：' + f.text" @click="askQuestion(f.text)">
          {{ f.text }}
        </view>
      </view>

      <view id="msg-bottom"></view>
    </scroll-view>

    <!-- Composer: suggested prompts + input -->
    <view class="composer">
      <scroll-view scroll-x enable-flex class="suggest-row" role="list" aria-label="建议提问" show-scrollbar="false">
        <view
          v-for="(q, idx) in suggestedQuestions"
          :key="idx"
          class="suggest"
          hover-class="sg-hover"
          :aria-label="'提问：' + q"
          @click="askQuestion(q)"
        >{{ q }}</view>
      </scroll-view>
      <view class="input-bar">
        <view class="sr-only">输入你的问题</view>
        <input 
          id="msgInput" 
          type="text" 
          placeholder="输入你的问题……" 
          :value="inputText"
          @input="onInput"
          @confirm="askQuestion(null)"
          autocomplete="off"
        />
        <view class="icon-btn" hover-class="ib-hover" aria-label="语音输入" @click="toggleMic">
          <text class="ib-ico" :class="recording ? 'ri-mic-fill' : 'ri-mic-line'"></text>
        </view>
        <view 
          class="send-btn" 
          aria-label="发送" 
          :class="{ disabled: !canSend }"
          hover-class="sb-hover"
          @click="askQuestion(null)"
        >
          <text class="send-ico ri-send-plane-line"></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 0,
      messages: [],
      mid: 1,
      inputText: '',
      scrollToId: 'msg-bottom',
      followChips: [],
      recording: false,
      reduceMotion: false,

      displayName: '用户',
      // 建议问题：每次进入页面随机换一批
      suggestedQuestions: [],
      // AI 思考中：typingId 标识当前思考气泡，thinkTimer 秒表
      typingId: null,
      thinkTimer: null
    }
  },
  computed: {
    greeting() {
      return '你好，' + this.displayName + '！我是你的涉外法治AI助手，可以帮你解析法条、梳理案例、起草文书要点。今天想学点什么？'
    },
    canSend() {
      return !!(this.inputText && this.inputText.trim().length > 0)
    }
  },
  onShow() {
    this.loadUserInfo()
    // 每次进入页面随机换一批建议问题
    this.randomSuggestions()
  },
  onReady() {
    // 顶部安全区适配：动态获取系统状态栏高度
    this.statusBarHeight = this.getStatusBarHeight()
    this.renderSeed()
  },
  onUnload() {
    // 退出页面时清理思考计时器，避免定时器泄漏
    this.stopThinkTimer()
  },
  methods: {
    loadUserInfo() {
      const app = getApp()
      const user = (app && app.globalData && app.globalData.userInfo) || uni.getStorageSync('userInfo') || {}
      this.displayName = (user && (user.name || user.account)) || '用户'
    },
    getStatusBarHeight() {
      try {
        return uni.getWindowInfo().statusBarHeight || 0
      } catch (e) {
        try {
          return uni.getSystemInfoSync().statusBarHeight || 0
        } catch (err) {
          return 0
        }
      }
    },
    navBack() { uni.navigateBack({ delta: 1 }) },
    // 从建议问题池中随机抽取一批（每次进入页面调用）
    randomSuggestions() {
      const pool = [
        '解释WTO争端解决流程',
        '起草涉外合同要注意哪些要点？',
        '中美合规差异对比',
        '法律英语术语辨析',
        '外国仲裁裁决的承认与执行条件？',
        '涉外民事诉讼的管辖规则？',
        '企业数据跨境传输需要满足哪些合规要求？',
        '涉外合同中的不可抗力条款如何约定？',
        '外国法院判决在我国如何申请承认与执行？',
        '国际货物买卖合同的核心要点？',
        '海运提单的法律性质与风险防范？',
        '外国投资者如何提起国际投资仲裁？'
      ]
      const picked = []
      const count = Math.min(4, pool.length)
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * pool.length)
        picked.push(pool.splice(idx, 1)[0])
      }
      this.suggestedQuestions = picked
    },
    onInput(e) { this.inputText = e.detail.value },
    toggleMic() {
      this.recording = !this.recording
      if (this.recording) {
        uni.showToast({ title: '语音输入暂未开启…', icon: 'none', duration: 1500 })
        const self = this
        setTimeout(() => {
          if (self.recording) {
            self.recording = false
          }
        }, 1800)
      }
    },
    escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      })
    },
    // 行内样式：加粗/斜体/行内代码（颜色用具体值，rich-text 不解析 CSS 变量）
    inlineMd(text) {
      return this.escapeHtml(text)
        .replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:700;color:#2E7BE0;">$1</strong>')
        .replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em style="font-style:italic;">$2</em>')
        .replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,.06);border-radius:4px;padding:1px 5px;font-size:13px;">$1</code>')
    },
    // Markdown → HTML（AI 回答排版）：标题/加粗/斜体/代码/列表/引用
    markdownToHtml(md) {
      if (!md) return ''
      const lines = String(md).split('\n')
      let html = ''
      let i = 0
      let inCode = false
      let codeBuf = []

      while (i < lines.length) {
        let line = lines[i]

        // 代码块开始/结束
        if (/^\s*```/.test(line)) {
          if (inCode) {
            html += '<pre style="background:rgba(0,0,0,.05);border-radius:6px;padding:8px 12px;margin:6px 0;white-space:pre-wrap;word-break:break-word;">' + this.escapeHtml(codeBuf.join('\n')) + '</pre>'
            codeBuf = []
            inCode = false
          } else {
            inCode = true
          }
          i++
          continue
        }
        if (inCode) {
          codeBuf.push(line)
          i++
          continue
        }

        // 标题：## 课程概述 等
        const headMatch = line.match(/^(#{1,3})\s+(.+)$/)
        if (headMatch) {
          const level = headMatch[1].length
          const text = headMatch[2]
          const size = level === 1 ? '17px' : level === 2 ? '16px' : '15px'
          html += '<p style="font-size:' + size + ';font-weight:700;color:#16314F;margin:10px 0 4px;">' + this.inlineMd(text) + '</p>'
          i++
          continue
        }

        // 引用块
        if (/^>\s*/.test(line)) {
          let quoteLines = []
          while (i < lines.length && /^>\s*/.test(lines[i])) {
            quoteLines.push(lines[i].replace(/^>\s*/, ''))
            i++
          }
          html += '<blockquote style="background:rgba(34,197,94,.10);border-left:3px solid #22C55E;border-radius:0 8px 8px 0;padding:8px 12px;margin:8px 0;color:#047857;font-size:13px;line-height:1.55;">' + quoteLines.map(function (l) { return this.inlineMd(l) }.bind(this)).join('<br/>') + '</blockquote>'
          continue
        }

        // 无序列表：收集相邻列表项
        if (/^[-*]\s+/.test(line)) {
          let items = []
          while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
            items.push('<li style="color:#355580;line-height:1.6;">' + this.inlineMd(lines[i].replace(/^[-*]\s+/, '')) + '</li>')
            i++
          }
          html += '<ul style="padding-left:18px;margin:6px 0;list-style:disc;">' + items.join('') + '</ul>'
          continue
        }

        // 有序列表
        if (/^\d+[.、]\s+/.test(line)) {
          let items = []
          while (i < lines.length && /^\d+[.、]\s+/.test(lines[i])) {
            items.push('<li style="color:#355580;line-height:1.6;">' + this.inlineMd(lines[i].replace(/^\d+[.、]\s+/, '')) + '</li>')
            i++
          }
          html += '<ol style="padding-left:18px;margin:6px 0;list-style:decimal;">' + items.join('') + '</ol>'
          continue
        }

        // 空行
        if (!line.trim()) {
          html += '<div style="height:6px;"></div>'
          i++
          continue
        }

        // 普通段落
        html += '<p style="margin:6px 0;color:#16314F;line-height:1.7;word-break:break-word;">' + this.inlineMd(line.trim()) + '</p>'
        i++
      }

      if (inCode && codeBuf.length) {
        html += '<pre style="background:rgba(0,0,0,.05);border-radius:6px;padding:8px 12px;margin:6px 0;white-space:pre-wrap;word-break:break-word;">' + this.escapeHtml(codeBuf.join('\n')) + '</pre>'
      }

      return html
    },
    scrollBottom() {
      // 关键：先置空再赋值，强制触发 scroll-into-view（同值不会重新滚动）
      this.scrollToId = ''
      this.$nextTick(() => {
        setTimeout(() => {
          this.scrollToId = 'msg-bottom'
        }, 60)
      })
    },
    addMsg(role, html, delay, opts) {
      opts = opts || {}
      const msg = {
        id: this.mid++,
        role: role,
        html: html,
        raw: opts.raw || '',
        delay: this.reduceMotion ? 0 : (delay || 0),
        isTyping: !!opts.isTyping,
        elapsed: 0
      }
      this.messages.push(msg)
      this.scrollBottom()
      return msg
    },
    // 思考中：显示三点动画 + 实时秒数
    showThinking() {
      const msg = this.addMsg('ai', '', 0, { isTyping: true })
      this.typingId = msg.id
      const self = this
      this.stopThinkTimer()
      this.thinkTimer = setInterval(function () {
        const m = self.messages.find(function (x) { return x.id === self.typingId })
        if (m) m.elapsed = (m.elapsed || 0) + 1
      }, 1000)
    },
    hideThinking() {
      this.stopThinkTimer()
      if (this.typingId) {
        const idx = this.messages.findIndex(m => m.id === this.typingId)
        if (idx >= 0) this.messages.splice(idx, 1)
        this.typingId = null
      }
    },
    stopThinkTimer() {
      if (this.thinkTimer) {
        clearInterval(this.thinkTimer)
        this.thinkTimer = null
      }
    },
    async askQuestion(q) {
      const question = (q || this.inputText || '').trim()
      if (!question) return
      this.followChips = []
      this.addMsg('user', this.escapeHtml(question), 0, { raw: question })
      this.inputText = ''
      this.showThinking()

      // 收集最近对话作为上下文（排除思考中的气泡）
      const history = this.messages
        .filter(function (m) { return !m.isTyping && (m.role === 'user' || m.role === 'ai') })
        .map(function (m) {
          return { role: m.role === 'user' ? 'user' : 'assistant', content: m.raw || '' }
        })

      try {
        // customUI: true 关闭 uniCloud 调用云对象时自动弹出的 loading 遮罩
        const aiChat = uniCloud.importObject('aiChat', { customUI: true })
        const res = await aiChat.chat({ messages: history })
        this.hideThinking()
        if (res && res.errCode === 0) {
          const text = res.content || ''
          this.addMsg('ai', this.markdownToHtml(text), 0, { raw: text })
        } else {
          this.addMsg('ai', this.escapeHtml((res && res.errMsg) || 'AI 服务暂时不可用，请稍后重试'), 0)
        }
      } catch (e) {
        console.error('aiChat error:', e)
        this.hideThinking()
        this.addMsg('ai', this.escapeHtml('AI 服务连接失败，请稍后重试'), 0)
      }
    },
    renderSeed() {
      this.messages = []
      this.followChips = []
      this.mid = 1
      this.$nextTick(() => {
        const d = this.reduceMotion ? 0 : 0.08
        this.addMsg('ai', this.escapeHtml(this.greeting), d, { raw: this.greeting })
      })
    }
  }
}
</script>

<style>
page {
  --brand: #5B9DF9;
  --brand-deep: #2E7BE0;
  --brand-soft: #8FB8F5;
  --blue-50: #EFF6FF;
  --blue-100: #DBEAFE;
  --blue-200: #BFDBFE;
  --blue-300: #93C5FD;
  --blue-400: #60A5FA;
  --blue-500: #4A90E2;
  --blue-600: #2563EB;
  --blue-700: #1D4ED8;
  --violet: #8B5CF6;
  --ink: #16314F;
  --ink-2: #355580;
  --muted: #7A92B0;
  --muted-2: #9AAFC6;
  --line: rgba(120, 160, 210, 0.16);
  --glass: rgba(255, 255, 255, 0.55);
  --glass-2: rgba(255, 255, 255, 0.68);
  --glass-3: rgba(255, 255, 255, 0.82);
  --glass-border: rgba(255, 255, 255, 0.75);
  --glass-border-soft: rgba(255, 255, 255, 0.45);
  --glass-shadow: 0 20rpx 68rpx rgba(46, 123, 224, 0.14);
  --glass-shadow-sm: 0 12rpx 36rpx rgba(46, 123, 224, 0.10);
  --green: #22C55E;
  --rose: #FB7185;
  --rose-soft: rgba(251, 113, 133, 0.16);
  --r-pill: 999rpx;
}

/* ---------- Page wrap (Flex column 三段式：固定头/滚动区/固定底) ---------- */
.page-wrap {
  height: 100vh;
  background: linear-gradient(160deg, #EAF3FF 0%, #F4F9FF 45%, #E6F1FE 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
page { height: 100vh; overflow: hidden; }

.page-wrap::before,
.page-wrap::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  filter: blur(140rpx);
  z-index: 0;
  pointer-events: none;
}
.page-wrap::before {
  width: 520rpx; height: 520rpx;
  background: radial-gradient(circle, rgba(139,92,246,0.35), transparent 70%);
  top: -120rpx; left: -100rpx;
}
.page-wrap::after {
  width: 600rpx; height: 600rpx;
  background: radial-gradient(circle, rgba(91,157,249,0.38), transparent 70%);
  bottom: 40rpx; right: -180rpx;
}

/* ---------- Status bar safe-area ---------- */
.status-bar {
  width: 100%;
  flex-shrink: 0;
  background: transparent;
}

/* ---------- Sub-header (固定头部，不随内容滚动) ---------- */
.sub-header {
  position: relative; z-index: 45;
  flex: 0 0 auto;
  flex-shrink: 0;
  display: flex; align-items: center;
  padding: 20rpx 20rpx 18rpx;
  margin: 0 16rpx;
  gap: 10rpx;
  background: linear-gradient(180deg, rgba(234,243,255,0.96) 0%, rgba(244,249,255,0.90) 78%, rgba(244,249,255,0) 100%);
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
}
.sub-header .title {
  display: inline-flex; align-items: center; gap: 14rpx;
  font-size: 34rpx; font-weight: 700; color: var(--ink);
  letter-spacing: .5rpx;
}
.sub-header .spacer { flex: 1; }

.back {
  display: flex; align-items: center; justify-content: center;
  width: 80rpx; height: 80rpx;
  color: var(--ink-2);
  transition: opacity .2s;
  flex-shrink: 0;
}
.bk-hover { opacity: 0.55; }
.bk-ico {
  width: 40rpx; height: 40rpx;
  background: var(--ink-2);
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='19' y1='12' x2='5' y2='12'/%3E%3Cpolyline points='12 19 5 12 12 5'/%3E%3C/svg%3E") center/contain no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='19' y1='12' x2='5' y2='12'/%3E%3Cpolyline points='12 19 5 12 12 5'/%3E%3C/svg%3E") center/contain no-repeat;
}

/* ---------- Chat layout (唯一滚动区域，头/底均固定) ---------- */
.chat-area {
  position: relative; z-index: 5;
  flex: 1 1 auto;
  min-height: 0;          /* 关键：flex子项可收缩，保证Safari/Firefox下滚动生效 */
  height: 0;              /* 配合flex:1让高度严格由父容器剩余空间决定 */
  padding: 16rpx 32rpx 12rpx;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;  /* 移动端惯性滚动 */
}

/* ---------- Date divider ---------- */
.date-div {
  display: flex; align-items: center; justify-content: center;
  margin: 12rpx 0 28rpx;
}
.date-div text {
  font-size: 22rpx; font-weight: 600; color: var(--muted);
  background: var(--glass);
  padding: 6rpx 24rpx;
  border-radius: var(--r-pill);
  border: 2rpx solid var(--glass-border-soft);
}

/* ---------- Messages ---------- */
.msg {
  display: flex; gap: 16rpx; align-items: flex-end;
  margin-bottom: 28rpx;
  animation: fadeUp .5s cubic-bezier(.22,1,.36,1) backwards;
}
.msg.right { flex-direction: row-reverse; }

.msg .avatar {
  width: 64rpx; height: 64rpx; border-radius: 50%;
  background: linear-gradient(135deg, var(--brand) 0%, var(--violet) 100%);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 12rpx 32rpx rgba(91,157,249,0.4);
  animation: breathe 3.4s ease-in-out infinite;
  position: relative;
}
.msg .avatar::after {
  content: "";
  position: absolute;
  inset: -6rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(139,92,246,0.32), transparent 70%);
  z-index: -1;
  animation: aura 3.4s ease-in-out infinite;
}
@keyframes aura { 0%,100% { opacity: .35; } 50% { opacity: .8; } }
.av-ico { font-size: 30rpx; color: #fff; line-height: 1; }

.bubble {
  max-width: 74%;
  padding: 22rpx 28rpx;
  font-size: 27rpx;
  line-height: 1.6;
  word-break: break-word;
}
.msg.left .bubble {
  background: var(--glass-2);
  border: 2rpx solid var(--glass-border-soft);
  color: var(--ink);
  border-radius: 36rpx 36rpx 36rpx 12rpx;
  box-shadow: var(--glass-shadow-sm);
}
.msg.left .bubble >>> strong,
.msg.left .bubble strong {
  font-weight: 700;
  color: var(--brand-deep);
}
.msg.right .bubble {
  background: linear-gradient(135deg, var(--brand) 0%, var(--blue-600) 100%);
  color: #fff;
  border-radius: 36rpx 36rpx 12rpx 36rpx;
  box-shadow: 0 16rpx 40rpx rgba(46,123,224,0.34);
}

@keyframes breathe {
  0%,100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}

/* Typing indicator dots */
.msg.typing .bubble {
  display: flex; align-items: center; gap: 10rpx;
  padding: 28rpx 32rpx;
}
.msg.typing .dot {
  width: 14rpx; height: 14rpx; border-radius: 50%;
  background: linear-gradient(135deg, var(--brand), var(--violet));
  animation: typingBounce 1.3s infinite ease-in-out;
}
.msg.typing .dot:nth-child(2) { animation-delay: .2s; }
.msg.typing .dot:nth-child(3) { animation-delay: .4s; }
.think-tip {
  font-size: 22rpx;
  color: var(--muted);
  margin-left: 8rpx;
  white-space: nowrap;
}
@keyframes typingBounce {
  0%, 60%, 100% { transform: translateY(0); opacity: .4; }
  30% { transform: translateY(-12rpx); opacity: 1; }
}

/* ---------- Follow-up chip row ---------- */
.follow-row {
  display: flex;
  margin-left: 80rpx;
  margin-top: -16rpx;
  margin-bottom: 28rpx;
  animation: fadeUp .4s cubic-bezier(.22,1,.36,1) backwards;
  animation-delay: .1s;
}
.follow-chip {
  height: 56rpx; padding: 0 26rpx;
  border-radius: var(--r-pill);
  font-size: 24rpx; font-weight: 600;
  background: var(--blue-50);
  color: var(--brand-deep);
  border: 2rpx solid rgba(91,157,249,0.28);
  display: inline-flex; align-items: center; gap: 12rpx;
  transition: transform .2s, box-shadow .2s, background .2s;
  position: relative;
}
.follow-chip::before {
  content: "";
  width: 10rpx; height: 10rpx; border-radius: 50%;
  background: linear-gradient(135deg, var(--brand), var(--violet));
}
.fc-hover { box-shadow: 0 8rpx 24rpx rgba(46,123,224,0.2); transform: scale(0.94); }

/* ---------- Composer (固定底部输入区，不随内容滚动) ---------- */
.composer {
  position: relative; z-index: 45;
  flex: 0 0 auto;
  flex-shrink: 0;
  padding: 16rpx 24rpx 28rpx;
  /* 底部安全区适配（iOS 底部横条），普通设备为 0 */
  padding-bottom: calc(28rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(28rpx + env(safe-area-inset-bottom));
  background: linear-gradient(180deg, rgba(244,249,255,0) 0%, rgba(244,249,255,0.92) 28%, rgba(244,249,255,0.98) 60%, #F4F9FF 100%);
  backdrop-filter: blur(18rpx);
  -webkit-backdrop-filter: blur(18rpx);
  border-top: 2rpx solid rgba(120,160,210,0.10);
}
.suggest-row {
  white-space: nowrap;
  padding: 8rpx 4rpx 20rpx;
}
.suggest {
  display: inline-flex; align-items: center; gap: 12rpx;
  margin-right: 16rpx;
  height: 60rpx; padding: 0 28rpx;
  border-radius: var(--r-pill);
  font-size: 24rpx; font-weight: 600;
  background: var(--glass);
  border: 2rpx solid var(--glass-border);
  color: var(--ink-2);
  box-shadow: var(--glass-shadow-sm);
  transition: transform .2s, box-shadow .2s;
  white-space: nowrap;
  position: relative;
}
.suggest::before {
  content: "";
  width: 12rpx; height: 12rpx; border-radius: 50%;
  background: linear-gradient(135deg, var(--brand), var(--violet));
}
.sg-hover { transform: scale(0.94); box-shadow: 0 6rpx 18rpx rgba(46,123,224,0.18); }

.input-bar {
  display: flex; align-items: center; gap: 16rpx;
  background: var(--glass-2);
  border: 2rpx solid var(--glass-border);
  border-radius: var(--r-pill);
  padding: 10rpx 10rpx 10rpx 32rpx;
  box-shadow: var(--glass-shadow-sm);
}
.input-bar input {
  flex: 1; border: none; background: none; outline: none;
  font-size: 28rpx; color: var(--ink);
  height: 76rpx;
}
.input-bar input::placeholder { color: var(--muted-2); }

.icon-btn {
  width: 76rpx; height: 76rpx; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: var(--glass);
  border: 2rpx solid var(--glass-border-soft);
  color: var(--ink-2);
  flex-shrink: 0;
  transition: transform .2s, color .2s;
}
.ib-hover { transform: scale(0.9); }
.ib-ico { font-size: 32rpx; color: var(--ink-2); line-height: 1; }

.send-btn {
  width: 80rpx; height: 80rpx; border-radius: 50%;
  background: linear-gradient(135deg, var(--brand) 0%, var(--blue-600) 100%);
  display: flex; align-items: center; justify-content: center;
  color: #fff; flex-shrink: 0;
  box-shadow: 0 12rpx 32rpx rgba(46,123,224,0.42);
  transition: transform .2s, opacity .25s, box-shadow .25s, background .25s;
}
.send-btn.disabled {
  opacity: .45;
  background: linear-gradient(135deg, var(--muted-2), var(--muted));
  box-shadow: none;
}
.send-ico { font-size: 32rpx; transform: translateX(2rpx); line-height: 1; }
.sb-hover { transform: scale(0.9); }

/* Sr only (screen reader only) */
.sr-only {
  position: absolute; width: 1rpx; height: 1rpx;
  padding: 0; margin: -1rpx; overflow: hidden;
  clip: rect(0,0,0,0); white-space: nowrap; border: 0;
  font-size: 0;
}

@keyframes fadeUp { from { opacity: 0; transform: translateY(36rpx); } to { opacity: 1; transform: translateY(0); } }
</style>
