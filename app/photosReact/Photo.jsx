import React from 'react'

const Photo = React.createClass({
  getInitialState: function () {
    return {}
  },
  links: function links (previousPhoto, nextPhoto) {
    var links = []
    if (previousPhoto) {
      links.push(<a
      href={previousPhoto.pageURI}
      onClick={(event) => {event.preventDefault();this.props.viewPhoto(previousPhoto.name)}}
      key='previous'>
        &larr;prevous&nbsp;
      </a>)
    }

    if (nextPhoto) {
      links.push(<a
      href={nextPhoto.pageURI}
      onClick={(event) => {event.preventDefault();this.props.viewPhoto(nextPhoto.name)}}
      key='next'>
        next&rarr;
      </a>)
    }
    return links
  },

  render: function render () {
    const photo = this.props.photo
    return (
      <div className="photo">
      <div id='nextPrev'>
        {this.links(this.props.previousPhoto, this.props.nextPhoto)}
      </div>
      <figure>
        <img src={photo.fullSizeURI} alt={photo.caption} title={photo.caption}>
        </img>
        <figcaption>{photo.caption}</figcaption>
      </figure>
    </div>
      )
  }
})

export default Photo
