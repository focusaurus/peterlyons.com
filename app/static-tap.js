"use strict";
const tap = require("tap");
const request = require("supertest");

const pathExps = [
  ["/humans.txt", /Technology Stack/],
  ["/plws.js", /flickrRE/],
  [("/error404.html", /404 File Not Found/)],
  ["/error500.html", /500 Internal Server Error/]
];

(async () => {
  const server = await require("./test-hapi-server")();
  require("./test-responses")(
    "Static files from ../static",
    server.info.uri,
    pathExps
  );

  tap.test("static favicon", test => {
    request(server.info.uri)
      .get("/favicon.ico")
      .expect(204)
      .expect("content-type", "image/x-icon")
      .end(error => {
        test.error(error);
        test.end();
      });
  });

  tap.test("static images", test => {
    request(server.info.uri)
      .get("/images/gora_gora_orkestar.jpg")
      .expect(200)
      .expect("content-type", "image/jpeg")
      .end(error => {
        test.error(error);
        test.end();
      });
  });
})();
