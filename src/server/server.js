const Koa = require('koa')
const router = require('./interface')
const redis = require('koa-redis')
const config = require('./config')
const session = require('koa-generic-session')
const mongoose = require('mongoose')
const body = require('koa-body')
const json = require('koa-json')
const passport = require('./passport')
const send = require('koa-static')

const app = new Koa()

app.keys = ['mine', 'ssr']
app.proxy = true

mongoose.set('useCreateIndex', true)
mongoose.connect(config.mongodb, { useNewUrlParser: true })

app.use(session({
  key: 'UFO',
  prefix: 'ufo--',
  store: new redis()
}))
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', 'http://www.mdmlmw.com')
  // ctx.set('Access-Control-Allow-Origin', ctx.headers.origin) // dev
  ctx.set('Access-Control-Allow-Headers', 'content-type')
  ctx.set('Access-Control-Allow-Methods', 'OPTIONS,GET,HEAD,PUT,POST,DELETE,PATCH')
  ctx.set('Access-Control-Allow-Credentials', true)
  await next()
})
app.use(body({
  multipart: true,
  formidable: {
    maxFileSize: 10 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
    keepExtensions: true // 保持文件的后缀
  }
}))
app.use(json())
app.use(passport.initialize())
app.use(passport.session())
app.use(router.routes()).use(router.allowedMethods())
app.use(send(__dirname + '/../../static'))

const port = 8000
const host = '127.0.0.1'
// const port = 8888
// const host = '192.168.0.105'
app.listen(port, host)
console.log('koa server is listening: ' + host + ':' + port)
