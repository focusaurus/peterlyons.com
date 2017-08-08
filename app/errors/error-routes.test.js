const request = require("../request");

const codes = [404, 500];
describe("the error pages", () => {
  codes.forEach(code => {
    it(`should have ${code}`, done => {
      request
        .get(`/error${code}`)
        .expect(code)
        .expect("Content-Type", "text/html; charset=utf-8")
        .end(done);
    });
  });
});
