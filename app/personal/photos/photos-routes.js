var _ = require('lodash')
var _galleries = require('./galleries')
var config = require('config3')
var express = require('express')
var galleries = require('./galleries-data')
var path = require('path')
var PhotoGallery = require('./photo-gallery')
var React = require('react')
var server = require('react-dom/server')
var sharify = require('sharify')

var router = new express.Router()

function loadGallery (req, res, next) {
  var matchGallery = _.find(galleries, {dirName: req.query.gallery})
  if (!matchGallery) {
    var sorted = _.sortBy(galleries, 'startDate')
    var mostRecent = _.last(sorted)
    var url = req.path + '?gallery=' + encodeURIComponent(mostRecent.dirName)
    res.redirect(url)
    return
  }
  res.locals.gallery = matchGallery
  next()
}

function photosReact (req, res, next) {
  _galleries.loadBySlug(res.locals.gallery.dirName, function (error, gallery) {
    if (error) {
      return res.status(500).send(error)
    }
    var photo = _.find(gallery.photos, {name: req.query.photo}) ||
      gallery.photos[0]
    _.extend(res.locals.sharify.data, {gallery, galleries, photo})
    var element = React.createElement(
      PhotoGallery, {galleries, gallery, photo})
    var photoGalleryHtml = server.renderToStaticMarkup(element)
    res.render(
      'personal/photos/view-gallery', {photoGalleryHtml, gallery})
  })
}

function getGallery (req, res) {
  return _galleries.loadBySlug(req.params.slug, function (error, gallery) {
    if (error) {
      res.status(500).send(error)
      return
    }
    if (!gallery) {
      res.send(404)
      return
    }
    res.send(gallery)
  })
}

router.use('/photos', express.static(path.join(__dirname, '../browser')))
router.get('/galleries/:slug', getGallery)
var mw = [sharify, loadGallery, photosReact]
router.get('/photos', mw)
if (config.photos.serveDirect) {
  router.get('/app/photos', mw)
}

module.exports = router
