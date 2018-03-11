"use strict";
const glob = require("glob");
const path = require("path");

async function init(server) {
  server.route({
    method: "GET",
    path: "/",
    handler: (request, reply) => reply.view("pages/home")
  });
  const pagesPattern = path.join(__dirname, "pages", "*.pug");
  const pages = glob.sync(pagesPattern); // eslint-disable-line no-sync
  pages.forEach(page => {
    const ext = path.extname(page);
    const base = path.basename(page, ext);
    server.route({
      method: "GET",
      path: `/${encodeURIComponent(base)}`,
      handler: (request, reply) => reply.view(`pages/${base}`)
    });
  });
}

module.exports = init;
