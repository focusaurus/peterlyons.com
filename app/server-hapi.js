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
      logEvents: ["response"]
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
    require("./pages"),
    require("./site/css-routes-hapi"),
    require("./decks/decks-routes-hapi"),
    require("./js-debug/js-debug-routes-hapi"),
    require("./plus-party/plus-party-routes"),
    require("./personal-redirects")
  ]);
  await server.register({plugin: require("./blog"), options: problog});
  await server.register(require("./static"));
  await server.register(require("./errors/errors-routes-hapi"));
  await server.start();
  log.info(`Server running at: ${server.info.uri}`);
  return server;
}

module.exports = {start};
