var ReactDOM = require('react-dom')
var ReactTestUtils = require('react-addons-test-utils')
var PlusParty = require('./plus-party-react')
var expect = require('chaimel')

describe('PlusParty', function () {
  var container
  var pp

  before(function () {
    container = document.createElement('div')
    container.classList.add('plus-party-test')
    container.style.display = 'none'
    document.body.appendChild(container)
  })

  it('should render in DOM properly', function () {
    pp = ReactDOM.render(PlusParty.PlusParty, container)
  })

  it('should have the correct initial total', function () {
    var total = container.querySelector('.total')
    expect(total.innerText).toEqual('6')
  })

  it('should update total correctly', function () {
    var total = container.querySelector('.total')
    ReactTestUtils.Simulate.change(pp.refs.rawText, {target: {value: '5 6 7'}})
    expect(total.innerText).toEqual('18')
  })

  it('should parse out numbers correctly', function () {
    var ul = container.querySelector('ul')
    ReactTestUtils.Simulate.change(
      pp.refs.rawText, {target: {value: 'nope 42 biscuits 7 8.5'}})
    expect(ul.children.length).toEqual(3)
  })

  after(function () {
    document.body.removeChild(container)
  })
})
