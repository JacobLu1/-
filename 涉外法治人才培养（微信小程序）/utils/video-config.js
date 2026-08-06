/**
 * 视频地址配置
 *
 * 上线发布时：
 *   1. 把 backend/video/ 下的视频文件上传到 uniCloud 云存储（uniCloud 控制台 → 云存储）
 *   2. 把云存储中的视频目录地址填到 VIDEO_BASE_ONLINE，例如 'https://xxx.bspapp.com/upload/video/'
 * 留空时自动使用本地开发地址（网页端相对路径 / 小程序端 localhost 视频服务器）。
 */
const VIDEO_BASE_ONLINE = ''

// 本地开发地址：运行时按平台自动选择（网页端相对路径 / 小程序端 localhost 视频服务器）
// 不采用 uni-app 条件编译，避免普通 JS 语法检查器把两段代码都视为有效而误报“重复声明”
let VIDEO_BASE_LOCAL = '/backend/video/'
try {
  const sys = uni.getSystemInfoSync()
  if (sys && sys.uniPlatform === 'mp-weixin') {
    VIDEO_BASE_LOCAL = 'http://localhost:8972/video/'
  }
} catch (e) {
  // 非 uni-app 环境时保持网页端默认值
}

export function getVideoUrl(fileName) {
  const base = VIDEO_BASE_ONLINE || VIDEO_BASE_LOCAL || ''
  return base + encodeURIComponent(fileName)
}
