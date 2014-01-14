_ = require "lodash"
async = require "async"
asyncjs = require "asyncjs"
bcrypt = require "bcrypt"
config = require "app/config"
connect = require "connect"
date = require "../../lib/date" #Do not remove. Monkey patches Date
NotFound = require "app/NotFound"
fs = require "fs"
markdown = require("markdown-js").makeHtml
middleware = require "./middleware"
path = require "path"
leadZero = require "./leadZero"
Post = require "./Post"

postLinks = {}
blogIndicesBySlug = {}

class BlogIndex
  constructor: (@URI, @title="") ->
    @blogTitle = @title

########## middleware ##########
loadBlogMW = (req, res, next) ->
  res.blog = blogIndicesBySlug[req.params.blogSlug]
  next()

loadPost = (req, res, next) ->
  blog = req.params[0]
  post = new Post
  post.base = config.blog.postBasePath
  post.load path.join(post.base, req.path + ".json"), blog, (error) ->
    if error?.code is "ENOENT"
      return next new NotFound req.path
    return next(error) if error
    res.post = post
    post.presented = presentPost post
    links = postLinks[post.URI()]
    post.previous = links.previous
    post.next = links.next
    res.viewPath = post.viewPath()
    next()

html = (req, res, next) ->
  return next() if not /\.html$/.test res.viewPath
  fs.readFile res.viewPath, "utf8", (error, htmlText) ->
    res.html = htmlText
    next error

markdownToHTML = (req, res, next) ->
  return next() if not /\.md$/.test res.viewPath
  fs.readFile res.viewPath, "utf8", (error, markdownText) ->
    return next error if error
    res.html = markdown markdownText
    next error

renderPost = (req, res, next) ->
  locals =
    post: res.post
    postContent: res.html
  res.app.render "blogs/view_post", locals, (error, html) ->
    return next error if error
    res.html = html
    next()

previewMarkdown = (req, res, next) ->
  res.html = markdown req.body
  next()

convertMiddleware = [
  middleware.text
  previewMarkdown
  middleware.domify
  middleware.flickr
  middleware.youtube
  middleware.undomify
  middleware.send
]

viewPostMiddleware = [
  loadPost
  html
  markdownToHTML
  renderPost
  middleware.domify
  middleware.flickr
  middleware.youtube
  middleware.undomify
  middleware.send
]

########## helper/worker functions ##########
presentPost = (post) ->
  date = leadZero(post.publish_date.getMonth() + 1)
  date = date + "/" + leadZero(post.publish_date.getDay() + 1)
  date = date + "/" + post.publish_date.getFullYear()
  presented = {}
  presented = _.extend presented, post
  presented.title = presented.title.trim()
  presented.date = post.publish_date.toString "MMM dd, yyyy"
  presented

loadBlog = (URI, callback) ->
  basePath = path.join config.blog.postBasePath, URI
  basePath = path.normalize basePath
  posts = []
  asyncjs.walkfiles(basePath, null, asyncjs.PREORDER)
  .stat()
  .each (file, next) ->
    return next() if file.stat.isDirectory()
    return next() if not /\.(md|html)$/.test file.name
    post = new Post
    posts.push post
    post.base = path.resolve(path.join(__dirname, "../posts"))
    #TODO fix up
    noExt = file.path.substr 0, file.path.lastIndexOf('.')
    post.load "#{noExt}.json", URI, (error) ->
      return next(error) if error
      post.presented = presentPost(post)
      next()
  .end (error) ->
    posts = _.sortBy posts, (post) ->
      post.publish_date
    .reverse()
    for post, index in posts
      postLinks[post.URI()] =
        next: if index > 0 then posts[index - 1] else null
        previous: if index < posts.length then posts[index + 1] else null
    callback error, posts

verifyPassword = (password, hash, callback) ->
  bcrypt.compare password, hash, (error, correctPassword) ->
    return callback error if error
    return callback "incorrect password" if not correctPassword
    callback()

savePost = (req, callback) ->
  post = new Post req.params.blogSlug, req.body.title, new Date(), "md"
  post.content = (req.body.content || "").trim() + "\n"
  post.base = config.blog.postBasePath
  post.save callback

########## top level request handlers ##########
createPost = (req, res, next) ->
  password = req.body.password
  work = [
    async.apply fs.readFile, config.blog.hashPath, "utf8"
    async.apply verifyPassword, password
    async.apply savePost, req
  ]
  async.waterfall work, (error, post) ->
    return res.status(500).send(error) if error
    response = post.metadata()
    response.URI = post.URI()
    res.send response
    #cheezy reload of the blog index
    loadBlog post.blog, (error,  posts) ->
      blog = blogIndicesBySlug[post.blog]
      blog.posts = posts
      delete blog.cachedFeedXML

feed = (req, res, next) ->
  res.header "Content-Type", "text/xml"
  if res.blog.cachedFeedXML
    return res.send res.blog.cachedFeedXML
  recentPosts = res.blog.posts[0..9]
  locals =
    title: res.blog.title
    URI: res.blog.URI
    pretty: true
    posts: recentPosts
  asyncjs.list(recentPosts).map (post, next) ->
    fakeRes =
      post: post
      viewPath: post.viewPath()
    next null, fakeRes
  .each (fakeRes, next) ->
    html req, fakeRes, next
  .each (fakeRes, next) ->
    markdownToHTML req, fakeRes, next
  .each (fakeRes, next) ->
    middleware.domify req, fakeRes, next
  .each (fakeRes, next) ->
    middleware.flickr req, fakeRes, next
  .each (fakeRes, next) ->
    middleware.youtube req, fakeRes, next
  .each (fakeRes, next) ->
    fakeRes.post.content = fakeRes.html
    next()
  .end (error, fakeRes) ->
    res.app.render "blogs/feed", locals, (error, feedXML) ->
      return next error if error
      res.blog.cachedFeedXML = feedXML
      res.send feedXML

flushCache = (req, res, next) ->
  delete res.blog.cachedFeedXML
  loadBlog res.blog.URI, (error,  posts) ->
    return next error if error
    res.blog.posts = posts
    res.redirect "/#{res.blog.URI}"

setup = (app) ->
  problog = new BlogIndex("problog", "Pete's Points")
  persblog = new BlogIndex("persblog", "The Stretch of Vitality")
  blogIndicesBySlug[problog.URI] = problog
  blogIndicesBySlug[persblog.URI] = persblog
  _load = (blog, next) ->
    loadBlog blog.URI, (error,  posts) ->
      blog.posts = posts
      next error
  doneLoading = (error) ->
    throw error if error
  async.forEach [problog, persblog], _load, doneLoading

  blogRoute = "/:blogSlug(persblog|problog)"
  app.get blogRoute, loadBlogMW, (req, res) ->
      res.render "blogs/#{req.params.blogSlug}", res.blog
  app.get "#{blogRoute}/post", (req, res) -> res.render "blogs/post"
  app.post "#{blogRoute}/post", connect.bodyParser(), createPost
  app.get "#{blogRoute}/feed", loadBlogMW, feed
  app.get "#{blogRoute}/flushCache}", loadBlogMW, flushCache
  app.get new RegExp("/(persblog|problog)/\\d{4}/\\d{2}/\\w+"), viewPostMiddleware
  app.post "/convert", convertMiddleware

module.exports = setup
