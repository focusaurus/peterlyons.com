var _ = require('lodash')
var analyticsScript = require('./site/blocks/analytics')
var compression = require('compression')
var config = require('config3')
var cssRoutes = require('./site/cssRoutes')
var express = require('express')
var httpErrors = require('httperrors')
var log = require('bole')(__filename)

function locals (req, res, next) {
  _.extend(
    res.locals,
    _.pick(
      config,
      'appURI',
      'appVersion',
      'analytics',
      'titleSuffix'))
  res.locals.analytics.script = analyticsScript
  next()
}

function head (app) {
  app.set('view engine', 'jade')
  app.set('views', __dirname)
  if (config.enableLogger) {
    app.use(function logger (req, res, next) {
      log.debug(req)
      next()
    })
  }
  app.use(compression())
  app.use(locals)
  app.use(cssRoutes)
}

function tail (app) {
  app.use(express.static(config.staticDir))
  app.use(express.static(config.wwwDir))
  app.use(function (req, res, next) {
    next(new httpErrors.NotFound(req.path))
  })

  // Express looks at function arity, so we must declare 4 arguments here
  /* eslint no-unused-vars:0 */
  app.use(function (error, req, res, next) {
    /* eslint no-unused-vars:1 */
    log.warn(req, 'app-wide error handler')
    res.status(error.statusCode || 500)
    if (error.statusCode === 404) {
      res.render('site/error404')
    } else {
      res.render('site/error500')
      log.error(error, req.path)
    }
  })
}

module.exports = {
  head: head,
  tail: tail
}
