"use strict";
const boom = require("boom");

module.exports = {
  name: "errors",
  version: "1.0.0",
  async register(server) {
    server.route({
      method: "GET",
      path: "/unit-test-error-500", // catch-all path
      handler: async () => {
        throw boom.internal("unit-test-error-500-message");
      }
    });

    server.route({
      method: "GET",
      path: "/unit-test-error-404", // catch-all path
      handler: async () => {
        throw boom.notFound("unit-test-error-404-message");
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
          return h.view(`errors/error${code}`).code(code);
        default:
          return h.continue;
      }
    });
  }
};
