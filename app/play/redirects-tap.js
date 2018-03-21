"use strict";
const request = require("supertest");
const tap = require("tap");

const pages = ["/bands", "/oberlin", "/favorites"];

let uri;

tap.beforeEach(async () => {
  uri = await require("../core/get-test-uri")(require("./server"));
});

pages.forEach(page => {
  tap.test(`${page}.html should redirect to no .html`, test => {
    request(uri)
      .get(`${page}.html`)
      .expect(301)
      .expect("location", page)
      .end(error => {
        test.error(error);
        test.end();
      });
  });
});
