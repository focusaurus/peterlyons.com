var CreatePost = require('./create-post-react')
// var expect = require('chaimel')
// var fauxJax = require('faux-jax')
// var sinon = require('sinon')
var React = require('react')
var ReactDOM = require('react-dom')
// var ReactTestUtils = require('react-addons-test-utils')
// var enzyme = require('enzyme')

describe('Blog CreatePost', function () {
  // var wrapper
  var container
  // var cp
  // var server

  before(function () {
    container = document.createElement('div')
    container.classList.add('create-post-react-test')
    container.style.display = 'none'
    document.body.appendChild(container)
    // server = sinon.fakeServer.create()
  })

  it('should render in DOM properly', function () {
    // var wrapper = enzyme.mount(CreatePost)
    // cp = ReactDOM.render(React.createElement(CreatePost), container)
    ReactDOM.render(React.createElement(CreatePost), container)
  })

  // it('should have the correct initial title', function () {
  //   var wrapper = enzyme.mount(CreatePost)
  //   var title = wrapper.find('input[name="title"]')
  //   expect(title.value).toEqual('new-post-title-here')
  // })
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

  after(function () {
    document.body.removeChild(container)
    // server.restore()
  })
})
