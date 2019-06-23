const mongoose = require('mongoose')

const Schema = mongoose.Schema

const User = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true
    }, // 邮箱：必填，唯一
    nickname: String, // 昵称：唯一
    password: {
      type: String,
      required: true
    }, // 密码
    avatar: String, // 头像
    age: String, // 年龄
    sex: String, // 性别
    signature: String, // 个人签名
    provinceId: String, // 地址：省
    cityId: String, // 地址： 市
    regionId: String // 地址：区域
  },
  {
    timestamps: {
      createdAt: 'created',
      updatedAt: 'updated'
    }
  }
)

module.exports = mongoose.model('user', User)
