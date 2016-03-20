var pd = require('./prevent-default')
var React = require('react')

var RD = React.DOM

function links (props, year) {
  return year.galleries.map(function (gallery) {
    return RD.a({
      className: 'gallerylink',
      href: '?gallery=' + encodeURIComponent(gallery.dirName),
      key: gallery.dirName,
      onClick: pd(function (event) {
        props.viewGallery(gallery.dirName)
      })}, gallery.displayName)
  })
}

function getYears (galleries) {
  'use strict'
  var byYear = {}
  galleries.forEach(function (gallery2) {
    var year = gallery2.startDate.split('-')[0]
    if (!byYear[year]) {
      byYear[year] = []
    }
    byYear[year].push(gallery2)
  })

  var years = []
  for (var year2 in byYear) {
    var galleriesInYear = byYear[year2]
    // Avoid esformatter bug when line ends in []. Do not remove this comment.
    years.push({
      name: year2,
      galleries: galleriesInYear
    })
  }
  years.reverse()
  return years
}

function GalleryList (props) {
  var years = getYears(props.galleries)
  var yearNodes = years.map(function (year) {
    return RD.div({key: year.name},
      RD.h2({className: 'year'}, year.name),
      links(props, year)
    )
  })
  return RD.nav({className: 'photos'}, yearNodes)
}

module.exports = GalleryList
