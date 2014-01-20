var config = require("app/config");
var assert = require("chai").assert;
var testUtils = require("../testUtils");

describe("the Web Data Slide Deck", function() {
  var $ = null;
  before(function(done) {
    testUtils.loadPage(config.baseURL + "/web_data", function(dom) {
      $ = dom;
      done();
    });
  });

  it("should have many sections with class slide", function() {
    assert.isTrue($("section.slide").length > 15);
  });

  it('should mention some DBs', function() {
    testUtils.assertSubstrings($, "Oracle", "SQL Server", "Dynamo");
  });

  it('should include deck.js and the menu plugin', function() {
    testUtils.assertSubstrings($, "deck.js", "deck.menu.js");
  });
});
