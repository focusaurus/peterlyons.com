fs = require "fs"
config = require "app/config"
Gallery = require "./Gallery"


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
    galleries = galleries.map (gData) ->
      new Gallery gData.dirName, gData.displayName, gData.startDate
    callback(null, galleries)

loadBySlug = (slug, callback) ->
  getGalleries (error, galleries) ->
    return callback(error) if error
    matches = galleries.filter (gallery) -> gallery.dirName is slug
    return callback() if not matches.length
    gallery = matches[0]
    console.log "@bug gallery.dirPath", gallery.dirPath, gallery.displayName
    fs.readFile "#{gallery.dirPath}/photos.json", (error, photoJSON) ->
      return callback(error) if error
      gallery.photos = photoJSONToObject gallery, photoJSON
      callback null, gallery

module.exports = {getGalleries, loadBySlug}
