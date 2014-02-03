window.CreatePost = require("app/browser/CreatePost");
var assert = require("assert");

describe("CreatePost Controller", function () {
  var $httpBackend;
  var options;
  var $controller;

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    options = {
      $scope: $injector.get('$rootScope'),
      draftJSON: undefined
    };
    $controller = $injector.get('$controller');
  }));

  it("should set up scope based on postDraft", function() {
    var postDraft = {
      title: "Post Title",
      content: "#marked it down"
    };
    options.draftJSON = JSON.stringify(postDraft);
    $controller("CreatePost", options);
    assert.equal(options.$scope.title, postDraft.title);
    assert.equal(options.$scope.contentMarkdown, postDraft.content);
  });

  it("should convert markdown to HTML when changed", function() {
    $httpBackend.expectPOST('/convert', "#marked it down")
      .respond(200, "<h1>marked it down</h1>");
    $controller("CreatePost", options);
    options.$scope.$apply(function () {
      options.$scope.contentMarkdown = "#marked it down";
    });
    $httpBackend.flush();
    assert.equal(options.$scope.contentHtml, "<h1>marked it down</h1>");
  });
});
