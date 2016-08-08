const testUtils = require('../test-utils')
const request = require('../request')

describe('the home page', function () {
  let $ = null

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
