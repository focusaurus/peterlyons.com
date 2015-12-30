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

  render: function render () {
    const gallery = this.props.gallery
    const photo = this.props.photo
    return (
      <div className="photo">
      <h1 id="photo">{gallery.displayName}</h1>
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
