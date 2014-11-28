var testUtils = require("../testUtils");

describe("the site", function () {
  it("should have the browserified JavaScript", function(done) {
    this.slow(2000).timeout(5000);
    testUtils.get("/browser.js")
      .expect(200)
      .expect("Content-Type", "application/javascript")
      .expect("Content-Encoding", "gzip")
      .end(done);
  });
});
