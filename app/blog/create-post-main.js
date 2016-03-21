var React = require('react')
var ReactDOM = require('react-dom')

var CreatePost = require('./create-post-react')

function init () {
  var reactEl = React.createElement(CreatePost, {storage: window.localStorage})
  var domEl = document.querySelector('.create-post-container')
  ReactDOM.render(reactEl, domEl)
}

exports.init = init
