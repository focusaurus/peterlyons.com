#!/usr/bin/env coffee
config = require "app/config"
errors = require "app/errors"
express = require "express"
middleware = require "app/controllers/middleware"
path = require "path"

app = express()
app.set "view engine", "jade"
app.set "views", __dirname + "/templates"
app.locals
  config: config
  appURI: config.appURI
app.use middleware.logRequestStart
app.use express.logger {format: ":date :method :url"}

#Load in the controllers
(require("app/controllers/#{name}")(app) for name in [
	"pages"
	"galleries"
	"photos"
	"blog"
	"css"
])
errors.setup app
app.use express.static config.staticDir

#Last in the chain means 404 for you
app.use (req, res, next) ->
  next new errors.NotFound req.path

app.use (error, req, res, next) ->
  console.log "Error handler middleware:", error
  if error instanceof errors.NotFound
    res.render "errors/error404"
  else
    res.render "errors/error500"

ip = if config.loopback then "127.0.0.1" else "0.0.0.0"
console.log "Express serving on http://#{ip}:#{config.port} baseURL: #{config.baseURL}, env: #{process.env.NODE_ENV}"
app.listen config.port, ip
