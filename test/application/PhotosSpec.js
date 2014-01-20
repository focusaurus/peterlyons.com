var config = require("app/config");
var expect = require("chai").expect;
var testUtils = require("../TestUtils");

describe("the photos page", function() {
  var $ = null;

  before(function(done) {
    testUtils.loadPage(config.baseURL + "/app/photos", function(dom) {
      $ = dom;
      done();
    });
  });

  it("should have the photo surrounding structure", function() {
    testUtils.assertSelectors(
      $, "h1#photo", "figure", "figcaption", "#nextPrev", "a.thumbnail");
  });
});
