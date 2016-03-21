var React = require('react')
var PhotoGallery = require('./photo-gallery')
var expect = require('chaimel')
var galleries = require('./galleries-test')
var enzyme = require('enzyme')

describe('PhotoGallery', function () {
  var wrapper
  before(function () {
    var element = React.createElement(PhotoGallery, {
      galleries: galleries,
      gallery: galleries[0],
      photo: galleries[0].photos[2]
    })
    wrapper = enzyme.mount(element)
  })

  it('should have the correct list of galleries', function () {
    var galleries = wrapper.find('a.gallerylink')
    expect(galleries).toHaveLength(2)
    expect(galleries.get(1).innerText).toEqual('Unit Test Gallery 2')
  })

  it('should have the correct thumbnails', function () {
    var thumbnails = wrapper.find('a.thumbnail')
    expect(thumbnails).toHaveLength(3)
    expect(thumbnails.get(0).href).toInclude(
      '/app/photos?gallery=burning_man_2011&photo=001_hexayurt_model')
  })
})
