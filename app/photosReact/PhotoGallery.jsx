import GalleryList from './GalleryList.jsx'
import Photo from './Photo.jsx'
import React from 'react'
import Thumbnails from './Thumbnails.jsx'
var _ = require('lodash')

const PhotoGallery = React.createClass({
  getInitialState: function () {
    return {
      gallery: this.props.gallery,
      galleries: this.props.galleries,
      photo: this.props.gallery.photos[0]
    }
  },
  onKeyDown: function onKeyDown (event) {
    console.log('you typed', event.key) // @bug
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
    return (
      <div className='galleryApp' onKeyDown={this.onKeyDown}>
        <h1 id="photo">{this.state.gallery.displayName}</h1>
        <Photo
          photo={this.state.photo}
          previousPhoto={this.state.previousPhoto}
          nextPhoto={this.state.nextPhoto}
          viewPhoto={this.viewPhoto}/>
        <Thumbnails
          gallery={this.state.gallery}
          viewPhoto={this.viewPhoto}/>
        <GalleryList galleries={this.state.galleries}/>
      </div>
      )
  },
  viewPhoto: function viewPhoto (photoName) {
    const match = {
      name: photoName
    }
    var newState = _.clone(this.state)
    newState.photo = _.find(this.state.gallery.photos, match) || this.state.photo
    this.setState(newState)
  }
})

export default PhotoGallery
