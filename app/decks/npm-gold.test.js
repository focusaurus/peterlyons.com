const testUtils = require('../test-utils')
const request = require('../request')

describe('the NPM Gold Slide Deck', function () {
  let $ = null
  before(function (done) {
    request.loadPage('/npm-gold', function (error, dom) {
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
