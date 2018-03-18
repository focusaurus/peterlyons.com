"use strict";
const tap = require("tap");
const request = require("supertest");

const pathExps = [
  ["/humans.txt", /Technology Stack/],
  ["/plws.js", /flickrRE/],
  ["/error404.html", /This is my 404 error page/i],
  ["/error500.html", /quick nap/i]
];

let uri;

tap.beforeEach(async () => {
  uri = await require("./test-hapi-server")();
});

tap.test("static files smoke tests", test => {
  require("./test-responses")("Static files from ../static", uri, pathExps);
  test.end();
});

tap.test("static favicon", test => {
  request(uri)
    .get("/favicon.ico")
    .expect(204)
    .expect("content-type", "image/x-icon")
    .end(error => {
      test.error(error);
      test.end();
    });
});

tap.test("static images", test => {
  request(uri)
    .get("/images/gora_gora_orkestar.jpg")
    .expect(200)
    .expect("content-type", "image/jpeg")
    .end(error => {
      test.error(error);
      test.end();
    });
});
