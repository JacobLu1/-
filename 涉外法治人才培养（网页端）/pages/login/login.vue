<template>
  <view class="login-page">
    <view class="stage">
      <!-- 背景层 -->
      <view class="bg-mesh"></view>
      <view class="bg-grid"></view>
      <view class="bg-blob blob-a"></view>
      <view class="bg-blob blob-b"></view>
      <!-- 星星粒子 -->
      <view class="star-field">
        <view class="star" v-for="i in 30" :key="'s'+i"
          :style="{
            left: starStyles[i-1].left,
            top: starStyles[i-1].top,
            width: starStyles[i-1].size,
            height: starStyles[i-1].size,
            animationDelay: starStyles[i-1].delay,
            animationDuration: starStyles[i-1].duration
          }"
        ></view>
      </view>
      <canvas id="particles" class="particles-canvas"></canvas>

      <!-- 左侧视觉面板 -->
      <aside class="visual">
        <view class="brand-row">
          <view class="brand-mark">
            <view class="brand-icon"></view>
          </view>
          <view class="brand-name">
            <text class="brand-name-cn">涉外法治人才培养平台</text>
            <text class="brand-name-en">Rule of Law · Global Talent Cultivation</text>
          </view>
        </view>

        <view class="globe-stage">
          <view class="globe-wrap">
            <view class="globe-glow"></view>
            <view class="ring-ticks"></view>
            <view class="ring-arc"></view>
            <view class="globe">
              <!-- 经线 -->
              <view class="meridian" style="transform:rotateY(0deg)"></view>
              <view class="meridian dim" style="transform:rotateY(22deg)"></view>
              <view class="meridian" style="transform:rotateY(45deg)"></view>
              <view class="meridian dim" style="transform:rotateY(67deg)"></view>
              <view class="meridian" style="transform:rotateY(90deg)"></view>
              <view class="meridian dim" style="transform:rotateY(112deg)"></view>
              <view class="meridian" style="transform:rotateY(135deg)"></view>
              <view class="meridian dim" style="transform:rotateY(157deg)"></view>
              <!-- 纬线 -->
              <view class="lat" style="top:8%;height:84%;transform:rotateX(78deg)"></view>
              <view class="lat" style="top:20%;height:60%;transform:rotateX(78deg)"></view>
              <view class="lat" style="top:38%;height:24%;transform:rotateX(78deg)"></view>
              <view class="globe-core"></view>
            </view>
            <!-- 轨道节点 -->
            <view class="orbit">
              <view class="node" style="transform:translate(-50%,-50%) rotateY(0deg) translateZ(50%)"></view>
              <view class="node small" style="transform:translate(-50%,-50%) rotateY(120deg) translateZ(50%)"></view>
              <view class="node small" style="transform:translate(-50%,-50%) rotateY(240deg) translateZ(50%)"></view>
            </view>
            <view class="orbit r2">
              <view class="node small" style="transform:translate(-50%,-50%) rotateY(60deg) rotateX(40deg) translateZ(56%)"></view>
              <view class="node" style="transform:translate(-50%,-50%) rotateY(200deg) rotateX(40deg) translateZ(56%)"></view>
            </view>
          </view>

          <!-- 悬浮天平 -->
          <view class="scales">
            <view class="scales-icon"></view>
          </view>

          <view class="doc-chip">
            <view class="doc-chip-dot"></view>
            <text>各维度专项能力提升</text>
          </view>
          <view class="doc-chip two">
            <view class="doc-chip-dot"></view>
            <text>WTO / CPTPP 专项测评</text>
          </view>
        </view>

        <view class="v-foot">
          <text class="v-eyebrow">International · Legal · Assessment\n</text>
          <text class="v-title">立足中国 <text class="v-title-em">胸怀天下</text>\n培育涉外法治英才\n</text>
          <text class="v-sub">面向涉外律师、国际仲裁员、合规官与法科学生，提供从知识\n图谱、实务情境到胜任力模型的科学化人才培养体系，为国家\n级涉外法治人才库精准绘制画像。</text>
          <view class="v-stats">
            <view class="stat">
              <text class="stat-num" :data-count="statTargets.dimension">{{ animatedStats.dimension }}</text>
              <text class="stat-label">题库题目</text>
            </view>
            <view class="stat">
              <text class="stat-num" :data-count="statTargets.countries">{{ animatedStats.countries }}</text>
              <text class="stat-label">上线资源</text>
            </view>
            <view class="stat">
              <text class="stat-num" :data-count="statTargets.talents" data-suffix="+">{{ animatedStats.talents }}</text>
              <text class="stat-label">测评人数</text>
            </view>
          </view>
        </view>
      </aside>

      <!-- 右侧登录面板 -->
      <main class="panel">
        <view class="card">
          <view class="c-head">
            <text class="c-head-title">欢迎登录\n</text>
            <text class="c-head-sub"><text class="c-head-sub-en">Welcome back</text> · 进入你的涉外法治胜任力画像</text>
          </view>

          <view class="roles">
            <view 
              class="role" 
              :class="{ active: activeRole === 'user' }"
              @tap="activeRole = 'user'"
            >
              <view class="role-icon-user"></view>
              <text>用户</text>
            </view>
            <view 
              class="role" 
              :class="{ active: activeRole === 'admin' }"
              @tap="activeRole = 'admin'"
            >
              <view class="role-icon-admin"></view>
              <text>管理员</text>
            </view>
          </view>

          <view class="form">
            <view class="field">
              <input 
                type="text" 
                class="field-input" 
                v-model="account"
                placeholder="账号"
                autocomplete="username"
                @confirm="handleSubmit"
                @keyup.enter="handleSubmit"
              >
              <view class="field-icon-user"></view>
              <text class="field-label">账号 / 证件号</text>
            </view>

            <view class="field">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                class="field-input" 
                v-model="password"
                placeholder="密码"
                autocomplete="current-password"
                @confirm="handleSubmit"
                @keyup.enter="handleSubmit"
              >
              <view class="field-icon-lock"></view>
              <text class="field-label">登录密码</text>
              <view class="field-toggle" @tap="showPassword = !showPassword">
                <view class="field-icon-eye" :class="{ 'eye-off': showPassword }"></view>
              </view>
            </view>

            <view class="captcha">
              <view class="captcha-row">
                <view class="field">
                  <input 
                    type="text" 
                    class="field-input" 
                    v-model="captchaCode"
                    placeholder="验证码"
                    maxlength="4"
                    @confirm="handleSubmit"
                  >
                  <view class="field-icon-check"></view>
                  <text class="field-label">图形验证码</text>
                </view>
                <view class="captcha-box" @tap="refreshCaptcha" :style="{ transform: `rotate(${captchaRotation}deg)` }">
                  <text class="captcha-text">{{ captchaText }}</text>
                </view>
              </view>
            </view>

            <view class="opts">
              <view class="check" @tap="rememberMe = !rememberMe">
                <view class="check-box" :class="{ checked: rememberMe }">
                  <view class="check-icon" v-if="rememberMe"></view>
                </view>
                <text class="check-label">7天免登录</text>
              </view>
              <text class="opts-link" @tap="handleForgotPassword">忘记密码？</text>
            </view>

            <button class="submit" @tap="handleSubmit">
              <view class="submit-shimmer"></view>
              <text class="submit-text">{{ submitButtonText }}</text>
            </button>
          </view>

          <view class="divider">
            <text class="divider-text">其他登录方式</text>
          </view>

          <view class="sso">
            <button class="sso-btn" @tap="handleWechatLogin">
              <view class="sso-icon-wechat"></view>
              <text>微信登录</text>
            </button>
            <button class="sso-btn" @tap="handleUnifiedAuth">
              <view class="sso-icon-shield"></view>
              <text>统一身份认证</text>
            </button>
          </view>

          <view class="c-foot">
            <text class="c-foot-text">还没有账号？</text>
            <text class="c-foot-link" @tap="handleRegister">立即注册申请</text>
            <text class="c-foot-text"> · 机构开通请联系 010-XXXX</text>
          </view>
        </view>

        <view class="legal-mini">
          <text>© 2026 涉外法治人才培养平台 · 京公网安备 11000002000088 · ICP 备2026XXXXXX 号</text>
        </view>
      </main>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      account: '',
      password: '',
      captchaCode: '',
      showPassword: false,
      rememberMe: true,
      activeRole: 'user',
      captchaText: '',
      captchaRotation: 0,
      submitButtonText: '进 入 平 台',
      animatedStats: {
        dimension: '0',
        countries: '0',
        talents: '0'
      },
      statTargets: {
        dimension: 0,
        countries: 0,
        talents: 0
      },
      starStyles: []
    }
  },
  mounted() {
    this.initStarStyles()
    this.refreshCaptcha()
    this.loadStats()
    this.initParticles()
  },
  onLoad(options) {
    // 从注册页返回时自动回填账号
    if (options && options.account) {
      this.account = decodeURIComponent(options.account)
    }
  },
  methods: {
    initStarStyles() {
      const styles = []
      for (let i = 0; i < 30; i++) {
        styles.push({
          left: Math.random() * 94 + '%',
          top: Math.random() * 100 + '%',
          size: (Math.random() * 3 + 1) + 'px',
          delay: Math.random() * 6 + 's',
          duration: (Math.random() * 4 + 4) + 's'
        })
      }
      this.starStyles = styles
    },
    refreshCaptcha() {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
      let code = ''
      for (let i = 0; i < 4; i++) {
        code += chars[Math.floor(Math.random() * chars.length)]
      }
      this.captchaText = code
      this.captchaRotation = Math.random() * 6 - 3
    },
    loadStats() {
      const usersObj = uniCloud.importObject('users')
      usersObj.overview()
        .then((r) => {
          r = r || {}
          if (r.errCode === 0) {
            this.statTargets = {
              dimension: r.questionCount || 0,
              countries: r.resourceCount || 0,
              talents: r.surveyCount || 0
            }
          }
        })
        .catch((err) => {
          console.error('[login] overview load error:', err)
        })
        .finally(() => {
          this.animateStats()
        })
    },
    animateStats() {
      const targets = [
        { key: 'dimension', target: this.statTargets.dimension, suffix: '' },
        { key: 'countries', target: this.statTargets.countries, suffix: '' },
        { key: 'talents', target: this.statTargets.talents, suffix: '+' }
      ]
      
      const duration = 1600
      const startTime = performance.now()
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        
        targets.forEach(item => {
          const value = Math.floor(item.target * eased)
          if (item.target >= 10000) {
            this.animatedStats[item.key] = (value / 10000).toFixed(1) + 'w' + item.suffix
          } else {
            this.animatedStats[item.key] = value.toLocaleString() + item.suffix
          }
        })
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      setTimeout(() => {
        requestAnimationFrame(animate)
      }, 700)
    },
    initParticles() {
      // #ifdef H5
      const el = document.getElementById('particles')
      if (!el) return
      // uni-app H5 会把 <canvas> 编译为 uni-canvas 自定义组件，内部才是原生 canvas
      const canvas = el.getContext ? el : (el.querySelector ? el.querySelector('canvas') : null)
      if (!canvas || !canvas.getContext) return

      const ctx = canvas.getContext('2d')
      let W, H, particles = []
      
      const resize = () => {
        W = canvas.width = window.innerWidth
        H = canvas.height = window.innerHeight
      }
      
      resize()
      window.addEventListener('resize', resize)
      
      const initParticles = () => {
        particles = []
        const n = Math.min(100, Math.floor(W * H / 15000))
        for (let i = 0; i < n; i++) {
          const type = Math.random()
          particles.push({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 2.5 + 0.8,
            alpha: Math.random() * 0.5 + 0.3,
            hue: type < 0.3 ? 210 : type < 0.6 ? 195 : 225,
            pulse: Math.random() * Math.PI * 2
          })
        }
      }
      
      initParticles()
      
      let frame = 0
      const draw = () => {
        frame++
        ctx.clearRect(0, 0, W, H)
        
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]
          p.x += p.vx
          p.y += p.vy
          
          if (p.x < 0 || p.x > W) p.vx *= -1
          if (p.y < 0 || p.y > H) p.vy *= -1
          
          // 脉冲呼吸效果
          const pulseR = p.r + Math.sin(frame * 0.02 + p.pulse) * 0.4
          
          // 光晕层
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulseR * 3)
          glow.addColorStop(0, `hsla(${p.hue},80%,65%,${p.alpha * 0.35})`)
          glow.addColorStop(0.4, `hsla(${p.hue},70%,55%,${p.alpha * 0.12})`)
          glow.addColorStop(1, 'transparent')
          ctx.beginPath()
          ctx.arc(p.x, p.y, pulseR * 3, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()
          
          // 粒子本体
          ctx.beginPath()
          ctx.arc(p.x, p.y, pulseR, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${p.hue},85%,70%,${p.alpha})`
          ctx.fill()
          
          // 连线
          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j]
            const dx = p.x - q.x
            const dy = p.y - q.y
            const d = Math.hypot(dx, dy)
            
            if (d < 150) {
              const lineAlpha = 0.15 * (1 - d / 150)
              ctx.beginPath()
              ctx.moveTo(p.x, p.y)
              ctx.lineTo(q.x, q.y)
              ctx.strokeStyle = `hsla(${p.hue},80%,60%,${lineAlpha})`
              ctx.lineWidth = 0.8
              ctx.stroke()
            }
          }
        }
        
        requestAnimationFrame(draw)
      }
      
      draw()
      // #endif
    },
    handleSubmit() {
      // 非空验证
      if (!this.account) {
        uni.showToast({ title: '请输入账号', icon: 'none' })
        return
      }
      if (!this.password) {
        uni.showToast({ title: '请输入密码', icon: 'none' })
        return
      }
      if (!this.captchaCode) {
        uni.showToast({ title: '请输入验证码', icon: 'none' })
        return
      }

      // 验证码必须先校验（区分大小写），不匹配则直接拒绝
      if (this.captchaCode.toUpperCase() !== this.captchaText.toUpperCase()) {
        uni.showToast({ title: '验证码错误', icon: 'none' })
        this.refreshCaptcha()
        this.captchaCode = ''
        return
      }

      // 提交到 users 云对象（网页端 + 小程序端共用同一服务空间）
      this.submitButtonText = '身份核验中...'
      const usersObj = uniCloud.importObject('users')
      usersObj.login({ account: this.account, password: this.password, role: this.activeRole })
        .then((r) => {
          r = r || {}
          if (r.errCode !== 0) {
            uni.showToast({ title: r.errMsg || '登录失败', icon: 'none' })
            this.refreshCaptcha()
            this.submitButtonText = '进 入 平 台'
            return
          }

          this.submitButtonText = '登录成功，正在跳转...'

          setTimeout(() => {
            const isAdmin = r.userInfo.role === 'admin'
            const tokenKey = isAdmin ? 'adminToken' : 'token'
            const userInfoKey = isAdmin ? 'adminInfo' : 'userInfo'

            uni.setStorageSync(tokenKey, r.token)
            uni.setStorageSync(userInfoKey, r.userInfo)

            // 管理员跳转到数据总览，用户跳转到问卷测评
            const targetUrl = isAdmin ? '/pages/admin/dashboard' : '/pages/survey/survey'
            uni.redirectTo({ url: targetUrl })
          }, 1200)
        })
        .catch((err) => {
          console.error('[login] users 云对象调用失败:', err)
          uni.showToast({ title: (err && err.errMsg) || '网络异常，请稍后重试', icon: 'none' })
          this.refreshCaptcha()
          this.submitButtonText = '进 入 平 台'
        })
    },
    handleForgotPassword() {
      uni.showToast({ title: '忘记密码功能开发中', icon: 'none' })
    },
    handleWechatLogin() {
      uni.showToast({ title: '微信登录功能开发中', icon: 'none' })
    },
    handleUnifiedAuth() {
      uni.showToast({ title: '统一身份认证功能开发中', icon: 'none' })
    },
    handleRegister() {
      uni.navigateTo({ url: '/pages/register/register' })
    }
  }
}
</script>

<style scoped>
/* ============ 设计令牌 ============ */
.login-page {
  --c-bg-0: #F2F8FF;
  --c-bg-1: #E3EFFD;
  --c-bg-2: #D4E6FB;
  --c-ink-900: #0B2545;
  --c-ink-700: #13315C;
  --c-ink-500: #3E5C84;
  --c-ink-400: #5B7BA8;
  --c-ink-300: #8AA3C9;
  --c-line: #CBD9EF;
  --c-blue-100: #DBEAFE;
  --c-blue-300: #93C5FD;
  --c-blue-400: #60A5FA;
  --c-blue-500: #3B82F6;
  --c-blue-600: #2563EB;
  --c-blue-700: #1D4ED8;
  --c-blue-900: #1E3A8A;
  --c-white: #FFFFFF;
  --shadow-soft: 0 24px 60px -28px rgba(30,58,138,.38);
  --shadow-card: 0 30px 80px -30px rgba(29,78,216,.30);
  --shadow-glow: 0 0 60px rgba(96,165,250,.45);
  --radius: 18px;
  --serif-cn: "Noto Serif SC", serif;
  --serif-en: "Fraunces", serif;
  --sans: "Noto Sans SC", system-ui, sans-serif;
  
  min-height: 100vh;
  font-family: var(--sans);
  color: var(--c-ink-700);
  background: var(--c-bg-0);
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ============ 主舞台 ============ */
.stage {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 1.08fr 0.92fr;
  overflow: hidden;
}

/* —— 背景层 —— */
.bg-mesh {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(900px 600px at 12% 18%, #DCEBFF 0%, transparent 55%),
    radial-gradient(800px 700px at 88% 82%, #C9DDF8 0%, transparent 60%),
    linear-gradient(135deg, #F2F8FF 0%, #E6F0FC 50%, #DCEBFF 100%);
}

.bg-grid {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.35;
  background-image:
    linear-gradient(rgba(37,99,235,.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37,99,235,.06) 1px, transparent 1px);
  background-size: 46px 46px;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 45%, #000 30%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 45%, #000 30%, transparent 80%);
}

.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  z-index: 1;
  mix-blend-mode: multiply;
  opacity: 0.5;
}

.blob-a {
  width: 480px;
  height: 480px;
  background: #AECDF5;
  top: -120px;
  left: -80px;
  animation: drift 18s ease-in-out infinite;
}

.blob-b {
  width: 420px;
  height: 420px;
  background: #C9DBF7;
  bottom: -140px;
  right: 30%;
  animation: drift 22s ease-in-out infinite reverse;
}

@keyframes drift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(40px, 30px) scale(1.08); }
}

.particles-canvas {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

/* ============ 星星粒子 ============ */
.star-field {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}
.star {
  position: absolute;
  border-radius: 50%;
  background: #60A5FA;
  box-shadow: 0 0 6px 2px rgba(96,165,250,0.6), 0 0 12px 4px rgba(147,197,253,0.3);
  animation: twinkle var(--s-dur, 5s) ease-in-out var(--s-delay, 0s) infinite;
}
@keyframes twinkle {
  0%, 100% { opacity: 0.15; transform: translate(0, 0) scale(1); }
  25% { opacity: 1; transform: translate(8px, -6px) scale(1.6); }
  50% { opacity: 0.2; transform: translate(-5px, 4px) scale(0.8); }
  75% { opacity: 0.9; transform: translate(3px, -3px) scale(1.4); }
}

/* ============ 左侧视觉面板 ============ */
.visual {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 38px 52px 40px;
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 14px;
  opacity: 0;
  animation: rise 0.9s 0.1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.brand-mark {
  width: 46px;
  height: 46px;
  border-radius: 13px;
  background: linear-gradient(140deg, var(--c-blue-600), var(--c-blue-900));
  display: grid;
  place-items: center;
  color: #fff;
  box-shadow: 0 10px 24px -8px rgba(29,78,216,.6), inset 0 1px 0 rgba(255,255,255,.4);
}

.brand-icon {
  width: 26px;
  height: 26px;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M7 21h10'/><path d='M12 3v18'/><path d='M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2'/></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z'/><path d='M7 21h10'/><path d='M12 3v18'/><path d='M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2'/></svg>") center/contain no-repeat;
}

.brand-name {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.brand-name-cn {
  font-family: var(--serif-cn);
  font-weight: 700;
  font-size: 16px;
  color: var(--c-ink-900);
  letter-spacing: 0.5px;
}

.brand-name-en {
  font-family: var(--serif-en);
  font-style: italic;
  font-size: 11px;
  color: var(--c-ink-400);
  letter-spacing: 0.4px;
}

/* —— 地球舞台 —— */
.globe-stage {
  position: relative;
  flex: 1;
  display: grid;
  place-items: center;
  opacity: 0;
  animation: rise 1.1s 0.25s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.globe-wrap {
  position: relative;
  width: min(440px, 38vh);
  aspect-ratio: 1;
  perspective: 900px;
}

.globe-glow {
  position: absolute;
  inset: -14%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(96,165,250,.35) 0%, rgba(147,197,253,.18) 45%, transparent 70%);
  filter: blur(8px);
  animation: pulse 6s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.06); opacity: 1; }
}

.globe {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  animation: spin 26s linear infinite;
}

@keyframes spin {
  to { transform: rotateY(360deg); }
}

.meridian {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid rgba(37,99,235,.55);
  box-shadow: inset 0 0 18px rgba(96,165,250,.15);
}

.meridian.dim {
  border-color: rgba(96,165,250,.35);
}

.lat {
  position: absolute;
  left: 0;
  right: 0;
  border-radius: 50%;
  border: 1px solid rgba(59,130,246,.42);
  transform-style: preserve-3d;
}

.globe-core {
  position: absolute;
  inset: 24%;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, rgba(255,255,255,.85), rgba(219,234,254,.5) 40%, rgba(147,197,253,.25) 75%, transparent);
  filter: blur(2px);
}

.orbit {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  animation: spin 16s linear infinite reverse;
}

.orbit.r2 {
  animation-duration: 24s;
  animation-direction: normal;
}

.node {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--c-blue-600);
  box-shadow: 0 0 14px 2px rgba(59,130,246,.7);
  transform-style: preserve-3d;
}

.node.small {
  width: 7px;
  height: 7px;
  background: var(--c-blue-400);
}

.node::after {
  content: "";
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 1px solid rgba(59,130,246,.35);
}

.ring-ticks {
  position: absolute;
  inset: -6%;
  border-radius: 50%;
  border: 1px dashed rgba(37,99,235,.22);
  animation: spin 60s linear infinite;
}

.ring-arc {
  position: absolute;
  inset: -10%;
  border-radius: 50%;
  border-top: 2px solid var(--c-blue-500);
  border-right: 2px solid transparent;
  border-bottom: 2px solid transparent;
  border-left: 2px solid transparent;
  transform: rotate(-30deg);
  animation: spin 14s linear infinite;
  opacity: 0.7;
}

/* —— 悬浮天平 —— */
.scales {
  position: absolute;
  right: 6%;
  top: 24%;
  width: 84px;
  height: 84px;
  opacity: 0.85;
  animation: sway 5s ease-in-out infinite;
  filter: drop-shadow(0 8px 16px rgba(29,78,216,.25));
}

@keyframes sway {
  0%, 100% { transform: rotate(-4deg); }
  50% { transform: rotate(4deg); }
}

.scales-icon {
  width: 100%;
  height: 100%;
  background: #1D4ED8;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'><path d='M50 14v66M28 80h44M50 20L24 30M50 20l26 10M18 30h64M24 30l-8 18h16zM76 30l-8 18h16z'></path><circle cx='50' cy='14' r='3.5' fill='black' stroke='none'></circle><path d='M16 48a8 8 0 0 0 16 0M68 48a8 8 0 0 0 16 0' stroke='black'></path></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'><path d='M50 14v66M28 80h44M50 20L24 30M50 20l26 10M18 30h64M24 30l-8 18h16zM76 30l-8 18h16z'></path><circle cx='50' cy='14' r='3.5' fill='black' stroke='none'></circle><path d='M16 48a8 8 0 0 0 16 0M68 48a8 8 0 0 0 16 0' stroke='black'></path></svg>") center/contain no-repeat;
}

.doc-chip {
  position: absolute;
  left: 4%;
  bottom: 30%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border-radius: 12px;
  background: rgba(255,255,255,.72);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,.8);
  box-shadow: 0 12px 30px -16px rgba(30,58,138,.4);
  font-size: 12px;
  color: var(--c-ink-700);
  font-weight: 500;
  animation: floatY 7s ease-in-out infinite;
}

.doc-chip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--c-blue-500);
  box-shadow: 0 0 8px var(--c-blue-500);
}

.doc-chip.two {
  left: auto;
  right: 8%;
  bottom: 22%;
  animation-delay: -3s;
}

@keyframes floatY {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

/* —— 左下标题区 —— */
.v-foot {
  position: relative;
  z-index: 3;
  opacity: 0;
  animation: rise 1s 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.v-eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--serif-en);
  font-style: italic;
  font-size: 13px;
  color: var(--c-blue-700);
  letter-spacing: 1px;
  margin-bottom: 14px;
  white-space: pre-line;
}

.v-eyebrow::before {
  content: "";
  width: 30px;
  height: 1px;
  background: var(--c-blue-500);
}

.v-title {
  font-family: var(--serif-cn);
  font-weight: 900;
  font-size: clamp(28px, 2.6vw, 40px);
  line-height: 1.18;
  color: var(--c-ink-900);
  letter-spacing: 1px;
  white-space: pre-line;
}

.v-title-em {
  font-style: normal;
  color: var(--c-blue-700);
  position: relative;
}

.v-title-em::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -4px;
  height: 3px;
  background: linear-gradient(90deg, var(--c-blue-400), transparent);
  border-radius: 2px;
}

.v-sub {
  margin-top: 28px;
  max-width: 430px;
  font-size: 14.5px;
  line-height: 1.8;
  color: var(--c-ink-500);
}

.v-stats {
  display: flex;
  gap: 34px;
  margin-top: 26px;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-num {
  font-family: var(--serif-en);
  font-weight: 600;
  font-size: 28px;
  color: var(--c-blue-700);
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: var(--c-ink-400);
  margin-top: 6px;
  letter-spacing: 0.5px;
}

/* ============ 右侧表单面板 ============ */
.panel {
  position: relative;
  z-index: 3;
  display: grid;
  place-items: center;
  padding: 32px 5vw;
}

.card {
  width: min(440px, 100%);
  background: rgba(255,255,255,.82);
  backdrop-filter: blur(22px) saturate(140%);
  border: 1px solid rgba(255,255,255,.9);
  border-radius: 26px;
  box-shadow: var(--shadow-card);
  padding: 42px 40px 36px;
  position: relative;
  overflow: hidden;
  opacity: 0;
  animation: rise 0.9s 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--c-blue-400), var(--c-blue-700), var(--c-blue-400));
  background-size: 200% 100%;
  animation: slide 4s linear infinite;
}

@keyframes slide {
  to { background-position: 200% 0; }
}

.c-head {
  margin-bottom: 26px;
}

.c-head-title {
  font-family: var(--serif-cn);
  font-weight: 700;
  font-size: 24px;
  color: var(--c-ink-900);
  letter-spacing: 0.5px;
  white-space: pre-line;
}

.c-head-sub {
  margin-top: 8px;
  font-size: 13.5px;
  color: var(--c-ink-400);
}

.c-head-sub-en {
  font-style: normal;
  font-family: var(--serif-en);
  color: var(--c-blue-600);
  font-weight: 600;
}

/* 角色切换 */
.roles {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.role {
  flex: 1;
  padding: 11px 8px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--c-ink-400);
  background: rgba(226,238,253,.5);
  border: 1px solid transparent;
  transition: 0.25s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
}

.role-icon-user {
  width: 15px;
  height: 15px;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2'><path d='M22 10L12 5 2 10l10 5 10-5z'></path><path d='M6 12v5c0 1 3 3 6 3s6-2 6-3v-5'></path></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2'><path d='M22 10L12 5 2 10l10 5 10-5z'></path><path d='M6 12v5c0 1 3 3 6 3s6-2 6-3v-5'></path></svg>") center/contain no-repeat;
}

.role-icon-admin {
  width: 15px;
  height: 15px;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2'><path d='M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z'></path></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2'><path d='M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z'></path></svg>") center/contain no-repeat;
}

.role:hover {
  color: var(--c-ink-700);
}

.role.active {
  color: var(--c-blue-700);
  background: #fff;
  border-color: var(--c-blue-300);
  box-shadow: 0 6px 18px -10px rgba(37,99,235,.6);
}

/* 字段 */
.field {
  position: relative;
  margin-bottom: 18px;
}

.field-input {
  width: 100%;
  height: 54px;
  padding: 0 48px;
  border-radius: 14px;
  font-size: 14.5px;
  color: var(--c-ink-900);
  background: rgba(247,251,255,.8);
  border: 1.5px solid var(--c-line);
  transition: 0.25s;
  outline: none;
  font-family: inherit;
}

.field-input::placeholder {
  color: transparent;
}

.field-input:focus {
  border-color: var(--c-blue-500);
  background: #fff;
  box-shadow: 0 0 0 4px rgba(59,130,246,.12);
}

.field-label {
  position: absolute;
  left: 46px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: var(--c-ink-300);
  pointer-events: none;
  transition: 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
  background: transparent;
  padding: 0 4px;
}

.field-input:focus ~ .field-label,
.field-input:not(:placeholder-shown) ~ .field-label {
  top: 0;
  left: 38px;
  font-size: 11px;
  color: var(--c-blue-600);
  background: linear-gradient(180deg, transparent 45%, rgba(255,255,255,.95) 45%);
  transform: translateY(-50%);
}

.field-icon-user,
.field-icon-lock,
.field-icon-check {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--c-ink-300);
  transition: 0.22s;
  background: currentColor;
}

.field-icon-user {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2'><circle cx='12' cy='8' r='4'></circle><path d='M4 21c0-4 4-7 8-7s8 3 8 7'></path></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2'><circle cx='12' cy='8' r='4'></circle><path d='M4 21c0-4 4-7 8-7s8 3 8 7'></path></svg>") center/contain no-repeat;
}

.field-icon-lock {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2'><rect x='4' y='10' width='16' height='11' rx='2'></rect><path d='M8 10V7a4 4 0 0 1 8 0v3'></path></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2'><rect x='4' y='10' width='16' height='11' rx='2'></rect><path d='M8 10V7a4 4 0 0 1 8 0v3'></path></svg>") center/contain no-repeat;
}

.field-icon-check {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2'><path d='M9 11l3 3L22 4'></path><path d='M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'></path></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2'><path d='M9 11l3 3L22 4'></path><path d='M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'></path></svg>") center/contain no-repeat;
}

.field-input:focus ~ .field-icon-user,
.field-input:focus ~ .field-icon-lock,
.field-input:focus ~ .field-icon-check {
  color: var(--c-blue-600);
}

.field-toggle {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  color: var(--c-ink-300);
  transition: 0.2s;
  border-radius: 8px;
  cursor: pointer;
}

.field-toggle:hover {
  color: var(--c-blue-600);
  background: rgba(59,130,246,.08);
}

.field-icon-eye {
  width: 20px;
  height: 20px;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2'><path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z'></path><circle cx='12' cy='12' r='3'></circle></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2'><path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z'></path><circle cx='12' cy='12' r='3'></circle></svg>") center/contain no-repeat;
}

.field-icon-eye.eye-off {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2'><path d='M17.94 17.94A10 10 0 0 1 12 20c-7 0-11-8-11-8a18 18 0 0 1 5.06-5.94'/><path d='M9.9 4.24A9 9 0 0 1 12 4c7 0 11 8 11 8a18 18 0 0 1-2.16 3.19'/><path d='M1 1l22 22'/><path d='M14.12 14.12a3 3 0 1 1-4.24-4.24'/></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2'><path d='M17.94 17.94A10 10 0 0 1 12 20c-7 0-11-8-11-8a18 18 0 0 1 5.06-5.94'/><path d='M9.9 4.24A9 9 0 0 1 12 4c7 0 11 8 11 8a18 18 0 0 1-2.16 3.19'/><path d='M1 1l22 22'/><path d='M14.12 14.12a3 3 0 1 1-4.24-4.24'/></svg>") center/contain no-repeat;
}

/* 验证码 */
.captcha {
  margin-bottom: 16px;
}

.captcha-row {
  display: flex;
  gap: 12px;
}

.captcha-row .field {
  flex: 1;
  margin-bottom: 0;
}

.captcha-box {
  width: 120px;
  height: 54px;
  border-radius: 14px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #EAF2FF, #D6E6FB);
  border: 1.5px solid var(--c-line);
  display: grid;
  place-items: center;
  cursor: pointer;
  font-family: var(--serif-en);
  font-style: italic;
  font-weight: 700;
  font-size: 20px;
  letter-spacing: 6px;
  color: var(--c-blue-700);
  user-select: none;
  position: relative;
  overflow: hidden;
  transition: 0.2s;
}

.captcha-box:hover {
  border-color: var(--c-blue-400);
}

.captcha-box::after {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(45deg, transparent 0 6px, rgba(37,99,235,.06) 6px 7px);
  pointer-events: none;
}

.captcha-text {
  position: relative;
  z-index: 1;
}

/* 选项行 */
.opts {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 6px 0 22px;
}

.check {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--c-ink-500);
  cursor: pointer;
}

.check-box {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  border: 1.5px solid var(--c-line);
  display: grid;
  place-items: center;
  transition: 0.2s;
}

.check-box.checked {
  background: var(--c-blue-600);
  border-color: var(--c-blue-600);
}

.check-icon {
  width: 12px;
  height: 12px;
  background: #fff;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='3'><path d='M5 13l4 4L19 7'></path></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='3'><path d='M5 13l4 4L19 7'></path></svg>") center/contain no-repeat;
}

.check-label {
  font-size: 13px;
  color: var(--c-ink-500);
}

.opts-link {
  font-size: 13px;
  color: var(--c-blue-600);
  font-weight: 500;
  cursor: pointer;
}

.opts-link:hover {
  text-decoration: underline;
}

/* 主按钮 */
.submit {
  width: 100%;
  height: 54px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 2px;
  background: linear-gradient(120deg, var(--c-blue-600) 0%, var(--c-blue-700) 50%, var(--c-blue-600) 100%);
  background-size: 200% 100%;
  box-shadow: 0 16px 34px -14px rgba(29,78,216,.7), inset 0 1px 0 rgba(255,255,255,.3);
  position: relative;
  overflow: hidden;
  transition: 0.25s;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit:hover {
  background-position: 100% 0;
  transform: translateY(-2px);
  box-shadow: 0 22px 40px -14px rgba(29,78,216,.8);
}

.submit:active {
  transform: translateY(0);
}

.submit-shimmer {
  position: absolute;
  top: 0;
  left: -60%;
  width: 40%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent);
  transform: skewX(-20deg);
  animation: shimmer 3.4s ease-in-out infinite;
}

@keyframes shimmer {
  0% { left: -60%; }
  55%, 100% { left: 130%; }
}

.submit-text {
  position: relative;
  z-index: 2;
}

.divider {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 24px 0 18px;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--c-line), transparent);
}

.divider-text {
  font-size: 12px;
  color: var(--c-ink-300);
  letter-spacing: 1px;
}

.sso {
  display: flex;
  gap: 12px;
}

.sso-btn {
  flex: 1;
  height: 48px;
  border-radius: 13px;
  font-size: 13px;
  font-weight: 500;
  color: var(--c-ink-700);
  background: rgba(247,251,255,.7);
  border: 1.5px solid var(--c-line);
  transition: 0.22s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

.sso-btn:hover {
  border-color: var(--c-blue-400);
  background: #fff;
  transform: translateY(-2px);
  box-shadow: 0 10px 22px -14px rgba(37,99,235,.5);
}

.sso-icon-wechat {
  width: 18px;
  height: 18px;
  background: #1D4ED8;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2'><path d='M12 2l9 5v10l-9 5-9-5V7z'></path><path d='M12 2v20M3 7l9 5 9-5'></path></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2'><path d='M12 2l9 5v10l-9 5-9-5V7z'></path><path d='M12 2v20M3 7l9 5 9-5'></path></svg>") center/contain no-repeat;
}

.sso-icon-shield {
  width: 18px;
  height: 18px;
  background: #1D4ED8;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2'><path d='M12 22s8-4 8-12V5l-8-3-8 3v5c0 8 8 12 8 12z'></path><path d='M9 12l2 2 4-4'></path></svg>") center/contain no-repeat;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2'><path d='M12 22s8-4 8-12V5l-8-3-8 3v5c0 8 8 12 8 12z'></path><path d='M9 12l2 2 4-4'></path></svg>") center/contain no-repeat;
}

.c-foot {
  text-align: center;
  margin-top: 22px;
  font-size: 13px;
  color: var(--c-ink-400);
}

.c-foot-text {
  font-size: 13px;
  color: var(--c-ink-400);
}

.c-foot-link {
  color: var(--c-blue-700);
  font-weight: 600;
  cursor: pointer;
}

.c-foot-link:hover {
  text-decoration: underline;
}

.legal-mini {
  position: absolute;
  bottom: 18px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 11px;
  color: var(--c-ink-300);
  letter-spacing: 0.5px;
  z-index: 3;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(26px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ============ 响应式 ============ */
@media (max-width: 980px) {
  .login-page {
    overflow: auto;
  }
  
  .stage {
    grid-template-columns: 1fr;
    height: auto;
    min-height: 100vh;
  }
  
  .visual {
    padding: 30px 28px 0;
    min-height: 42vh;
  }
  
  .globe-wrap {
    width: min(300px, 30vh);
  }
  
  .v-stats {
    gap: 24px;
  }
  
  .panel {
    padding: 10px 28px 40px;
  }
  
  .scales {
    width: 64px;
    height: 64px;
  }
}

@media (max-width: 560px) {
  .visual {
    padding: 24px 20px 0;
  }
  
  .card {
    padding: 32px 24px 28px;
  }
  
  .sso {
    flex-direction: column;
  }
  
  .captcha-box {
    width: 104px;
  }
  
  .v-stats {
    gap: 18px;
  }
  
  .stat-num {
    font-size: 22px;
  }
}
</style>
