const request = require("../request");
const testUtils = require("../test-utils");

describe("the plus party page", () => {
  let $;

  before(done => {
    request.loadPage("/plus-party", (error, dom) => {
      $ = dom;
      done(error);
    });
  });

  it("should have an iframe", () => {
    testUtils.assertSelectors(
      $,
      "iframe[allowfullscreen]",
      'img[alt="One plus two plus two plus one."]'
    );
  });
});
