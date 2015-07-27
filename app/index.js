var _ = require('lodash')
var compression = require('compression')
var config = require('config3')
var express = require('express')
var httpErrors = require('httperrors')
var log = require('bole')(__filename)

var app = express()
app.set('view engine', 'jade')
app.set('views', __dirname)
app.locals = _.extend(
  {}, _.pick(config, 'baseURL', 'appURI', 'appVersion', 'analytics'))
app.locals.analytics.script = require('app/site/blocks/analytics')

if (config.enableLogger) {
  app.use(function logger (req, res, next) {
    log.debug(req)
    next()
  })
}
[
  'blogs/blogRoutes',
  'plusParty/plusPartyRoutes',
  'jsDebug/jsDebugRoutes',
  'decks/decksRoutes',
  'pages/pagesRoutes',
  'photos/photosRoutes',
  'photos/galleriesRoutes',
  'site/cssRoutes',
  'site/errorRoutes'
].forEach(function (routesPath) {
  require('app/' + routesPath)(app)
})

app.use(compression())
app.use(express.static(config.staticDir))
app.use(express.static(config.wwwDir))
app.use(express.static(config.zeroClipboardDir))
// needed for reveal slideshows
app.use('/reveal', express.static(config.revealDir))
app.use(function (req, res, next) {
  next(new httpErrors.NotFound(req.path))
})

/* eslint no-unused-vars:0 */
// Express looks at function arity, so we must declare 4 arguments here
app.use(function (error, req, res, next) {
  res.status(error.statusCode || 500)
  if (error.statusCode === 404) {
    res.render('site/error404')
  } else {
    res.render('site/error500')
    log.error(error, req)
  }
})

module.exports = app
