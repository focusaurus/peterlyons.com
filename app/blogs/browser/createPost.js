;(function iife(exports, undefined) {
var MARKDOWN_OPTIONS = {
  headers: {
    contentType: "text/x-markdown"
  }
};

function CreatePost($scope, $window, $http, $sce) {
  this.$scope = $scope;
  this.$http = $http;
  this.$sce = $sce;
  try {
    var savedPost = JSON.parse(localStorage.postDraft);
    $scope.title = savedPost.title;
    $scope.contentMarkdown = savedPost.content;
  } catch (_error) {
    console.log(localStorage.postDraft);
  }
  $scope.save = save.bind(this, $scope, $window, $http);
  $scope.$watch("contentMarkdown",
    _.debounce(changeContentMarkdown.bind(this, $scope, $http, $sce), 250));
}

function changeContentMarkdown($scope, $http, $sce) {
  var postDraft = {
    content: $scope.contentMarkdown,
    title: $scope.title
  };
  localStorage.postDraft = JSON.stringify(postDraft);
  $http.post(
    "/convert", $scope.contentMarkdown, MARKDOWN_OPTIONS
  ).success(function(contentHtml) {
    $scope.contentHtml = $sce.trustAsHtml(contentHtml);
  });
}

function save($scope, $window, $http) {
  $scope.savedPost = null;
  $scope.error = null;
  var data = {
    title: $scope.title,
    content: $scope.contentMarkdown,
    password: $scope.password
  };
  //relative URL here is intentional to post to the current blog
  $http.post("post", data).success(function(response) {
    $scope.savedPost = response;
  }).error(function(response) {
    $scope.error = response;
  }).finally(function () {
    $window.scrollTo(0, 0);
  });
}

exports.CreatePost = CreatePost;
})(this);
