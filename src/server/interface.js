const Router = require('koa-router')
const User = require('./model/user')
const Ufo = require('./model/ufos')
const Passport = require('./passport')
const Redis = require('koa-redis')
const Mailer = require('nodemailer')
const config = require('./config')
const fs = require('fs')

const Store = new Redis().client
const router = new Router({
  prefix: '/ufo'
})

// 正常返回1，错误返回0。

// 登录
router.post('/login', async ctx => {
  return Passport.authenticate('local', (err, user, info, status) => {
    if (err) {
      ctx.body = {
        code: 0,
        msg: err
      }
    } else {
      if (user) {
        ctx.body = {
          code: 1,
          data: user
        }
        return ctx.login(user)
      } else {
        ctx.body = {
          code: 0,
          msg: info
        }
      }
    }
  })(ctx)
})
// 退出登录
router.post('/logout', async ctx => {
  await ctx.logout()
  if (ctx.isAuthenticated()) {
    ctx.body = {
      code: 0,
      msg: '退出失败，请重试'
    }
  } else {
    ctx.body = {
      code: 1,
      msg: '退出成功'
    }
  }
})
// 注册 (修改密码)
router.post('/register', async ctx => {
  try {
    let { email = '', code = '', password = '' } = ctx.request.body
    if (!email || !code || !password) {
      ctx.body = {
        code: 0,
        msg: '信息不完整'
      }
      return
    }
    let storeExpired = await Store.hget(`nodemailer${email}`, 'expired')
    if (Date.now() - storeExpired > 0) {
      ctx.body = {
        code: 0,
        msg: '验证码已过期'
      }
      return
    }
    let storeCode = await Store.hget(`nodemailer${email}`, 'code')
    if (storeCode !== code) {
      ctx.body = {
        code: 0,
        msg: '验证码错误'
      }
      return
    }
    let user = {}
    let rs = await User.findOne({ email })
    if (rs) {
      user = await User.updateOne({ '_id': rs._id }, { password })
    } else {
      user = await User.create({ email, password })
    }
    ctx.body = {
      code: 1,
      data: user
    }
  } catch (e) {
    ctx.body = {
      code: 0,
      msg: '注册失败'
    }
  }
})
// 发送验证码
router.post('/sendCode', async ctx => {
  let { email = '' } = ctx.request.body
  if (!email) {
    ctx.body = {
      code: 0,
      msg: '邮箱不存在'
    }
    return
  }
  let storeExpired = await Store.hget(`nodemailer${email}`, 'expired')
  if (storeExpired && storeExpired - Date.now() > 0) {
    ctx.body = {
      code: 0,
      msg: '请求过于频繁，请稍后再试！'
    }
    return
  }
  const transporter = Mailer.createTransport({
    host: config.smtp.host,
    port: 587,
    secure: false,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass
    }
  })
  const to = {
    email,
    expired: config.smtp.expired(),
    code: config.smtp.code()
  }
  const emailOptions = {
    from: `<${config.smtp.user}>`,
    to: email,
    subject: 'UFOS - 注册验证码',
    html: `感谢在 UFOS 注册！您的验证码是：${to.code}，有效期1分钟。`
  }
  try {
    await transporter.sendMail(emailOptions)
    await Store.hmset(`nodemailer${email}`, 'code', to.code, 'expired', to.expired, 'email', email)
    ctx.body = {
      code: 1,
      msg: '验证码已发送，请查收。'
    }
  } catch (e) {
    ctx.body = {
      code: 0,
      msg: '注册失败，检查邮箱是否正确，然后重新获取验证码'
    }
  }
})
// 获取列表数据（全部or当前用户，带分页, 倒序返回, 关联查询用户信息）
router.post('/list', async ctx => {
  try {
    let { _id = '', limit = 10, skip = 0 } = ctx.request.body
    let data = []
    if (_id) {
      // MINE页面 按照创建时间倒序
      data = await Ufo.find({ 'user': _id })
        .populate({ path: 'user', select: ['nickname', 'avatar'] })
        .skip(skip)
        .limit(limit)
        .sort({ 'created': -1 })
    } else {
      // ALL页面 按照更新时间倒序
      data = await Ufo.find()
        .populate({ path: 'user', select: ['nickname', 'avatar'] })
        .skip(skip)
        .limit(limit)
        .sort({ 'updated': -1 })
    }
    ctx.body = {
      code: 1,
      data
    }
  } catch (e) {
    ctx.body = {
      code: 0,
      msg: e.message || '请求失败'
    }
  }
})
// 添加或修改一条列表数据
router.post('/edit', async ctx => {
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0,
      msg: '登录失效，请重新登录'
    }
  }
  let { _id = '', imgs = [], text = '' } = ctx.request.body
  let user = ctx.session.passport.user._id
  if (!text || !user) {
    ctx.body = {
      code: 0,
      msg: '参数错误'
    }
    return
  }
  let data
  if (_id) {
    await Ufo.updateOne({ _id }, { text, imgs })
    data = await Ufo.findOne({ _id })
  } else {
    data = await Ufo.create({ imgs, text, user })
  }
  ctx.body = {
    code: 1,
    data
  }
})
// 删除一条列表数据(直接删掉，不是逻辑删除)
router.post('/remove', async ctx => {
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0,
      msg: '登录失效，请重新登录'
    }
  }
  let { _id } = ctx.request.body
  if (!_id) {
    ctx.body = {
      code: 0,
      msg: '参数错误'
    }
    return
  }
  let data = await Ufo.remove({ _id })
  ctx.body = {
    code: 1,
    data
  }
})
// 保存个人资料
router.post('/userInfo', async ctx => {
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0,
      msg: '登录失效，请重新登录'
    }
  }
  let {
    _id,
    avatar = '',
    nickname = '',
    age = '',
    sex = '',
    signature = '',
    provinceId = '',
    cityId = '',
    regionId = ''
  } = ctx.request.body
  if (!_id) {
    ctx.body = {
      code: 0,
      msg: '参数错误'
    }
    return
  }
  if (nickname) {
    let rs = await User.findOne({ nickname })
    if (rs && rs._id.toString() !== _id) {
      ctx.body = {
        code: 0,
        msg: '该昵称已被占用'
      }
      return
    }
  }
  let data = { avatar, nickname, age, sex, signature, provinceId, cityId, regionId }
  await User.updateOne({ _id }, data)
  ctx.body = {
    code: 1,
    data
  }
})
// 上传图片 (最好是每一个用户单独创建一个文件夹，只存放该用户上传的图片。)
router.post('/upImage', async ctx => {
  try {
    const data = ctx.request.files.file
    const imageName = Date.now() + '_' + data.name
    const savePath = __dirname + '/../../static/' + imageName
    const read = fs.createReadStream(data.path)
    const write = fs.createWriteStream(savePath)
    const rs = await new Promise(resolve => {
      let stream = read.pipe(write)
      stream.on('finish', () => {
        resolve({
          code: 1,
          data: `http://api.mdmlmw.com/${imageName}`
        })
      })
      stream.on('error', (e) => {
        resolve({
          code: 0,
          data: e
        })
      })
    })
    ctx.body = rs
  } catch (e) {
    ctx.body = {
      code: 0,
      data: '上传失败'
    }
  }
})
// 验证登录状态
router.post('/user', async ctx => {
  // ctx.session.passport.user 存在，即为登录状态。
  try {
    const user = ctx.session.passport.user
    if (user && user._id) {
      let rs = await User.findOne({ '_id': user._id })
      ctx.body = {
        data: rs
      }
      return
    }
    throw new Error()
  } catch (e) {
    ctx.body = {
      data: {}
    }
  }
})

module.exports = router
