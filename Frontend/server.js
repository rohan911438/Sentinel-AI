const http = require('http')
const fs = require('fs')
const path = require('path')

const port = process.env.PORT ? Number(process.env.PORT) : 5173
const root = __dirname

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
}

function sendFile(filePath, res) {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end('Not Found')
      return
    }

    const ext = path.extname(filePath).toLowerCase()
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' })
    res.end(content)
  })
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0])

  if (urlPath === '/' || urlPath === '/index.html') {
    sendFile(path.join(root, 'static.html'), res)
    return
  }

  if (urlPath === '/dashboard' || urlPath === '/dashboard.html') {
    sendFile(path.join(root, 'dashboard.html'), res)
    return
  }

  const safePath = path.normalize(urlPath).replace(/^([.][.][/\\])+/, '')
  sendFile(path.join(root, safePath), res)
})

server.listen(port, '127.0.0.1', () => {
  console.log(`Sentinel AI static server running at http://127.0.0.1:${port}`)
})
