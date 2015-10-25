import GalleryList from './GalleryList'
import Photo from './Photo'
import React from 'react'

const PhotoGallery = React.createClass({
  render: function() {
    return (
      <div className='galleryApp'>
        <Photo
          gallery={this.props.gallery}
          photo={this.props.gallery.photos[0]} />
        <GalleryList galleries={this.props.galleries} />
      </div>
      )
  }
})

export default PhotoGallery
