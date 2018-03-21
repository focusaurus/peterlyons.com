"use strict";
const config = require("config3");
const hapi = require("hapi");
const path = require("path");

const persblog = {
  basePath: path.join(__dirname, "../../../data/posts/persblog"),
  prefix: "/persblog",
  staticPath: path.join(__dirname, "../../static"),
  subtitle: "Sporadic musing and accounts of my personal life",
  title: "The Stretch of Vitality"
};

async function setup({port = config.persPort, logLevel = config.logLevel}) {
  const server = hapi.server({debug: false, host: config.host, port});

  await server.register({
    plugin: require("hapi-pino"),
    options: {
      mergeHapiLogData: true
    }
  });
  server.logger().level = logLevel;
  server.log("info", "PLWS (personal) server starting");

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
  return server;
}

module.exports = {setup};
