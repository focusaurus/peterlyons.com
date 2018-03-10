"use strict";
const pathExps = [
  ["/humans.txt", /Technology Stack/],
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
})();
