"use strict";
const tap = require("tap");
const request = require("supertest");

let server;

tap.beforeEach(async () => {
  server = await require("./test-hapi-server")();
});

tap.test("GET / should have security headers", test => {
  request(server.info.uri)
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
