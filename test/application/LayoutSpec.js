var _ = require("lodash");
var expectations = require("expectations");
var testUtils = require("../testUtils");

describe("the main layout", function() {
  var $ = null;
  before(function(done) {
    testUtils.loadPage("/", function(error, dom) {
      $ = dom;
      done(error);
    });
  });
  it("should have the google fonts", function() {
    var selector = "link[rel=stylesheet]";
    testUtils.assertSelectors($, selector);
    var hrefs = [];
    var link = $(selector).each(function (index, item) {
      hrefs.push($(item).attr("href"));
    });
    expect(_.some(hrefs, function (href) {
      return href.indexOf("fonts.googleapis.com") >= 0;
    })).toBeTruthy();
  });

  it("should have the key structural elements", function() {
    testUtils.assertSelectors(
      $,"header h1", "body .content", "nav.site", ".license");
  });

  it("should have the normal title", function() {
    expect($("title").text()).toBe("Peter Lyons: node.js expert consultant");
  });
});
