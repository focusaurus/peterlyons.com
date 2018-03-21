"use strict";
const {DECKS} = require("./decks-plugin");
const getTestUri = require("../../core/get-test-uri");
const request = require("supertest");
const tap = require("tap");


let uri;

tap.beforeEach(async () => {
  uri = await getTestUri(require("../server"));
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
