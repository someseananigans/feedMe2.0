const { model, Schema } = require('mongoose')

const Comment = new Schema({
  comment: String,
  post: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  created_On: {
    type: Number,
    default: Date.now()
  }
})

module.exports = model('Comment', Comment)