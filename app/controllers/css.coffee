fs = require "fs"
path = require "path"
stylus = require "stylus"

root = path.normalize "#{__dirname}/../assets/css"
cssCacheByName = Object.create null

setup = (app) ->
  app.get "/:name.css", (req, res, next) ->
    res.header "Content-Type", "text/css"
    name = req.params.name
    cached = cssCacheByName[name]
    stylPath = "#{root}/#{name}.styl"
    fs.stat stylPath, (error, stats) ->
      return next error if error
      if cached?.mtime.getTime() is stats.mtime.getTime()
        #We have a valid cached result. Bon voyage
        return res.send cached.data
      fs.readFile stylPath, "utf8", (error, stylusText) ->
        if error?.code is "ENOENT"
          return next new errors.NotFound req.path
        return next error if error
        stylus.render stylusText, {filename: stylPath, compress: true}, (error, cssText) ->
          return next error if error
          cssCacheByName[name] =
            data: cssText
            mtime: stats.mtime
          res.send cssText

module.exports = setup
