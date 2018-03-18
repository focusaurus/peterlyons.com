"use strict";
const {DECKS} = require("./decks-routes-hapi");
const request = require("supertest");
const tap = require("tap");

let uri;

tap.beforeEach(async () => {
  uri = await require("../get-test-uri")(require("../server"));
});

Object.keys(DECKS).forEach(deck => {
  tap.test(`deck: ${deck}`, test => {
    request(uri)
      .get(`/${deck}`)
      .expect(200)
      .expect(/reveal\.js/)
      .expect(/---/)
      .expect(/highlight/)
      .expect(/#/)
      .end(error => {
        test.error(error);
        test.end();
      });
  });
});
