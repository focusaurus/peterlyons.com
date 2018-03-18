"use strict";
const tap = require("tap");
const testUtils = require("../test-utils");

let uri;

tap.beforeEach(async () => {
  uri = await require("../test-hapi-server")();
});

tap.test("the plus party page", async test => {
  const $ = await testUtils.loadDom(server.info.uri, "/plus-party");
  testUtils.assertSelectors(
    $,
    "iframe[allowfullscreen]",
    'img[alt="One plus two plus two plus one."]'
  );
  test.end();
});