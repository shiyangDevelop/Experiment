const { errorFn } = require('./error')
const DataBase = require('../database/index')
module.exports = function (req, res, next) {
  let params = req.body
  if (params.username && params.password && params.verificationCode) {
    DataBase.login.login(req, res, data => {
      req.session.userId = '000111222'
      console.log(req.session)
      if (data.length > 0) {
        if (req.body.password === data[0].customer_password) {
          res.json({
            success: true,
            message: '登录成功'
          })
        } else {
          res.json({
            success: false,
            message: '登录密码错误'
          })
        }
      } else {
        res.json({
          success: false,
          message: '用户名输入有误'
        })
      }
    })
  } else {
    errorFn(res, '存在用户名、密码、验证码为空!')
  }
}