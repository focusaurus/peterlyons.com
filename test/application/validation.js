var w3c = require('w3c-validate').createValidator();
var request = require("supertest")(require("app/server"));
var testConfigs = require("./testConfigs");

//Only validate against W3C's validator when explicitly asked
if (process.argv.indexOf("--validate") < 0) {
  return;
}
require("./BlogsAreLoaded");
describe("The HTML of each page", function () {
  testConfigs.forEach(function (testConfig) {
    var URI = testConfig[0];
    var regex = testConfig[1];
    it(URI + " should be valid HTML5 according to the W3C", function(done) {
      this.slow(2000);
      request.get(URI).expect(200).end(function (error, res) {
        if (error) {
          done(error);
          return;
        }
        w3c.validate(res.text, done);
      });
    });
  });
});
