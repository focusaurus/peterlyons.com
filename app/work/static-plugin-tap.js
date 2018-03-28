"use strict";
const tap = require("tap");
const request = require("supertest");
const getTestUri = require("../core/get-test-uri");

let uri;

tap.beforeEach(async () => {
  uri = await getTestUri(require("./server"));
});

tap.test("static plws.js", test => {
  request(uri)
    .get("/plws.js")
    .expect(200)
    .expect("content-type", "application/javascript; charset=utf-8")
    .expect(/flickrRE/)
    .end(error => {
      test.error(error);
      test.end();
    });
});

tap.test("static favicon", test => {
  request(uri)
    .get("/favicon.ico")
    .expect(204)
    .end(error => {
      test.error(error);
      test.end();
    });
});
