var config = require("app/config");
var cssCacheByName = Object.create(null);
var fs = require("fs");
var nib = require("nib");
var path = require("path");
var root = path.normalize(__dirname + "/..");
var stylus = require("stylus");

function setup(app) {
  app.get("/:name.css", function(req, res, next) {
    res.header("Content-Type", "text/css");
    var name = req.params.name;
    var cached = cssCacheByName[name];
    var stylPath = root + "/site/" + name + ".styl";
    fs.stat(stylPath, function(error, stats) {
      if (error) {
        return next(error);
      }
      if (config.cacheCSS && cached &&
          cached.mtime.getTime() === stats.mtime.getTime()) {
        return res.send(cached.data);
      }
      fs.readFile(stylPath, "utf8", function(error, stylusText) {
        if (error && error.code === "ENOENT") {
          return next(new errors.NotFound(req.path));
        }
        if (error) {
          return next(error);
        }
        var options = {
          filename: stylPath,
          paths: [__dirname, nib.path],
          compress: true
        };
        return stylus.render(stylusText, options, function(error, cssText) {
          if (error) {
            return next(error);
          }
          cssCacheByName[name] = {
            data: cssText,
            mtime: stats.mtime
          };
          return res.send(cssText);
        });
      });
    });
  });
}

module.exports = setup;
