var testUtils = require('../test-utils')
var request = require('../request')

describe('the NPM Gold Slide Deck', function () {
  var $ = null
  before(function (done) {
    request.loadPage('/npm_gold', function (error, dom) {
      $ = dom
      done(error)
    })
  })

  it('should be a slide deck', function () {
    testUtils.assertDeck($)
  })

  it('should mention some packages', function () {
    testUtils.assertSubstrings($, 'lodash', 'moment.js', 'cheerio')
  })
})
