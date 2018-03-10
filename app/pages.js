"use strict";
const config = require("config3");
const glob = require("glob");
const path = require("path");

const locals = {
  proSite: true,
  analytics: {
    code: config.analytics.proCode
  }
};

async function init(server) {
  await server.register(require("vision"));
  server.views({
    engines: {pug: require("pug")},
    relativeTo: path.join(__dirname, "pages")
  });

  server.route({
    method: "GET",
    path: "/",
    handler: (request, reply) => reply.view("home", locals)
  });
  const pagesPattern = path.join(__dirname, "pages", "*.pug");
  const pages = glob.sync(pagesPattern); // eslint-disable-line no-sync
  pages.forEach(page => {
    const ext = path.extname(page);
    const base = path.basename(page, ext);
    server.route({
      method: "GET",
      path: `/${encodeURIComponent(base)}`,
      handler: (request, reply) => reply.view(base, locals)
    });
  });
}

module.exports = init;
