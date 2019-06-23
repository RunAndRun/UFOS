const Passport = require('koa-passport')
const Local = require('passport-local')
const User = require('./model/user')

Passport.use(new Local({
  usernameField: 'email'
}, async (email, password, done) => {
  let rs = await User.findOne({ email })
  if (!rs) {
    return done(null, false, '用户名错误 或 用户不存在')
  } else {
    if (rs.password === password) {
      return done(null, rs)
    } else {
      return done(null, false, '密码错误')
    }
  }
}))

Passport.serializeUser((user, done) => {
  done(null, user)
})

Passport.deserializeUser((user, done) => {
  return done(null, user)
})

module.exports = Passport
