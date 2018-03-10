"use strict";
const {DECKS} = require("./decks-routes-hapi");
const request = require("supertest");
const tap = require("tap");

let server;

tap.beforeEach(async () => {
  server = await require("../test-hapi-server")();
});

Object.keys(DECKS).forEach(deck => {
  tap.test(`deck: ${deck}`, test => {
    request(server.info.uri)
      .get(`/${deck}`)
      .expect("reveal.js")
      .expect("---")
      .expect("highlight")
      .expect("#")
      .expect(200, err => {
        test.end(err);
      });
  });
});
