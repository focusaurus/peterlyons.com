const request = require("../request");
const testUtils = require("../test-utils");

describe("the jsDebug", () => {
  let $ = null;

  before(done => {
    request.loadPage("/js-debug", (error, dom) => {
      $ = dom;
      done(error);
    });
  });

  it("should have the screencast youtube video", () => {
    testUtils.assertSelectors($, "iframe", "button.stepSync");
  });

  it("should redirect /jsDebug to /js-debug", done => {
    request
      .get("/jsDebug")
      .expect(301)
      .expect("Location", "/js-debug")
      .end(done);
  });
});
