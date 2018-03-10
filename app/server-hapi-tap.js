"use strict";
const request = require("supertest");
const smokeTests = require("./smoke-tests");
const tap = require("tap");

let server;

tap.beforeEach(async () => {
  server = await require("./test-hapi-server")();
});

tap.test("home page", test => {
  request(server.info.uri)
    .get("/")
    .expect("Crafting node.js web applications")
    .expect("Stacks")
    .expect("Creative Commons")
    .expect(200, err => {
      test.end(err);
    });
});

tap.test("static files from www", test => {
  request(server.info.uri)
    .get("/plws.js")
    .expect(200, err => {
      test.end(err);
    });
});

tap.test("static files from static", test => {
  request(server.info.uri)
    .get("/favicon.ico")
    .expect("Content-Type", "image/ico")
    .expect(200, err => {
      test.end(err);
    });
});

tap.test("static smoke tests", test => {
    smokeTests("static files", server.info.uri, [["/humans.txt", "Technology Stack"]])

})
