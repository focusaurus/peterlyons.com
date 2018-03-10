"use strict";
const tap = require("tap");
const request = require("supertest");

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
