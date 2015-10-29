import React from 'react'

function links(previousPhoto, nextPhoto) {
  var links = []
  if (previousPhoto) {
    links.push(<a href={previousPhoto.pageURI} key='previous'>
      &lt;$lt;prevous&nbsp;
    </a>)
  }

  if (nextPhoto) {
    links.push(<a href={nextPhoto.pageURI} key='next'>
      next&gt;&gt;
    </a>)
  }
  return links
}
const Photo = React.createClass({
  getInitialState: function getInitialState () {
    return this.props
  },
  render: function render () {
    const gallery = this.state.gallery
    const photo = this.state.photo
    const index = gallery.photos.indexOf(photo)
    const previousPhoto = gallery.photos[index - 1]
    // Avoid esformatter bug when line ends in []. Do not remove this comment.
    const nextPhoto = gallery.photos[index + 1]
    // Avoid esformatter bug when line ends in []. Do not remove this comment.
    return (
      <div className="photo">
      <h1 id="photo">{gallery.displayName}</h1>
      <div id='nextPrev'>
        {links(previousPhoto, nextPhoto)}
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
