const redis = require('redis');
const session = require('express-session');
const app = require('../app');
const RedisStore = require('connect-redis')(session);
var redisClient = redis.createClient()
redisClient.on('connect', function () {
  console.log('redis connect!')
})
redisClient.on('ready', function () {
  console.log('redis ready!')
  redisClient.set('uuid', '1234567899999', function (err, data) {
    console.log(data)
  })
  redisClient.get('uuid', function (err, data) {
    console.log(data)
  })
})

// 此时req对象还没有session这个属性
app.use(session({
  store: new RedisStore({client: redisClient}),
  secret: 'express is powerful'
}));
module.exports = {
  'login': require('./login')
}