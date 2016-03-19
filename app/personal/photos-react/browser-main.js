var PhotoGallery = require('./photo-gallery')
var React = require('react')
var ReactDOM = require('react-dom')
var sharify = require('sharify')

var galleryApp = document.querySelector('.gallery-app')
var element = React.createElement(PhotoGallery, sharify.data)
ReactDOM.render(element, galleryApp)
