var _ = require('lodash')
var CreatePost = require('./create-post-react')
var errors = require('httperrors')
var events = require('events')
var express = require('express')
var glob = require('glob')
var log = require('bole')(__filename)
var path = require('path')
var Post = require('./post')
var presentPost = require('./present-post')
var React = require('react')
var server = require('react-dom/server')
var util = require('util')
var viewPost = require('./view-post')

var globAsync = util.promisify(glob)

function flushCache (req, res, next) {
  var blog = res.app.locals.blog
  log.info('flushing blog cache', {title: blog.title})
  blog.load()
  res.redirect(blog.prefix)
}

function Blog (options) {
  if (!(this instanceof Blog)) {
    return new Blog()
  }
  events.EventEmitter.call(this)
  _.extend(this, _.pick(options,
    'title',
    'subtitle',
    'basePath',
    'prefix',
    'staticPath'))
  this.basePath = path.normalize(this.basePath)
  this.staticPath = this.staticPath && path.normalize(this.staticPath)
  this.postLinks = {}
  var app = this.app = express()
  app.locals.blog = this
  app.set('view engine', 'pug')
  app.set('views', path.join(__dirname, '..'))
  app.get('/', function renderIndex (req, res) {
    res.locals.posts = res.app.locals.blog.posts
    res.render('blog/index')
  })
  app.route('/post')
    .get(function (req, res) {
      var element = React.createElement(CreatePost)
      var bodyHtml = server.renderToStaticMarkup(element)
      res.render('blog/create-post', {bodyHtml: bodyHtml})
    })
    .post(require('./create-post-routes').handler)
  app.post('/convert', viewPost.viewDraft)
  app.get('/feed', require('./feed-route'))
  app.get('/flush-cache', flushCache)
  app.get(new RegExp('/\\d{4}/\\d{2}/\\w+'), viewPost.viewPublished)
  if (this.staticPath) {
    app.use(express.static(this.staticPath))
  }
  app.use(function (req, res, next) {
    next(new errors.NotFound(req.path))
  })
  app.use(require('../errors/error-handler'))
  this.load()
}
util.inherits(Blog, events.EventEmitter)

Blog.prototype.load = async function load () {
  delete this.cachedFeedXML
  const self = this
  const files = await globAsync(this.basePath + '/**/*.json')
  async function loadPost (file, callback) {
    var post = new Post(self)
    await post.load(file)
    post.presented = presentPost(post)
    return post
  }
  let posts = await Promise.all(files.map(loadPost))
  posts = _.sortBy(posts, 'publish_date').reverse()
  posts.forEach((post, index) => {
    /* eslint no-ternary:0 */
    this.postLinks[post.uri()] = {
      next: index > 0 ? posts[index - 1] : null,
      previous: index < posts.length ? posts[index + 1] : null
    }
  })
  this.posts = posts
}

module.exports = Blog
