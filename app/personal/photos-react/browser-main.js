const PhotoGallery = require('./photo-gallery')
const React = require('react')
const ReactDOM = require('react-dom')
const sharify = require('sharify')

const element = React.createElement(PhotoGallery, sharify.data)
ReactDOM.render(element, document.querySelector('.galleryApp'))
