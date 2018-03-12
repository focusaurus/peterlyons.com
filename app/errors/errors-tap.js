"use strict";
const request = require("supertest");
const tap = require("tap");

let server;

tap.beforeEach(async () => {
  server = await require("../test-hapi-server")();
});

tap.test("custom 404 error page", test => {
  request(server.info.uri)
    .get("/unit-test-error-404")
    .expect(404)
    .expect(/404/)
    .expect(/not very funny/i)
    .end(error => {
      test.error(error);
      test.end();
    });
});

tap.test("custom 500 error page", test => {
  request(server.info.uri)
    .get("/unit-test-error-500")
    .expect(500)
    .expect("content-type", "text/html; charset=utf-8")
    .expect(/oops/i)
    .expect(/quick nap/i)
    .end(error => {
      test.error(error);
      test.end();
    });
});
