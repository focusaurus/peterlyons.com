"use strict";
const tap = require("tap");
const request = require("supertest");

let server;

tap.beforeEach(async () => {
  server = await require("./test-blog")();
});

tap.test("a request for a non-existent blog post name", test => {
  request(server.info.uri)
    .get("/utb/2014/01/no-such-post")
    .expect(404)
    .end(error => {
      test.error(error);
      test.end();
    });
});

tap.test("a static image request should 200", test => {
  request(server.info.uri)
    .get("/utb/images/one.png")
    .expect(200)
    .expect("Content-Type", "image/png")
    .end(error => {
      test.error(error);
      test.end();
    });
});

tap.test("a flush-cache request", test => {
  request(server.info.uri)
    .get("/utb/flush-cache")
    .expect(302)
    .expect("location", "/utb")
    .end(error => {
      test.error(error);
      test.end();
    });
});
