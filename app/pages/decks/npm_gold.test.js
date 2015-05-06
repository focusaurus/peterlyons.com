var testUtils = require("app/testUtils");

describe("the NPM Gold Slide Deck", function() {
  var $ = null;
  before(function(done) {
    testUtils.loadPage("/npm_gold", function(error, dom) {
      $ = dom;
      done(error);
    });
  });

  it("should be a slide deck", function() {
    testUtils.assertDeck($);
  });

  it("should mention some packages", function() {
    testUtils.assertSubstrings($, "lodash", "moment.js", "cheerio");
  });
});
