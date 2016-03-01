#!/usr/bin/env mocha --reporter spec
/* eslint-env mocha */
process.env.NODE_ENV = 'test'
var htmlValidator = require('html-validator')

function makeTest (request, configs) {
  describe('The HTML of each page', function () {
    configs.forEach(function (testConfig) {
      var URI = testConfig[0]
      it(URI + ' should be valid HTML5 according to the W3C', function (done) {
        this.slow(5000)
        this.timeout(9000)
        request.get(URI).expect(200).end(function (error, res) {
          if (error) {
            done(error)
            return
          }
          var options = {
            format: 'text',
            data: res.text
          }
          htmlValidator(options, done)
        })
      })
    })
  })
}

makeTest(require('../app/request'), require('../app/test-configs'))
makeTest(
  require('../app/personal/request'), require('../app/personal/test-configs'))
