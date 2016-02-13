var expect = require('chaimel')
var testBlog = require('./testBlog')

describe('a blog post page', function () {
  var $
  before(function (done) {
    testBlog.loadPage('/utb/2015/12/unit-test-post-1', function (error, dom) {
      $ = dom
      done(error)
    })
  })

  it('should have the post title', function () {
    expect($('title').text()).toMatch(/Unit Test Post 1/i)
  })

  it('should have the post content', function () {
    expect($('article').text()).toMatch(/Unit Test Post 1 Content/i)
  })

  it('should have a link to the blog index', function () {
    expect($('a.blogIndex').attr('href')).toEqual('/utb')
  })

  it('first post should NOT have a link to previous', function () {
    expect($('a.previous').length).toEqual(0)
  })

  it('should have a link to the next post', function () {
    expect($('a.next').attr('href')).toEqual('/utb/2015/12/unit-test-post-2')
  })

  it('should process a flickr tag', function () {
    expect($('flickr')).toHaveLength(0)
    expect($('iframe')).notToHaveLength(0)
  })

  it('should process a youtube tag', function () {
    expect($('youtube')).toHaveLength(0)
    expect($('iframe')).notToHaveLength(0)
  })

  it('should have disqus comments', function () {
    expect($('#disqus_thread').length).toEqual(1)
  })
})

describe('the most recent blog post', function () {
  var $
  before(function (done) {
    testBlog.loadPage('/utb/2016/01/unit-test-post-11', function (error, dom) {
      $ = dom
      done(error)
    })
  })

  it('should have the post title', function () {
    expect($('title').text()).toMatch(/Unit Test Post 11/i)
  })

  it('should have a link to the blog index', function () {
    expect($('a.blogIndex').attr('href')).toEqual('/utb')
  })

  it('should have a link to the previous post', function () {
    expect($('a.previous').attr('href'))
      .toEqual('/utb/2016/01/unit-test-post-10')
  })

  it('last post should NOT have a link to next', function () {
    expect($('a.next').length).toEqual(0)
  })
})

describe('a blog post in the middle', function () {
  var $
  before(function (done) {
    testBlog.loadPage('/utb/2015/12/unit-test-post-2', function (error, dom) {
      $ = dom
      done(error)
    })
  })

  it('should have the post title', function () {
    expect($('title').text()).toMatch(/Unit Test Post 2/i)
  })

  it('should have a link to the blog index', function () {
    expect($('a.blogIndex').attr('href')).toEqual('/utb')
  })

  it('should have a link to the previous post', function () {
    expect($('a.previous').attr('href'))
      .toEqual('/utb/2015/12/unit-test-post-1')
  })

  it('should have a link to the next post', function () {
    expect($('a.next').attr('href'))
      .toEqual('/utb/2015/12/unit-test-post-3')
  })
})
