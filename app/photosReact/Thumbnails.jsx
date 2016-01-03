import React from 'react'

function Thumbnails (props) {
  var thumbnails = props.gallery.photos.map(function (photo) {
    return (
      <a
      className='thumbnail'
      href={photo.pageURI}
      key={photo.pageURI}
      onClick={(event) => {
        event.preventDefault()
        props.viewPhoto(photo.name)
      }}>
            <img
      className='thumbnail'
      src={photo.thumbnailURI}
      alt={photo.caption}
      title={photo.caption}></img>
          </a>
      )
  })
  const gallery = props.gallery
  const photo = props.photo
  const index = gallery.photos.indexOf(photo)
  return (<div className="thumbnails">{thumbnails}</div>)
}

export default Thumbnails
