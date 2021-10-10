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

module.exports = router