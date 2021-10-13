const router = require('express').Router()
const { Comment, Post, User } = require('../models')
const jwt = require('jsonwebtoken')
const passport = require('passport')

// get post's comments
router.get('/comments/:post_id', (req, res) => {
  Comment.find({ post: req.params.post_id })
    .populate({
      path: 'user',
      model: 'User'
    })
    .then(comments => res.json(comments))
    .catch(err => console.log(err))
})

// create comment
router.post('/comment/:post_id', passport.authenticate('jwt'), (req, res) => {
  Comment.create({
    comment: req.body.comment,
    post: req.params.post_id,
    user: req.user._id
  })
    .then(cmnt => {
      Post.findByIdAndUpdate(req.params.post_id, { $push: { comments: cmnt._id } })
        .then(() => {
          const comment = {
            created_On: cmnt.created_On,
            _id: cmnt._id,
            comment: cmnt.comment,
            post: cmnt.post,
            user: {
              username: req.user.username,
              profile: req.user.profile
            },

          }
          res.json(comment)
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

// update comment
router.put('/comment/:comment_id', passport.authenticate('jwt'), (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body)
    .then(() => res.sendStatus(200))
    .catch(err => console.log(err))
})

// delete comment
router.delete('/comment/:_id', passport.authenticate('jwt'), (req, res) => {
  Comment.findByIdAndDelete(req.params._id)
    .then(() => res.sendStatus(200))
    .catch(err => console.log(err))
})

module.exports = router