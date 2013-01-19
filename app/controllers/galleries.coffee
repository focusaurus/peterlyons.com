_ = require 'underscore'
fs = require 'fs'
config = require 'app/config'
gallery = require 'app/models/gallery'

defaultLocals =
  config: config
  title: ''
  test: false

exports.getGalleries = (callback) ->
  fs.readFile config.photos.galleryDataPath, (error, data) ->
    if error
      return callback(error)
    galleries = (new gallery.Gallery(jg.dirName, jg.displayName, jg.startDate) \
      for jg in JSON.parse(data))
    return callback(null, galleries)

adminGalleries = (req, res) ->
  exports.getGalleries (error, jsonGalleries) ->
    throw error if error
    jsonNames = _.pluck(jsonGalleries, 'dirName')
    fs.readdir config.photos.galleryDir, (error, names) ->
      throw error if error
      #Stupid Mac OS X polluting the user space filesystem
      galleryDirNames = _.without(names, '.DS_Store')
      galleryDirNames = galleryDirNames.filter (name) ->
        not (jsonNames.indexOf(name) >= 0)

      newGalleries = (new gallery.Gallery(dirName) for dirName in galleryDirNames)
      allGalleries = jsonGalleries.concat newGalleries
      locals =
        title: 'Manage Photos'
        galleries: allGalleries
        formatDate: (date) ->
          if not date
            return ''
          return "#{date.getMonth() + 1}/#{date.getDate()}/#{date.getFullYear()}"
      locals = _.defaults locals, defaultLocals
      res.render 'admin_galleries', locals

updateGalleries = (req, res) ->
  galleries = []
  for key of req.body
    match = key.match /gallery_(.*)_displayName/
    if not match
      continue
    dirName = match[1]
    startDate = req.body['gallery_' + dirName + '_startDate']
    galleries.push(new gallery.Gallery(dirName, req.body[key], startDate))

  galleries = _.sortBy galleries, (gallery) ->
    gallery.startDate
  galleries.reverse()
  fs.writeFile '../data/galleries.json', JSON.stringify(galleries), (error) ->
    if error
      res.send error, 503
    else
      res.redirect '/admin/galleries'

exports.setup = (app) ->
  if process.env.NODE_ENV in ['production', 'staging']
    return
  app.get '/admin/galleries', adminGalleries
  app.post '/admin/galleries', updateGalleries
