"use strict";
const config = require("config3");
const hapi = require("hapi");
const log = require("pino")();
const path = require("path");
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

  await server.register(require("inert"));
  server.route({
    method: "GET",
    path: "/reveal.js/{file*}",
    handler: {
      directory: {
        path: path.join(__dirname, "..", "node_modules", "reveal.js"),
        redirectToSlash: false,
        index: false
      }
    }
  });
  server.route({
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: path.join(__dirname, "..", "..", "static"),
        redirectToSlash: false,
        index: true
      }
    }
  });
  await server.start();
  log.info(`Server running at: ${server.info.uri}`);
  return server;
}

module.exports = {start};
