const router = require('express').Router()
const passport = require('passport')
const { Comment, Post, User } = require('../models')

router.use('/api', require('./userController.js'))
router.use('/api', require('./searchController.js'))
// router.use('/api', require('./postController.js'))
// router.use('/api', require('./commentController.js'))
// router.use('/api', require('./chatController.js'))


module.exports = router