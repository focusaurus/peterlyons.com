// var ReactTestUtils = require('react-addons-test-utils')
var CreatePost = require('./create-post-react')
var expect = require('chaimel')
var React = require('react')
var ReactDOM = require('react-dom')

describe('Blog CreatePost', function () {
  var container
  var cp // eslint-disable-line no-unused-vars

  before(function () {
    container = document.createElement('div')
    container.classList.add('create-post-react-test')
    container.style.display = 'none'
    document.body.appendChild(container)
  })

  it('should render in DOM properly', function () {
    cp = ReactDOM.render(React.createElement(CreatePost), container)
  })

  it('should have the correct initial title', function () {
    var title = container.querySelector('input[name="title"]')
    expect(title.value).toEqual('new-post-title-here')
  })

  // it('should update total correctly', function () {
  //   var total = container.querySelector('.total')
  // ReactTestUtils.Simulate.change(cp.refs.rawText, {target: {value: '5 6 7'}})
  //   expect(total.innerText).toEqual('18')
  // })
  //
  // it('should parse out numbers correctly', function () {
  //   var ul = container.querySelector('ul')
  //   ReactTestUtils.Simulate.change(
  //     cp.refs.rawText, {target: {value: 'nope 42 biscuits 7 8.5'}})
  //   expect(ul.children.length).toEqual(3)
  //   expect(container.querySelector('.total').innerText).toEqual('57.5')
  // })

  after(function () {
    document.body.removeChild(container)
  })
})
