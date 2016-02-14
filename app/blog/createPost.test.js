var bcrypt = require('bcryptjs')
var createPost = require('./createPost')
var expect = require('chaimel')
var testBlog = require('./testBlog')
var testUtils = require('../testUtils')

describe('createPost.verifyPassword', function () {
  var password = 'unit test blog password'
  /* eslint no-sync:0 */
  var salt = bcrypt.genSaltSync(10)
  var hash = bcrypt.hashSync(password, salt)

  it('should callback without error with correct password', function (done) {
    createPost.verifyPassword(password, hash, function (error) {
      expect(error).notToExist()
      done()
    })
  })
})

describe('the blog post authoring/preview page', function () {
  var $ = null
  before(function (done) {
    testBlog.loadPage('/utb/post', function (error, dom) {
      $ = dom
      done(error)
    })
  })
  it('should have a preview section and a textarea', function () {
    testUtils.assertSelectors($, 'section.preview', 'textarea')
  })
})
