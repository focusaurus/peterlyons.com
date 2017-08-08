const expect = require("chaimel");
const request = require("../request");

describe("the jsDebug randomDelay route", () => {
  it("should have randomDelay route", (done) => {
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
