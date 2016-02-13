var testUtils = require('../../testUtils')

describe('the photos page', function () {
  var $ = null

  before(function (done) {
    var url = '/app/photos?gallery=burning_man_2011'
    testUtils.loadPage(url, function (error, dom) {
      $ = dom
      done(error)
    })
  })

  it('should have the photo surrounding structure', function () {
    testUtils.assertSelectors(
      $, 'h1#photo', 'figure', 'figcaption', '#nextPrev', 'a.thumbnail')
  })

  it('should redirect to the newest gallery', function (done) {
    testUtils.get('/app/photos')
      .expect(302)
      .expect('location', '/app/photos?gallery=burning_man_2011')
      .end(done)
  })
})
