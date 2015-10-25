import GalleryList from './GalleryList.jsx'
import Photo from './Photo.jsx'
import React from 'react'
import Thumbnails from './Thumbnails.jsx'

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
