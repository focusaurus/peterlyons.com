var CreatePost = require('./create-post-react')
var expect = require('chaimel')
var React = require('react')
var enzyme = require('enzyme')

describe('Blog CreatePost', function () {
  var storage = {}
  var cpElement = React.createElement(CreatePost, {storage: storage})

  it('should render in DOM properly', function () {
    enzyme.mount(cpElement)
  })

  it('should have the correct initial default title', function () {
    var wrapper = enzyme.mount(cpElement)
    var title = wrapper.find('input[name="title"]')
    expect(title.node.value).toEqual('new-post-title-here')
  })

  it('should load title from storage', function () {
    var element = React.createElement(CreatePost, {
      storage: {
        postDraft: '{"title":"title from storage"}'
      }
    })
    var wrapper = enzyme.mount(element)
    expect(wrapper.state()).toHaveProperty('title', 'title from storage')
    var title = wrapper.find('input[name="title"]')
    expect(title.node.value).toEqual('title from storage')
  })

  it('should load content from storage', function () {
    var element = React.createElement(CreatePost, {
      storage: {
        postDraft: '{"content":"content from storage"}'
      }
    })
    var wrapper = enzyme.mount(element)
    expect(wrapper.state()).toHaveProperty(
      'contentMarkdown', 'content from storage')
    var content = wrapper.find('textarea')
    expect(content.node.value).toEqual('content from storage')
  })

  it('should track title changes', function () {
    var wrapper = enzyme.mount(cpElement)
    var title = wrapper.find('input[name="title"]')
    title.simulate('change', {target: {value: 'new title 1'}})
    expect(wrapper.state()).toHaveProperty('title', 'new title 1')
    expect(storage).toHaveProperty('postDraft')
    var postDraft
    try {
      postDraft = JSON.parse(storage.postDraft)
    } catch (e) {
      expect(e).notToExist()
    }
    expect(postDraft).toHaveProperty('title', 'new title 1')
  })

  it('should track password changes', function () {
    var wrapper = enzyme.mount(cpElement)
    var password = wrapper.find('input[type="password"]')
    password.simulate('change', {target: {value: 'new password 1'}})
    expect(wrapper.state()).toHaveProperty('password', 'new password 1')
  })

  it('should disable save button initially', function () {
    var wrapper = enzyme.mount(cpElement)
    var save = wrapper.find('button')
    expect(save.node.disabled).toBeTrue()
  })

  it('should enable save button when password is set', function () {
    var wrapper = enzyme.mount(cpElement)
    var save = wrapper.find('button')
    var password = wrapper.find('input[type="password"]')
    password.simulate('change', {target: {value: 'a'}})
    expect(save.node.disabled).toBeFalse()
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
