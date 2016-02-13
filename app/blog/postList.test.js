var testBlog = require('./testBlog')
var expect = require('chaimel')

describe('a blog post list page', function () {
  var $ = null
  before(function (done) {
    testBlog.loadPage('/utb', function (error, dom) {
      $ = dom
      done(error)
    })
  })

  it('should have nicely formatted dates', function () {
    expect($('.postDate')).notToHaveLength(0)
    var date = $('.postDate').last().html()
    expect(date).toMatch(/Dec 01, 2015/)
  })

  it('should include all the posts', function () {
    expect($('.postTitle').length).toEqual(11)
  })
})
