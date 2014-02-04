var expectations = require("expectations");
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
    expect(options.$scope.title).toBe(postDraft.title);
    expect(options.$scope.contentMarkdown).toBe(postDraft.content);
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
    expect(options.$scope.contentHtml.toString()).toBe(
      "<h1>marked it down2</h1>");
  });
});
