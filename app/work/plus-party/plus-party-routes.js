"use strict";

module.exports = {
  name: "plusParty",
  version: "1.0.0",
  async register(server) {
    server.route({
      method: "GET",
      path: "/plus-party",
      options: { cache: false },
      handler: async (request, h) => h.view("work/plus-party/plus-party")
    });
    server.methods.redirect("/plusParty", "/plus-party");
  }
};
