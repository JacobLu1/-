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
        <view class="suggest" hover-class="sg-hover" @click="askQuestion('解释WTO争端解决流程')">
          解释WTO争端解决流程
        </view>
        <view class="suggest" hover-class="sg-hover" @click="askQuestion('起草涉外合同要点')">
          起草涉外合同要点
        </view>
        <view class="suggest" hover-class="sg-hover" @click="askQuestion('中美合规差异对比')">
          中美合规差异对比
        </view>
        <view class="suggest" hover-class="sg-hover" @click="askQuestion('法律英语术语辨析')">
          法律英语术语辨析
        </view>
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

      GREETING: '你好，陆知远！我是你的涉外法治AI助手，可以帮你解析法条、梳理案例、起草文书要点。今天想学点什么？',
      SEED_USER_Q: '请解释国际商事仲裁中管辖权异议的处理流程。',
      ANSWERS: [
        {
          keys: ['管辖权', '异议', '仲裁庭', '自裁'],
          text: '国际商事仲裁中<strong>管辖权异议</strong>的处理流程：①当事人应在仲裁庭首次开庭前提出（部分规则要求不晚于提交实体答辩时）；②适用<strong>仲裁庭自裁管辖权原则</strong>（Kompetenz-Kompetenz），仲裁庭可自行裁定自身管辖权；③异议被驳回后，多数仲裁地法允许事后向法院申请司法审查（如<strong>SIAC</strong>规则下需经法院确认）；④裁决作出后，可依<strong>《纽约公约》</strong>第5条以"无管辖权"为由申请拒绝承认与执行。',
          follow: '查看相关案例'
        },
        {
          keys: ['WTO', '争端'],
          text: '<strong>WTO争端解决</strong>大致分四步：①<strong>协商</strong>（必经程序，至少60天）；②<strong>专家组审理</strong>（DSU第6条，约6个月出报告）；③<strong>上诉机构复审</strong>（仅法律审，60-90天）；④<strong>DSB通过并监督执行</strong>。败诉方未合理执行的，胜诉方可申请报复授权。近年因上诉机构停摆，多方诉诸MPIA仲裁作为替代。',
          follow: '查看争端时间线'
        },
        {
          keys: ['合同', '起草'],
          text: '起草涉外合同要把握三层要点：①<strong>准据法与管辖</strong>——明示选择适用法与争议解决条款（仲裁地、机构、语言）；②<strong>核心条款</strong>——标的、对价、交付、违约责任、不可抗力；③<strong>跨境合规</strong>——出口管制、制裁筛查、数据跨境与税务。建议附中英对照版本并约定效力优先顺序。',
          follow: '下载合同模板'
        },
        {
          keys: ['合规', '差异', '中美'],
          text: '中美合规差异集中在三块：①<strong>数据合规</strong>——中国《数据安全法》《个人信息保护法》强调重要数据出境评估，美国偏行业自律加州法（CCPA）；②<strong>出口管制</strong>——中国《出口管制法》与美国EAR均管辖域外行为，企业需做双重筛查；③<strong>反垄断申报</strong>——中美门槛与管辖标准不同，跨境并购常需双报。',
          follow: '合规自查清单'
        },
        {
          keys: ['英语', '术语', '辨析', '对照'],
          text: '涉外法治高频术语辨析：①<strong>Jurisdiction</strong>（管辖权）vs <strong>Governing Law</strong>（准据法）——前者指争端由谁审理，后者指实体适用哪国法；②<strong>Arbitration</strong> vs <strong>Litigation</strong>——仲裁一裁终局、保密、可跨国执行（《纽约公约》），诉讼公开且可上诉；③<strong>Force Majeure</strong> 不可抗力 vs <strong>Hardship</strong> 艰难情形——前者免责，后者触发重新协商。',
          follow: '术语对照表'
        },
        {
          keys: ['案例', '时间线', '模板', '清单', '解析'],
          text: '为你整理三则典型涉外法治案例：①<strong>ICC仲裁管辖权异议案</strong>——仲裁庭依自裁原则裁定管辖，后经法院确认；②<strong>中美贸易争端DS542</strong>——WTO专家组就技术转让争议作出裁决；③<strong>SIAC裁决在华承认执行案</strong>——法院依《纽约公约》第5条审查公共政策例外。需要哪一则展开？',
          follow: '解析案例一'
        }
      ],
      FALLBACK: {
        text: '这是个很好的问题。建议从<strong>法律依据</strong>、<strong>适用范围</strong>与<strong>实务要点</strong>三个层面展开。如果你能告诉我具体场景（如合同类型、争议阶段），我可以给出更有针对性的解析，或帮你起草相关文书要点。',
        follow: '换个角度问'
      }
    }
  },
  computed: {
    canSend() {
      return !!(this.inputText && this.inputText.trim().length > 0)
    }
  },
  onReady() {
    // 顶部安全区适配：动态获取系统状态栏高度
    this.statusBarHeight = this.getStatusBarHeight()
    this.renderSeed()
  },
  methods: {
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
    matchAnswer(q) {
      const lower = q.toLowerCase()
      for (let i = 0; i < this.ANSWERS.length; i++) {
        const a = this.ANSWERS[i]
        for (let j = 0; j < a.keys.length; j++) {
          const k = a.keys[j]
          if (q.indexOf(k) !== -1 || lower.indexOf(k.toLowerCase()) !== -1) return a
        }
      }
      return this.FALLBACK
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
        delay: this.reduceMotion ? 0 : (delay || 0),
        isTyping: !!opts.isTyping
      }
      this.messages.push(msg)
      this.scrollBottom()
      return msg
    },
    addFollowChip(text) {
      this.followChips = [{ text: text }]
      this.scrollBottom()
    },
    showTyping() {
      const msg = this.addMsg('ai', '', 0, { isTyping: true })
      this.typingId = msg.id
    },
    hideTyping() {
      if (this.typingId) {
        const idx = this.messages.findIndex(m => m.id === this.typingId)
        if (idx >= 0) this.messages.splice(idx, 1)
        this.typingId = null
      }
    },
    askQuestion(q) {
      const question = (q || this.inputText || '').trim()
      if (!question) return
      this.followChips = []
      this.addMsg('user', this.escapeHtml(question), 0)
      this.inputText = ''
      this.showTyping()
      const delay = this.reduceMotion ? 220 : 1300
      const self = this
      setTimeout(function () {
        self.hideTyping()
        const ans = self.matchAnswer(question)
        self.addMsg('ai', ans.text, 0)
        if (ans.follow) self.addFollowChip(ans.follow)
      }, delay)
    },
    renderSeed() {
      this.messages = []
      this.followChips = []
      this.mid = 1
      this.$nextTick(() => {
        const d = this.reduceMotion ? 0 : 0.08
        this.addMsg('ai', this.GREETING, d)
        setTimeout(() => {
          this.addMsg('user', this.escapeHtml(this.SEED_USER_Q), this.reduceMotion ? 0 : 0.28)
          setTimeout(() => {
            const ans = this.matchAnswer(this.SEED_USER_Q)
            this.addMsg('ai', ans.text, this.reduceMotion ? 0 : 0.5)
            if (ans.follow) this.addFollowChip(ans.follow)
          }, this.reduceMotion ? 0 : 220)
        }, this.reduceMotion ? 0 : 200)
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
