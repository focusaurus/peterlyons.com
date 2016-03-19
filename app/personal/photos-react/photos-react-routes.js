const _ = require('lodash')
const config = require('config3')
const express = require('express')
const galleries = require('../photos/galleries-data')
const _galleries = require('../photos/galleries')
const PhotoGallery = require('./photo-gallery')
const React = require('react')
const server = require('react-dom/server')
const sharify = require('sharify')
const router = new express.Router()

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
    const element = React.createElement(
      PhotoGallery, {galleries, gallery, photo})
    var photoGalleryHtml = server.renderToStaticMarkup(element)
    res.render(
      'personal/photos-react/view-gallery', {photoGalleryHtml, gallery})
  })
}

const mw = [sharify, loadGallery, photosReact]
router.get('/photos-react', mw)
if (config.photos.serveDirect) {
  router.get('/app/photos-react', mw)
}

module.exports = router
