const _ = require("lodash");
const galleryMod = require("./galleries");
const config = require("config3");
const express = require("express");
const galleries = require("./galleries-data");
const path = require("path");
const PhotoGallery = require("./photo-gallery");
const React = require("react");
const server = require("react-dom/server");
const sharify = require("sharify");

const router = new express.Router();

function loadGallery(req, res, next) {
  const matchGallery = _.find(galleries, {dirName: req.query.gallery});
  if (!matchGallery) {
    const sorted = _.sortBy(galleries, "startDate");
    const mostRecent = _.last(sorted);
    const url = `${req.path}?gallery=${encodeURIComponent(mostRecent.dirName)}`;
    res.redirect(url);
    return;
  }
  res.locals.gallery = matchGallery;
  next();
}

function photosReact(req, res) {
  galleryMod.loadBySlug(res.locals.gallery.dirName, (error, gallery) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    const photo =
      _.find(gallery.photos, {name: req.query.photo}) || gallery.photos[0];
    _.extend(res.locals.sharify.data, {gallery, galleries, photo});
    const element = React.createElement(PhotoGallery, {
      galleries,
      gallery,
      photo
    });
    const photoGalleryHtml = server.renderToStaticMarkup(element);
    res.render("personal/photos/view-gallery", {photoGalleryHtml, gallery});
  });
}

function getGallery(req, res) {
  return galleryMod.loadBySlug(req.params.slug, (error, gallery) => {
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

router.use("/photos", express.static(path.join(__dirname, "../browser")));
router.get("/galleries/:slug", getGallery);
const mw = [sharify, loadGallery, photosReact];
router.get("/photos", mw);
if (config.photos.serveDirect) {
  router.get("/app/photos", mw);
}

module.exports = router;
