var request = require('./request')

describe('personal URLs should redirect to .org', function () {
  var pages = [
    '/app/photos',
    '/bands',
    '/favorites',
    '/oberlin',
    '/persblog',
    '/photos'
  ]
  pages.forEach(function (page) {
    it(page + ' should redirect to .org', function (done) {
      request
        .get(page)
        .expect(301)
        .expect('location', 'http://peterlyons.org' + page)
        .end(done)
    })
  })
})
