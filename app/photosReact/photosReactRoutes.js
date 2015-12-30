var _ = require('lodash')
var config = require('config3')
var galleries = require(config.photos.galleryDataPath)
var _galleries = require('../photos/galleries')
var PhotoGallery = require('./PhotoGallery')
var react = require('react')
var server = require('react-dom/server')
var sharify = require('sharify')

function loadGallery (req, res, next) {
  var matchGallery = galleries.filter(function (g) {
    return g.dirName === req.query.gallery
  })
  if (!matchGallery.length) {
    var sorted = _.sortByAll(galleries, 'startDate')
    var mostRecent = _.last(sorted)
    var url = req.path + '?gallery=' + encodeURIComponent(mostRecent.dirName)
    res.redirect(url)
    return
  }
  res.locals.gallery = matchGallery[0]; // eslint-disable-line semi
  next()
}

function photosReact (req, res, next) {
  _galleries.loadBySlug(res.locals.gallery.dirName, function (error, gallery) {
    if (error) {
      return res.status(500).send(error)
    }
    _.extend(res.locals.sharify.data, {
      gallery: gallery,
      galleries: galleries
    })
    const element = react.createElement(PhotoGallery, {
      galleries,
      gallery
    })
    var photoGalleryHtml = server.renderToString(element)
    res.render('photosReact/viewGallery', {
      photoGalleryHtml,
      gallery
    })
  })
}

function setup (app) {
  const mw = [sharify, loadGallery, photosReact]
  app.get('/photos-react', mw)
  if (config.photos.serveDirect) {
    app.get('/app/photos-react', mw)
  }
}

module.exports = setup
