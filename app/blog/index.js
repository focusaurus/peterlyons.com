var _ = require('lodash')
var async = require('async')
var CreatePost = require('./create-post-react').CreatePost
var createPost = require('./create-post')
var events = require('events')
var express = require('express')
var fs = require('fs')
var glob = require('glob')
var httpErrors = require('httperrors')
var log = require('bole')(__filename)
var markdown = require('marked')
var middleware = require('./middleware')
var path = require('path')
var Post = require('./post')
var presentPost = require('./present-post')
var server = require('react-dom/server')
var util = require('util')

var postLinks = {}

function loadPostMW (req, res, next) {
  var blog = res.app.locals.blog
  var post = new Post(blog)
  post.load(path.join(blog.basePath, req.path + '.json'), function (error) {
    if (error && error.code === 'ENOENT') {
      next(new httpErrors.NotFound(req.path))
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

function html (req, res, next) {
  if (!/\.html$/.test(res.contentPath)) {
    next()
    return
  }
  fs.readFile(res.contentPath, 'utf8', function (error, htmlText) {
    if (error && error.code === 'ENOENT') {
      next(new httpErrors.NotFound(req.path))
      return
    }
    res.locals.postContent = htmlText
    next(error)
  })
}

function markdownToHTML (req, res, next) {
  if (!/\.md$/.test(res.contentPath)) {
    next()
    return
  }
  fs.readFile(res.contentPath, 'utf8', function (error, markdownText) {
    if (error && error.code === 'ENOENT') {
      next(new httpErrors.NotFound(req.path))
      return
    }
    if (error) {
      next(error)
      return
    }
    res.locals.postContent = markdown(markdownText)
    next(error)
  })
}

function renderPost (req, res, next) {
  res.app.render('blog/view-post', res.locals, function (error, html2) {
    if (error) {
      next(error)
      return
    }
    res.locals.postContent = html2
    next()
  })
}

function previewMarkdown (req, res, next) {
  res.locals.postContent = markdown(req.text)
  next()
}

var convertMiddleware = [
  middleware.text,
  previewMarkdown,
  middleware.domify,
  middleware.flickr,
  middleware.youtube,
  middleware.undomify,
  middleware.send
]

var viewPostMiddleware = [
  loadPostMW,
  html,
  markdownToHTML,
  renderPost,
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

function feedRenderPost (req, res, post, callback) {
  var fakeRes = {
    post: post,
    contentPath: post.contentPath(),
    locals: _.cloneDeep(res.locals)
  }
  async.applyEachSeries([
    html,
    markdownToHTML,
    middleware.domify,
    middleware.flickr,
    middleware.youtube,
    middleware.undomify,
    function storeContent (req2, fakeRes2, next) {
      fakeRes2.post.content = fakeRes2.html
      next()
    }
  ], req, fakeRes, function (error) {
    if (error) {
      callback(error)
      return
    }
    callback(null, post)
  })
}

function feed (req, res, next) {
  var blog = res.app.locals.blog
  res.type('xml')
  if (blog.cachedFeedXML) {
    res.send(blog.cachedFeedXML)
    return
  }
  var recentPosts = blog.posts.slice(0, 10)
  var boundRender = feedRenderPost.bind(null, req, res)
  async.map(recentPosts, boundRender, function (error, renderedPosts) {
    if (error) {
      next(error)
      return
    }
    var locals = {
      pretty: true,
      posts: renderedPosts,
      hostname: req.hostname
    }
    res.app.render('blog/feed', locals, function (error2, feedXML) {
      if (error2) {
        next(error2)
        return
      }
      blog.cachedFeedXML = feedXML
      res.send(feedXML)
    })
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
      res.render('blog/post')
    })
    .post(createPost.handler)
  app.route('/post-react')
    .get(function (req, res) {
      var bodyHtml = server.renderToStaticMarkup(CreatePost)
      res.render('blog/create-post-react', {bodyHtml: bodyHtml})
    })
    .post(createPost.handler)
  app.post('/convert', convertMiddleware)
  app.get('/feed', feed)
  app.get('/flush-cache', flushCache)
  app.get(new RegExp('/\\d{4}/\\d{2}/\\w+'), viewPostMiddleware)
  app.use(function (req, res, next) {
    next(new httpErrors.NotFound(req.path))
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
