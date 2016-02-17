var cheerio = require('cheerio')
var expect = require('chaimel')
var request = require('supertest')(process.env.URL)
var testUtils = require('../test-utils')

var configs = [
  ['/app/photos?gallery=burning_man_2011', /Gallery/],
  ['/persblog', /travel/],
  ['/persblog/2007/10/hometown-dracula', /Randall/]
]

describe('blog smoke tests', function () {
  configs.forEach(function (config) {
    var uri = config[0]
    var regex = config[1]
    it('should load' + uri, function (done) {
      request.get(uri).expect(200).expect(regex).end(done)
    })
  })
})

describe('the photos page', function () {
  var $ = null

  before(function (done) {
    request
      .get('/app/photos?gallery=burning_man_2011')
      .expect(200)
      .end(function (error, res) {
        expect(error).notToExist()
        $ = cheerio.load(res.text)
        done(error)
      })
  })

  it('should have the photo surrounding structure', function () {
    testUtils.assertSelectors(
      $, 'h1#photo', 'figure', 'figcaption', '#nextPrev', 'a.thumbnail')
  })

  it('should redirect to the newest gallery', function (done) {
    request.get('/app/photos')
      .expect(302)
      .expect('Location', '/photos?gallery=burning_man_2011')
      .end(done)
  })
})
