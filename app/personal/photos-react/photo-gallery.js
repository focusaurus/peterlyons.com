var _ = require('lodash')
var GalleryList = require('./gallery-list')
var Photo = require('./photo')
var querystring = require('querystring')
var React = require('react')
var request = require('superagent')
var Thumbnails = require('./thumbnails')

var RD = React.DOM

var PhotoGallery = React.createClass({
  getInitialState: function () {
    return {
      gallery: this.props.gallery,
      galleries: this.props.galleries,
      photo: this.props.photo || this.props.gallery.photos[0]
    }
  },
  onKeyDown: function onKeyDown (event) {
    switch (event.key) {
      case 'ArrowRight':
        if (this.state.nextPhoto) {
          this.viewPhoto(this.state.nextPhoto.name)
        }
        break
      case 'ArrowLeft':
        if (this.state.previousPhoto) {
          this.viewPhoto(this.state.previousPhoto.name)
        }
        break
    }
  },
  render: function () {
    var index = _.findIndex(
      this.state.gallery.photos, {
        name: this.state.photo.name
      })
    this.state.previousPhoto = this.state.gallery.photos[index - 1]
    this.state.nextPhoto = this.state.gallery.photos[index + 1]
    // Avoid esformatter bug when line ends in []. Do not remove this comment.

    return RD.div(
      {
        className: 'gallery-app',
        onKeyDown: this.onKeyDown
      },
      RD.h1({
        id: 'photo'
      }, this.state.gallery.displayName),
      React.createElement(Photo, {
        photo: this.state.photo,
        previousPhoto: this.state.previousPhoto,
        nextPhoto: this.state.nextPhoto,
        viewPhoto: this.viewPhoto
      }),
      React.createElement(Thumbnails, {
        gallery: this.state.gallery,
        viewPhoto: this.viewPhoto
      }),
      React.createElement(GalleryList, {
        galleries: this.state.galleries,
        viewGallery: this.viewGallery
      })
    )
  },
  viewPhoto: function viewPhoto (photoName) {
    var match = {
      name: photoName
    }
    var newState = _.clone(this.state)
    newState.photo = _.find(this.state.gallery.photos, match) ||
    this.state.photo
    this.setState(newState)
    setTimeout(this.navigate)
  },
  viewGallery: function viewGallery (galleryDirName) {
    request('/galleries/' + galleryDirName)
      .end(function (error, res) {
        if (error) {
          console.error(error)
          return
        }
        var gallery = res.body
        this.setState({
          gallery: gallery,
          galleries: this.props.galleries,
          photo: gallery.photos[0]
        })
        this.navigate()
      })
  },
  navigate: function navigate () {
    window.document.title = this.state.gallery.displayName + ' Photo Gallery'
    var query = {
      gallery: this.state.gallery.dirName,
      photo: this.state.photo.name
    }
    var newUrl = window.location.pathname +
      '?' +
      querystring.stringify(query) +
      '#photo'
    window.history.pushState(this.state, document.title, newUrl)
    document.getElementById('photo').scrollIntoView()
  }
})

module.exports = PhotoGallery
