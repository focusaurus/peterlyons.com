const request = require('../request')
const testUtils = require('../test-utils')

describe('the Rapid Feedback Slide Deck', function () {
  let $ = null
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
