_ = require "lodash"
config = require "app/config"
galleries = require "./galleries"
connectCoffeeScript = require "connect-coffee-script"

renderPhotos = (req, res) ->
  locals = {title: "Photo Gallery"}
  conf = config.photos

  galleries.getGalleries (error, galleries) ->
    throw error if error
    locals.galleries = galleries
    locals.gallery = _.sortBy(galleries, (g) -> -g.startDate)[0]
    galleryParam = req.param "gallery"
    matchGallery = galleries.filter (g) -> g.dirName is galleryParam
    if matchGallery.length
      locals.gallery = matchGallery[0]
      locals.title = "#{locals.gallery.displayName} Photo Gallery" + config.titleSuffix
      res.render "photos/view_gallery", locals
    else
      console.log "@bug redirecting", req.path, locals.gallery.dirName
      res.redirect "#{req.path}?gallery=" + encodeURIComponent(locals.gallery.dirName)

getGallery = (req, res) ->
  galleries.loadBySlug req.params.slug, (error, gallery) ->
    return res.status(500).send(error) if error
    if not gallery
      res.send 404
      return
    res.send gallery

getGalleries = (req, res) ->
  galleries.getGalleries (error, galleries) ->
    return res.status(500).send(error) if error
    res.send galleries

ccsConfig =
  src: "#{__dirname}/browser"
  prefix: "/photos"
  dest: "#{config.staticDir}/photos"
setup = (app) ->
  app.use connectCoffeeScript(ccsConfig)
  app.get "/galleries/:slug", getGallery
  app.get "/galleries", getGalleries
  app.get "/photos", renderPhotos
  if config.photos.serveDirect
    #No nginx rewrites in the dev environment, so make this URI also work
    app.get "/app/photos", renderPhotos

module.exports = setup
