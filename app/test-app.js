var expect = require('chaimel')
var cheerio = require('cheerio')
var supertest = require('supertest')

function testApp (app) {
  var request = supertest(app)
  function loadPage (URL, callback) {
    request.get(URL).expect(200).end(function (error, res) {
      if (error) {
        callback(error)
        return
      }
      var $ = cheerio.load(res.text)
      callback(null, $)
    })
  }

  function get (URL) {
    return request.get(URL)
  }

  function post (URL) {
    return request.post(URL)
  }

  /* eslint no-unused-vars:0 */
  function pageContains (_url, _phraseVarArgs, _done) {
    var phrases = Array.prototype.slice.call(arguments)
    var url = phrases.shift()
    var done = phrases.pop()

    request.get(url).expect(200).end(function (error, res) {
      if (error) {
        done(error)
        return
      }
      phrases.forEach(function (phrase) {
        if (typeof phrase === 'string') {
          expect(res.text).toInclude(
            phrase, 'Document missing phrase ' + phrase + res.text)
        } else {
          // regex
          expect(res.text).toMatch(
            phrase, 'Document does not match ' + phrase.pattern)
        }
      })
      done(null, cheerio.load(res.text))
    })
  }

  function smoke (testConfigs) {
    describe('smoke tests for most pages on the site', function () {
      testConfigs.forEach(function (testConfig) {
        var URI = testConfig[0]
        var regex = testConfig[1]
        it(URI + ' should match ' + regex, function (done) {
          pageContains(URI, regex, done)
        })
      })
      it('should have a 404 page', function (done) {
        get('/should-cause-a-404').expect(404).end(done)
      })
    })
  }

  return {
    get: get,
    post: post,
    loadPage: loadPage,
    pageContains: pageContains,
    smoke: smoke
  }
}

module.exports = testApp
