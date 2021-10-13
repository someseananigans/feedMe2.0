const router = require('express').Router()
const {Post, User, Comment} = require('../models')
const jwt = require('jsonwebtoken')
const passport = require('passport')

// get all posts 
router.get('/posts', (req, res) => {
  Post.find({})
    .populate(
      {
        path: 'comments',
        model: 'Comment',
        select: 'comment user _id',
        populate: {
          path: 'user',
          model: 'User',
          select: 'username profile _id'
        }
      },
      {
        path: 'user',
        model: 'User',
        select: 'username profile _id'
      }
    )
    .then(posts => res.json(posts))
    .catch(err => console.log(err))
})

// get post by id
router.get('/posts/:post_id', (req, res) => {
  Post.findById({ _id: req.params.post_id})
    .populate(
      {
        path: 'comments',
        model: 'Comment',
        select: 'comment user _id',
        populate: {
          path: 'user',
          model: 'User',
          select: 'username profile _id'
        }
      },
      {
        path: 'user',
        model: 'User',
        select: 'username profile _id'
      }
    )
    .then(post => res.json(post))
    .catch(err => console.log(err))
})

// get user's posts
router.get('/user/posts', passport.authenticate('jwt'), (req, res) => {
  Post.find({ user: req.user._id})
    .populate( 
      {
        path: 'comments',
        model: 'Comment',
        select: 'comment user _id',
        populate: {
          path: 'user',
          model: 'User',
          select: 'username profile _id'
        }
      },
      {
        path: 'user',
        model: 'User',
        select: 'username profile _id'
      }
    )
    .then(posts => res.json(posts))
    .catch(err => console.log(err))
})

// post a post
router.post('/post', passport.authenticate('jwt'), (req, res) => {
  const {body, image} = req.body

  Post.create({
    body,
    image, 
    user: req.user._id
  })
    .then(post => {
      User.findByIdAndUpdate(req.user._id, { $push: { posts: post._id }})
        .then(() => res.json(post))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

// update a post 
router.put('/post/:post_id', passport.authenticate('jwt'), (req, res) => {
  Post.findByIdAndUpdate(req.params.post_id, req.body)
    .then(() => res.sendStatus(200))
    .catch(err => console.log(err))
})

// delete a post
router.delete('/post/:post_id', passport.authenticate('jwt'), (req, res) => {
  Post.findByIdAndRemove(req.params.post_id)
    .then(() => res.sendStatus(200))
    .catch(err => console.log(err))
})

module.exports = router