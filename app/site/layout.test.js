var _ = require('lodash')
var config = require('config3')
var expect = require('chaimel')
var pack = require('../../package')
var request = require('../request')
var testUtils = require('../test-utils')

describe('the main layout', function () {
  var $ = null
  before(function (done) {
    request.loadPage('/', function (error, dom) {
      $ = dom
      done(error)
    })
  })
  it('should have the google fonts', function () {
    var selector = 'link[rel=stylesheet]'
    testUtils.assertSelectors($, selector)
    var hrefs = []
    $(selector).each(function (index, item) {
      hrefs.push($(item).attr('href'))
    })
    expect(_.some(hrefs, function (href) {
      return href.indexOf('fonts.googleapis.com') >= 0
    })).toBeTrue()
  })

  it('should have the key structural elements', function () {
    testUtils.assertSelectors($,
      'header h1', 'body .content', 'nav.site', '.license')
  })

  it('should have the normal title', function () {
    expect($('title').text()).toEqual('Peter Lyons: node.js expert consultant')
  })

  it('should include the javascript with cachebusting', function () {
    testUtils.assertSelectors(
      $, "script[src='/plws.js?v=" + pack.version + "']")
  })

  it('should have the browserified JavaScript', function (done) {
    request.get('/plws.js?v=' + pack.version)
      .expect(200)
      .expect('Content-Type', 'application/javascript')
      .expect('Content-Encoding', 'gzip')
      .end(done)
  })

  it('should include HTML comment with app version', function () {
    testUtils.assertSelectors($, 'meta[name=x-app-version]')
    expect($('meta[name=x-app-version]').attr('content')).toEqual(pack.version)
  })
})

describe('analytics snippet', function () {
  before(function () {
    config.analytics.enabled = true
    config.analytics.code = 'UNIT_TEST'
  })

  after(function () {
    config.analytics.enabled = false
    config.analytics.code = ''
  })

  it('should include the analytics snippet when enabled', function (done) {
    request.loadPage('/', function (error, $) {
      expect(error).notToExist()
      var selector = 'script[data-id=analytics]'
      testUtils.assertSelectors($, selector)
      expect($(selector).text()).to.include('UNIT_TEST')
      done()
    })
  })
})
