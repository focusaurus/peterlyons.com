// import GalleryList from './gallery-list'
// import Photo from './photo'
// import React from 'react'
// import Thumbnails from './thumbnails'
const _ = require('lodash')
const GalleryList = require('./gallery-list')
const Photo = require('./photo')
const querystring = require('querystring')
const React = require('react')
const request = require('superagent')
const Thumbnails = require('./thumbnails')

const RD = React.DOM

const PhotoGallery = React.createClass({
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
    const index = this.state.gallery.photos.indexOf(this.state.photo)
    this.state.previousPhoto = this.state.gallery.photos[index - 1]
    this.state.nextPhoto = this.state.gallery.photos[index + 1]
    // Avoid esformatter bug when line ends in []. Do not remove this comment.
    // return (
    //   <div className='galleryApp' onKeyDown={this.onKeyDown}>
    //     <h1 id="photo">{this.state.gallery.displayName}</h1>
    //     <Photo
    //   photo={this.state.photo}
    //   previousPhoto={this.state.previousPhoto}
    //   nextPhoto={this.state.nextPhoto}
    //   viewPhoto={this.viewPhoto}/>
    //     <Thumbnails
    //   gallery={this.state.gallery}
    //   viewPhoto={this.viewPhoto}/>
    // <GalleryList
    //   galleries={this.state.galleries}
    //   viewGallery={this.viewGallery}/>
    //   </div>
    //   )

    return RD.div(
      {className: 'galleryApp', onKeyDown: this.onKeyDown},
      RD.h1({id: 'photo'}, this.state.gallery.displayName),
      React.createElement(Photo, {
        photo: this.state.photo,
        previousPhoto: this.state.previousPhoto,
        nextPhoto: this.state.nextPhoto,
        viewPhoto: this.viewPhoto }),
      React.createElement(Thumbnails, {
        gallery: this.state.gallery,
        viewPhoto: this.viewPhoto }),
      React.createElement(GalleryList, {
        galleries: this.state.galleries,
        viewGallery: this.viewGallery })
    )
  },
  viewPhoto: function viewPhoto (photoName) {
    const match = {
      name: photoName
    }
    const newState = _.clone(this.state)
    newState.photo = _.find(this.state.gallery.photos, match) ||
      this.state.photo
    this.setState(newState)
    setTimeout(this.navigate)
  },
  viewGallery: function viewGallery (galleryDirName) {
    request('/galleries/' + galleryDirName)
      .end((error, res) => {
        if (error) {
          console.error(error)
          return
        }
        const gallery = res.body
        this.setState({
          gallery,
          galleries: this.props.galleries,
          photo: gallery.photos[0]
        })
        this.navigate()
      })
  },
  navigate: function navigate () {
    window.document.title = this.state.gallery.displayName + ' Photo Gallery'
    const query = {
      gallery: this.state.gallery.dirName,
      photo: this.state.photo.name
    }
    const newUrl = window.location.pathname +
      '?' +
      querystring.stringify(query) +
      '#photo'
    window.history.pushState(this.state, document.title, newUrl)
    document.getElementById('photo').scrollIntoView()
  }
})

module.exports = PhotoGallery
