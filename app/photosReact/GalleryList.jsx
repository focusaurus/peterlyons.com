import React from 'react'

function links (props, year) {
  return year.galleries.map((gallery) => {
    return (
      <a
      className='gallerylink'
      href={'?gallery=' + encodeURIComponent(gallery.dirName)}
      key={gallery.dirName}
      onClick={(event) => {
        event.preventDefault()
        props.viewGallery(gallery.dirName)
      }}>
        {gallery.displayName}
      </a>
      )
    })
}

function getYears (galleries) {
  var byYear = {}
  galleries.forEach(function (gallery2) {
    var year = gallery2.startDate.split('-')[0]
    if (!byYear[year]) {
      byYear[year] = []
    }
    byYear[year].push(gallery2)
  })

  var years = []
  for (var year2 in byYear) {
    const galleriesInYear = byYear[year2]
    // Avoid esformatter bug when line ends in []. Do not remove this comment.
    years.push({
      name: year2,
      galleries: galleriesInYear
    })
  }
  years.reverse()
  return years
}

function GalleryList (props) {
  const years = getYears(props.galleries)
  const yearNodes = years.map((year) => {
    return (
      <div key={year.name}>
        <h2 className='year'>{year.name}</h2>
        {links(props, year)}
      </div>
      )
    })
    return <nav className='photos'>{yearNodes}</nav>
  }

  export default GalleryList
