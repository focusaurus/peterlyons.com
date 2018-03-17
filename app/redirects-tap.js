"use strict";
const request = require("supertest");
const tap = require("tap");

let server;

tap.beforeEach(async () => {
  server = await require("./test-hapi-server")();
});

const uris = {
  "/code_conventions": "/code-conventions",
  "/leveling_up": "/leveling-up",
  "/npm_gold": "/npm-gold",
  "/plusParty": "/plus-party",
  "/rapid_feedback": "/rapid-feedback",
  "/twelve_factor_nodejs": "/twelve-factor-nodejs",
  "/web_data": "/web-data",
  "/web_prog": "/web-prog",
  "/white_glove": "/white-glove"
};

Object.keys(uris).forEach(old => {
  tap.test(`pro pages with underscores should redirect ${old}`, test => {
    request(server.info.uri)
      .get(old)
      .expect(301)
      .expect("Location", uris[old])
      .end(error => {
        test.error(error);
        test.end();
      });
  });
});
