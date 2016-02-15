var _ = require('lodash')
var _galleries = require('./galleries')
var config = require('config3')
var express = require('express')
var path = require('path')
var sharify = require('sharify')

var router = new express.Router()

function renderPhotos (req, res, next) {
  var galleries = _galleries.galleries
  var matchGallery = galleries.filter(function (g) {
    return g.dirName === req.query.gallery
  })
  if (!matchGallery.length) {
    var mostRecent = _.sortBy(
      galleries, 'startDate')[galleries.length - 1]
    res.redirect(req.path + '?gallery=' +
      encodeURIComponent(mostRecent.dirName))
    return
  }
  _galleries.loadBySlug(matchGallery[0].dirName, function (error2, gallery) {
    if (error2) {
      return res.status(500).send(error2)
    }
    _.extend(res.locals.sharify.data, {
      gallery: gallery,
      galleries: galleries
    })
    res.render('personal/photos/viewGallery', {
      gallery: gallery
    })
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
router.get('/photos', sharify, renderPhotos)
if (config.photos.serveDirect) {
  router.get('/app/photos', sharify, renderPhotos)
}

module.exports = router
