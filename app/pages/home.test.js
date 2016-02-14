var testUtils = require('../testUtils')
var request = require('../request')

describe('the home page', function () {
  var $ = null

  before(function (done) {
    request.loadPage('/', function (error, dom) {
      $ = dom
      done(error)
    })
  })
  it('should have the intro material', function () {
    testUtils.assertSelectors($,
      'section.intro')
  })
})
