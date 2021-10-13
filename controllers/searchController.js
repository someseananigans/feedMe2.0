const router = require('express').Router()
const { User, Post, Comment } = require('../models')
const jwt = require('jsonwebtoken')
const passport = require('passport')

// const getMatches = (array, toMatch) => {
//   const res = new Promise((resolve, reject) => {
//     let searchResults = []
//     for (let i = 0; i < array.length; i++) {
//       if (array[i].username.includes(toMatch)) {
//         searchResults.push(array[i])
//       }
//     }
//     searchResults.sort((a,b) => (a.createdAt - b.createdAt))
//     resolve(searchResults)
//   })
//   return res
// }

// <-------------- User Search -------------->

// search function 
const relevantSearch = (array, search, oKey) => {
  let searchResults = []
  searchResults = array.filter(item => item[oKey].includes(search.toLowerCase))
  searchResults.sort((a, b) => (a.createdAt - b.createdAt))
  if (searchResults.length > 10) {
    return searchResults.slice(0, 10)
  }
  return searchResults
}

router.get('search/:search', (req, res) => {
  User.find({})
    .then(users => res.json(relevantSearch(users, req.params.username, 'username')))
    .catch(err => console.log(err))
})

router.get('search/:search', passport.authenticate('jwt'), (req, res) => {
  User.find({})
    .then(users => {
      let searchFollowing = relevantSearch(req.user.following, req.params.search, 'username')
      let searchAll = relevantSearch(users, req.params.username, 'username')
      res.json(searchFollowing.concat(searchAll).slice(0, 10))
    })
    .catch(err => console.log(err))
})


// <-------------- Post Search -------------->

// get all posts from following by most recent
router.get('/posts/following', passport.authenticate('jwt'), async (req, res) => {
  let followedUsers = req.user.following
  let feed = []
  let allFollowPosts = []
  // let followedPosts = []

  try {
    for (followed of followedUsers) {
      const userData = await User.findById(followed).populate({
        path: 'posts',
        model: 'Post',
        populate: {
          path: 'user',
          model: 'User'
        }
      })
      // followedPosts.push(userData.posts)
      feed = feed.concat(userData.posts)
    }
    feed.sort((a, b) => (b.created_On - a.created_On))

    // for (posts of followedPosts) {
    //   for (post of posts) {
    //     feed.push(post)
    //   }
    // }

    // feed.sort((a,b) => (b.created_On - a.created_On))

    res.json(feed)
  } catch (error) {
    console.log('unable to find following posts')
  }
})

// get all liked posts 
router.get('/posts/liked', passport.authenticate('jwt'), async (req, res) => {
  let likedPosts = req.user.liked_post

  let allLikedPosts = []

  try {
    for (post of likedPosts) {
      const postData = await Post.findById(post._id).populate(
        {
          path: 'user',
          model: 'User',
          select: 'username profile _id'
        },
        {
          path: 'comments',
          model: 'Comments',
          select: 'comment user _id',
          populate: {
            path: 'user',
            model: 'User',
            select: 'username profile _id'
          }
        }

      )
      allLikedPosts.push(postData)
    }
    allLikedPosts.sort((a, b) => (b.created_On - a.created_On))
    res.json(allLikedPosts)

  } catch (error) {
    console.log('unable to find liked posts')
  }
})



module.exports = router