const {promisify} = require('util')
const childProcess = require('child_process')
const promiseHandler = require('./promise-handler')
var bcrypt = require('bcryptjs')
var bodyParser = require('body-parser')
var config = require('config3')
var fs = require('fs')
var log = require('bole')(__filename)
var Post = require('./post')

const readFileAsync = promisify(fs.readFile)
const compareAsync = promisify(bcrypt.compare)
const execFileAsync = promisify(childProcess.execFile)

async function verifyPasswordAsync (password, hash) {
  const correctPassword = compareAsync(password, hash)
  if (!correctPassword) {
    throw new Error('incorrect password')
  }
  return correctPassword
}

async function newBlogPrepare () {
  var script = config.blog.newBlogPreparePath
  try {
    const io = await execFileAsync(script, [])
    log.info({
      stdout: io.stdout.toString(),
      stderr: io.stderr.toString()
    }, 'new blog prepare succeeded')
  } catch (error) {
    log.error({ err: error }, 'Error preparing git repo for new blog')
    throw error
  }
}

async function savePost (req) {
  var post = new Post(req.app.locals.blog, req.body.title, new Date(), 'md')
  post.content = (req.body.content || '').trim() + '\n'
  post.base = config.blog.postBasePath
  await post.save()
}

async function newBlogFinalize (token, post, callback) {
  var script = config.blog.newBlogFinalizePath
  try {
    const io = await execFileAsync(script, [token])
    log.info({
      stdout: io.stdout.toString(),
      stderr: io.stderr.toString()
    }, 'new blog finalized successfully')
    callback(null, post)
  } catch (error) {
    log.error({ err: error }, 'Error finalizing git commit/push for new blog')
    throw error
  }
}

async function createPost (req, res) {
  var password = req.body.password
  const hash = await readFileAsync(config.blog.hashPath, 'utf8')
  await verifyPasswordAsync(password, hash)
  await newBlogPrepare
  const post = await savePost(req)
  await newBlogFinalize(password, post)
  var response = post.metadata()
  response.uri = post.uri()
  res.send(response)
  post.blog.load()
}

module.exports = {
  handler: [bodyParser.json(), promiseHandler(createPost)],
  verifyPasswordAsync: verifyPasswordAsync
}
