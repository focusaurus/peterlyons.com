import GalleryList from './GalleryList.jsx'
import Photo from './Photo.jsx'
import React from 'react'
import Thumbnails from './Thumbnails.jsx'
var _ = require('lodash')

const PhotoGallery = React.createClass({
  getInitialState: function () {
    return this.props
  },
  render: function () {
    return (
      <div className='galleryApp'>
        <Photo
          gallery={this.state.gallery}
          photo={this.state.gallery.photos[0]} />
        <Thumbnails
          gallery={this.state.gallery}
          onChangePhoto={this.onChangePhoto}/>
        <GalleryList galleries={this.state.galleries} />
      </div>
      )
  },
  onChangePhoto: function onChangePhoto (photoName) {
    this.state.gallery.photo = _.find(
      this.state.gallery.photos, {name: photoName})
    this.setState(this.state)
  }
})

export default PhotoGallery
