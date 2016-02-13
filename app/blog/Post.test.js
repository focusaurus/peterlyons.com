var expect = require('chaimel')
var Post = require('./Post')

var blog = {
  basePath: '/tmp/unit-test-blog',
  prefix: '/unit-test-blog'
}

var publishDate = new Date(2014, 0, 31)
var post = new Post(
  blog,
  'Unit Test Title',
  publishDate,
  'md'
)

describe('Post model class', function () {
  it('should store constructor props and compute slug', function () {
    expect(post.title).toEqual('Unit Test Title')
    expect(post.publish_date).toEqual(publishDate)
    expect(post.name).toEqual('unit-test-title')
  })

  it('metadata should return the right fields', function () {
    var metadata = post.metadata()
    expect(metadata.format).toEqual('md')
    expect(metadata.title).toEqual('Unit Test Title')
    expect(metadata.publish_date).toEqual(publishDate)
    expect(metadata.name).toEqual('unit-test-title')
  })

  it('dirPath should be correct', function () {
    expect(post.dirPath()).toEqual('/tmp/unit-test-blog/2014/01')
  })
  it('contentPath should be correct', function () {
    expect(post.contentPath())
      .toEqual('/tmp/unit-test-blog/2014/01/unit-test-title.md')
  })

  it('metadataPath should be correct', function () {
    expect(post.metadataPath()).toEqual(
      '/tmp/unit-test-blog/2014/01/unit-test-title.json')
  })

  it('URI should be correct', function () {
    expect(post.uri()).toEqual('/unit-test-blog/2014/01/unit-test-title')
  })
})
