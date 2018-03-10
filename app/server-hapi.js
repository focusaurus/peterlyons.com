"use strict";
const config = require("config3");
const hapi = require("hapi");
const log = require("pino")();
const path = require("path");
require("process-title");

const server = hapi.server({
  port: config.proPort,
  host: config.ip,
  routes: {
    files: {
      relativeTo: path.join(__dirname, "..", "www")
    }
  }
});

async function init() {
  await server.register({
    plugin: require("hapi-pino"),
    options: {
      prettyPrint: false,
      logEvents: ["response"]
    }
  });
  await server.register(require("inert"));
  server.route({
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: ".",
        redirectToSlash: true,
        index: true
      }
    }
  });
  await server.start();
  log.info(`Server running at: ${server.info.uri}`);
}

process.on("unhandledRejection", err => {
  log.fatal(err);
  // eslint-disable-next-line no-process-exit
  process.exit(66);
});

init();
