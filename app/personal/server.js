"use strict";
const config = require("config3");
const hapi = require("hapi");
const log = require("pino")();
const path = require("path");
require("process-title");

const persblog = {
  basePath: path.join(__dirname, "../../../data/posts/persblog"),
  prefix: "/persblog",
  staticPath: path.join(__dirname, "../../static/persblog"),
  subtitle: "Sporadic musing and accounts of my personal life",
  title: "The Stretch of Vitality"
};

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

  await server.register([
    require("../errors/errors-routes-hapi"),
    require("../site/css-routes-hapi"),
    require("../static"),
    require("./pages"),
    require("./photos/photos"),
    require("./redirects")
  ]);
  await server.register({plugin: require("../blog"), options: persblog});

  await server.start();
  log.info(`Server running at: ${server.info.uri}`);
  return server;
}

module.exports = {start};
