var _ = require("lodash");
var assert = require("assert");
var config = require("app/config");
var testUtils = require("../testUtils");

describe("the main layout", function() {
  var $ = null;
  before(function(done) {
    testUtils.loadPage(config.baseURL, function(dom) {
      $ = dom;
      done();
    });
  });
  it("should have the google fonts", function() {
    var selector = "link[rel=stylesheet]";
    testUtils.assertSelectors($, selector);
    var hrefs = [];
    var link = $(selector).each(function (index, item) {
      hrefs.push($(item).attr("href"));
    });
    assert(_.some(hrefs, function (href) {
      return href.indexOf("fonts.googleapis.com") >= 0;
    }));
  });

  it("should have the key structural elements", function() {
    testUtils.assertSelectors(
      $,"header h1", "body .content", "nav.site", ".license");
  });

  it("should have the normal title", function() {
    assert.equal($("title").text(), "Peter Lyons: node.js coder for hire");
  });
});
