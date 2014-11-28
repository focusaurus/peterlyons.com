var testUtils = require("app/testUtils");

describe("the jsDebug", function() {
  var $ = null;

  before(function(done) {
    testUtils.loadPage("/jsDebug", function(error, dom) {
      $ = dom;
      done(error);
    });
  });

  it("should have the screencast youtube video", function() {
    testUtils.assertSelectors($, "iframe", "button.stepSync");
  });

  it("should redirect to the newest gallery", function(done) {
    testUtils.get("/app/photos")
      .expect(302)
      .expect("location", "/app/photos?gallery=burning_man_2011")
      .end(done);
  });
});
