const testUtils = require("../test-utils");
const request = require("../request");
const DECKS = require("./decks-routes").DECKS;
const expect = require("chaimel");

Object.keys(DECKS).forEach(deck => {
  describe(`slide deck /${deck}`, () => {
    it("should be a slide deck", done => {
      request.loadPage(`/${deck}`, (error, $) => {
        if (error) {
          done(error);
          return;
        }
        expect($(".reveal .slides ").length).toEqual(1);
        testUtils.assertSubstrings($, "reveal.js", "##", "highlight");
        done(error);
      });
    });
  });
});
