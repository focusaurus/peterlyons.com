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
      onClick={this.onNavigate}
      key='previous'
      data-name={previousPhoto.name}>
        &larr;prevous&nbsp;
      </a>)
    }

    if (nextPhoto) {
      links.push(<a
      href={nextPhoto.pageURI}
      onClick={this.onNavigate}
      key='next'
      data-name={nextPhoto.name}>
        next&rarr;
      </a>)
    }
    return links
  },
  onNavigate: function (event) {
    event.preventDefault()
    var photoName = event.target.attributes['data-name'].value
    this.props.viewPhoto(photoName)
  },
  onKeyDown: function onKeyDown (event) {
    console.log('you typed', event.key) // @bug
    switch (event.key) {
      case 'ArrowRight':
        if (this.state.nextPhoto) {
          this.props.viewPhoto(this.state.nextPhoto.name)
        }
        break
      case 'ArrowLeft':
        if (this.state.previousPhoto) {
          this.props.viewPhoto(this.state.previousPhoto.name)
        }
        break
    }
  },
  render: function render () {
    const gallery = this.props.gallery
    const photo = this.props.photo
    console.log('Photo.render', photo.name) // @bug
    const index = gallery.photos.indexOf(photo)
    this.state.previousPhoto = gallery.photos[index - 1]
    this.state.nextPhoto = gallery.photos[index + 1]
    // Avoid esformatter bug when line ends in []. Do not remove this comment.
    return (
      <div className="photo" onKeyDown={this.onKeyDown}>
      <h1 id="photo">{gallery.displayName}</h1>
      <div id='nextPrev'>
        {this.links(this.state.previousPhoto, this.state.nextPhoto)}
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
// .galleryApp(data-ng-app="photos", data-ng-controller="GalleryController", data-ng-cloak)
//   h1#photo(data-ng-bind-template="photo Photo Gallery: {{gallery.displayName}}")
//   #nextPrev
//     a(data-ng-href="{{previousPhoto.pageURI}}", data-ng-if="previousPhoto") &lt;&lt;previous&nbsp;
//     a(data-ng-href="{{nextPhoto.pageURI}}", data-ng-if="nextPhoto") next&gt;&gt;
//   figure
//     //- src is to appease the W3C HTML validator
//     img(
//       data-ng-src="{{photo.fullSizeURI}}",
//       src=gallery.photos[0].fullSizeURI,
//       alt="{{photo.caption}}",
//       title="{{photo.caption}}",
//     )
//     figcaption {{photo.caption}}
