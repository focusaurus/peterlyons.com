var _ = require("lodash");
var connect = require("connect");
var fs = require("fs");
var config = require("app/config");
var galleries = require("./galleries");
var defaultLocals = {
  config: config,
  title: '',
  test: false
};

function adminGalleries(req, res, next) {
  galleries.getGalleries(function(error, jsonGalleries) {
    if (error) {
      next(error);
      return;
    }
    var jsonNames = _.pluck(jsonGalleries, 'dirName');
    fs.readdir(config.photos.galleryDir, function(error, names) {
      if (error) {
        next(error);
        return;
      }
      var galleryDirNames = _.without(names, '.DS_Store');
      galleryDirNames = galleryDirNames.filter(function(name) {
        return jsonNames.indexOf(name) < 0;
      });
      var newGalleries = galleryDirNames.map(function (dirName) {
        return {dirName: dirName};
      });
      var allGalleries = jsonGalleries.concat(newGalleries);
      var locals = {
        title: 'Manage Photos',
        galleries: allGalleries,
        formatDate: function(date) {
          if (!date) {
            return '';
          }
          return (date.getMonth() + 1) + "/" + (date.getDate()) + "/" +
            (date.getFullYear());
        }
      };
      locals = _.defaults(locals, defaultLocals);
      res.render('admin_galleries', locals);
    });
  });
}

function updateGalleries(req, res) {
  var galleries = [];
  for (var key in req.body) {
    var match = key.match(/gallery_(.*)_displayName/);
    if (!match) {
      continue;
    }
    var dirName = match[1];
    var startDate = req.body['gallery_' + dirName + '_startDate'];
    galleries.push({
      dirName: dirName,
      displyName: req.body[key],
      startDate: startDate
    });
  }
  galleries = _.sortBy(galleries, function(gallery) {
    return gallery.startDate;
  });
  galleries.reverse();
  fs.writeFile('../data/galleries.json', JSON.stringify(galleries), function(error) {
    if (error) {
      res.send(error, 503);
      return;
    }
    res.redirect('/admin/galleries');
  });
}

function setup(app) {
  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    return;
  }
  app.get('/admin/galleries', adminGalleries);
  app.post('/admin/galleries', connect.bodyParser(), updateGalleries);
}

module.exports = setup;
