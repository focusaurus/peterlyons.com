const pd = require('./prevent-default')
const React = require('react')

const RD = React.DOM

function links (props) {
  'use strict'
  var links = []
  if (props.previousPhoto) {
    let attrs = {
      href: props.previousPhoto.pageURI,
      onClick: pd((event) => {
        props.viewPhoto(props.previousPhoto.name)
      }),
      key: 'previous',
      dangerouslySetInnerHTML: {__html: '&larr;previous&nbsp;'}
    }
    links.push(RD.a(attrs))
  }

  if (props.nextPhoto) {
    let attrs = {
      href: props.nextPhoto.pageURI,
      onClick: pd((event) => {
        props.viewPhoto(props.nextPhoto.name)
      }),
      key: 'next',
      dangerouslySetInnerHTML: {__html: 'next&rarr;'}
    }
    links.push(RD.a(attrs))
  }
  return links
}

function Photo (props) {
  const photo = props.photo
  // return (
  //   <div className="photo">
  //     <div id='nextPrev'>
  //       {links(props)}
  //     </div>
  //     <figure>
  //       <img src={photo.fullSizeURI} alt={photo.caption} title={photo.caption}>
  //       </img>
  //       <figcaption>{photo.caption}</figcaption>
  //     </figure>
  //   </div>
  //   )
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
