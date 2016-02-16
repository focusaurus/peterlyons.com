var request = require('../request')
var testUtils = require('../test-utils')

describe('the Web Data Slide Deck', function () {
  var $ = null
  before(function (done) {
    request.loadPage('/web-data', function (error, dom) {
      $ = dom
      done(error)
    })
  })

  it('should be a slide deck', function () {
    testUtils.assertDeck($)
  })

  it('should mention some DBs', function () {
    testUtils.assertSubstrings($, 'Oracle', 'SQL Server', 'Dynamo')
  })
})
