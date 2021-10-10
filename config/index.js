module.exports = async function syncDB() {
  await require('mongoose').connect(process.env.MONGODB_URI || 'mongodb://localhost/grams')
}