const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UFOS = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    }, // 用户
    text: {
      type: String,
      required: true
    }, // 文字
    imgs: Array // 图片数组
  },
  {
    timestamps: {
      createdAt: 'created',
      updatedAt: 'updated'
    }
  }
)

module.exports = mongoose.model('ufos', UFOS)
