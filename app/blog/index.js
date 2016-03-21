var _ = require('lodash')
var async = require('async')
var CreatePost = require('./create-post-react')
var errors = require('httperrors')
var events = require('events')
var express = require('express')
var glob = require('glob')
var log = require('bole')(__filename)
var middleware = require('./middleware')
var path = require('path')
var Post = require('./post')
var presentPost = require('./present-post')
var React = require('react')
var server = require('react-dom/server')
var util = require('util')

var postLinks = {}

function loadPostMW (req, res, next) {
  var blog = res.app.locals.blog
  var post = new Post(blog)
  post.load(path.join(blog.basePath, req.path + '.json'), function (error) {
    if (error && error.code === 'ENOENT') {
      next(new errors.NotFound(req.path))
      return
    }
    if (error) {
      next(error)
      return
    }
    res.locals.post = post
    post.presented = presentPost(post)
    var links = postLinks[post.uri()]
    post.previous = links.previous
    post.next = links.next
    res.contentPath = post.contentPath()
    next()
  })
}

var viewPostMiddleware = [
  loadPostMW,
  middleware.html,
  middleware.markdownToHTML,
  middleware.renderPost,
  middleware.domify,
  middleware.flickr,
  middleware.youtube,
  middleware.undomify,
  middleware.send
]

function loadPost (blog, file, callback) {
  var post = new Post(blog)
  post.load(file, function (error) {
    if (error) {
      callback(error)
      return
    }
    post.presented = presentPost(post)
    callback(null, post)
  })
}

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
  _.extend(this, _.pick(options, 'title', 'subtitle', 'basePath', 'prefix'))
  this.basePath = path.normalize(this.basePath)
  var app = this.app = express()
  app.locals.blog = this
  app.set('view engine', 'jade')
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
  app.post('/convert', middleware.convert)
  app.get('/feed', require('./feed-route'))
  app.get('/flush-cache', flushCache)
  app.get(new RegExp('/\\d{4}/\\d{2}/\\w+'), viewPostMiddleware)
  app.use(function (req, res, next) {
    next(new errors.NotFound(req.path))
  })
  app.use(require('../errors/error-handler'))
  this.load()
}
util.inherits(Blog, events.EventEmitter)

Blog.prototype.load = function load () {
  var self = this
  delete this.cachedFeedXML
  glob(this.basePath + '/**/*.json', function (error, files) {
    if (error) {
      self.emit('error', error)
      return
    }
    var boundLoad = loadPost.bind(null, self)
    async.map(files, boundLoad, function (error2, posts) {
      if (error2) {
        self.emit('error', error2)
        return
      }
      posts = _.sortBy(posts, function (post) {
        return post.publish_date
      }).reverse()
      posts.forEach(function (post, index) {
        /* eslint no-ternary:0 */
        postLinks[post.uri()] = {
          next: index > 0 ? posts[index - 1] : null,
          previous: index < posts.length ? posts[index + 1] : null
        }
      })
      self.posts = posts
      self.emit('ready')
    })
  })
}

module.exports = Blog
