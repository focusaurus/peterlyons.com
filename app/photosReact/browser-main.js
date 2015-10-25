var PhotoGallery = require('./PhotoGallery.jsx')
var React = require('react')
var ReactDOM = require('react-dom')
var sharify = require('sharify')

var element = React.createElement(PhotoGallery, {
  galleries: sharify.data.galleries,
  gallery: sharify.data.gallery
})
ReactDOM.render(element, document.querySelector('.galleryApp'))
