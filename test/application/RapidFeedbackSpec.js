var expectations = require("expectations");
var testUtils = require("../testUtils");

describe("the Rapid Feedback Slide Deck", function() {
  var $ = null;
  before(function(done) {
    testUtils.loadPage("/rapid_feedback", function(error, dom) {
      $ = dom;
      done(error);
    });
  });

  it("should have many sections with class slide", function() {
    expect($("section.slide").length).toBeGreaterThan(3);
  });

  it("should mention some ruby stuff", function() {
    testUtils.assertSubstrings($, "ruby", "rails", "stackoverflow");
  });

  it('should include deck.js and the menu plugin', function() {
    testUtils.assertSubstrings($, "deck.js", "deck.menu.js",
      "deck.js/jquery-1.7.2.min.js");
  });
});
