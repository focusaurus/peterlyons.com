var testUtils = require("../testUtils");

describe("the plus party page", function() {
  it("should serve the zeroclipboard swf file", function(done) {
    testUtils.get("/ZeroClipboard.swf")
      .expect("Content-Type", "application/x-shockwave-flash")
      .expect(200)
      .end(done);
  });
});
