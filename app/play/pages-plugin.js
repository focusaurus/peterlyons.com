"use strict";
const glob = require("glob");
const path = require("path");

const pagesPattern = path.join(__dirname, "*.pug");

module.exports = {
  name: "pages",
  version: "1.0.0",
  async register(server) {
    server.route({
      method: "GET",
      path: "/",
      options: { cache: false },
      handler: (request, reply) => reply.view("play/home")
    });
    const pages = glob.sync(pagesPattern); // eslint-disable-line no-sync
    pages.forEach(page => {
      const ext = path.extname(page);
      const base = path.basename(page, ext);
      if (base === "navigation") {
        return;
      }
      server.route({
        method: "GET",
        path: `/${encodeURIComponent(base)}`,
        options: { cache: false },
        handler: (request, reply) => reply.view(`play/${base}`)
      });
    });
  }
};
