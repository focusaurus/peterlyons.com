var fs = require('fs')
var path = require('path')

function template (extension) {
  return function templateMiddleware (req, res, next) {
    var viewPath = req.path
    var redirect = /\.html$/.test(viewPath)
    if (redirect) {
      viewPath = viewPath.slice(0, viewPath.length - 5)
    }
    var templatePath = '' + viewPath + '.' + extension
    templatePath = path.join(req.app.get('views'), 'pages', templatePath)
    fs.stat(templatePath, function (error, stats) {
      // @todo distinguish ENOENT vs other errors
      if (error) {
        next()
        return
      }
      if (stats.isDirectory()) {
        next()
        return
      }
      if (redirect) {
        res.redirect(301, viewPath)
        return
      }
      res.render(templatePath)
    })
  }
}

module.exports = template
