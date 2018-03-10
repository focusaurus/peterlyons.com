"use strict";
const config = require("config3");
const hapi = require("hapi");
const log = require("pino")();
require("process-title");

async function start({port = config.proPort, logLevel = config.logLevel}) {
  const server = hapi.server({
    port,
    host: config.host
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

  await require("./pages")(server);
  await require("./site/css-routes-hapi")(server);
  await require("./decks/decks-routes-hapi")(server);
  await require("./static")(server);

  await server.start();
  log.info(`Server running at: ${server.info.uri}`);
  return server;
}

module.exports = {start};
