var assert = require("assert");
var CreatePost = require("app/browser/CreatePost");

describe("CreatePost Controller", function () {
  var injector;
  var options;

  beforeEach(inject(function($injector) {
    injector = $injector;
    options = {
      $scope: injector.get("$rootScope"),
      localStorage: {}
    };
  }));

  it("should set up scope based on postDraft", function() {
    var postDraft = {
      title: "Post Title",
      content: "#marked it down"
    };
    options.localStorage = {postDraft: JSON.stringify(postDraft)};
    injector.instantiate(CreatePost, options);
    assert.equal(options.$scope.title, postDraft.title);
    assert.equal(options.$scope.contentMarkdown, postDraft.content);
  });

  it("should convert markdown to HTML when changed", function() {
    var $httpBackend = injector.get("$httpBackend");
    $httpBackend.expectPOST('/convert', "#marked it down2")
      .respond(200, "<h1>marked it down2</h1>");
    injector.instantiate(CreatePost, options);
    options.$scope.$apply(function () {
      options.$scope.contentMarkdown = "#marked it down2";
    });
    $httpBackend.flush();
    assert.equal(options.$scope.contentHtml.toString(), "<h1>marked it down2</h1>");
  });
});
