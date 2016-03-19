var request = require('../request')
var testUtils = require('../test-utils')

describe('the jsDebug', function () {
  var $ = null

  before(function (done) {
    request.loadPage('/js-debug', function (error, dom) {
      $ = dom
      done(error)
    })
  })

  it('should have the screencast youtube video', function () {
    testUtils.assertSelectors($, 'iframe', 'button.stepSync')
  })

  it('should redirect /jsDebug to /js-debug', function (done) {
    request.get('/jsDebug')
      .expect(301)
      .expect('Location', '/js-debug')
      .end(done)
  })
})
