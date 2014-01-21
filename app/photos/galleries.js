var fs = require("fs");
var config = require("app/config");

function photoJSONToObject(gallery, photoJSON) {
  var photos = JSON.parse(photoJSON);
  photos.forEach(function (photo) {
    photo.fullSizeURI = config.photos.photoURI + gallery.dirName + "/" +
      photo.name + config.photos.extension;
    photo.thumbnailURI = config.photos.photoURI + gallery.dirName + "/" +
      photo.name + config.photos.thumbExtension;
    photo.pageURI = config.photos.galleryURI + "?gallery=" + gallery.dirName +
      "&photo=" + photo.name;
  });
  return photos;
}

function getGalleries(callback) {
  return fs.readFile(config.photos.galleryDataPath, function(error, data) {
    if (error) {
      return callback(error);
    }
    var galleries = [];
    try {
      galleries = JSON.parse(data);
    } catch (oops) {
      return callback(new Error("Invalid galleries JSON"));
    }
    callback(null, galleries);
  });
}

function loadBySlug(slug, callback) {
  return getGalleries(function(error, galleries) {
    if (error) {
      return callback(error);
    }
    var matches = galleries.filter(function(gallery) {
      return gallery.dirName === slug;
    });
    if (!matches.length) {
      return callback();
    }
    var gallery = matches[0];
    var jsonPath = config.photos.galleryDir + "/" + gallery.dirName +
      "/photos.json";
    return fs.readFile(jsonPath, function(error, photoJSON) {
      if (error) {
        return callback(error);
      }
      gallery.photos = photoJSONToObject(gallery, photoJSON);
      return callback(null, gallery);
    });
  });
}

module.exports = {
  getGalleries: getGalleries,
  loadBySlug: loadBySlug
};
