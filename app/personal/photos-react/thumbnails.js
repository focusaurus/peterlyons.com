const React = require('react')

const RD = React.DOM

function Thumbnails (props) {
  var thumbnails = props.gallery.photos.map(function (photo) {
    // return (
    //   <a
    //   className='thumbnail'
    //   href={photo.pageURI}
    //   key={photo.pageURI}
    //   onClick={(event) => {
    //     event.preventDefault()
    //     props.viewPhoto(photo.name)
    //   }}>
    //         <img
    //   className='thumbnail'
    //   src={photo.thumbnailURI}
    //   alt={photo.caption}
    //   title={photo.caption}></img>
    //       </a>
    //   )
    return RD.a({
      className: 'thumbnail',
      href: photo.pageURI,
      key: photo.pageURI,
      onClick: (event) => {
        event.preventDefault()
        props.viewPhoto(photo.name)
      }},
      RD.img({
        className: 'thumbnail',
        src: photo.thumbnailURI,
        alt: photo.caption,
        title: photo.caption })
      )
  })
  // const gallery = props.gallery
  // const photo = props.photo
  // return (<div className="thumbnails">{thumbnails}</div>)
  return RD.div({className: 'thumbnails'}, thumbnails)
}

module.exports = Thumbnails
