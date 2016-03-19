var request = require('../request')
var testUtils = require('../test-utils')

describe('the Rapid Feedback Slide Deck', function () {
  var $ = null
  before(function (done) {
    request.loadPage('/rapid-feedback', function (error, dom) {
      $ = dom
      done(error)
    })
  })

  it('should be a slide deck', function () {
    testUtils.assertDeck($)
  })

  it('should mention some ruby stuff', function () {
    testUtils.assertSubstrings($, 'ruby', 'rails', 'stackoverflow')
  })
})
