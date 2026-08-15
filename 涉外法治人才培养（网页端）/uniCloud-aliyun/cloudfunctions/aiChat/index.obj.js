// 云对象：AI 对话助手（接入智谱 GLM-4-Flash-250414 大模型）
//
// 调用方式：
//   const aiChat = uniCloud.importObject('aiChat')
//   await aiChat.chat({ messages: [{ role: 'user', content: '...' }, ...] })
// 返回统一结构：{ errCode: 0 成功 | 非0 失败, errMsg, content }
//
// 模型说明：
//   - 智谱开放平台 https://open.bigmodel.cn 注册后获取 API Key
//   - GLM-4-Flash-250414 为免费模型（免费版可能限量/限频）
//
// API Key 配置：
// 推荐：在本云函数目录下的 config.local.json 里填 zhipuApiKey（该文件已在 .gitignore 中忽略）

const path = require('path')
const fs = require('fs')

// 读取同目录 config.local.json（部署时随云函数上传到云端，但被 git 忽略）
function getApiKey() {
  try {
    const localConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, './config.local.json'), 'utf8'))
    if (localConfig && localConfig.zhipuApiKey && localConfig.zhipuApiKey.indexOf('请在此填入') === -1) {
      return localConfig.zhipuApiKey
    }
  } catch (e) {
    // 配置文件不存在时忽略，继续尝试环境变量
  }
  return process.env.ZHIPU_API_KEY || ''
}

const ZHIPU_CHAT_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'

// 系统提示词：让模型扮演涉外法治人才培养平台的专家助手
const SYSTEM_PROMPT = `你是"涉外法治人才培养平台"的法治AI助手，一名资深涉外法律专家。

你的职责：
1. 回答涉外法律相关问题（国际商事仲裁、国际贸易法、涉外民事诉讼、国际私法、跨境数据合规、法律英语等）
2. 解答法律概念、法条适用、实务操作等问题
3. 结合中国法律（如《涉外民事关系法律适用法》《民事诉讼法》《个人信息保护法》）与相关国际条约（如《纽约公约》、CISG、INCOTERMS、GDPR）作答

回答要求：
- 专业、准确、条理清晰
- 必须使用 Markdown 排版回答，让内容层次分明：
  - 用 **加粗** 标出小标题或关键词
  - 多个要点时使用 "- " 或 "1. " 列表逐条列出，要点较长时用 "**要点名**：说明" 的格式
  - 重要提示或风险提醒放在 "> " 引用块里
  - 段落间空行分隔，不要整段挤在一起
- 不确定的地方要说明，不编造法条
- 涉及具体案情时提示"不构成法律意见，建议咨询执业律师"
- 保持中文回答`

// 提取智谱错误响应里的可读信息（兼容不同字段命名），返回 { code, message, raw }
function extractZhipuError(data) {
  if (!data) return { code: '', message: '', raw: '' }
  const raw = JSON.stringify(data)
  const error = data.error || {}
  const code = error.code || data.code || ''
  const message = error.message || error.msg || data.message || data.msg || ''
  return { code: String(code), message: String(message), raw }
}

// 发送请求，429/5xx 自动重试最多 3 次（指数退避），避免偶发限流导致失败
async function requestWithRetry(fullMessages, retryLeft = 3) {
  const doRequest = () => {
    const ZHIPU_API_KEY = getApiKey()
    return uniCloud.httpclient.request(ZHIPU_CHAT_URL, {
      method: 'POST',
      contentType: 'json',
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${ZHIPU_API_KEY}`
      },
      data: {
        model: 'glm-4-flash-250414',
        messages: fullMessages,
        max_tokens: 4096,
        temperature: 0.7,
        stream: false
      },
      timeout: 60000
    })
  }

  const res = await doRequest()

  if ((res.status === 429 || res.status >= 500) && retryLeft > 0) {
    // 带业务错误码的 429 一般是额度/频率问题，重试意义不大，直接返回
    const detail = extractZhipuError(res.data)
    console.error(`[aiChat] http ${res.status}, code=${detail.code}, msg=${detail.message}`)
    return res
  }

  return res
}

module.exports = {
  /**
   * 与 AI 对话
   * @param {Array} messages 对话消息 [{ role: 'user'|'assistant', content: '...' }]
   */
  async chat({ messages = [], system = '' } = {}) {
    const ZHIPU_API_KEY = getApiKey()
    if (!Array.isArray(messages) || messages.length === 0) {
      return { errCode: 400, errMsg: '消息不能为空', content: '' }
    }

    if (!ZHIPU_API_KEY) {
      return { errCode: 1001, errMsg: '未配置智谱 API Key，请在 aiChat 云函数的 config.local.json 中填写 zhipuApiKey 后重新部署', content: '' }
    }

    const fullMessages = [
      { role: 'system', content: system || SYSTEM_PROMPT },
      ...messages.slice(-20) // 只携带最近 20 条消息作为上下文
    ]

    try {
      const res = await requestWithRetry(fullMessages)

      if (res.status !== 200) {
        // 透传智谱返回的错误详情，方便定位（限流/额度/模型名等）
        const detail = extractZhipuError(res.data)
        console.error('[aiChat] zhipu http error:', res.status, detail.raw || JSON.stringify(res.data || {}))
        const extra = detail.code ? `（业务码 ${detail.code}）` : ''
        const msg = detail.message ? `，详情：${detail.message}` : ''
        return { errCode: 500, errMsg: `AI 服务异常（${res.status}）${extra}${msg}`, content: '' }
      }

      const data = res.data || {}
      const content = data.choices && data.choices[0] && data.choices[0].message
        ? data.choices[0].message.content
        : ''

      if (!content) {
        return { errCode: 502, errMsg: 'AI 返回内容为空', content: '' }
      }

      return { errCode: 0, errMsg: '', content }
    } catch (e) {
      console.error('[aiChat] request error:', e)
      return { errCode: 500, errMsg: 'AI 服务连接失败，请稍后重试', content: '' }
    }
  },

  /**
   * 根据视频信息生成详细课程简介（用于视频详情页）
   * @param {Object} opts { title: 课程标题, category: 分类, description: 已有简介(可空), meta: 时长(可空) }
   * @returns {Object} { errCode, errMsg, intro }
   */
  async generateVideoIntro({ title = '', category = '', description = '', meta = '' } = {}) {
    const ZHIPU_API_KEY = getApiKey()
    if (!ZHIPU_API_KEY) {
      return { errCode: 1001, errMsg: '未配置智谱 API Key', intro: '' }
    }

    const infoLines = [
      `- 课程标题：${title || '未知'}`,
      `- 所属分类：${category || '未分类'}`,
      `- 课程时长：${meta || '未知'}`
    ]
    if (description) infoLines.push(`- 已有简介：${description}`)

    const messages = [
      {
        role: 'system',
        content: `你是涉外法治人才培养平台的资深课程编辑。请根据视频信息，为该课程生成一份**详细、结构化**的课程简介，用于课程详情页展示。

课程简介（intro）必须使用 Markdown 排版，包含以下两个部分：
1. **课程概述**：用 "## 课程概述" 开头，2-3句话概括课程主题、核心内容与学习价值
2. **你将学到**：用 "## 你将学到" 开头，列出 3-5 个具体学习目标，每条用 "- " 列表，要点较长时用 "**要点名**：说明" 的格式

其他要求：
- 内容必须专业、准确，贴合涉外法治领域（国际商事仲裁、国际贸易法、涉外民事诉讼、国际私法、跨境数据合规、法律英语等），不编造法条或虚假信息
- 有已有简介时，可参考其内容，但要比它更详细、更有条理
- 只输出 JSON，不要输出多余文字或 markdown 代码块标记`
      },
      {
        role: 'user',
        content: `视频信息：\n${infoLines.join('\n')}\n\n请按以下格式输出 JSON（intro 内使用 Markdown，只包含"课程概述"和"你将学到"两部分）：\n{"intro":"## 课程概述\\n...\\n\\n## 你将学到\\n- ..."}`
      }
    ]

    try {
      const res = await requestWithRetry(messages)

      if (res.status !== 200) {
        const detail = extractZhipuError(res.data)
        console.error('[aiChat] generateVideoIntro zhipu http error:', res.status, detail.raw || JSON.stringify(res.data || {}))
        const extra = detail.code ? `（业务码 ${detail.code}）` : ''
        return { errCode: 500, errMsg: `AI 服务异常（${res.status}）${extra}`, intro: '' }
      }

      const data = res.data || {}
      const content = data.choices && data.choices[0] && data.choices[0].message
        ? data.choices[0].message.content
        : ''

      // 解析 JSON：兼容 ```json ... ``` 包裹及多余前后文字
      const cleaned = String(content || '').replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
      let parsed = {}
      try {
        parsed = JSON.parse(cleaned)
      } catch (e) {
        const match = cleaned.match(/\{[\s\S]*\}/)
        if (match) {
          try { parsed = JSON.parse(match[0]) } catch (e2) { parsed = {} }
        }
      }

      return {
        errCode: 0,
        errMsg: '',
        intro: parsed.intro || ''
      }
    } catch (e) {
      console.error('[aiChat] generateVideoIntro request error:', e)
      return { errCode: 500, errMsg: 'AI 服务连接失败，请稍后重试', intro: '' }
    }
  }
}
