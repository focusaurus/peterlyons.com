"use strict";
const boom = require("boom");

module.exports = {
  name: "errors",
  version: "1.0.0",
  async register(server) {
    server.route({
      method: "GET",
      path: "/error500", // catch-all path
      handler: async () => {
        throw boom.internal("error500-message");
      }
    });

    server.route({
      method: "GET",
      path: "/error404", // catch-all path
      handler: async () => {
        throw boom.notFound("error404-message");
      }
    });

    server.ext("onPreResponse", async (request, h) => {
      if (!request.response.isBoom) {
        return h.continue;
      }
      const code = request.response.output.statusCode;
      // Yep, it's a switch statement with fallthrough!
      switch (code) {
        case 500:
          request.log("error", request.response);
        case 404: // eslint-disable-line no-fallthrough
          return h.view(`core/errors/error${code}`).code(code);
        default:
          return h.continue;
      }
    });
  }
};
