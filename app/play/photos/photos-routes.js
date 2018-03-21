const _ = require("lodash");
const config = require("config3");
const express = require("express");
const galleries = require("./galleries-data");
const galleryMod = require("./galleries");
const path = require("path");
const promiseHandler = require("../../promise-handler");
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

async function viewGallery(req, res) {
  const gallery = await galleryMod.loadBySlug(res.locals.gallery.dirName);
  const photo =
    _.find(gallery.photos, {name: req.query.photo}) || gallery.photos[0];
  Object.assign(res.locals.sharify.data, {gallery, galleries, photo});
  res.render("play/photos/view-gallery");
}

async function getGallery(req, res) {
  const gallery = await galleryMod.loadBySlug(req.params.slug);
  if (!gallery) {
    res.send(404);
    return;
  }
  res.send(gallery);
}

router.use("/photos", express.static(path.join(__dirname, "../browser")));
router.get("/galleries/:slug", promiseHandler(getGallery));
const mw = [sharify, loadGallery, promiseHandler(viewGallery)];
router.get("/photos", mw);
if (config.photos.serveDirect) {
  router.get("/app/photos", mw);
}

module.exports = router;
