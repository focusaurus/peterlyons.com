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
    .expect(200)
    .expect(/iframe/)
    .expect(/button/i)
    .expect(/\.stepSync/)
    .end(error => {
      test.error(error);
      test.end();
    });
});

tap.test("/jsDebug redirect", test => {
  request(server.info.uri)
    .get("/jsDebug")
    .expect(301)
    .expect("Location", "/js-debug")
    .end(error => {
      test.error(error);
      test.end();
    });
});

tap.test("/jsDebug/randomDelay redirect", test => {
  request(server.info.uri)
    .get("/jsDebug/randomDelay")
    .expect(301)
    .expect("Location", "/js-debug/random-delay")
    .end(error => {
      test.error(error);
      test.end();
    });
});

tap.test("/js-debug/random-delay", test => {
  request(server.info.uri)
    .get("/js-debug/random-delay?requestNumber=42")
    .expect(200)
    .expect(/42/)
    .expect(/\d+ ms/)
    .end(error => {
      test.error(error);
      test.end();
    });
});
