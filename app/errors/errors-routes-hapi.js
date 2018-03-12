"use strict";
const boom = require("boom");

async function setup(server) {
  server.route({
    method: "GET",
    path: "/unit-test-error-500", // catch-all path
    handler: async () => {
      throw boom.internal("unit-test-500-error");
    }
  });

  server.route({
    method: "*",
    path: "/{p*}", // catch-all path
    handler: async (request, reply) => {
      reply.logger.debug("HEY errors", request.path); // FIXME
      return reply.view("errors/error404").code(404);
    }
  });

  server.ext("onPreResponse", async (request, h) => {
    if (!request.response.isBoom) {
      return h.continue;
    }
    request.logger.warn(request.response);
    return h.view("errors/error500").code(500);
  });
}
module.exports = setup;
