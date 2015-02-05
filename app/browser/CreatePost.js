var _ = require("lodash");
var MARKDOWN_OPTIONS = {
  headers: {
    contentType: "text/x-markdown"
  }
};

function CreatePost($scope, $window, $location, $http, $sce, localStorage) {
  this.$scope = $scope;
  this.$window = $window;
  this.$location = $location;
  this.$http = $http;
  this.$sce = $sce;
  this.localStorage = localStorage;
  try {
    var savedPost = JSON.parse(localStorage.postDraft);
    this.$scope.title = savedPost.title;
    this.$scope.contentMarkdown = savedPost.content;
  } catch (_error) {
    // console.log(localStorage);
  }
  this.$scope.save = this.save.bind(this);
  this.$scope.$watch("contentMarkdown",
    _.throttle(this.changeContentMarkdown.bind(this), 2000));
}

CreatePost.prototype.changeContentMarkdown = function changeContentMarkdown() {
  var self = this;
  var postDraft = {
    content: this.$scope.contentMarkdown,
    title: this.$scope.title
  };
  this.localStorage.postDraft = JSON.stringify(postDraft);
  this.$http.post(
    "/convert", this.$scope.contentMarkdown, MARKDOWN_OPTIONS
  ).success(function(contentHtml) {
    self.$scope.contentHtml = self.$sce.trustAsHtml(contentHtml);
  });
};

CreatePost.prototype.save = function save() {
  var self = this;
  this.$scope.savedPost = null;
  this.$scope.error = null;
  var data = {
    title: this.$scope.title,
    content: this.$scope.contentMarkdown,
    password: this.$scope.password
  };
  //the POST URI should be the same as the current page
  this.$http.post(this.$location.path(), data).success(function(response) {
    self.$scope.savedPost = response;
    delete self.localStorage.postDraft;
  }).error(function(response) {
    self.$scope.error = response;
  }).finally(function () {
    self.$window.scrollTo(0, 0);
  });
};

module.exports = CreatePost;
