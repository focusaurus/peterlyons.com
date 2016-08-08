const request = require('../request')
const testUtils = require('../test-utils')

describe('the Twelve-Factor node.js slide deck', function () {
  let $ = null
  before(function (done) {
    request.loadPage('/twelve-factor-nodejs', function (error, dom) {
      $ = dom
      done(error)
    })
  })

  it('should be a slide deck', function () {
    testUtils.assertDeck($)
  })

  it('should mention some relevant words', function () {
    testUtils.assertSubstrings($, 'bole', 'systemd', 'config3')
  })
})
