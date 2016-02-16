function init () {
  // Just require angular without assigning it.
  // browserify returns an empty object, but window.angular is there
  require('angular')
  require('angular-sanitize')
  var createPostApp = window.createPostApp = angular.module(
    'createPostApp', ['ngSanitize'])
  createPostApp.controller('CreatePost', require('./create-post'))
  createPostApp.value('localStorage', window.localStorage)
}
module.exports = init
