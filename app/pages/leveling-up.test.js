const request = require('../request')
const expect = require('chaimel')
const testUtils = require('../test-utils')

describe('the Leveling Up article', function () {
  let $ = null
  before(function (done) {
    request.loadPage('/leveling-up', function (error, dom) {
      $ = dom
      done(error)
    })
  })

  it('should have the proper content', function () {
    testUtils.assertSelectors($, '#pillar1', '#pillar2', '#pillar3')
    testUtils.assertSubstrings($, 'operating system', 'thousands')
  })

  it('should have the proper title', function () {
    expect($('title').text()).toMatch(/Leveling Up/)
  })
})
