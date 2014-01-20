var config = require("app/config");
var expect = require("chai").expect;
var loadPage = require("../testUtils").loadPage;

describe("the home page", function() {
  var $ = null;

  before(function(done) {
    loadPage(config.baseURL, function(dom) {
      $ = dom;
      done();
    });
  });
  it("should have the intro material", function () {
    ["section#intro", "section#chops", "section#writing"].forEach(function(selector) {
      expect($(selector)).not.to.be.empty;
    });
  });
});
