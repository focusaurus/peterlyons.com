var request = require('../request')
var expect = require('chaimel')
var testUtils = require('app/testUtils')

describe('the Leveling Up article', function () {
  var $ = null
  before(function (done) {
    request.loadPage('/leveling_up', function (error, dom) {
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
