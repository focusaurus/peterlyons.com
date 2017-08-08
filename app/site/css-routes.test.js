const request = require("../request");

describe("the CSS route", () => {
  it("should have the CSS", done => {
    request
      .get("/screen.css")
      .expect(200)
      .expect("Content-Type", "text/css; charset=utf-8")
      .end(done);
  });
});
