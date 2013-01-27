#!/usr/bin/env coffee
config = require "app/config"
errors = require "app/errors"
express = require "express"
path = require "path"

app = express()
app.use express.logger {format: ":method :url"}
app.use express.bodyParser()
app.use app.router
app.use express.static(config.staticDir)
# if config.tests
#   #Note to self. Make sure compiler comes BEFORE static
#   app.use express.compiler(src: __dirname + "/../test", enable: ["coffeescript"])
#   app.use express.static(__dirname + "/../test")

app.set "view engine", "jade"
app.set "views", __dirname + "/templates"

app.locals
  config: config
  title: ''

#Last in the chain means 404 for you
app.use (req, res, next) ->
  next new errors.NotFound req.path

#Load in the controllers
["pages", "galleries", "photos", "blog", "css"].map (controllerName) ->
  controller = require "app/controllers/" + controllerName
  controller.setup app
errors.setup app

app.use (error, req, res, next) ->
  console.log error
  if error instanceof errors.NotFound
    res.render "error404"
  else
    res.render "error502"

ip = if config.loopback then "127.0.0.1" else "0.0.0.0"
console.log "Express serving on http://#{ip}:#{config.port} baseURL: #{config.baseURL}, env: #{process.env.NODE_ENV}"
app.listen config.port, ip
