import GalleryList from './GalleryList'
import Photo from './Photo'
import React from 'react'
import Thumbnails from './Thumbnails'

const PhotoGallery = React.createClass({
  render: function() {
    return (
      <div className='galleryApp'>
        <Photo
          gallery={this.props.gallery}
          photo={this.props.gallery.photos[0]} />
        <Thumbnails gallery={this.props.gallery} />
        <GalleryList galleries={this.props.galleries} />
      </div>
      )
  }
})

export default PhotoGallery
