const fs = require('fs')
const server = require('express')()
const Vue = require('vue')
const route = require('./route')()
const renderer = require('vue-server-renderer').createRenderer({
  template: fs.readFileSync('./index.html', 'UTF-8')
})
console.log(route)
server.get('/home', (req, res) => {
  const app = new Vue({
    
    data: {
      url: req.url
    },
    template: `<div>访问的 URL 是： {{ url }}</div>`
  })
  renderer.renderToString(app, (err, html) => {
    if (err) {
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(html)
  })
})
server.get('/news', (req, res) => {
  const app = new Vue({
    data: {
      url: req.url
    },
    template: `<div>访问的 URL 是： {{ url }} 哈哈哈</div>`
  })
  renderer.renderToString(app, (err, html) => {
    if (err) {
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(html)
  })
})

server.listen(8080)