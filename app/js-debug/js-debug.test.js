var request = require('../request')
var testUtils = require('../test-utils')

describe('the jsDebug', function () {
  var $ = null

  before(function (done) {
    request.loadPage('/jsDebug', function (error, dom) {
      $ = dom
      done(error)
    })
  })

  it('should have the screencast youtube video', function () {
    testUtils.assertSelectors($, 'iframe', 'button.stepSync')
  })
})
