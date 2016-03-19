const PhotoGallery = require('./photo-gallery')
const React = require('react')
const ReactDOM = require('react-dom')
const sharify = require('sharify')

const element = React.createElement(PhotoGallery, {
  galleries: sharify.data.galleries,
  gallery: sharify.data.gallery
})
ReactDOM.render(element, document.querySelector('.galleryApp'))
