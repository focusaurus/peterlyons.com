"use strict";
const tap = require("tap");
const request = require("supertest");

const pathExps = [
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

(async () => {
  const server = await require("./test-hapi-server")();
  require("./test-responses")(
    "Pages (pug templates)",
    server.info.uri,
    pathExps
  );
  tap.test("home page", test => {
    request(server.info.uri)
      .get("/")
      .expect("Crafting node.js web applications")
      .expect("Stacks")
      .expect("Creative Commons")
      .expect(200, err => {
        test.end(err);
      });
  });
})();
