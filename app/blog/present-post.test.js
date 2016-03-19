var presentPost = require('./present-post')
var expect = require('chaimel')

describe('presentPost', function () {
  it('should format the date', function () {
    var presented = presentPost({
      'publish_date': new Date(2014, 0, 31),
      title: 'foo'
    })
    expect(presented.date).toEqual('Jan 31, 2014')
  })
  it('should trim the title', function () {
    var presented = presentPost({
      'publish_date': new Date(2014, 0, 31),
      title: ' a '
    })
    expect(presented.title).toEqual('a')
  })
})
