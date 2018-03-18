"use strict";
const request = require("supertest");
const tap = require("tap");

let uri;

tap.beforeEach(async () => {
  uri = await require("../get-test-uri")(require("../server"));
});

tap.test("custom 404 error page", test => {
  request(uri)
    .get("/unit-test-error-404")
    .expect(404)
    .expect(/Error Code: 404 File Not Found/)
    .expect(/not very funny/i)
    .end((error, res) => {
      test.error(error);
      test.notOk(res.text.includes("unit-test-error-404-message"));
      test.end();
    });
});

tap.test("custom 500 error page", test => {
  request(uri)
    .get("/unit-test-error-500")
    .expect(500)
    .expect("content-type", "text/html; charset=utf-8")
    .expect(/oops/i)
    .expect(/Error Code: 500 Internal Server Error/)
    .expect(/quick nap/i)
    .end((error, res) => {
      test.error(error);
      test.notOk(res.text.includes("unit-test-error-500-message"));
      test.end();
    });
});
