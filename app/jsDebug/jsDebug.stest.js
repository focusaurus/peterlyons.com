var expect = require("chai").expect;
var testUtils = require("app/testUtils");

describe("the jsDebug randomDelay route", function() {

  it("should have randomDelay route", function(done) {
    this.timeout(10 * 1000).slow(10 * 1000);
    testUtils.get("/jsDebug/randomDelay?requestNumber=42")
      .expect(200)
      .end(function (error, res) {
        expect(error).not.to.exist();
        expect(res.text).to.include("42");
        expect(res.text).to.include(" ms");
        done();
      });
  });
});
