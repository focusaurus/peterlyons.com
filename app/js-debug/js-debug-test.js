const request = require("../request");
const testUtils = require("../test-utils");
const expect = require("chaimel");

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

  it("should have randomDelay route", function x (done) {
    this.timeout(10 * 1000).slow(10 * 1000);
    request
      .get("/js-debug/random-delay?requestNumber=42")
      .expect(200)
      .end((error, res) => {
        expect(error).notToExist();
        expect(res.text).toContain("42");
        expect(res.text).toContain(" ms");
        done();
      });
  });
});
