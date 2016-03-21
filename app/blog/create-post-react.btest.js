var CreatePost = require('./create-post-react')
var expect = require('chaimel')
var React = require('react')
var enzyme = require('enzyme')

describe('Blog CreatePost', function () {
  var cpElement = React.createElement(CreatePost)

  it('should render in DOM properly', function () {
    enzyme.mount(cpElement)
  })

  it('should have the correct initial title', function () {
    var wrapper = enzyme.mount(cpElement)
    var title = wrapper.find('input[name="title"]')
    expect(title.node.value).toEqual('new-post-title-here')
  })
  //
  // it('should preview markdown to HTML', function (done) {
  //   // fauxJax.install()
  //   // fauxJax.on('request', respond)
  //   var preview = container.querySelector('section.preview')
  //   var html = '<p>unit test <b>markdown</b></p>'
  //   // function respond (request) {
  //   //   request.respond(200, {}, html)
  //   //   fauxJax.restore()
  //   //   done()
  //   // }
  //   server.respondWith('POST', 'convert', [200, {}, html])
  //
  //   ReactTestUtils.Simulate.change(
  //     cp.refs.content, {target: {value: 'unit test **markdown**'}})
  //   server.respond()
  //   this.timeout(0)
  //   setTimeout(function () {
  //     expect(preview.innerHTML).toEqual(html)
  //     done()
  //   }, 1000)
  // })
})
