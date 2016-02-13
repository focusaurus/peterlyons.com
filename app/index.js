var Blog = require('./blog')
var config = require('config3')
var express = require('express')
var join = require('path').join
var appCommon = require('./appCommon')

var app = express()
appCommon.head(app)
app.locals.proSite = true
var problog = new Blog({
  basePath: join(__dirname, '../data/posts/problog'),
  prefix: '/problog',
  title: 'Pete\'s Points',
  subtitle: 'A blog about web development, programming, technology'
})
app.use(problog.prefix, problog.app)

// config.blogs.forEach(function (blogConfig) {
//   var blog = new Blog(blogConfig)
//   app.use(blogConfig.prefix, blog.app)
//   // Some poor coupling here as the blog sub-app is rendered within the
//   // main site layout.jade template, thus needs some locals referenced there
//   _.extend(blog.app.locals, _.pick(app.locals, 'analytics', 'titleSuffix'))
//   blog.on('error', function (error) {
//     log.error('Error with blog ' + blogConfig.prefix, error)
//   })
//   blog.on('ready', function () {
//     log.info('blog at ' + blogConfig.prefix + ' is ready')
//   })
// })

var paths = [
  'plusParty/plusPartyRoutes',
  'jsDebug/jsDebugRoutes',
  'decks/decksRoutes',
  'pages/pagesRoutes'
]
paths.forEach(function (routesPath) {
  require('app/' + routesPath)(app)
})

app.use(express.static(config.zeroClipboardDir))
// needed for reveal slideshows
app.use('/reveal', express.static(config.revealDir))
appCommon.tail(app)

module.exports = app
