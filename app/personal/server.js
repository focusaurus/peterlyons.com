"use strict";
const config = require("config3");
const hapi = require("hapi");
const log = require("pino")();
const path = require("path");
require("process-title");

async function start({port = config.persPort, logLevel = config.logLevel}) {
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

  await server.register(require("vision"));
  server.views({
    engines: {pug: require("pug")},
    relativeTo: path.join(__dirname, ".."),
    context: require("../template-vars")()
  });

  await require("./pages")(server);
  await require("./photos/photos")(server);
  await require("../site/css-routes-hapi")(server);
  await server.register(require("./redirects"));
  await require("../static")(server);
  await require("../errors/errors-routes-hapi")(server);
  await server.start();
  log.info(`Server running at: ${server.info.uri}`);
  return server;
}

module.exports = {start};
