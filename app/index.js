var appCommon = require('./appCommon')
var Blog = require('./blog')
var config = require('config3')
var express = require('express')
var fs = require('fs')
var path = require('path')

var app = express()
appCommon.head(app)
var problog = new Blog({
  basePath: path.join(__dirname, '../../data/posts/problog'),
  prefix: '/problog',
  title: "Pete's Points",
  subtitle: 'A blog about web development, programming, technology'
})
app.use(function (req, res, next) {
  res.locals.proSite = true
  next()
})
app.use(problog.prefix, problog.app)

var paths = [
  'plusParty/plusPartyRoutes',
  'jsDebug/jsDebugRoutes',
  'decks/decksRoutes'
]
paths.forEach(function (routesPath) {
  require('./' + routesPath)(app)
})

app.get('/', function (req, res) {
  res.render('pages/home')
})
// Add routes for each template in "pages" directory
var pagesPath = path.join(__dirname, 'pages')
var pages = fs.readdirSync(pagesPath) // eslint-disable-line no-sync
pages.forEach(function (page) {
  if (/\.(jade|md)$/.test(page)) {
    var ext = path.extname(page)
    var base = path.basename(page, ext)
    app.get('/' + base, function (req, res) {
      res.render(path.join('pages', page))
    })
  }
})

app.use(require('./redirects'))
app.use(require('./errors/errorRoutes'))
app.use(express.static(config.zeroClipboardDir))
// needed for reveal slideshows
app.use('/reveal', express.static(config.revealDir))
appCommon.tail(app)

module.exports = app
