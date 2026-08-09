/**
 * 本地视频静态服务器（零依赖，仅 Node 内置模块）
 *
 * 用途：微信小程序 video 组件播放后端视频文件。视频体积大，不能打进小程序包
 *       （主包上限 2MB），因此由本服务器通过 HTTP 流式（Range 请求）提供。
 *
 * 启动：node scripts/serve-video.js
 * 默认端口：8972
 * 服务根目录：backend/（如 http://localhost:8972/video/video_intl_arbitration_0.mp4）
 *
 * 微信开发者工具要求：详情 -> 本地设置 -> 勾选“不校验合法域名…”。
 * 真机预览时，把 video-detail.vue 中的 videoSrc 换成 http://<电脑局域网IP>:8972/...
 */
const http = require('http')
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '../backend')
const PORT = Number(process.env.PORT || 8972)

const MIME = {
  '.mp4': 'video/mp4',
  '.m4a': 'audio/mp4',
  '.mp3': 'audio/mpeg'
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0])
  const filePath = path.normalize(path.join(ROOT, urlPath))

  // 防止目录穿越
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404)
      res.end('Not Found')
      return
    }

    const type = MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream'
    const range = req.headers.range

    if (range) {
      // 支持 Range 请求，视频拖动进度需要
      const m = /bytes=(\d*)-(\d*)/.exec(range)
      let start = m && m[1] ? parseInt(m[1], 10) : 0
      let end = m && m[2] ? parseInt(m[2], 10) : stat.size - 1
      if (Number.isNaN(start)) start = 0
      if (Number.isNaN(end)) end = stat.size - 1
      if (start > end || start >= stat.size) {
        res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` })
        res.end()
        return
      }
      res.writeHead(206, {
        'Content-Type': type,
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store'
      })
      fs.createReadStream(filePath, { start, end }).pipe(res)
    } else {
      res.writeHead(200, {
        'Content-Type': type,
        'Content-Length': stat.size,
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*'
      })
      fs.createReadStream(filePath).pipe(res)
    }
  })
})

server.listen(PORT, () => {
  console.log(`[video-server] http://localhost:${PORT}/  (根目录: ${ROOT})`)
  const os = require('os')
  const nets = os.networkInterfaces()
  Object.keys(nets).forEach((name) => {
    nets[name].forEach((net) => {
      if (net.family === 'IPv4' && !net.internal) {
        console.log(`[video-server] 局域网地址(真机用): http://${net.address}:${PORT}/`)
      }
    })
  })
})
