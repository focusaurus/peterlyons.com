var pd = require('./prevent-default')
var React = require('react')

var RD = React.DOM

function links (props) {
  'use strict'
  var links = []
  if (props.previousPhoto) {
    var attrs = {
      href: props.previousPhoto.pageURI,
      onClick: pd(function (event) {
        props.viewPhoto(props.previousPhoto.name)
      }),
      key: 'previous',
      dangerouslySetInnerHTML: {__html: '&larr;previous&nbsp;'}
    }
    links.push(RD.a(attrs))
  }

  if (props.nextPhoto) {
    var attrs2 = {
      href: props.nextPhoto.pageURI,
      onClick: pd(function (event) {
        props.viewPhoto(props.nextPhoto.name)
      }),
      key: 'next',
      dangerouslySetInnerHTML: {__html: 'next&rarr;'}
    }
    links.push(RD.a(attrs2))
  }
  return links
}

function Photo (props) {
  var photo = props.photo
  return RD.div({className: 'photo'},
    RD.div({id: 'nextPrev'}, links(props)),
    RD.figure(null,
      RD.img({
        src: photo.fullSizeURI,
        alt: photo.caption,
        title: photo.caption
      }),
      RD.figcaption(null, photo.caption)
    )
  )
}

module.exports = Photo
