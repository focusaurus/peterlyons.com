var testBlog = require('./test-blog')
var expect = require('chaimel')
var cheerio = require('cheerio')

describe('the preview converter', function () {
  var request
  before(function (done) {
    testBlog(function (error, req) {
      request = req
      done(error)
    })
  })
  it('should convert markdown to HTML', function (done) {
    request.post('/utb/convert')
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
    request.post('/utb/convert')
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
