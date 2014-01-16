_ = require "lodash"
config = require "app/config"
_galleries = require "./galleries"
connectCoffeeScript = require "connect-coffee-script"
sharify = require "sharify"

renderPhotos = (req, res, next) ->
  _galleries.getGalleries (error, galleries) ->
    return next(error) if error
    matchGallery = galleries.filter (g) -> g.dirName is req.param("gallery")
    if not matchGallery.length
      mostRecent = _.sortBy(galleries, (g) -> -g.startDate)[0]
      res.redirect "#{req.path}?gallery=" + \
        encodeURIComponent(mostRecent.dirName)
      return
    _galleries.loadBySlug  matchGallery[0].dirName, (error, gallery) ->
      return res.status(500).send(error) if error
      _.extend res.locals.sharify.data, {gallery, galleries}
      res.render "photos/view_gallery", {gallery}

getGallery = (req, res) ->
  _galleries.loadBySlug req.params.slug, (error, gallery) ->
    return res.status(500).send(error) if error
    if not gallery
      res.send 404
      return
    res.send gallery

ccsConfig =
  src: "#{__dirname}/browser"
  prefix: "/photos"
  dest: "#{config.staticDir}/photos"
setup = (app) ->
  app.use connectCoffeeScript(ccsConfig)
  app.get "/galleries/:slug", getGallery
  app.get "/photos", sharify, renderPhotos
  if config.photos.serveDirect
    #No nginx rewrites in the dev environment, so make this URI also work
    app.get "/app/photos", sharify, renderPhotos

module.exports = setup
