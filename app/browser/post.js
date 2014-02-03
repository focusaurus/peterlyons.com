function init() {
  var createPostApp = window.createPostApp = angular.module("createPostApp", []);
  createPostApp.controller("CreatePost", require("app/browser/CreatePost"));
  createPostApp.value("localStorage", window.localStorage);
}
module.exports = init;
