const fs = require("fs");
const config = require("config3");
const galleries = require("./galleries-data");

function photoJSONToObject(gallery, photoJSON) {
  const photos = JSON.parse(photoJSON);
  photos.forEach(photo => {
    /* eslint-disable no-param-reassign */
    photo.fullSizeURI = [
      config.photos.photoURI,
      gallery.dirName,
      "/",
      photo.name,
      config.photos.extension
    ].join("");
    photo.thumbnailURI = [
      config.photos.photoURI,
      gallery.dirName,
      "/",
      photo.name,
      config.photos.thumbExtension
    ].join("");
    photo.pageURI = [
      config.photos.galleryURI,
      "?gallery=",
      gallery.dirName,
      "&photo=",
      photo.name
    ].join("");
  });
  return photos;
}

function loadBySlug(slug, callback) {
  const matches = galleries.filter(gallery2 => gallery2.dirName === slug);
  if (!matches.length) {
    callback();
    return;
  }
  const gallery = matches[0];
  const jsonPath = [
    config.photos.galleryDir,
    "/",
    gallery.dirName,
    "/photos.json"
  ].join("");
  fs.readFile(jsonPath, (error2, photoJSON) => {
    if (error2) {
      callback(error2);
      return;
    }
    gallery.photos = photoJSONToObject(gallery, photoJSON);
    callback(null, gallery);
  });
}

module.exports = {
  galleries,
  loadBySlug,
  photoJSONToObject
};
