const PhotoGallery = require('./photo-gallery')
const React = require('react')
const ReactDOM = require('react-dom')
const sharify = require('sharify')

/* global document */
const galleryApp = document.querySelector('.gallery-app')
const element = React.createElement(PhotoGallery, sharify.data)
ReactDOM.render(element, galleryApp)
