"use strict";
const request = require("supertest");
const tap = require("tap");

const pages = ["/bands", "/oberlin", "/favorites"];

(async () => {
  const server = await require("./test-server")();
  pages.forEach(page => {
    tap.test(`${page}.html should redirect to no .html`, test => {
      request(server.info.uri)
        .get(`${page}.html`)
        .expect(301)
        .expect("location", page)
        .end(error => {
          test.error(error);
          test.end();
        });
    });
  });
})();
