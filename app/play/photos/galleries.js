const {promisify} = require("util");
const config = require("../../core/config-validate");
const fs = require("fs");
const galleries = require("./galleries-data");

const readFileAsync = promisify(fs.readFile);

function photoJSONToObject(gallery, photoJSON) {
  const photos = JSON.parse(photoJSON);
  photos.forEach(photo => {
    /* eslint-disable no-param-reassign */
    photo.fullSizeURI = [
      "/photos/",
      gallery.dirName,
      "/",
      photo.name,
      ".jpg"
    ].join("");
    photo.thumbnailURI = [
      "/photos/",
      gallery.dirName,
      "/",
      photo.name,
      "-TN.jpg"
    ].join("");
    photo.pageURI = [
      "/photos?gallery=",
      gallery.dirName,
      "&photo=",
      photo.name
    ].join("");
  });
  return photos;
}

async function loadBySlug(slug) {
  const matches = galleries.filter(gallery2 => gallery2.dirName === slug);
  if (!matches.length) {
    return null;
  }
  const gallery = matches[0];
  const jsonPath = [
    config.photos.galleryDir,
    "/",
    gallery.dirName,
    "/photos.json"
  ].join("");
  const photoJSON = await readFileAsync(jsonPath, "utf8");
  gallery.photos = photoJSONToObject(gallery, photoJSON);
  return gallery;
}

module.exports = {
  galleries,
  loadBySlug,
  photoJSONToObject
};
