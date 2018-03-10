"use strict";
const config = require("config3");
const hapi = require("hapi");
const log = require("pino")();
const path = require("path");
require("process-title");

async function start({port}) {
  const server = hapi.server({
    port: port || config.proPort,
    host: config.ip,
    routes: {
      files: {
        relativeTo: path.join(__dirname, "..", "www")
      }
    }
  });

  await server.register({
    plugin: require("hapi-pino"),
    options: {
      prettyPrint: false,
      logEvents: ["response"]
    }
  });

  await server.register(require("vision"));
  server.views({
    engines: {pug: require("pug")},
    relativeTo: path.resolve(__dirname, "pages")
  });

  server.route({
    method: "GET",
    path: "/",
    handler: (request, reply) => {
      const locals = {
        proSite: true,
        analytics: {
          code: config.analytics.proCode
        }
      };
      return reply.view("home", locals);
    }
  });
  await server.register(require("inert"));
  server.route({
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: ".",
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
