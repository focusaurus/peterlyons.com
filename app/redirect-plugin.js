"use strict";

module.exports = {
  name: "redirect",
  version: "1.0.0",
  async register(server) {
    server.method("redirect", async (path, newPath) => {
      server.route({
        method: "GET",
        path,
        handler: (request, reply) => reply.redirect(newPath).code(301)
      });
    });
  }
};
