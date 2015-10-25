import React from 'react'

function links(previousPhoto, nextPhoto) {
  var links = []
  if (previousPhoto) {
    links.push(<a href={previousPhoto.pageURI}>
      &lt;$lt;prevous&nbsp;
    </a>)
  }

  if (nextPhoto) {
    links.push(<a href={nextPhoto.pageURI}>
      next&gt;&gt;
    </a>)
  }
  return links
}
const Thumbnails = React.createClass({

  render: function() {
    var thumbnails = this.props.gallery.photos.map(function (photo) {
      return (
        <a className='thumbnail' href={photo.pageURI}>
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
