_ = require 'underscore'
async = require 'async'
fs = require 'fs'
config = require 'app/config'
gallery = require 'app/models/gallery'
galleries = require 'app/controllers/galleries'
{Page} = require 'app/controllers/pages'

#Load photo metadata from a photos.json file in the gallery directory
getPhotoJSON = (locals, callback) ->
  fs.readFile locals.gallery.dirPath + "/" + "photos.json", (error, photoJSON) ->
    if error
      return callback()
    p = locals.photos
    #This extends locals.photos with all the new photos
    p.push.apply(p, photoJSONToObject locals.gallery, photoJSON)
    callback()

#Try the earlier approach where captions were embedded in IPTC info in
#the photo .jpg files directly
getPhotoIPTC = (locals, callback) ->
  if locals.photos
    #photoList has already been loaded from flat .json file
    #Don't bother trying IPTC subprocess
    return callback()

  #Now we run iptc_caption.py to generate a list of photos with captions
  #from the filesystem. This program writes JSON to stdout
  command = ['python ./bin/iptc_caption.py --dir ',
              "'#{config.photos.galleryDir}/#{gallery.dirName}'"].join ''
  child_process.exec command, (error, photoJSON, stderr) ->
    if error
      console.log error
      return callback()
    #This extends locals.photos with all the new photos
    p = locals.photos
    p.push.apply(p, photoJSONToObject locals.gallery, photoJSON)
    callback()

photoJSONToObject = (gallery, photoJSON) ->
  photos = JSON.parse(photoJSON)
  for photo in photos
    photo.fullSizeURI ="#{config.photos.photoURI}#{gallery.dirName}/#{photo.name}#{config.photos.extension}"
    photo.pageURI = "#{config.photos.galleryURI}?gallery=#{gallery.dirName}&photo=#{photo.name}"
  return photos

renderPhotos = (req, res) ->
  locals = {title: 'Photo Gallery'}
  conf = config.photos

  galleries.getGalleries (error, galleries) ->
    throw error if error
    locals.galleries = galleries
    locals.gallery = _.sortBy(galleries, (g) -> g.startDate).slice(-1)[0]
    galleryParam = req.param 'gallery'
    galleryNames = _.pluck galleries, 'dirName'
    if _.contains galleryNames, galleryParam
      locals.gallery = galleries[galleryNames.indexOf(galleryParam)]
    locals.photos = []
    #First, try to load a photos.json metadata file
    #2nd choice, try iptc_caption.py to build the json
    async.series [
      (callback) ->
        getPhotoJSON locals, callback
      ,
      (callback) ->
        getPhotoIPTC locals, callback
      ],
      (error, dontcare) ->
        #Figure out which photo to display full size.
        photoParam = req.param 'photo'
        index = _.pluck(locals.photos, 'name').indexOf(photoParam)
        #If it's a bogus photo name, default to the first photo
        index = 0 if index < 0
        locals.photo = locals.photos[index]
        locals.photo.next = locals.photos[index + 1] or locals.photos[0]
        locals.photo.prev = locals.photos[index - 1] or _.last(locals.photos)
        locals.title = "#{locals.gallery.displayName} Photo Gallery"
        page = new Page 'photos', locals
        page.render req, res

exports.setup = (app) ->
  app.get '/photos', renderPhotos
  if config.photos.serveDirect
    #No nginx rewrites in the dev environment, so make this URI also work
    app.get '/app/photos', renderPhotos
