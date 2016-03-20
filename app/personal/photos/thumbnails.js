var pd = require('./prevent-default')
var React = require('react')

var RD = React.DOM

function Thumbnails (props) {
  var thumbnails = props.gallery.photos.map(function (photo) {
    return RD.a({
      className: 'thumbnail',
      href: photo.pageURI,
      key: photo.pageURI,
      onClick: pd(function (event) {
        props.viewPhoto(photo.name)
      })},
      RD.img({
        className: 'thumbnail',
        src: photo.thumbnailURI,
        alt: photo.caption,
        title: photo.caption })
      )
  })
  return RD.div({className: 'thumbnails'}, thumbnails)
}

module.exports = Thumbnails
