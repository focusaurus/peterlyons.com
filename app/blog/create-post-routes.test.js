var bcrypt = require('bcryptjs')
var createPost = require('./create-post-routes')
var expect = require('chaimel')
var testBlog = require('./test-blog')
var testUtils = require('../test-utils')

describe('createPost.verifyPasswordAsync', function () {
  var password = 'unit test blog password'
  /* eslint-disable no-sync */
  var salt = bcrypt.genSaltSync(10)
  var hash = bcrypt.hashSync(password, salt)

  it('should callback without error with correct password', async function () {
    await createPost.verifyPasswordAsync(password, hash)
  })

  it('should throw exception with incorrect password', async function () {
    try {
      await createPost.verifyPasswordAsync(password + 'NOPE', hash)
    } catch (error) {
      expect(error).toBeError()
    }
  })
})

describe('the blog post authoring/preview page', function () {
  let $ = null
  before(async function () {
    await testBlog.load()
    $ = await testBlog.loadPage('/utb/post')
  })

  it('should have a preview section and a textarea', function () {
    testUtils.assertSelectors($, 'section.preview', 'textarea')
  })
})
