var Blog = require('./')
var expect = require('chaimel')
var testBlog = require('./testBlog')

describe('Blog constructor', function () {
  it('should accept and store options properly', function () {
    var options = {
      title: 'Unit Test Title',
      subtitle: 'Unit Test Subtitle',
      basePath: '/tmp/unit-test-base-path'
    }
    var blog = new Blog(options)
    expect(blog.title).toEqual(options.title)
    expect(blog.subtitle).toEqual(options.subtitle)
    expect(blog.basePath).toEqual(options.basePath)
  })
})

describe('a request for a non-existent blog post name', function () {
  it('should 404', function (done) {
    testBlog(function (ignore, request) {
      request.get('/utb/2014/01/no-such-post').expect(404).end(done)
    })
  })
})
