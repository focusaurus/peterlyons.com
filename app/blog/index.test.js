var Blog = require('./')
var cheerio = require('cheerio')
var expect = require('chaimel')
var testBlog = require('./test-blog')

before(() => testBlog.load())

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
  it('should 404', function () {
    return testBlog.request.get('/utb/2014/01/no-such-post').expect(404)
  })
})

describe('a static image request', function () {
  it('should 200', function () {
    return testBlog.request
        .get('/utb/images/one.png')
        .expect(200)
        .expect('Content-Type', 'image/png')
  })
})

describe('the preview converter', function () {
  it('should convert markdown to HTML', function (done) {
    testBlog.request.post('/utb/convert')
      .send('# Header One')
      .set('Content-Type', 'text/x-markdown')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function (error, res) {
        expect(error).notToExist()
        expect('<h1 id="header-one">Header One</h1>').toEqual(res.text.trim())
        done()
      })
  })

  it('should have the flickr & youtube pipeline middleware', function (done) {
    testBlog.request.post('/utb/convert')
      .send('<youtube href="http://www.youtube.com/embed/K27MA8v91D4"></youtube>\n<flickrshow href="https://www.flickr.com/photos/88096431@N00/sets/72157645234728466/"></flickrshow>') // eslint-disable-line max-len
      .set('Content-Type', 'text/x-markdown')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function (error, res) {
        expect(error).notToExist()
        var $ = cheerio.load(res.text)
        expect($('youtube')).toHaveLength(0)
        expect($('iframe')).toHaveLength(2)
        expect($('flickrshow')).toHaveLength(0)
        expect($('object')).toHaveLength(0)
        done()
      })
  })
})
