var testUtils = require("app/testUtils");
require("expectations");

describe("the jsDebug randomDelay route", function() {

  it("should have randomDelay route", function(done) {
    this.timeout(10 * 1000).slow(10 * 1000);
    testUtils.get("/jsDebug/randomDelay?requestNumber=42")
      .expect(200)
      .end(function (error, res) {
        expect(error).toBeFalsey();
        expect(res.text).toContain("42");
        expect(res.text).toContain(" ms");
        done();
      });
  });
});
