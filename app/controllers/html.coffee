fs = require "fs"

engine = (htmlPath, options, callback) ->
	fs.readFile htmlPath, "utf8", callback

exports.setup = (app) ->
  app.engine ".html", engine
