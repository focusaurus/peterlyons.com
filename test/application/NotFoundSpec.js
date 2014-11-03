var testUtils = require("../testUtils");

describe("404 page should have correct status code", function() {
  it("/no-such-url should be 404", function(done) {
    testUtils.get("/no-such-url").expect(404).end(done);
  });
});
