const CreatePost = require("./create-post-react");
const React = require("react");
const ReactDOM = require("react-dom");
/* global window */

const reactEl = React.createElement(CreatePost, {
  storage: window.localStorage
});
const domEl = window.document.querySelector(".create-post-container");
ReactDOM.render(reactEl, domEl);
