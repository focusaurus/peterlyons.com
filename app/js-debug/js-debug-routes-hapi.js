"use strict";

function randomDelay() {
  const delay = Math.random() * 2000;
  return new Promise(resolve => {
    setTimeout(() => resolve(delay), delay);
  });
}

module.exports = {
  name: "js-debug",
  version: "1.0.0",
  async register(server) {
    server.route({
      method: "GET",
      path: "/js-debug",
      handler: (request, reply) => reply.view("js-debug/js-debug")
    });
    server.route({
      method: "GET",
      path: "/js-debug/random-delay",
      handler: async request => {
        const delay = await randomDelay();
        const num = request.query.requestNumber;
        return `Responded after ${delay.toFixed(
          0
        )} ms to request number ${num}`;
      }
    });
    server.route({
      method: "GET",
      path: "/jsDebug",
      handler: (request, reply) => reply.redirect("/js-debug").code(301)
    });
    server.route({
      method: "GET",
      path: "/jsDebug/randomDelay",
      handler: (request, reply) =>
        reply.redirect("/js-debug/random-delay").code(301)
    });
  }
};
