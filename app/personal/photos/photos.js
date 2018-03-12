"use strict";
const galleryMod = require("./galleries");

async function getGallery(request, h) {
  const gallery = await galleryMod.loadBySlug(request.params.slug);
  if (!gallery) {
    return h.response('').code(404);
  }
  return gallery;
}

async function setup(server) {
  server.route({
    method: "GET",
    path: "/galleries/{slug}",
    handler: getGallery
  });
}

module.exports = setup;
