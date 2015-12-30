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
  render: function () {
    console.log('PhotoGallery rendering', this.state.photo.name) // @bug
    return (
      <div className='galleryApp'>
        <Photo
          gallery={this.state.gallery}
          photo={this.state.photo}
          viewPhoto={this.viewPhoto}/>
        <Thumbnails
          gallery={this.state.gallery}
          viewPhoto={this.viewPhoto}/>
        <GalleryList galleries={this.state.galleries}/>
      </div>
      )
  },
  viewPhoto: function viewPhoto (photoName) {
    console.log('viewPhoto', photoName) // @bug
    const match = {
      name: photoName
    }
    var newState = _.clone(this.state)
    newState.photo = _.find(this.state.gallery.photos, match) || this.state.photo
    this.setState(newState)
  }
})

export default PhotoGallery
