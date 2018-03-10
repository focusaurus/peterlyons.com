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
      .expect("Content-Type", "image/ico")
      .expect(200, err => {
        test.end(err);
      });
  });

  tap.test("static images", test => {
    request(server.info.uri)
      .get("/images/gora_gora_orkestar.jpg")
      .expect("Content-Type", "image/jpg")
      .expect(200, err => {
        test.end(err);
      });
  });

  tap.test("google analytics", test => {
    request(server.info.uri)
      .get("/googleAnalytics.js")
      .expect("Content-Type", "text/javascript")
      .expect("GoogleAnalyticsObject")
      .expect(200, err => {
        test.end(err);
      });
  });
})();
