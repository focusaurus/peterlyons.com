var testUtils = require("../testUtils");
var testConfigs = require("./testConfigs");
require("./BlogsAreLoaded");

describe("smoke tests for most pages on the site", function() {
  testConfigs.forEach(function (testConfig) {
    var URI = testConfig[0];
    var regex = testConfig[1];
    it(URI + " should match " + regex, function(done) {
      testUtils.pageContains(URI, regex, done);
    });
  });
  it("should have a 404 page", function (done) {
    testUtils.get("/should-cause-a-404").expect(404).end(done);
  });
});
