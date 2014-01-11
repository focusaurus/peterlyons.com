fs = require "fs"
path = require "path"
stylus = require "stylus"
config = require "app/config"
nib = require "nib"

root = path.normalize "#{__dirname}/.."
cssCacheByName = Object.create null

setup = (app) ->
  app.get "/:name.css", (req, res, next) ->
    res.header "Content-Type", "text/css"
    name = req.params.name
    cached = cssCacheByName[name]
    stylPath = "#{root}/site/#{name}.styl"
    fs.stat stylPath, (error, stats) ->
      return next error if error
      if cached?.mtime.getTime() is stats.mtime.getTime() and config.cacheCSS
        #We have a valid cached result. Bon voyage
        return res.send cached.data
      fs.readFile stylPath, "utf8", (error, stylusText) ->
        if error?.code is "ENOENT"
          return next new errors.NotFound req.path
        return next error if error
        options =
          filename: stylPath
          paths: [__dirname, nib.path]
          compress: true
        stylus.render stylusText, options, (error, cssText) ->
          return next error if error
          cssCacheByName[name] =
            data: cssText
            mtime: stats.mtime
          res.send cssText

module.exports = setup
