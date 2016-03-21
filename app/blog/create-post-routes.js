var async = require('async')
var bcrypt = require('bcryptjs')
var bodyParser = require('body-parser')
var config = require('config3')
var execFile = require('child_process').execFile
var fs = require('fs')
var log = require('bole')(__filename)
var Post = require('./post')

function verifyPassword (password, hash, callback) {
  bcrypt.compare(password, hash, function (error, correctPassword) {
    if (error) {
      callback(error)
      return
    }
    if (!correctPassword) {
      callback('incorrect password')
      return
    }
    callback()
  })
}

function newBlogPrepare (callback) {
  var script = config.blog.newBlogPreparePath
  execFile(script, [], function (error, stdout, stderr) {
    if (error) {
      log.error({
        err: error,
        stdout: stdout,
        stderr: stderr
      }, 'Error preparing git repo for new blog')
      callback(error)
      return
    }
    log.info({
      stdout: stdout.toString(),
      stderr: stderr.toString()
    }, 'new blog prepare succeeded')
    callback()
  })
}

function savePost (req, callback) {
  var post = new Post(req.app.locals.blog, req.body.title, new Date(), 'md')
  post.content = (req.body.content || '').trim() + '\n'
  post.base = config.blog.postBasePath
  post.save(callback)
}

function newBlogFinalize (token, post, callback) {
  var script = config.blog.newBlogFinalizePath
  execFile(script, [token], function (error, stdout, stderr) {
    if (error) {
      log.error({
        err: error,
        stdout: stdout,
        stderr: stderr
      }, 'Error finalizing git commit/push for new blog')
      callback(error)
      return
    }
    log.info({
      stdout: stdout.toString(),
      stderr: stderr.toString()
    }, 'new blog finalized successfully')
    callback(null, post)
  })
}

function createPost (req, res) {
  var password = req.body.password
  var work = [
    async.apply(fs.readFile, config.blog.hashPath, 'utf8'),
    async.apply(verifyPassword, password),
    async.apply(newBlogPrepare),
    async.apply(savePost, req),
    async.apply(newBlogFinalize, password)
  ]
  async.waterfall(work, function (error, post) {
    if (error) {
      log.error(error, 'Could not save blog post' + req.body.title)
      return res.status(500).send(error)
    }
    var response = post.metadata()
    response.uri = post.uri()
    res.send(response)
    post.blog.load()
  })
}

module.exports = {
  handler: [bodyParser.json(), createPost],
  verifyPassword: verifyPassword
}
