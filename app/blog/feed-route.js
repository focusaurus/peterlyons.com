var _ = require('lodash')
var async = require('async')
var middleware = require('./middleware')

function feedRenderPost (req, res, post, callback) {
  var fakeRes = {
    post: post,
    contentPath: post.contentPath(),
    locals: _.cloneDeep(res.locals)
  }
  async.applyEachSeries([
    middleware.html,
    middleware.markdownToHTML,
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

module.exports = feed
