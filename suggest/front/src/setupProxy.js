const proxy = require('http-proxy-middleware')
module.exports = function (app) {
  app.use(proxy('/api', {
    target: 'http://localhost:9000',
    changeOrigin: true,
    pathRewrite: {
      '^/api' : '',     // 重写请求，比如我们源访问的是api/old-path，那么请求会被解析为/api/new-path
    }
  }))
}