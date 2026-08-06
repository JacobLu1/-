<template>
  <view class="survey-shell">
    <!-- ===== Brand CSS Variables (from 问卷测评.html) ===== -->
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
          <view class="app-nav-item is-active" data-nav-key="survey">
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
          <text class="app-topbar-title">{{ currentTopbarTitle }}</text>
          <text class="app-topbar-meta">{{ todayDateText }}</text>
        </header>

        <main class="app-content">
          <!-- ============================================= -->
          <!-- STEP 1: 测评开始页 -->
          <!-- ============================================= -->
          <view v-if="currentStep === 'start'" class="survey-main start-main">
            <view class="start-hero">
              <view class="start-badge">涉外法治人才能力测评平台</view>
              <text class="start-title">涉外法治综合测评</text>
              <text class="start-subtitle">科学评估 · 精准诊断 · 个性化提升</text>
            </view>

            <section class="survey-card start-card">
              <view class="start-intro">
                <text class="start-intro-title">测评介绍</text>
                <text class="start-intro-text">
                  本测评面向涉外法治人才培养需求，从国际私法、国际经济法、国际公法、涉外商事法等多个专业维度，系统评估您的法律知识储备与实务应用能力。\n完成测评后，系统将为您生成一份个性化的能力分析报告，帮助您定位优势、补齐短板。
                </text>
              </view>

              <view class="start-feature-list">
                <view class="start-feature">
                  <view class="start-feature-dot"></view>
                  <view class="start-feature-body">
                    <text class="start-feature-title">综合测评</text>
                    <text class="start-feature-desc">覆盖四大专业维度，含客观题与主观题，全面检验涉外法治综合能力</text>
                  </view>
                </view>
                <view class="start-feature">
                  <view class="start-feature-dot"></view>
                  <view class="start-feature-body">
                    <text class="start-feature-title">专项测评</text>
                    <text class="start-feature-desc">聚焦特定涉外法治领域精准发力，帮助您快速定位细分方向的优劣势</text>
                  </view>
                </view>
                <view class="start-feature">
                  <view class="start-feature-dot"></view>
                  <view class="start-feature-body">
                    <text class="start-feature-title">结果报告</text>
                    <text class="start-feature-desc">提交后即时生成测评结果，展示综合评分、各能力维度得分与针对性提升建议</text>
                  </view>
                </view>
              </view>

              <view class="start-actions">
                <button class="btn-primary start-btn-primary" @tap="startComprehensive">
                  <view class="play-icon"></view>
                  开始测评
                </button>
                <button class="btn-secondary start-btn-secondary" @tap="goToSpecialSelect">
                  专项测评
                  <view class="chev-r"></view>
                </button>
              </view>

              <text class="start-hint">温馨提示：综合测评约需 20 分钟，请预留充足时间，保持网络畅通</text>
            </section>
          </view>

          <!-- ============================================= -->
          <!-- STEP 2: 客观题 -->
          <!-- ============================================= -->
          <view v-else-if="currentStep.startsWith('objective')" class="survey-main">
            <view class="survey-header">
              <view class="sh-left">
                <view class="exit-btn" @tap="confirmExit">退出测评</view>
                <text class="survey-header-title">{{ isSpecialMode ? '专项测评 · ' + specialCategory : '涉外法治人才专业能力测评' }}</text>
              </view>
              <view class="countdown-timer" role="timer" aria-live="off">
                <view class="cd-clock-icon"></view>
                <text>剩余时间</text>
                <text class="timer-num">{{ timerDisplay }}</text>
              </view>
            </view>

            <section v-if="currentQuestion" class="survey-card">
              <view class="q-meta">
                <text class="q-badge">第 {{ currentQuestion.globalIndex }} 题 / 共 {{ totalObjectiveQuestions }} 题</text>
                <text class="q-category">{{ questionCategoryLabel }}</text>
              </view>
              <text class="q-text">{{ currentQuestion.question }}</text>

              <!-- 单选 -->
              <view v-if="currentQuestion.type === 'single'" class="q-options"
                    :key="'opts-' + currentQuestion.globalKey"
                    role="radiogroup" aria-label="选项">
                <view class="q-option"
                      v-for="(opt, oIdx) in currentQuestion.options"
                      :key="currentQuestion.globalKey + '-' + oIdx"
                      :class="{ 'is-checked': formData.objectiveAnswers[currentQuestion.globalKey] === opt.key }"
                      @tap="selectSingle(currentQuestion.globalKey, opt.key)">
                  <radio class="q-radio"
                         :checked="formData.objectiveAnswers[currentQuestion.globalKey] === opt.key"
                         :color="'#2563EB'" />
                  <text class="q-option-letter">{{ opt.key }}</text>
                  <text class="q-option-text">{{ opt.text }}</text>
                </view>
              </view>

              <!-- 多选 -->
              <view v-if="currentQuestion.type === 'multi'" class="q-options"
                    :key="'opts-' + currentQuestion.globalKey"
                    role="group" aria-label="选项">
                <view class="q-option"
                      v-for="(opt, oIdx) in currentQuestion.options"
                      :key="currentQuestion.globalKey + '-' + oIdx"
                      :class="{ 'is-checked': isMultiSelected(currentQuestion.globalKey, opt.key) }"
                      @tap="toggleMulti(currentQuestion.globalKey, opt.key)">
                  <checkbox class="q-check"
                            :checked="isMultiSelected(currentQuestion.globalKey, opt.key)"
                            :color="'#2563EB'" />
                  <text class="q-option-letter">{{ opt.key }}</text>
                  <text class="q-option-text">{{ opt.text }}</text>
                </view>
              </view>

              <!-- 判断 -->
              <view v-if="currentQuestion.type === 'judge'" class="q-options judge-options"
                    :key="'opts-' + currentQuestion.globalKey">
                <view class="q-option judge-opt"
                      :class="{ 'is-checked': formData.objectiveAnswers[currentQuestion.globalKey] === true }"
                      @tap="selectJudge(currentQuestion.globalKey, true)">
                  <radio class="q-radio"
                         :checked="formData.objectiveAnswers[currentQuestion.globalKey] === true"
                         :color="'#2563EB'" />
                  <text class="q-option-letter">✓</text>
                  <text class="q-option-text">正确</text>
                </view>
                <view class="q-option judge-opt"
                      :class="{ 'is-checked': formData.objectiveAnswers[currentQuestion.globalKey] === false }"
                      @tap="selectJudge(currentQuestion.globalKey, false)">
                  <radio class="q-radio"
                         :checked="formData.objectiveAnswers[currentQuestion.globalKey] === false"
                         :color="'#2563EB'" />
                  <text class="q-option-letter">✗</text>
                  <text class="q-option-text">错误</text>
                </view>
              </view>

              <view class="q-nav">
                <button class="btn-secondary"
                        :disabled="currentQIndex === 0"
                        :class="{ 'is-disabled': currentQIndex === 0 }"
                        @tap="prevQuestion">
                  <view class="chev-l"></view>
                  上一题
                </button>
                <button v-if="currentQIndex < totalObjectiveQuestions - 1" class="btn-primary" @tap="nextQuestion">
                  下一题
                  <view class="chev-r"></view>
                </button>
                <button v-else class="btn-primary" @tap="goNextFromObjective">
                  进入主观题
                  <view class="chev-r"></view>
                </button>
              </view>
            </section>
          </view>

          <!-- ============================================= -->
          <!-- STEP 3: 主观题 -->
          <!-- ============================================= -->
          <view v-else-if="currentStep === 'subjective'" class="survey-main">
            <view class="survey-header">
              <view class="sh-left">
                <view class="exit-btn" @tap="confirmExit">退出测评</view>
                <text class="survey-header-title">{{ isSpecialMode ? '专项测评 · ' + specialCategory : '涉外法治人才专业能力测评' }} · 主观题</text>
              </view>
              <view class="countdown-timer" role="timer" aria-live="off">
                <view class="cd-clock-icon"></view>
                <text>剩余时间</text>
                <text class="timer-num">{{ timerDisplay }}</text>
              </view>
            </view>

            <view class="step-indicator-card">
              <view class="step-bar-track"><view class="step-bar-fill" style="width:100%"></view></view>
              <view class="step-labels">
                <text class="step-lbl is-done">✓ 开始测评</text>
                <text class="step-lbl is-done">✓ 客观题</text>
                <text class="step-lbl is-active">③ 主观题</text>
              </view>
            </view>

            <section class="survey-card subjective-card" v-for="(sq, sIdx) in subjectiveQuestions" :key="sIdx">
              <view class="q-meta">
                <text class="q-category" :class="'cat-' + sq.type">{{ sq.typeLabel }}</text>
                <text class="q-badge">第 {{ sIdx + 1 }} 题 / 共 {{ subjectiveQuestions.length }} 题</text>
              </view>
              <text class="q-text">{{ sIdx + 1 }}. {{ sq.title }}</text>

              <view v-if="sq.caseText" class="case-box">
                <text class="case-label">【案例材料】</text>
                <text class="case-text">{{ sq.caseText }}</text>
              </view>

              <textarea class="subj-textarea"
                        v-model="formData.subjectiveAnswers[sIdx]"
                        :placeholder="sq.placeholder"
                        :maxlength="3000"
                        auto-height :min-height="160" :max-height="400"></textarea>
              <view class="textarea-footer">
                <text class="word-hint"
                      :class="{ warning: (formData.subjectiveAnswers[sIdx]||'').length > 0 && (formData.subjectiveAnswers[sIdx]||'').length < 300 }">
                  已写 {{ (formData.subjectiveAnswers[sIdx]||'').length }} 字（建议不少于300字）
                </text>
              </view>
            </section>

            <view class="subj-actions q-nav">
              <button class="btn-secondary" @tap="backToObjective">
                <view class="chev-l"></view>
                返回客观题
              </button>
              <button class="btn-primary submit-btn" @tap="submitSurvey">
                <view class="submit-check"></view>
                提交问卷
              </button>
            </view>
          </view>
        </main>
      </view>
    </view>

    <!-- ===== Question Number Grid (fixed bottom-right) ===== -->
    <aside v-if="isObjectiveStep" class="question-grid-card" aria-label="答题进度">
      <view class="qg-toggle-btn" :class="{ 'is-open': qgOpen }" @tap="qgOpen = !qgOpen" aria-label="展开或收起答题卡">
        <view class="chev-up"></view>
      </view>
      <view class="qg-head">
        <text class="qg-title">答题进度</text>
        <view class="qg-head-spacer"></view>
      </view>
      <text class="qg-progress-text">已完成 {{ answeredObjectiveCount }}/{{ totalObjectiveQuestions }}</text>
      <view class="qg-progress-bar">
        <view class="qg-progress-fill" :style="{ width: objectiveProgressPercent + '%' }"></view>
      </view>
      <view class="qg-body" :class="{ 'is-collapsed': !qgOpen && viewportWidth < 1200 }">
        <view class="qg-grid">
          <view class="qg-btn"
                v-for="i in totalObjectiveQuestions" :key="i"
                :class="{
                  done: isAnswered(i),
                  current: i === currentQIndex + 1
                }"
                @tap="jumpToQuestion(i - 1)">
            {{ i }}
          </view>
        </view>
        <button class="qg-submit" @tap="submitSurvey">
          <view class="submit-check"></view>
          <text>提交问卷</text>
        </button>
      </view>
    </aside>
  </view>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted, watch } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getDisplayName, getLevelText } from '@/utils/auth.js'

/* =========== 题目数据（保持原样） =========== */
const SINGLE_QUESTIONS=[
  {question:'根据《中华人民共和国涉外民事关系法律适用法》，涉外合同当事人没有选择合同适用的法律的，适用与合同有最密切联系的法律。下列哪项不属于确定"最密切联系地"的考量因素？',options:[{key:'A',text:'合同订立地'},{key:'B',text:'合同履行地'},{key:'C',text:'当事人国籍'},{key:'D',text:'标的物所在地'}],answer:'C'},
  {question:'关于《承认及执行外国仲裁裁决公约》（《纽约公约》），下列说法正确的是：',options:[{key:'A',text:'仅适用于缔约国之间作出的仲裁裁决'},{key:'B',text:'允许以公共政策为由拒绝承认任何外国裁决'},{key:'C',text:'要求裁决在申请执行地国具有终局性'},{key:'D',text:'规定了统一的仲裁程序规则'}],answer:'C'},
  {question:'根据中国《出口管制法》，临时管制措施的期限一般不超过多久？',options:[{key:'A',text:'6个月'},{key:'B',text:'1年'},{key:'C',text:'2年'},{key:'D',text:'无固定期限'}],answer:'C'},
  {question:'在国际货物买卖中，CIF术语下风险转移的界限是：',options:[{key:'A',text:'货交第一承运人时'},{key:'B',text:'货物越过装运港船舷时'},{key:'C',text:'货物到达目的港时'},{key:'D',text:'买方收取货物时'}],answer:'B'},
  {question:'根据《外商投资法》，外商投资准入特别管理措施（负面清单）以外的领域，按照何种原则管理？',options:[{key:'A',text:'审批制'},{key:'B',text:'核准制'},{key:'C',text:'备案制'},{key:'D',text:'内外资一致原则'}],answer:'D'},
  {question:'关于国际私法中的"公共秩序保留"制度，下列表述正确的是：',options:[{key:'A',text:'是各国普遍采用的拒绝适用外国法的理由'},{key:'B',text:'仅适用于婚姻家庭领域'},{key:'C',text:'需要经过外交途径确认'},{key:'D',text:'一旦援引则案件必须终止审理'}],answer:'A'},
  {question:'RCEP（《区域全面经济伙伴关系协定》）的原产地规则中，区域价值成分（RVC）标准一般为多少？',options:[{key:'A',text:'不低于20%'},{key:'B',text:'不低于30%'},{key:'C',text:'不低于40%'},{key:'D',text:'不低于50%'}],answer:'C'},
  {question:'根据中国《民事诉讼法》关于涉外民事诉讼的规定，在中国领域内没有住所的当事人提出上诉的期限为收到判决书、裁定书之日起：',options:[{key:'A',text:'15日'},{key:'B',text:'30日'},{key:'C',text:'60日'},{key:'D',text:'90日'}],answer:'B'},
  {question:'关于跨境数据传输的合规要求，下列哪项不符合中国现行法律规定？',options:[{key:'A',text:'关键信息基础设施运营者向境外提供数据应当进行安全评估'},{key:'B',text:'处理个人信息达到一定数量需通过安全评估或签订标准合同'},{key:'C',text:'所有企业均可自由向境外传输任何类型的数据'},{key:'D',text:'向境外提供重要数据应当申报数据出境安全评估'}],answer:'C'},
  {question:'根据《联合国国际货物销售合同公约》（CISG），要约于何时生效？',options:[{key:'A',text:'要约人发出要约时'},{key:'B',text:'受要约人收到要约时'},{key:'C',text:'受要约人承诺时'},{key:'D',text:'双方达成合意时'}],answer:'B'}
]
const MULTI_QUESTIONS=[
  {question:'下列哪些情形属于《涉外民事关系法律适用法》规定的"涉外民事关系"？',options:[{key:'A',text:'一方或双方为外国公民'},{key:'B',text:'经常居所地在国外的中国公民之间的民事关系'},{key:'C',text:'标的物位于国外'},{key:'D',text:'产生、变更或消灭民事关系的法律事实发生在国外'},{key:'E',text:'当事人协议选择适用外国法'}],answer:['A','B','C','D']},
  {question:'关于国际商事仲裁，下列哪些说法是正确的？',options:[{key:'A',text:'仲裁庭有权认定自己的管辖权（自裁管辖权原则）'},{key:'B',text:'仲裁裁决具有终局性，一般不得上诉'},{key:'C',text:'仲裁程序不公开进行是基本原则'},{key:'D',text:'仲裁庭可以依职权主动调查收集证据'},{key:'E',text:'当事人可以在仲裁过程中随时和解并撤回仲裁申请'}],answer:['A','B','C','E']},
  {question:'根据WTO规则，下列哪些属于最惠国待遇原则的例外情形？',options:[{key:'A',text:'关税同盟和自由贸易区成员间的优惠'},{key:'B',text:'普惠制（GSP）下的特殊待遇'},{key:'C',text:'边境贸易安排'},{key:'D',text:'保障措施'},{key:'E',text:'一般例外和安全例外条款'}],answer:['A','B','C','E']},
  {question:'关于外国法院判决在中国的承认与执行，下列条件中正确的有：',options:[{key:'A',text:'需要中国与该国之间存在条约或互惠关系'},{key:'B',text:'判决必须是终局的、具有执行力的'},{key:'C',text:'不违反中国的公共利益'},{key:'D',text:'被告在中国境内有可供执行的财产'},{key:'E',text:'原审法院必须是中国承认的外国法院'}],answer:['A','B','C']},
  {question:'下列关于《反外国制裁法》的说法，哪些是正确的？',options:[{key:'A',text:'反制措施包括不予签发签证、不准入境等'},{key:'B',text:'可查封、扣押、冻结在中国境内的财产'},{key:'C',text:'禁止或限制中国境内的组织个人与被制裁对象交易'},{key:'D',text:'国务院有关部门可制定反制清单'},{key:'E',text:'反制决定自公布之日起立即生效'}],answer:['A','B','C','D','E']},
  {question:'在国际投资争端解决机制（ISDS）中，常见的争议解决方式包括：',options:[{key:'A',text:'ICSID（解决投资争端国际中心）仲裁'},{key:'B',text:'UNCITRAL（贸法会）仲裁规则'},{key:'C',text:'东道国当地法院诉讼'},{key:'D',text:'投资者与东道国政府协商谈判'},{key:'E',text:'WTO争端解决机制'}],answer:['A','B','C','D']}
]
const JUDGE_QUESTIONS=[
  {question:'根据中国法律，外国人在中国领域内享有与中国公民同等的民事诉讼权利能力。（ ）',answer:true},
  {question:'在国际货物买卖中，FOB术语下卖方负责办理货物运输保险。（ ）',answer:false},
  {question:'《巴黎公约》确立的国民待遇原则适用于所有知识产权类型。（ ）',answer:true}
]
const SUBJECTIVE_QUESTIONS=[
  {title:'案例分析：涉外仲裁协议效力争议',type:'case',typeLabel:'案例分析',caseText:'中国A公司与德国B公司签订一份设备采购合同，合同约定："因本合同引起的或与本合同有关的任何争议，应提交北京仲裁委员会仲裁。"后因设备质量问题发生纠纷，B公司在北京法院提起诉讼。A公司提出管辖异议，主张应由北京仲裁委员会管辖。B公司辩称其未在仲裁协议上签字，仲裁协议对其无效。请问：（1）该仲裁协议是否对B公司具有约束力？（2）如B公司未提出异议而直接参加诉讼且进行实体答辩，会产生什么法律后果？',placeholder:'请结合《仲裁法》《纽约公约》及相关司法解释进行分析（建议不少于300字）...'},
  {title:'论述：RCEP协定对中国涉外法律服务行业的影响与应对策略',type:'essay',typeLabel:'论述题',caseText:'',placeholder:'请从RCEP原产地规则累积效应、服务贸易开放承诺等角度分析机遇与挑战（建议不少于300字）...'},
  {title:'论述：数字时代跨境数据流动的法律规制困境与完善路径',type:'essay',typeLabel:'论述题',caseText:'',placeholder:'请结合中国《网络安全法》《数据安全法》、欧盟GDPR、美国CLOUD Act等法规体系分析（建议不少于300字）...'}
]
const QUESTION_CATEGORY='国际私法'

/* =========== 能力维度映射（用于结果页维度评分） =========== */
const QUESTION_DIMS = {
  s_0: '国际私法', s_1: '涉外商事法', s_2: '国际经济法', s_3: '国际经济法', s_4: '国际经济法',
  s_5: '国际私法', s_6: '国际经济法', s_7: '国际私法', s_8: '国际经济法', s_9: '国际经济法',
  m_0: '国际私法', m_1: '涉外商事法', m_2: '国际经济法', m_3: '国际私法', m_4: '国际公法', m_5: '国际经济法',
  j_0: '国际私法', j_1: '国际经济法', j_2: '国际公法'
}
const DIMENSION_NAMES = ['国际私法', '国际经济法', '国际公法', '涉外商事法']
const DIMENSION_ADVICE = {
  '国际私法': '加强涉外民事关系法律适用法与涉外民事诉讼程序的学习，结合典型案例理解公共秩序保留、最密切联系等核心制度。',
  '国际经济法': '系统学习国际贸易法（CISG、INCOTERMS）、WTO规则及外商投资相关法律，重点突破国际贸易与投资实务案例。',
  '国际公法': '巩固国际公法基本理论，关注《反外国制裁法》等涉外法治前沿动态，提升对国际条约的理解与运用能力。',
  '涉外商事法': '加强涉外仲裁与涉外商事诉讼实务训练，熟悉《纽约公约》与国内仲裁司法审查规则，提升涉外纠纷解决能力。'
}
const DEFAULT_ADVICE = '结合测评结果制定个性化学习计划，持续跟踪涉外法治领域最新立法与典型案例，做到学以致用。'

/* =========== 响应式状态 =========== */
const currentStep = ref('start')
const currentQIndex = ref(0)
const specialMode = ref(false)
const specialCategory = ref('')
const formData = reactive({
  name: '', school: '', career: '', email: '',
  objectiveAnswers: {},
  subjectiveAnswers: ['', '', '']
})
const remainingTime = ref(45 * 60 + 12)
let timer = null
const visitedSet = reactive(new Set())
const qgOpen = ref(true)
const viewportWidth = ref(typeof window !== 'undefined' ? (window.innerWidth || 1440) : 1440)

const userName = ref(getDisplayName())
const userRole = ref(getLevelText())
const userInitial = computed(() => (userName.value || '用').slice(0, 1))
const todayDateText = computed(() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}年${m}月${d}日`
})
const currentTopbarTitle = computed(() => {
  if (currentStep.value === 'start') return '涉外法治综合测评'
  if (currentStep.value.startsWith('objective')) return isSpecialMode.value ? '专项测评' : '问卷测评'
  return '主观题作答'
})
const isSpecialMode = computed(() => specialMode.value)
const isObjectiveStep = computed(() => currentStep.value.startsWith('objective'))
const questionCategoryLabel = computed(() => {
  // 按题型映射，保持原问卷.html里的"国际私法"样式
  const q = currentQuestion.value
  if (!q) return QUESTION_CATEGORY
  return q.typeLabel
})

/* =========== 计算属性 =========== */
const allObjectiveQuestions = computed(() => {
  const list = []
  SINGLE_QUESTIONS.forEach((q, i) => list.push({
    ...q, type: 'single', typeLabel: '单选题',
    globalIndex: i + 1, globalKey: 's_' + i, answer: q.answer,
    dim: QUESTION_DIMS['s_' + i] || '综合'
  }))
  MULTI_QUESTIONS.forEach((q, i) => {
    const b = SINGLE_QUESTIONS.length
    list.push({
      ...q, type: 'multi', typeLabel: '多选题',
      globalIndex: b + i + 1, globalKey: 'm_' + i, answer: q.answer,
      dim: QUESTION_DIMS['m_' + i] || '综合'
    })
  })
  JUDGE_QUESTIONS.forEach((q, i) => {
    const b = SINGLE_QUESTIONS.length + MULTI_QUESTIONS.length
    list.push({
      ...q, type: 'judge', typeLabel: '判断题',
      globalIndex: b + i + 1, globalKey: 'j_' + i, answer: q.answer,
      dim: QUESTION_DIMS['j_' + i] || '综合'
    })
  })
  return list
})
const totalObjectiveQuestions = computed(() => allObjectiveQuestions.value.length)
const currentQuestion = computed(() => allObjectiveQuestions.value[currentQIndex.value] || null)
const answeredObjectiveCount = computed(() => {
  let c = 0
  for (const k in formData.objectiveAnswers) {
    const v = formData.objectiveAnswers[k]
    if (v !== undefined && v !== null && v !== '' && (Array.isArray(v) ? v.length > 0 : true)) c++
  }
  return c
})
const objectiveProgressPercent = computed(() =>
  Math.round(answeredObjectiveCount.value / totalObjectiveQuestions.value * 100)
)
const subjectiveQuestions = ref(SUBJECTIVE_QUESTIONS)
const timerDisplay = computed(() => {
  const m = Math.floor(remainingTime.value / 60)
  const s = remainingTime.value % 60
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0')
})

/* =========== 工具方法 =========== */
function navigateTo(url) { uni.navigateTo({ url }) }

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

/* =========== 开始页 / 退出 =========== */
function startComprehensive() {
  if (isSpecialMode.value) resetForm()
  currentQIndex.value = 0
  visitedSet.clear()
  currentStep.value = 'objective_0'
  saveLocalData()
  if (!timer) startTimer()
}

function goToSpecialSelect() {
  uni.navigateTo({ url: '/pages/special-select/special-select' })
}

function confirmExit() {
  uni.showModal({
    title: '退出测评',
    content: '确定要退出当前测评吗？已作答内容将不会保留。',
    confirmText: '退出',
    cancelText: '继续答题',
    success: (r) => {
      if (r.confirm) {
        if (timer) { clearInterval(timer); timer = null }
        remainingTime.value = 45 * 60 + 12
        specialMode.value = false
        specialCategory.value = ''
        resetForm()
        currentStep.value = 'start'
      }
    }
  })
}

function selectSingle(k, v) {
  formData.objectiveAnswers[k] = v
  markVisited()
  saveLocalData()
}
function selectJudge(k, v) {
  formData.objectiveAnswers[k] = v
  markVisited()
  saveLocalData()
}
function isMultiSelected(k, v) {
  const a = formData.objectiveAnswers[k]
  return Array.isArray(a) && a.includes(v)
}
function toggleMulti(k, v) {
  let a = formData.objectiveAnswers[k]
  if (!Array.isArray(a)) a = []
  a = [...a]
  const idx = a.indexOf(v)
  if (idx >= 0) a.splice(idx, 1)
  else a.push(v)
  formData.objectiveAnswers[k] = a
  markVisited()
  saveLocalData()
}
function markVisited() { visitedSet.add(currentQIndex.value) }
function prevQuestion() { if (currentQIndex.value > 0) currentQIndex.value-- }
function nextQuestion() {
  if (currentQIndex.value < totalObjectiveQuestions.value - 1) {
    currentQIndex.value++
    markVisited()
  }
}
function jumpToQuestion(idx) {
  if (idx >= 0 && idx < totalObjectiveQuestions.value) {
    currentQIndex.value = idx
    markVisited()
  }
}
function isAnswered(num) {
  const q = allObjectiveQuestions.value[num - 1]
  if (!q) return false
  const v = formData.objectiveAnswers[q.globalKey]
  return v !== undefined && v !== null && v !== '' && (Array.isArray(v) ? v.length > 0 : true)
}
function isVisited(num) { return visitedSet.has(num - 1) }

function goNextFromObjective() {
  const left = totalObjectiveQuestions.value - answeredObjectiveCount.value
  if (left > 0) {
    uni.showModal({
      title: '提示',
      content: `还有${left}题未作答，确定继续吗？`,
      success: (r) => { if (r.confirm) { saveLocalData(); currentStep.value = 'subjective' } }
    })
  } else {
    saveLocalData()
    currentStep.value = 'subjective'
  }
}
function backToObjective() {
  currentStep.value = 'objective_0'
  currentQIndex.value = 0
}
function submitSurvey() {
  const uSubj = formData.subjectiveAnswers.filter(a => !a || a.trim().length < 10)
  const uObj = totalObjectiveQuestions.value - answeredObjectiveCount.value
  let msg = ''
  if (uObj > 0) msg += `客观题${uObj}题未答\n`
  if (uSubj.length > 0) msg += `主观题${uSubj.length}题未作答\n`
  if (msg) {
    uni.showModal({
      title: '确认提交',
      content: msg + '确定？未答题按零分计算。',
      confirmText: '确认提交',
      success: (r) => { if (r.confirm) doSubmit() }
    })
  } else {
    uni.showModal({
      title: '确认提交',
      content: '全部填写完毕，确定提交？',
      confirmText: '确认提交',
      success: (r) => { if (r.confirm) doSubmit() }
    })
  }
}
function doSubmit() {
  try {
    saveLocalData()
    const verify = uni.getStorageSync('survey_data')
    if (!verify) { uni.showToast({ title: '保存失败，请重试', icon: 'none' }); return }
  } catch (e) {
    uni.showToast({ title: '数据保存异常', icon: 'none' }); return
  }
  if (timer) clearInterval(timer)
  const result = computeResult()
  try { uni.setStorageSync('survey_result', JSON.stringify(result)) } catch (e) {}
  // 云端保存测评结果（失败不影响本地跳转）
  const submitToken = uni.getStorageSync('token')
  if (submitToken) {
    const surveyObj = uniCloud.importObject('survey')
    surveyObj.saveResult({ token: submitToken, result }).then((r) => {
      if (r && r.errCode !== 0) console.warn('[survey] 保存测评结果失败:', r.errMsg)
    }).catch((err) => {
      console.warn('[survey] 保存测评结果失败:', err)
    })
  }
  const savedData = JSON.stringify(formData)
  uni.redirectTo({
    url: '/pages/result/result',
    success: () => { resetForm(); try { uni.removeStorageSync('survey_data') } catch (e) {} },
    fail: (err) => {
      console.error('[submit] redirect failed:', err)
      uni.showToast({ title: '页面跳转失败', icon: 'none' })
      try { uni.setStorageSync('survey_data', savedData) } catch (e) {}
    }
  })
}

/* =========== 结果计算（保存供结果页读取） =========== */
function computeResult() {
  const dimCorrect = {}
  const dimTotal = {}
  DIMENSION_NAMES.forEach(d => { dimCorrect[d] = 0; dimTotal[d] = 0 })
  let correct = 0
  allObjectiveQuestions.value.forEach(q => {
    const d = q.dim || '综合'
    if (dimTotal[d] === undefined) { dimCorrect[d] = 0; dimTotal[d] = 0 }
    dimTotal[d]++
    const ans = formData.objectiveAnswers[q.globalKey]
    let ok = false
    if (Array.isArray(q.answer)) {
      const a = Array.isArray(ans) ? [...ans].sort().join(',') : ''
      ok = a !== '' && a === [...q.answer].sort().join(',')
    } else {
      ok = ans === q.answer
    }
    if (ok) { correct++; dimCorrect[d]++ }
  })
  const total = allObjectiveQuestions.value.length
  const score = total ? Math.round(correct / total * 100) : 0
  const level = score >= 90 ? '卓越' : score >= 80 ? '优秀' : score >= 70 ? '良好' : score >= 60 ? '中等' : '待提升'
  const dimensions = DIMENSION_NAMES.map(d => ({
    name: d,
    score: dimTotal[d] ? Math.round(dimCorrect[d] / dimTotal[d] * 100) : 0
  }))
  const sorted = [...dimensions].sort((a, b) => a.score - b.score)
  const recommendations = []
  sorted.forEach(d => {
    if (recommendations.length < 3) {
      recommendations.push(DIMENSION_ADVICE[d.name] || DEFAULT_ADVICE)
    }
  })
  while (recommendations.length < 3) recommendations.push(DEFAULT_ADVICE)
  return {
    score,
    level,
    dimensions,
    recommendations,
    mode: isSpecialMode.value ? 'special' : 'comprehensive',
    specialCategory: specialCategory.value
  }
}
function saveLocalData() {
  try { uni.setStorageSync('survey_data', JSON.stringify(formData)) } catch (e) {}
}
function loadLocalData() {
  try {
    const d = uni.getStorageSync('survey_data')
    if (d) {
      const p = JSON.parse(d)
      if (p) {
        formData.name = p.name || ''
        formData.school = p.school || ''
        formData.career = p.career || ''
        formData.email = p.email || ''
        formData.objectiveAnswers = p.objectiveAnswers || {}
        formData.subjectiveAnswers = p.subjectiveAnswers || ['', '', '']
      }
    }
  } catch (e) {}
}
function startTimer() {
  timer = setInterval(() => {
    if (remainingTime.value > 0) remainingTime.value--
    else { clearInterval(timer); timer = null; onTimeUp() }
  }, 1000)
}
function onTimeUp() {
  uni.showModal({
    title: '时间到',
    content: '答题时间已结束，系统将自动提交您的答卷。',
    showCancel: false, confirmText: '查看报告',
    success: () => doSubmit()
  })
}
function resetForm() {
  formData.name = ''
  formData.school = ''
  formData.career = ''
  formData.email = ''
  formData.objectiveAnswers = {}
  formData.subjectiveAnswers = ['', '', '']
  visitedSet.clear()
}

/* =========== 生命周期 =========== */
watch(currentStep, (nv) => {
  if (typeof nv === 'string' && nv.startsWith('objective')) {
    const m = nv.match(/objective_(\d+)/)
    if (m) currentQIndex.value = parseInt(m[1])
  }
})
watch(currentQIndex, (nv) => {
  if (currentStep.value.startsWith('objective'))
    currentStep.value = 'objective_' + nv
})

onMounted(() => {
  if (typeof window !== 'undefined') {
    viewportWidth.value = window.innerWidth || 1440
    window.addEventListener('resize', () => { viewportWidth.value = window.innerWidth || 1440 })
  }
})

onUnmounted(() => { if (timer) clearInterval(timer) })

onLoad((options) => {
  // ===== 登录鉴权：无 token 则强制跳转登录页 =====
  const token = uni.getStorageSync('token')
  if (!token) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    setTimeout(() => { uni.redirectTo({ url: '/pages/login/login' }) }, 800)
    return
  }

  // 从本地存储取用户信息
  try {
    const info = uni.getStorageSync('userInfo')
    if (info && info.name) {
      userName.value = info.name
    }
  } catch (e) {}

  if (options && options.from === 'retake') {
    try { uni.removeStorageSync('survey_data') } catch (e) {}
    try { uni.removeStorageSync('survey_result') } catch (e) {}
    specialMode.value = false
    specialCategory.value = ''
    resetForm()
    currentStep.value = 'start'
    currentQIndex.value = 0
    return
  }
  loadLocalData()
})

onShow(() => {
  // 从专项选择页返回：读取待启动的专项测评
  const pending = uni.getStorageSync('pending_special')
  if (pending) {
    try { uni.removeStorageSync('pending_special') } catch (e) {}
    specialMode.value = true
    specialCategory.value = pending
    startComprehensive()
  }
})
</script>

<style scoped>
/* =========================================================
   Brand Design Tokens (from 问卷测评.html)
   涉外法治人才培养测评 — Blue-White Professional
   ========================================================= */
.survey-shell {
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

  /* === Radius Scale === */
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

/* =========================================================
   Shell Layout
   ========================================================= */
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
  background: var(--rule-primary-tint-1);
  color: var(--rule-primary);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 600;
  flex-shrink: 0;
}
.app-sidebar-user-name {
  display: block;
  font-size: 13px; font-weight: 500;
  color: var(--rule-foreground);
}
.app-sidebar-user-role {
  display: block;
  font-size: 12px;
  color: var(--rule-muted-foreground);
}

/* ===== Sidebar Logout Button ===== */
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
  font-size: 13px; font-weight: 500;
}

/* ===== Main ===== */
.app-main {
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 0;
}
.app-topbar {
  height: 64px;
  border-bottom: 1px solid var(--rule-border);
  background: var(--rule-card);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 32px;
  flex-shrink: 0;
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

/* ===== Survey Main Width Reserved for Fixed Grid ===== */
.survey-main {
  width: 100%;
}
@media (min-width: 1200px) {
  .survey-main { padding-right: 284px; }
}

/* =========================================================
   Survey Header + Countdown
   ========================================================= */
.survey-header {
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; margin: 0 auto 24px;
  max-width: 800px;
  flex-wrap: wrap;
}
.survey-header-title {
  font-size: 18px; font-weight: 600;
  color: var(--rule-foreground);
  letter-spacing: -0.01em;
}
.countdown-timer {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 14px;
  border-radius: 9999px;
  background: var(--rule-primary-tint-3);
  border: 1px solid var(--rule-primary-tint-1);
  color: var(--rule-primary);
  font-size: 13px; font-weight: 500;
  white-space: nowrap;
}
.cd-clock-icon {
  width: 16px; height: 16px; flex-shrink: 0;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><polyline points='12 6 12 12 16 14'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><polyline points='12 6 12 12 16 14'/></svg>") center/contain no-repeat;
}
.timer-num {
  font-family: "JetBrains Mono", "SF Mono", Consolas, monospace;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  letter-spacing: 0.02em;
}

/* =========================================================
   Question Card
   ========================================================= */
.survey-card {
  max-width: 800px;
  margin: 0 auto 24px;
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: var(--rule-radius-large);
  padding: 40px;
  box-shadow: var(--rule-shadow-1);
}

.step-indicator-card {
  max-width: 800px;
  margin: 0 auto 24px;
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: var(--rule-radius-large);
  padding: 20px 32px;
  box-shadow: var(--rule-shadow-1);
}
.step-bar-track {
  height: 6px;
  background: var(--rule-muted);
  border-radius: 9999px;
  overflow: hidden;
}
.step-bar-fill {
  height: 100%;
  background: var(--rule-primary);
  border-radius: 9999px;
}
.step-labels {
  display: flex; justify-content: space-between;
  margin-top: 14px;
  flex-wrap: wrap; gap: 8px;
}
.step-lbl {
  font-size: 13px;
  color: var(--rule-muted-foreground);
}
.step-lbl.is-done { color: var(--rule-primary); font-weight: 500; }
.step-lbl.is-active { color: var(--rule-foreground); font-weight: 600; }

/* ===== 主观题输入框聚焦样式 ===== */
.subj-textarea:focus {
  outline: none;
  border-color: var(--rule-primary);
  background: var(--rule-card);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* ===== 测评开始页 ===== */
.start-main { padding-right: 0 !important; }
.start-hero { text-align: center; max-width: 800px; margin: 0 auto 24px; }
.start-badge {
  display: inline-flex; align-items: center;
  padding: 6px 14px; border-radius: 9999px;
  background: var(--rule-primary-tint-3);
  border: 1px solid var(--rule-primary-tint-1);
  color: var(--rule-primary); font-size: 13px; font-weight: 500;
}
.start-title {
  display: block;
  font-size: 34px; font-weight: 800;
  color: var(--rule-foreground);
  letter-spacing: -0.02em; line-height: 1.2;
  margin: 16px 0 8px;
}
.start-subtitle { font-size: 15px; color: var(--rule-muted-foreground); }
.start-card { padding: 40px; }
.start-intro {
  padding: 20px 24px;
  background: var(--rule-primary-tint-3);
  border: 1px solid var(--rule-primary-tint-1);
  border-radius: 12px;
  margin-bottom: 24px;
}
.start-intro-title {
  display: block;
  font-size: 15px; font-weight: 600;
  color: var(--rule-primary);
  margin-bottom: 8px;
}
.start-intro-text {
  display: block;
  font-size: 14px;
  color: var(--rule-ink-2);
  line-height: 1.8;
}
.start-feature-list {
  display: flex; flex-direction: column;
  gap: 16px; margin-bottom: 28px;
}
.start-feature { display: flex; gap: 14px; align-items: flex-start; }
.start-feature-dot {
  width: 8px; height: 8px; border-radius: 9999px;
  background: var(--rule-primary);
  margin-top: 7px; flex-shrink: 0;
}
.start-feature-body { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.start-feature-title { font-size: 15px; font-weight: 600; color: var(--rule-foreground); }
.start-feature-desc { font-size: 13.5px; color: var(--rule-muted-foreground); line-height: 1.6; }
.start-actions {
  display: flex; justify-content: center;
  gap: 16px; flex-wrap: wrap;
}
.start-btn-primary, .start-btn-secondary {
  padding: 12px 34px;
  font-size: 15px;
  border-radius: 10px;
}
.play-icon {
  width: 16px; height: 16px; flex-shrink: 0;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polygon points='6 3 20 12 6 21 6 3'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polygon points='6 3 20 12 6 21 6 3'/></svg>") center/contain no-repeat;
}
.start-hint {
  display: block; text-align: center;
  font-size: 12.5px;
  color: var(--rule-muted-foreground);
  margin-top: 20px;
}

/* ===== 退出测评按钮 ===== */
.sh-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
.exit-btn {
  display: inline-flex; align-items: center;
  padding: 6px 12px; border-radius: 8px;
  font-size: 13px; font-weight: 500;
  color: var(--rule-muted-foreground);
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  cursor: pointer; white-space: nowrap;
  transition: color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;
}
.exit-btn:hover {
  color: var(--state-error);
  border-color: var(--state-error-tint);
  background: var(--state-error-tint);
}

/* ===== Question Meta ===== */
.q-meta {
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 16px;
}
.q-badge {
  font-size: 13px;
  color: var(--rule-muted-foreground);
}
.q-category {
  display: inline-flex; align-items: center;
  padding: 3px 10px;
  border-radius: 9999px;
  background: var(--rule-primary-tint-3);
  color: var(--rule-primary);
  font-size: 12px; font-weight: 500;
}
.q-category.cat-case { background: #FEF3C7; color: #B45309; }
.q-category.cat-essay { background: #EDE9FE; color: #6D28D9; }

.q-text {
  display: block;
  font-size: 18px; font-weight: 600;
  color: var(--rule-foreground);
  line-height: 1.6;
  margin: 0 0 24px;
  word-break: keep-all;
  overflow-wrap: break-word;
}

/* ===== Options ===== */
.q-options {
  display: flex; flex-direction: column;
  gap: 12px;
}
.judge-options {
  flex-direction: row;
  gap: 12px;
}
@media (max-width: 640px) {
  .judge-options { flex-direction: column; }
}
.q-option {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px;
  border: 1px solid var(--rule-border);
  border-radius: var(--rule-radius-medium);
  background: var(--rule-card);
  cursor: pointer;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}
.judge-opt { flex: 1; }
.q-option:hover { border-color: var(--rule-primary); }
.q-option.is-checked {
  border-color: var(--rule-primary);
  background: var(--rule-primary-tint-3);
}
.q-radio, .q-check {
  flex-shrink: 0;
  margin: 0;
  width: 18px; height: 18px;
  pointer-events: none;
}
.q-option-letter {
  font-size: 14px; font-weight: 600;
  color: var(--rule-ink-2);
  flex-shrink: 0;
  width: 16px;
}
.q-option.is-checked .q-option-letter { color: var(--rule-primary); }
.q-option-text {
  font-size: 15px;
  color: var(--rule-foreground);
  line-height: 1.5;
}

/* ===== Nav Buttons ===== */
.q-nav {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--rule-border);
}

.btn-secondary, .btn-primary {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 10px 18px;
  border-radius: var(--rule-radius-medium);
  font-size: 14px; font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
  line-height: 1.5;
  font-family: inherit;
}
.btn-secondary {
  border: 1px solid var(--rule-border);
  background: var(--rule-card);
  color: var(--rule-foreground);
}
.btn-secondary:hover:not(.is-disabled) {
  border-color: var(--rule-primary);
  color: var(--rule-primary);
}
.btn-secondary.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-primary {
  border: 1px solid var(--rule-primary);
  background: var(--rule-primary);
  color: #fff;
}
.btn-primary:hover {
  background: var(--rule-primary-hover);
  border-color: var(--rule-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(37,99,235,0.25);
}
.chev-l, .chev-r {
  width: 16px; height: 16px;
  background: currentColor;
  transition: transform 0.15s ease;
}
.chev-l {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='19' y1='12' x2='5' y2='12'/><polyline points='12 19 5 12 12 5'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='19' y1='12' x2='5' y2='12'/><polyline points='12 19 5 12 12 5'/></svg>") center/contain no-repeat;
}
.chev-r {
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='5' y1='12' x2='19' y2='12'/><polyline points='12 5 19 12 12 19'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='5' y1='12' x2='19' y2='12'/><polyline points='12 5 19 12 12 19'/></svg>") center/contain no-repeat;
}
.btn-primary:hover .chev-r { transform: translateX(2px); }
.btn-secondary:hover .chev-l { transform: translateX(-2px); }

.submit-check {
  width: 16px; height: 16px;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z'/><path d='m21.854 2.147-10.94 10.939'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z'/><path d='m21.854 2.147-10.94 10.939'/></svg>") center/contain no-repeat;
}

/* =========================================================
   Subjective Card
   ========================================================= */
.case-box {
  background: var(--rule-primary-tint-3);
  border-left: 3px solid var(--rule-primary);
  padding: 16px 18px;
  border-radius: 0 var(--rule-radius-medium) var(--rule-radius-medium) 0;
  margin-bottom: 20px;
}
.case-label {
  display: block;
  font-size: 13px; font-weight: 600;
  color: var(--rule-primary);
  margin-bottom: 6px;
}
.case-text {
  display: block;
  font-size: 14px;
  color: var(--rule-ink-2);
  line-height: 1.8;
  white-space: pre-wrap;
}
.subj-textarea {
  width: 100%;
  min-height: 160px;
  padding: 14px 16px;
  background: var(--rule-background);
  border: 1px solid var(--rule-input);
  border-radius: var(--rule-radius-medium);
  font-size: 14px;
  line-height: 1.7;
  color: var(--rule-foreground);
  font-family: inherit;
  box-sizing: border-box;
  resize: vertical;
  transition: all 0.15s ease;
}
.textarea-footer {
  margin-top: 10px;
  text-align: right;
}
.word-hint {
  font-size: 13px;
  color: var(--rule-muted-foreground);
}
.word-hint.warning { color: #D97706; }

.subj-actions {
  max-width: 800px;
  margin: 0 auto 24px;
  border: none;
  padding-top: 0;
  margin-top: 0;
}
.submit-btn {
  background: linear-gradient(135deg, var(--rule-primary), #4F46E5);
  border-color: transparent;
}

/* =========================================================
   Question Number Grid (Fixed)
   ========================================================= */
.question-grid-card {
  position: fixed;
  bottom: 24px; right: 24px;
  width: 244px;
  background: var(--rule-card);
  border: 1px solid var(--rule-border);
  border-radius: 12px;
  box-shadow: var(--rule-shadow-2);
  padding: 16px;
  z-index: 30;
}
.qg-toggle-btn {
  position: absolute;
  top: 12px; right: 12px;
  display: none;
  width: 28px; height: 28px;
  border-radius: 6px;
  align-items: center; justify-content: center;
  cursor: pointer;
  color: var(--rule-muted-foreground);
  transition: background 0.15s ease, color 0.15s ease;
}
.qg-toggle-btn:hover { background: var(--rule-muted); color: var(--rule-foreground); }
.chev-up {
  width: 16px; height: 16px;
  background: currentColor;
  transition: transform 0.2s ease;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>") center/contain no-repeat;
}
.qg-toggle-btn.is-open .chev-up { transform: rotate(180deg); }

.qg-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 2px;
}
.qg-head-spacer { width: 28px; }
.qg-title { font-size: 13px; color: var(--rule-muted-foreground); }
.qg-progress-text {
  display: block;
  font-size: 14px; font-weight: 600;
  color: var(--rule-foreground);
  margin-top: 6px;
  font-variant-numeric: tabular-nums;
}
.qg-progress-bar {
  height: 6px;
  background: var(--rule-muted);
  border-radius: 9999px;
  margin-top: 10px;
  overflow: hidden;
}
.qg-progress-fill {
  height: 100%;
  background: var(--rule-primary);
  border-radius: 9999px;
  transition: width 0.25s ease;
}
.qg-body {
  margin-top: 14px;
  transition: all 0.25s ease;
  overflow: hidden;
}
.qg-body.is-collapsed {
  display: none;
}
.qg-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
}
.qg-btn {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  border-radius: var(--rule-radius-medium);
  font-size: 13px; font-weight: 500;
  border: 1px solid var(--rule-border);
  background: var(--rule-card);
  color: var(--rule-muted-foreground);
  cursor: pointer;
  font-variant-numeric: tabular-nums;
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}
.qg-btn:hover { border-color: var(--rule-primary); color: var(--rule-primary); }
.qg-btn.done {
  background: var(--rule-primary-tint-1);
  color: var(--rule-primary);
  border-color: transparent;
}
.qg-btn.current {
  background: var(--rule-primary);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 0 0 3px var(--rule-primary-tint-1);
}

.qg-submit {
  display: flex; align-items: center; justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 10px;
  margin-top: 14px;
  border: none;
  border-radius: var(--rule-radius-medium);
  background: var(--rule-primary);
  color: #fff;
  font-size: 14px; font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s ease, transform 0.15s ease;
}
.qg-submit:hover {
  background: var(--rule-primary-hover);
  transform: translateY(-1px);
}
.qg-submit > text { color: #fff; }

/* =========================================================
   Responsive
   ========================================================= */
@media (max-width: 1199px) {
  .qg-toggle-btn { display: inline-flex; }
}
@media (min-width: 1200px) {
  .qg-toggle-btn { display: none; }
  .qg-body { display: block; }
}
@media (max-width: 768px) {
  .app-sidebar { transform: translateX(-100%); transition: transform 0.3s; }
  .app-main { margin-left: 0; }
  .app-content { padding: 16px; }
}
@media (max-width: 480px) {
  .survey-card { padding: 24px; }
  .q-text { font-size: 16px; }
  .question-grid-card {
    width: calc(100vw - 32px);
    max-width: 280px;
    right: 16px; bottom: 16px;
  }
  .survey-header-title { font-size: 16px; }
  .survey-header { margin-bottom: 16px; }
  .subj-card { padding: 24px; }
  .step-indicator-card { padding: 16px 20px; }
  .start-title { font-size: 26px; }
  .start-card { padding: 24px; }
  .start-intro { padding: 16px 18px; }
  .start-actions { flex-direction: column; }
  .start-btn-primary, .start-btn-secondary { width: 100%; justify-content: center; }
}
@media (prefers-reduced-motion: reduce) {
  * { transition-duration: 0.01ms !important; }
}
</style>
