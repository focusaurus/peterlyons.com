require("./BlogsAreLoaded");
var request = require("supertest")(require("app"));
var testConfigs = require("./testConfigs");
var w3c = require("w3c-validate").createValidator();

function suite() {
  testConfigs.forEach(function (testConfig) {
    var URI = testConfig[0];
    it(URI + " should be valid HTML5 according to the W3C", function(done) {
      this.slow(2000);
      this.timeout(5000);
      request.get(URI).expect(200).end(function (error, res) {
        if (error) {
          done(error);
          return;
        }
        w3c.validate(res.text, done);
      });
    });
  });
}

//Only validate against W3C's validator when explicitly asked
if (process.env.VALIDATE === "yes") {
  describe("The HTML of each page", suite);
}
