var CreatePost = require('./create-post-react')
var React = require('react')
var ReactDOM = require('react-dom')

var reactEl = React.createElement(CreatePost, {storage: window.localStorage})
var domEl = document.querySelector('.create-post-container')
ReactDOM.render(reactEl, domEl)
