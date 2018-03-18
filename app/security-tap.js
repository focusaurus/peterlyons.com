"use strict";
const tap = require("tap");
const request = require("supertest");

let uri;

tap.beforeEach(async () => {
  uri = await require("./get-test-uri")(require("./server"));
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
