var _ = require('lodash')
var async = require('async')
var fs = require('fs')
var join = require('path').join
var markdown = require('marked')
var mkdirp = require('mkdirp')
var moment = require('moment')
var slug = require('./slug')

/* eslint camelcase:0 */
function Post (blog, title, publish_date, format) {
  this.blog = blog
  this.title = title
  this.publish_date = publish_date
  this.format = format
  this.name = slug(this.title)
}

Post.prototype._monthPath = function _monthPath () {
  var publishMoment = moment(this.publish_date)
  return join(publishMoment.format('YYYY'), publishMoment.format('MM'))
}

Post.prototype.dirPath = function () {
  return join(this.blog.basePath, this._monthPath())
}

Post.prototype.contentPath = function () {
  return join(this.dirPath(), this.name + '.' + this.format)
}

Post.prototype.metadataPath = function () {
  return join(this.dirPath(), this.name + '.json')
}

Post.prototype.uri = function () {
  return join(this.blog.prefix, this._monthPath(), this.name)
}

Post.prototype.metadata = function () {
  return {
    publish_date: this.publish_date,
    name: this.name,
    title: this.title,
    format: this.format
  }
}

Post.prototype.loadMetadata = function (metadataPath, callback) {
  var self = this
  this.metadataPath = metadataPath
  fs.readFile(metadataPath, 'utf8', function (error, jsonString) {
    if (error) {
      callback(error)
      return
    }
    var metadata
    try {
      metadata = JSON.parse(jsonString)
    } catch (parseError) {
      callback(parseError)
      return
    }
    _.extend(self, metadata)
    self.publish_date = new Date(self.publish_date)
    callback()
  })
}

Post.prototype.load = function (metadataPath, callback1) {
  var self = this
  this.metadataPath = metadataPath

  function loadContent (callback) {
    var noExt = self.metadataPath.substr(0, self.metadataPath.lastIndexOf('.'))
    var contentPath = noExt + '.' + self.format
    fs.readFile(contentPath, 'utf8', function (error, content) {
      if (error) {
        callback(error)
        return
      }
      self.content = content
      if (self.format === 'md') {
        self.content = markdown(content)
      }
      callback()
    })
  }

  async.series([
    self.loadMetadata.bind(self, metadataPath),
    loadContent],
    callback1)
}

Post.prototype.save = function (callback) {
  var self = this
  var contentPath = join(this.blog.basePath, this.contentPath())
  var metadataPath = join(this.blog.basePath, this.metadataPath())
  mkdirp(this.dirPath(), function (error) {
    var work
    if (error) {
      return callback(error)
    }
    work = [
      async.apply(fs.writeFile, contentPath, self.content),
      async.apply(
        fs.writeFile, metadataPath, JSON.stringify(self.metadata(), null, 2))
    ]
    async.parallel(work, function (error2) {
      if (error2) {
        return callback(error2)
      }
      return callback(null, self)
    })
  })
}

module.exports = Post
