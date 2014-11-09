var _ = require("lodash");
var _galleries = require("./galleries");
var config = require("config3");
var connect = require("connect");
var path = require("path");
var sharify = require("sharify");

function renderPhotos(req, res, next) {
  _galleries.getGalleries(function(error, galleries) {
    if (error) {
      next(error);
      return;
    }
    var matchGallery = galleries.filter(function(g) {
      return g.dirName === req.param("gallery");
    });
    if (!matchGallery.length) {
      var mostRecent = _.sortBy(galleries, function(g) {
        return -g.startDate;
      })[0];
      res.redirect(req.path + "?gallery=" +
        encodeURIComponent(mostRecent.dirName));
      return;
    }
    _galleries.loadBySlug(matchGallery[0].dirName, function(error, gallery) {
      if (error) {
        return res.status(500).send(error);
      }
      _.extend(res.locals.sharify.data, {
        gallery: gallery,
        galleries: galleries
      });
      res.render("photos/viewGallery", {
        gallery: gallery
      });
    });
  });
}

function getGallery(req, res) {
  return _galleries.loadBySlug(req.params.slug, function(error, gallery) {
    if (error) {
      res.status(500).send(error);
      return;
    }
    if (!gallery) {
      res.send(404);
      return;
    }
    res.send(gallery);
  });
}

function setup(app) {
  app.use("/photos", connect.static(path.join(__dirname, "/browser")));
  app.get("/galleries/:slug", getGallery);
  app.get("/photos", sharify, renderPhotos);
  if (config.photos.serveDirect) {
    app.get("/app/photos", sharify, renderPhotos);
  }
}

module.exports = setup;
