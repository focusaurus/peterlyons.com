var fs = require('fs')
var config = require('config3')
var galleries = require('./galleries-data')

function photoJSONToObject (gallery, photoJSON) {
  var photos = JSON.parse(photoJSON)
  photos.forEach(function (photo) {
    photo.fullSizeURI = config.photos.photoURI + gallery.dirName + '/' +
      photo.name + config.photos.extension
    photo.thumbnailURI = config.photos.photoURI + gallery.dirName + '/' +
      photo.name + config.photos.thumbExtension
    photo.pageURI = config.photos.galleryURI + '?gallery=' + gallery.dirName +
      '&photo=' + photo.name
  })
  return photos
}

function loadBySlug (slug, callback) {
  var matches = galleries.filter(function (gallery2) {
    return gallery2.dirName === slug
  })
  if (!matches.length) {
    return callback()
  }
  var gallery = matches[0]
  var jsonPath = config.photos.galleryDir + '/' + gallery.dirName +
    '/photos.json'
  fs.readFile(jsonPath, function (error2, photoJSON) {
    if (error2) {
      return callback(error2)
    }
    gallery.photos = photoJSONToObject(gallery, photoJSON)
    callback(null, gallery)
  })
}

module.exports = {
  galleries: galleries,
  loadBySlug: loadBySlug,
  photoJSONToObject: photoJSONToObject
}
