const  {model, Schema} = require('mongoose')

const User = new Schema({
  name: String, 
  username: {
    type: String, 
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  profile: {
    type: String,
    default: 'https://firebasestorage.googleapis.com/v0/b/reinsta-884d1.appspot.com/o/images%2FGram1621567414811?alt=media&token=81b10f2f-99f6-4308-91d6-8515359b588b',
  },
  bio: String,
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],
  liked_post: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],
  // chatRooms: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'ChatRoom'
  // }]
})

User.plugin(require('passport-local-mongoose'))

module.exports = model('User', User)