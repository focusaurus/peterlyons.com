import React from 'react'

const Thumbnails = React.createClass({
  onClickPhoto: function (event) {
    event.preventDefault()
    var photoName = event.target.parentElement.attributes['data-name'].value
    this.props.viewPhoto(photoName)
  },
  render: function () {
    var self = this
    var thumbnails = this.props.gallery.photos.map(function (photo) {
      return (
          <a
            className='thumbnail'
            href={photo.pageURI}
            data-name={photo.name}
            key={photo.pageURI}
            onClick={self.onClickPhoto}>
            <img
              className='thumbnail'
              src={photo.thumbnailURI}
              alt={photo.caption}
              title={photo.caption}></img>
          </a>
          )
      })
    const gallery = this.props.gallery
    const photo = this.props.photo
    const index = gallery.photos.indexOf(photo)
    return (<div className="thumbnails">{thumbnails}</div>)
  }
})

export default Thumbnails
