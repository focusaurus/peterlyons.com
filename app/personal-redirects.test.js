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

  it('should maintain photo gallery path and query', function (done) {
    var page = '/app/photos?gallery=fall_2009&photo=020_paint_and_blinds'
    request
      .get(page)
      .expect(301)
      .expect('location', 'http://peterlyons.org' + page)
      .end(done)
  })
})
