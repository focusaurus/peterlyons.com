fs = require "fs"
config = require "app/config"
Gallery = require "./Gallery"

getGalleries = (callback) ->
  fs.readFile config.photos.galleryDataPath, (error, data) ->
    if error
      return callback(error)
    galleries = (new Gallery(jg.dirName, jg.displayName, jg.startDate) \
      for jg in JSON.parse(data))
    return callback(null, galleries)

module.exports = {getGalleries}
