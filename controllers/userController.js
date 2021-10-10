const router = require('express').Router()
const { User, Post, Comment } = require('../models')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const { eventNames } = require('../models/User')

// get current user
router.get('/user', (req, res) => {
  res.json(req.user)
})

// get all users
router.get('/users', (req, res) => {
  User.find({})
    .then(users => res.json(users))
    .catch(err => console.log(err))
})

// get x amount of users
router.get('/userlist/:count', (req, res) => {
  User.find({})
    .then(users => res.json(users.slice(0, req.params.count)))
    .catch(err => console.log(err))
})

// get user by id
router.get('/users/:id', (req, res) => {
  User.findById(req.params.id)
    .populate(
      {
        path: 'posts',
        model: 'Post',
        populate: {
          path: 'user',
          model: 'User',
        },
        populate: {
          path: 'comments',
          model: 'Comment',
          populate: {
            path: 'user',
            model: 'User'
          }
        }
      })

    .then(user => res.json(user))
    .catch(err => console.log(err))
})

// update user
router.put('/user', passport.authenticate('jwt'), (req, res) => {
  User.findByIdAndUpdate(req.user.id, req.body)
    .then(() => res.sendStatus(200))
    .catch(err => console.log(err))
})

// delete user
router.delete('/user', passport.authenticate('jwt'), (req, res) => {
  User.findByIdAndDelete(req.user.id)
    .then(() => res.sendStatus(200))
    .catch(err => console.log(err))
})

// user registration
router.post('/user/register', async (req, res) => {
  let status = { name: '', email: '', username: '', password: '' }
  const { name, email, username, password } = req.body
  const lowerCaseUsername = username.toLowerCase()

  // empty input check 
  name.length < 1 && (status.name = 'Please Enter Your Full Name')
  username.length < 1 && (status.username = 'Please Enter a Username')
  password.length < 1 && (status.password = 'Please Enter a Pasword')
  email.length < 1 && (status.email = 'Email is Required')

  // valid email check
  !(email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) && (status.email = 'Please Enter a Valid Email')

  let registeredUsers = {
    email: [],
    username: []
  }
  // check for existing user info
  await User.find({})
    .then(users => {
      users.forEach(user => {
        registeredUsers.email.push(user.email)
        registeredUsers.username.push(user.username)
      })
    })
    .catch(err => console.log(err))

  registeredUsers.email.indexOf(email) !== -1 && (status.email = 'Email is Already in Use')
  registeredUsers.username.indexOf(username) !== -1 && (status.username = "Username is Already in Use")

  if (status.name || status.username || status.password || status.email) {
    res.json({
      status: status,
      message: 'Unable to Register User'
    })
  }
  else {
    User.register(new User({ name, email, username: lowerCaseUsername }), password, (err, user) => {
      if (err) {
        res.json({
          status: status,
          err: err,
          message: 'Unable to Register User',
          req: req.body
        })
      }
      // log in user
      User.authenticate()(lowerCaseUsername, password, (err, user) => {
        if (err) { console.log(err) }
        else if (!user) {
          res.json({
            message: 'Unable to Login User'
          })
        }
        else {
          res.json({
            date: user,
            status: 200,
            message: 'Successfully Logged In User',
            user: user ? jwt.sign({id: user._id}, process.env.SECRET) : null
          })
        }
      })
    })
  }
})

// user login
router.post('/user/login', (req, res) => {
  User.authenticate()(req.body.username.toLowerCase(), req.body.password, (err, user) => {
    if (err) { console.log(err) }
    else if (!user) {
      res.json({
        message: 'Username or Password was Incorrect',
      })
    } else {
      res.json({
        user: user ? jwt.sign({ id: user._id }, process.env.SECRET) : null
      })
    }
  })
})

