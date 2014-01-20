var fs = require("fs");
var path = require("path");

function template(extension) {
  return function(req, res, next) {
    var viewPath = req.path;
    var redirect = /\.html$/.test(viewPath);
    if (redirect) {
      viewPath = viewPath.slice(0, viewPath.length - 5);
    }
    var templatePath = "" + viewPath + "." + extension;
    templatePath = path.join(req.app.get("views"), "pages", templatePath);
    fs.stat(templatePath, function(error, stats) {
      if (error) {
        return next();
      }
      if (stats.isDirectory()) {
        return next();
      }
      if (redirect) {
        return res.redirect(viewPath);
      }
      return res.render(templatePath);
    });
  };
}

module.exports = template;
