"use strict";
const _ = require("lodash");
const config = require("config3");
const hapi = require("hapi");
const log = require("pino")();
const path = require("path");
require("process-title");

async function start({port = config.proPort, logLevel = config.logLevel}) {
  const server = hapi.server({
    port,
    host: config.host
    // debug: {request: ["*"]}
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

  await require("./pages")(server);
  await require("./site/css-routes-hapi")(server);
  await require("./decks/decks-routes-hapi")(server);
  await require("./js-debug/js-debug-routes-hapi")(server);
  await server.register(require("./personal-redirects"));
  await require("./static")(server);
  await require("./errors/errors-routes-hapi")(server);
  await server.start();
  log.info(`Server running at: ${server.info.uri}`);
  return server;
}

module.exports = {start};
