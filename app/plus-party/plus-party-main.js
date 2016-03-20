var ReactDOM = require('react-dom')
var plusParty = require('./plus-party')

function init () {
  ReactDOM.render(plusParty.PlusParty, document.querySelector('.plus-party'))
}

exports.init = init
