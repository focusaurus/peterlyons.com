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
  app.use(require('./errors/error-handler'))
}

module.exports = {
  head: head,
  tail: tail
}
