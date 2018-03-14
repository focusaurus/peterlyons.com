"use strict";
const _ = require("lodash");
const galleries = require("./galleries-data");
const galleryMod = require("./galleries");

async function getGallery(request, h) {
  const gallery = await galleryMod.loadBySlug(request.params.slug);
  if (!gallery) {
    return h.response("").code(404);
  }
  return gallery;
}

async function viewGallery(request, h) {
  const matchGallery = galleries.find(g => g.dirName === request.query.gallery);
  if (!matchGallery) {
    const sorted = _.sortBy(galleries, "startDate");
    const mostRecent = _.last(sorted);
    const url = `${request.path}?gallery=${encodeURIComponent(
      mostRecent.dirName
    )}`;
    return h.redirect(url);
  }
  const gallery = await galleryMod.loadBySlug(matchGallery.dirName);
  const photo =
    _.find(gallery.photos, {name: request.query.photo}) || gallery.photos[0];
  const sharify = JSON.stringify({gallery, galleries, photo}, null, 2);
  return h.view("personal/photos/view-gallery", {
    gallery,
    sharify: `window.__sharifyData=${sharify};`
  });
}

module.exports = {
  name: "photos",
  version: "1.0.0",
  async register(server) {
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
