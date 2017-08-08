var Blog = require('./')
var cheerio = require('cheerio')
var express = require('express')
var join = require('path').join
var supertest = require('supertest')

var app = express()
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
const request = supertest(app)

blog.loadPage = async function loadPage (uri, callback) {
  return request.get(uri).expect(200).then(function (res) {
    return cheerio.load(res.text)
  })
}
blog.request = request

module.exports = blog
