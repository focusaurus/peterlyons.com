var React = require('react')
var ReactDOM = require('react-dom')
var ReactTestUtils = require('react-addons-test-utils')
var PhotoGallery = require('./photo-gallery')
var expect = require('chaimel')
var galleries = require('./galleries-test.json')

describe('PhotoGallery', function () {
  var container

  before(function () {
    container = document.createElement('div')
    container.classList.add('photos-react-test')
    container.style.display = 'none'
    document.body.appendChild(container)
  })

  it('should render in DOM properly', function () {
    var element = React.createElement(PhotoGallery, {
      galleries: galleries,
      gallery: galleries[0],
      photo: galleries[0].photos[2]
    })
    ReactDOM.render(element, container)
  })

  it('should have the correct list of galleries', function () {
    var galleries = container.querySelectorAll('a.gallerylink')
    expect(galleries.length).toEqual(2)
    expect(galleries[1].innerText).toEqual('Unit Test Gallery 2')
  })

  it('should have the correct thumbnails', function () {
    var thumbnails = container.querySelectorAll('a.thumbnail')
    expect(thumbnails.length).toEqual(3)
    expect(thumbnails[0].href).toInclude(
      '/app/photos-react?gallery=burning_man_2011&photo=001_hexayurt_model')
  })

  after(function () {
    document.body.removeChild(container)
  })
})
