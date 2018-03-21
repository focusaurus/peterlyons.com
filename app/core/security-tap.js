"use strict";
const getTestUri = require("./get-test-uri");
const request = require("supertest");
const tap = require("tap");

let uri;

tap.beforeEach(async () => {
  uri = await getTestUri(require("../work/server"));
});

tap.test("GET / should have security headers", test => {
  request(uri)
    .get("/")
    .expect("x-frame-options", "DENY")
    .expect("x-content-type-options", "nosniff")
    .expect("x-xss-protection", "1")
    .end((error, res) => {
      test.error(error);
      test.notOk(res.headers["x-powered-by"]);
      test.end();
    });
});
