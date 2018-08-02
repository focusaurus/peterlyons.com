"use strict";
const getTestUri = require("../core/get-test-uri");
const request = require("supertest");
const tap = require("tap");

let uri;

tap.beforeEach(async () => {
  uri = await getTestUri(require("./server"));
});

tap.test("/screen.css", test => {
  request(uri)
    .get("/screen.css")
    .expect(200)
    .expect("content-type", "text/css; charset=utf-8")
    .expect("cache-control", "max-age=1440, must-revalidate, public")
    .expect(/font-family/)
    .end(error => {
      test.error(error);
      test.end();
    });
});

tap.test("/deck.css", test => {
  request(uri)
    .get("/deck.css")
    .expect(200)
    .expect("content-type", "text/css; charset=utf-8")
    .expect(/background-color:/)
    .end(error => {
      test.error(error);
      test.end();
    });
});

tap.test("non-existent css error", test => {
  request(uri)
    .get("/unit-test-error.css")
    .expect(500)
    .expect("content-type", "text/html; charset=utf-8")
    .end(error => {
      test.error(error);
      test.end();
    });
});

tap.test("invalid stylus error", test => {
  request(uri)
    .get("/unit-test-invalid.css")
    .expect(500)
    .expect("content-type", "text/html; charset=utf-8")
    .end(error => {
      test.error(error);
      test.end();
    });
});
