fs = require "fs"
path = require "path"
stylus = require "stylus"

root = path.normalize "#{__dirname}/../assets/css"

exports.setup = (app) ->
  app.get "/:name.css", (req, res, next) ->
    stylPath = "#{root}/#{req.params.name}.styl"
    console.log("@bug looking for", stylPath)
    fs.readFile stylPath, "utf8", (error, stylusText) ->
      if error?.code is "ENOENT"
        return next new errors.NotFound req.path
      return next error if error
      stylus.render stylusText, {filename: stylPath, compress: true}, (error, cssText) ->
        return next error if error
        res.header("Content-Type", "text/css").send cssText
