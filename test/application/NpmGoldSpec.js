require("expectations");
var testUtils = require("../testUtils");

describe("the NPM Gold Slide Deck", function() {
  var $ = null;
  before(function(done) {
    testUtils.loadPage("/npm_gold", function(error, dom) {
      $ = dom;
      done(error);
    });
  });

  it("should have many sections with class slide", function() {
    expect($("section.slide").length).toBeGreaterThan(3);
  });

  it("should mention some packages", function() {
    testUtils.assertSubstrings($, "lodash", "moment.js", "cheerio");
  });

  it("should include deck.js and the menu plugin", function() {
    testUtils.assertSubstrings($, "deck.js", "deck.menu.js",
      "deck.js/jquery-1.7.2.min.js");
  });
});
