"use strict";
const getTestUri = require("../core/get-test-uri");
const request = require("supertest");
const tap = require("tap");

const pages = ["/bands", "/oberlin", "/favorites"];

let uri;

tap.beforeEach(async () => {
  uri = await getTestUri(require("./server"));
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
