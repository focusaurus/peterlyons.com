"use strict";
const tap = require("tap");
const request = require("supertest");

let server;

tap.beforeEach(async () => {
  server = await require("./test-hapi-server")();
});


tap.test("static files from www", test => {
  console.log(`uri: ${server.info.uri}`);
  request(server.info.uri)
    .get("/plws.js")
    .expect(200, err => {
      test.end(err);
    });
});
