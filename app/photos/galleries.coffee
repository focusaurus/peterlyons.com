fs = require "fs"
config = require "app/config"

photoJSONToObject = (gallery, photoJSON) ->
  photos = JSON.parse(photoJSON)
  for photo in photos
    photo.fullSizeURI = "#{config.photos.photoURI}#{gallery.dirName}/#{photo.name}#{config.photos.extension}"
    photo.thumbnailURI = "#{config.photos.photoURI}#{gallery.dirName}/#{photo.name}#{config.photos.thumbExtension}"
    photo.pageURI = "#{config.photos.galleryURI}?gallery=#{gallery.dirName}&photo=#{photo.name}"
  return photos

getGalleries = (callback) ->
  fs.readFile config.photos.galleryDataPath, (error, data) ->
    if error
      return callback(error)
    galleries = []
    try
      galleries = JSON.parse data
    catch e
      return callback(new Error("Invalid galleries JSON"))
    callback(null, galleries)

loadBySlug = (slug, callback) ->
  getGalleries (error, galleries) ->
    return callback(error) if error
    matches = galleries.filter (gallery) -> gallery.dirName is slug
    return callback() if not matches.length
    gallery = matches[0]
    fs.readFile "#{config.photos.galleryDir}/#{gallery.dirName}/photos.json", (error, photoJSON) ->
      return callback(error) if error
      gallery.photos = photoJSONToObject gallery, photoJSON
      callback null, gallery

module.exports = {getGalleries, loadBySlug}
