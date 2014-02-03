function init() {
  var createPostApp = window.createPostApp = angular.module("createPostApp", []);
  createPostApp.controller("CreatePost", require("app/browser/CreatePost"));
  createPostApp.factory("localStorage", require("app/browser/localStorage"));
}
module.exports = init;
