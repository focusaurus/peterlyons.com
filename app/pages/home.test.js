const testUtils = require("../test-utils");
const request = require("../request");

describe("the home page", () => {
  let $ = null;

  before(done => {
    request.loadPage("/", (error, dom) => {
      $ = dom;
      done(error);
    });
  });
  it("should have the intro material", () => {
    testUtils.assertSelectors($, "section.intro");
  });
});
