require('./blogsAreLoaded.test') // needed to make sure content is loaded
var cheerio = require('cheerio')
var expect = require('chaimel')
var testUtils = require('app/testUtils')

describe('a blog post page', function () {
  var $ = null
  before(function (done) {
    testUtils.loadPage('/persblog/2012/06/apogaea', function (error, dom) {
      $ = dom
      done(error)
    })
  })
  it('should have the post title', function () {
    expect($('title').text()).toMatch(/apogaea/i)
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

describe('a blog index page', function () {
  var $ = null
  before(function (done) {
    testUtils.loadPage('/problog', function (error, dom) {
      $ = dom
      done(error)
    })
  })
  it('should have nicely formatted dates', function () {
    expect($('.postDate')).notToHaveLength(0)
    var date = $('.postDate').last().html()
    expect(date).toMatch(/Mar 14, 2009/)
  })
})

describe('the preview converter', function () {
  it('should convert markdown to HTML', function (done) {
    testUtils.post('/convert')
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
    testUtils.post('/convert')
      /* eslint max-len:0 */
      .send('<youtube href="http://www.youtube.com/embed/K27MA8v91D4"></youtube>\n<flickrshow href="https://www.flickr.com/photos/88096431@N00/sets/72157645234728466/"></flickrshow>')
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

describe('the blog post authoring/preview page', function () {
  var $ = null
  before(function (done) {
    testUtils.loadPage('/persblog/post', function (error, dom) {
      $ = dom
      done(error)
    })
  })
  it('should have a preview section and a textarea', function () {
    testUtils.assertSelectors($, 'section.preview', 'textarea')
  })
})

describe('a request for a non-existent blog post name', function () {
  it('should 404', function () {
    testUtils.get('/persblog/2014/01/no-such-post').expect(404)
  })
})

describe('a blog feed XML', function () {
  var $ = null
  before(function (done) {
    testUtils.loadPage('/problog/feed', function (error, dom) {
      $ = dom
      done(error)
    })
  })

  it('should have an atom XML feed tag', function () {
    expect($('feed').length).toEqual(1)
  })

  it('should have the right feed > title content', function () {
    expect($('feed > title').text()).toEqual('Pete\'s Points')
  })

  it('should have 10 recent posts', function () {
    expect($('entry').length).toEqual(10)
  })

  it('should have the author', function () {
    expect($('author > name').text()).toEqual('Peter Lyons')
  })
})
