const request = require("../request");
const expect = require("chaimel");
const testUtils = require("../test-utils");

describe("the Leveling Up article", () => {
  let $ = null;
  before(done => {
    request.loadPage("/leveling-up", (error, dom) => {
      $ = dom;
      done(error);
    });
  });

  it("should have the proper content", () => {
    testUtils.assertSelectors($, "#pillar1", "#pillar2", "#pillar3");
    testUtils.assertSubstrings($, "operating system", "thousands");
  });

  it("should have the proper title", () => {
    expect($("title").text()).toMatch(/Leveling Up/);
  });
});
