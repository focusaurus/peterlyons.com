"use strict";
const config = require("config3");
const hapi = require("hapi");
const log = require("pino")();
const path = require("path");
require("process-title");

const problog = {
  basePath: path.join(__dirname, "../../data/posts/problog"),
  prefix: "/problog",
  staticPath: path.join(__dirname, "../../static/problog"),
  subtitle: "A blog about web development, programming, technology",
  title: "Pete's Points"
};

async function start({port = config.proPort, logLevel = config.logLevel}) {
  const server = hapi.server({
    port,
    host: config.host,
    debug: {request: ["blog"]}
  });

  await server.register({
    plugin: require("hapi-pino"),
    options: {
      prettyPrint: false,
      logEvents: ["*"]
    }
  });
  server.logger().level = logLevel;
  log.level = logLevel;

  await server.register(require("vision"));
  server.views({
    engines: {pug: require("pug")},
    relativeTo: path.join(__dirname),
    context: require("./template-vars")({proSite: true})
  });

  await server.register([
    require("./decks/decks-routes-hapi"),
    require("./errors/errors-routes-hapi"),
    require("./js-debug/js-debug-routes-hapi"),
    require("./pages"),
    require("./personal-redirects"),
    require("./plus-party/plus-party-routes"),
    require("./site/css-routes-hapi"),
    require("./static")
  ]);
  await server.register({plugin: require("./blog"), options: problog});
  await server.start();
  log.info(`Server running at: ${server.info.uri}`);
  return server;
}

module.exports = {start};
