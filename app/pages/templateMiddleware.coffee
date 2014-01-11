fs = require "fs"
path = require "path"

template = (extension) ->
  (req, res, next) ->
    viewPath = req.path
    #Handle old .html URLs so stale links out there still work
    redirect = /\.html$/.test viewPath
    if redirect
      viewPath = viewPath.slice(0, viewPath.length - 5)
    templatePath = "#{viewPath}.#{extension}"
    templatePath = path.join req.app.get("views"), "pages", templatePath
    fs.stat templatePath, (error, stats) ->
      #@todo distinguish ENOENT vs other errors
      return next() if error
      return next() if stats.isDirectory()
      return res.redirect viewPath if redirect
      res.render templatePath

module.exports = template
