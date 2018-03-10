"use strict";
const request = require("supertest");
const tap = require("tap");

let server;

tap.beforeEach(async () => {
  server = await require("../test-hapi-server")();
});

tap.test("/screen.css", test => {
  request(server.info.uri)
    .get("/screen.css")
    .expect("Content-Type", "text/css; charset=utf-8")
    .expect("font-family")
    .expect(200, err => {
      test.end(err);
    });
});

tap.test("/deck.css", test => {
  request(server.info.uri)
    .get("/deck.css")
    .expect("Content-Type", "text/css; charset=utf-8")
    .expect("background-color: khaki")
    .expect(200, err => {
      test.end(err);
    });
});
