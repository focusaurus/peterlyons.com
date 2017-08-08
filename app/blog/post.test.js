var expect = require('chaimel')
var fs = require('fs')
var mktmp = require('mktmp')
var Post = require('./post')

/* eslint-disable no-sync */
var basePath = mktmp.createDirSync('unit-test-blog-XXXX')

var blog = {
  basePath: basePath,
  prefix: '/unit-test-blog'
}

var publishDate = new Date(2014, 0, 31)
var post = new Post(
  blog,
  'Unit Test Title',
  publishDate,
  'md'
)
post.content = '# Unit Test Post Content\n'

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
    expect(post.dirPath()).toEqual(basePath + '/2014/01')
  })

  it('contentPath should be correct', function () {
    expect(post.contentPath()).toEqual(basePath + '/2014/01/unit-test-title.md')
  })

  it('metadataPath should be correct', function () {
    expect(post.metadataPath())
      .toEqual(basePath + '/2014/01/unit-test-title.json')
  })

  it('URI should be correct', function () {
    expect(post.uri()).toEqual('/unit-test-blog/2014/01/unit-test-title')
  })

  it('should handle non-existent metadata correctly', function () {
    var post = new Post()
    return post.loadMetadata('/tmp/no-such-metadata.json')
    .catch(function (error) {
      expect(error).toBeAnInstanceOf(Error)
      expect(error.code).toEqual('ENOENT')
    })
  })

  it('should save properly', function () {
    return post.save()
    .then(() => {
      var content = fs.readFileSync(post.contentPath(), 'utf-8')
      expect(content).toEqual('# Unit Test Post Content\n')
      var metadataString = fs.readFileSync(post.metadataPath(), 'utf-8')
      var metadata = JSON.parse(metadataString)
      expect(metadata).toHaveProperty('format', 'md')
      expect(metadata).toHaveProperty('name', 'unit-test-title')
      expect(metadata).toHaveProperty('title', 'Unit Test Title')
      expect(metadata).toHaveProperty('publish_date')
    })
  })
})
