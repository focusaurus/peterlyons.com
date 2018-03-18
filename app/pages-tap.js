"use strict";
const request = require("supertest");
const tap = require("tap");

const pathExps = [
  ["/", /node\.js/],
  ["/career", /Opsware/],
  ["/code-conventions", /readability/],
  ["/contact", /pete@peterlyons.com/],
  ["/leveling-up", /Pillar 1/],
  ["/plus-party", /Plus Party/],
  ["/practices", /Craftsmanship/],
  ["/stacks", /JavaScript/],
  ["/talks", /Speaking/],
  ["/twelve-factor-nodejs", /Twelve-Factor/],
  ["/web-prog", /PHP/]
];

let uri;

tap.beforeEach(async () => {
  uri = await require("./get-test-uri")(require("./server"));
});

tap.test("pages smoke tests", test => {
  require("./test-responses")("Pages (pug templates)", uri, pathExps);
  test.end();
});

tap.test("home page", test => {
  request(uri)
    .get("/")
    .expect(200)
    .expect(/Crafting node.js web applications/)
    .expect(/Stacks/)
    .expect(/Creative Commons/)
    .expect(/<section .*class="intro"/i)
    .end(error => {
      test.error(error);
      test.end();
    });
});
