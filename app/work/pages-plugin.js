"use strict";
const glob = require("glob");
const path = require("path");

module.exports = {
  name: "pages",
  version: "1.0.0",
  async register(server) {
    server.route({
      method: "GET",
      path: "/",
      options: { cache: false },
      handler: (request, reply) => reply.view("work/pages/home")
    });
    const pagesPattern = path.join(__dirname, "pages/*.pug");
    const pages = glob.sync(pagesPattern); // eslint-disable-line no-sync
    pages.forEach(page => {
      const ext = path.extname(page);
      const base = path.basename(page, ext);
      server.route({
        method: "GET",
        path: `/${encodeURIComponent(base)}`,
        options: { cache: false },
        handler: (request, reply) => reply.view(`work/pages/${base}`)
      });
    });
    // Redirect old snake_case uris to kebab-case
    server.methods.redirect("/code_conventions", "/code-conventions");
    server.methods.redirect("/leveling_up", "/leveling-up");
    server.methods.redirect("/web_prog", "/web-prog");
  }
};
