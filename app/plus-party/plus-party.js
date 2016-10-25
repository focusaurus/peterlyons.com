var core = require('./plus-party-core')
var React = require('react')

var RD = React.DOM
var initialText = "Paste some numbers in here and we'll total them up" +
  " even if there's some words and junk, too.\n\n" +
  'For example: 1 plus 2 plus 2 plus 1'

function numberItem (number, index) {
  return RD.li({key: index}, number.toFixed(2).toString())
}

var PlusParty = React.createClass({
  getInitialState: function getInitialState () {
    return {rawText: initialText, copyAlert: false}
  },

  onChange: function onChange (event) {
    this.setState({rawText: event.target.value})
  },

  stopAlert: function stopAlert () {
    this.setState({copyAlert: false})
  },

  onClick: function onClick () {
    this.setState({copyAlert: true})
    setTimeout(this.stopAlert, 2000)
  },

  render: function render () {
    var numbers = core.parseNumbers(this.state.rawText)
    var total = numbers.reduce(core.sum, 0)
    var buttonText = 'Copy Total to Clipboard'
    if (this.state.copyAlert) {
      buttonText = 'Copied!'
    }
    return RD.div({className: 'plus-party'},
      RD.textarea({
        onChange: this.onChange,
        value: this.state.rawText,
        ref: 'rawText'
      }),
      RD.button({
        id: 'copyToClipboard',
        'data-clipboard-text': total,
        onClick: this.onClick
      }, buttonText),
      RD.ul({className: 'clear'}, numbers.map(numberItem)),
      RD.div({className: 'total'}, total)
    )
  },

  componentDidMount: function componentDidMount () {
    var ClipBoard = require('clipboard')
    new ClipBoard('#copyToClipboard') // eslint-disable-line no-new
  }
})

exports.PlusParty = React.createElement(PlusParty)
