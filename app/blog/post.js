const _ = require('lodash')
const {promisify} = require('util')
const fs = require('fs')
const join = require('path').join
const markdown = require('marked')
const moment = require('moment')
const slug = require('./slug')

const mkdirpAsync = promisify(require('mkdirp'))
const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)

/* eslint camelcase:0 */
function Post (blog, title, publish_date, format) {
  this.blog = blog
  this.title = title
  this.publish_date = publish_date
  this.format = format
  this.name = slug(this.title)
}

Post.prototype._monthPath = function _monthPath () {
  const publishMoment = moment(this.publish_date)
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

Post.prototype.loadMetadata = async function (metadataPath, callback) {
  this.metadataPath = metadataPath
  const jsonString = await readFileAsync(metadataPath, 'utf8')
  const metadata = JSON.parse(jsonString)
  _.extend(this, metadata)
  this.publish_date = new Date(this.publish_date)
  // load next, previous links
  Object.assign(this, this.blog.postLinks[this.uri()])
}

Post.prototype.load = async function (metadataPath, callback1) {
  await this.loadMetadata(metadataPath)
  const noExt = this.metadataPath.substr(0, this.metadataPath.lastIndexOf('.'))
  const contentPath = noExt + '.' + this.format
  this.content = await readFileAsync(contentPath, 'utf8')
  if (this.format === 'md') {
    this.content = markdown(this.content)
  }
  return this
}

Post.prototype.save = async function (callback) {
  await mkdirpAsync(this.dirPath())
  const metadataJson = JSON.stringify(this.metadata(), null, 2)
  return Promise.all([
    writeFileAsync(this.contentPath(), this.content),
    writeFileAsync(this.metadataPath(), metadataJson)
  ])
}

module.exports = Post

// if (module === require.main) {
//   const Blog = require('./')
//   var options = {
//     title: 'Unit Test Title',
//     subtitle: 'Unit Test Subtitle',
//     basePath: './unit-test-blog1'
//   }
//   const blog = new Blog(options)
//   const post = new Post(blog, 'Unit Test Post 1', new Date(2015, 11, 1), 'md')
//   post.load(__dirname + '/unit-test-blog1/2015/12/unit-test-post-1.json')
//   .then(() => {
//     console.log('post.content', post.content)
//   })
//   .catch(console.log)
//   const post2 = new Post(blog, 'Dev Post 1', new Date(), 'md')
//   post2.content = '# title\nhi'
//   post2.save().then(() => {
//     console.log('save done') // fixme
//   }).catch(console.error)
// }
