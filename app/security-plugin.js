"use strict";

module.exports = {
  name: "security",
  version: "1.0.0",
  async register(server) {
    server.ext("onPreResponse", (request, h) => {
      if (request.response.isBoom) {
        return h.continue;
      }
      server.log(["security"], "Setting security headers");
      return request.response
        .header("x-frame-options", "DENY")
        .header("x-content-type-options", "nosniff")
        .header("x-xss-protection", "1");
    });
  }
};
