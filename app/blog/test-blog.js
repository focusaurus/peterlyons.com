var Blog = require('./')
var cheerio = require('cheerio')
var express = require('express')
var join = require('path').join
var supertest = require('supertest')

var app = express()

function testBlog (callback) {
  var blog = new Blog({
    basePath: join(__dirname, 'unit-test-blog1'),
    staticPath: join(__dirname, 'unit-test-blog1'),
    title: 'Unit Test Blog 1',
    prefix: '/utb',
    subtitle: 'Unit Test Subtitle 1'
  })
  // crap coupling here. Sorry.
  blog.app.locals.analytics = {
    enabled: false
  }
  blog.app.locals.titleSuffix = 'Unit Test Title Suffix'

  app.use('/utb', blog.app)
  blog.app.use(function (error, req, res, next) {
    res.status(error.statusCode).send(error.message)
  })
  blog.on('ready', function () {
    var request = supertest(app)
    callback(null, request, blog)
  })
}

testBlog.loadPage = function loadPage (uri, callback) {
  testBlog(function (_, request, blog) {
    request.get(uri).expect(200).end(function (error, res) {
      if (error) {
        callback(error)
        return
      }
      var $ = cheerio.load(res.text)
      callback(null, $, request, blog)
    })
  })
}

module.exports = testBlog
