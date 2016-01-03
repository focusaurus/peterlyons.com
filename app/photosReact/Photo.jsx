import React from 'react'

function links (props) {
  var links = []
  if (props.previousPhoto) {
    links.push(<a
    href={props.previousPhoto.pageURI}
    onClick={(event) => {
      event.preventDefault();props.viewPhoto(props.previousPhoto.name)
    }}
    key='previous'>
        &larr;prevous&nbsp;
      </a>)
  }

  if (props.nextPhoto) {
    links.push(<a
    href={props.nextPhoto.pageURI}
    onClick={(event) => {
      event.preventDefault();props.viewPhoto(props.nextPhoto.name)
    }}
    key='next'>
        next&rarr;
      </a>)
  }
  return links
}

function Photo (props) {
  const photo = props.photo
  return (
    <div className="photo">
      <div id='nextPrev'>
        {links(props)}
      </div>
      <figure>
        <img src={photo.fullSizeURI} alt={photo.caption} title={photo.caption}>
        </img>
        <figcaption>{photo.caption}</figcaption>
      </figure>
    </div>
    )
}

export default Photo
