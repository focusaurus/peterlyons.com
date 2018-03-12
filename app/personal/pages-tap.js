"use strict";
const request = require("supertest");
const tap = require("tap");

const pathExps = [
  ["/", /personal site of Peter Lyons/],
  ["/bands", /Gora Gora Orkestar/],
  ["/favorites", /Bobby McFerrin/],
  ["/oberlin", /conservatory/i]
];

(async () => {
  const server = await require("./test-server")();
  require("../test-responses")(
    "Pages (pug templates)",
    server.info.uri,
    pathExps
  );
  tap.test("css", test => {
    request(server.info.uri)
      .get("/screen.css")
      .expect(200)
      .expect("content-type", "text/css; charset=utf-8")
      .expect(/background-color:/)
      .end(error => {
        test.error(error);
        test.end();
      });
  });
  tap.test("personal site does not include pro nav", test => {
    request(server.info.uri)
      .get("/")
      .expect(200)
      .end((error, res) => {
        test.error(error);
        const proNav = ["Code Conventions", "Career", "Projects"];
        proNav.forEach(text => {
          tap.notOk(res.text.includes(text));
        });
        test.end();
      });
  });
})();
