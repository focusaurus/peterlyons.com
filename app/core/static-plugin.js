"use strict";
const path = require("path");
const config = require("./config-validate");

module.exports = {
  name: "static",
  version: "1.0.0",
  async register(server) {
    await server.register(require("inert"));
    server.route({
      method: "GET",
      path: "/favicon.ico",
      options: { cache: false },
      handler: (request, h) =>
        h
          .response()
          .code(204)
          .type("image/x-icon")
    });
    server.route({
      method: "GET",
      path: "/reveal.js/{file*}",
      options: { cache: false },
      handler: {
        directory: {
          path: path.join(__dirname, "../../node_modules/reveal.js"),
          redirectToSlash: false,
          index: false
        }
      }
    });
    server.route({
      method: "GET",
      path: "/{param*}",
      options: { cache: false },
      handler: {
        directory: {
          path: [config.staticDir, path.join(__dirname, "../../www")],
          redirectToSlash: false,
          index: true
        }
      }
    });
  }
};
