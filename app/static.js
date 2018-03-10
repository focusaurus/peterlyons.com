"use strict";
const path = require("path");

async function setup(server) {
  await server.register(require("inert"));
  server.route({
    method: "GET",
    path: "/reveal.js/{file*}",
    handler: {
      directory: {
        path: path.join(__dirname, "..", "node_modules", "reveal.js"),
        redirectToSlash: false,
        index: false
      }
    }
  });
  server.route({
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: [
          path.join(__dirname, "..", "..", "static"),
          path.join(__dirname, "third-party")
        ],
        redirectToSlash: false,
        index: true
      }
    }
  });
}

module.exports = setup;
