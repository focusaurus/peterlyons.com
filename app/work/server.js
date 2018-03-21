"use strict";
const config = require("config3");
const hapi = require("hapi");
const path = require("path");

const problog = {
  basePath: path.join(__dirname, "../../../data/posts/problog"),
  prefix: "/problog",
  staticPath: path.join(__dirname, "../../../static"),
  subtitle: "A blog about web development, programming, technology",
  title: "Pete's Points"
};

async function setup({port = config.proPort, logLevel = config.logLevel} = {}) {
  const server = hapi.server({debug: false, host: config.host, port});

  await server.register({
    plugin: require("hapi-pino"),
    options: {mergeHapiLogData: true}
  });

  await server.register([
    require("vision"), // renders page templates (pug)
    require("../core/redirect-plugin"), // old uri redirects,
    require("../core/security-plugin") // headers
  ]);
  server.logger().level = logLevel;
  server.log("info", "PLWS (professional) server starting");

  server.views({
    engines: {pug: require("pug")},
    relativeTo: path.join(__dirname, ".."),
    context: require("../core/template-vars")({proSite: true})
  });

  await server.register([
    require("./decks/decks-plugin"),
    require("../core/errors/errors-plugin"),
    require("./js-debug/js-debug-plugin"),
    require("./pages-plugin"),
    require("./play-redirect-plugin"),
    require("./plus-party/plus-party-routes"),
    require("../core/css-plugin"),
    require("../core/static-plugin")
  ]);
  await server.register({
    plugin: require("../core/blog/blog-plugin"),
    options: problog
  });
  return server;
}

module.exports = {setup};
