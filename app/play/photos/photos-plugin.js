"use strict";
const _ = require("lodash");
const {promisify} = require("util");
const fs = require("fs");
const path = require("path");

const readFileAsync = promisify(fs.readFile);

function photoJSONToObject(gallery, photoJSON) {
  const photos = JSON.parse(photoJSON);
  photos.forEach(photo => {
    /* eslint-disable no-param-reassign */
    photo.fullSizeURI = `/photos/${gallery.dirName}/${photo.name}.jpg`;
    photo.thumbnailURI = `/photos/${gallery.dirName}/${photo.name}-TN.jpg`;
    photo.pageURI = `/photos?gallery=${gallery.dirName}&photo=${photo.name}`;
    /* eslint-enable no-param-reassign */
  });
  return photos;
}

async function loadGallery(baseDir, galleries, slug) {
  const matches = galleries.filter(gallery2 => gallery2.dirName === slug);
  if (!matches.length) {
    return null;
  }
  const gallery = matches[0];
  const jsonPath = path.join(baseDir, gallery.dirName, "photos.json");
  const photoJSON = await readFileAsync(jsonPath, "utf8");
  gallery.photos = photoJSONToObject(gallery, photoJSON);
  return gallery;
}

async function getGallery(request, h) {
  const {baseDir, galleries} = h.context;
  const gallery = await loadGallery(baseDir, galleries, request.params.slug);
  if (!gallery) {
    return h.response("").code(404);
  }
  return gallery;
}

async function viewGallery(request, h) {
  const {baseDir, galleries} = h.context;
  const matchGallery = galleries.find(g => g.dirName === request.query.gallery);
  if (!matchGallery) {
    const sorted = _.sortBy(galleries, "startDate");
    const newest = _.last(sorted);
    const url = `${request.path}?gallery=${encodeURIComponent(newest.dirName)}`;
    return h.redirect(url);
  }
  const gallery = await loadGallery(baseDir, galleries, matchGallery.dirName);
  const photo =
    gallery.photos.find(p => p.name === request.query.photo) ||
    gallery.photos[0];
  const sharify = JSON.stringify({gallery, galleries, photo}, null, 2);
  return h.view("play/photos/view-gallery", {
    gallery,
    sharify: `window.__sharifyData=${sharify};`
  });
}

module.exports = {
  name: "photos",
  version: "1.0.0",
  async register(server, options) {
    server.register(require("vision"));  // renders page templates (pug)
    server.bind({
      galleries: options.galleries || require("./galleries-data"),
      baseDir: options.baseDir
    });
    server.route({
      method: "GET",
      path: "/galleries/{slug}",
      handler: getGallery
    });
    server.route({
      method: "GET",
      path: "/photos",
      handler: viewGallery
    });
    server.route({
      method: "GET",
      path: "/app/photos",
      handler: viewGallery
    });
  }
};
