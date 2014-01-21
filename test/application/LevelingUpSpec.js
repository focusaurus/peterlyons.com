var config = require("app/config");
var assert = require("assert");
var testUtils = require("../testUtils");

describe("the Leveling Up article", function() {
  var $ = null;
  before(function(done) {
    testUtils.loadPage(config.baseURL + "/leveling_up", function(dom) {
      $ = dom;
      done();
    });
  });

  it("should have the proper content", function() {
    testUtils.assertSelectors($, "#pillar1", "#pillar2", "#pillar3");
    testUtils.assertSubstrings($, "operating system", "thousands");
  });

  it("should have the proper title", function() {
    assert(/Leveling Up/.test($("title").text()));
  });
});
