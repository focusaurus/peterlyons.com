"use strict";
const tap = require("tap");
const request = require("supertest");

let uri;

tap.beforeEach(async () => {
  server = await require("./test-blog-hapi")();
});

tap.skip("a request for a non-existent blog post name", async test => {
  request(uri)
    .get("/utb/2014/01/no-such-post")
    .expect(404)
    .end(error => {
      test.error(error);
      // console.log("HEY", res.text); // fixme
      test.end();
    });
});

tap.skip("a static image request should 200", async test => {
  request(uri)
    .get("/utb/images/one.png")
    .expect(200)
    .expect("Content-Type", "image/png")
    .end(error => {
      test.error(error);
      test.end();
    });
});
