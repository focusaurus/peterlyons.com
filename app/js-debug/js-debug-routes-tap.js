"use strict";
const request = require("supertest");
const tap = require("tap");

let server;

tap.beforeEach(async () => {
  server = await require("../test-hapi-server")();
});

tap.test("/js-debug", test => {
  request(server.info.uri)
    .get("/js-debug")
    .expect("iframe")
    .expect("button.stepSync")
    .expect(200, test.end);
});

tap.test("/jsDebug redirect", test => {
  request(server.info.uri)
    .get("/jsDebug")
    .expect(301)
    .expect("Location", "/js-debug")
    .end(test.end);
});

tap.test("/js-debug/random-delay", test => {
  request(server.info.uri)
    .get("/js-debug/random-delay?requestNumber=42")
    .expect(/42/)
    .expect(/\d+ ms/)
    .expect(200, test.end);
});
