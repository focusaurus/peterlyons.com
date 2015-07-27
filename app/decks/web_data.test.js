var testUtils = require('app/testUtils')

describe('the Web Data Slide Deck', function () {
  var $ = null
  before(function (done) {
    testUtils.loadPage('/web_data', function (error, dom) {
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
