module.exports = require('mongoose').connect(process.env.MONGODB_URI || 'mongodb://localhost/grams', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})