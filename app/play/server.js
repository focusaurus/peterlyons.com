"use strict";
const config = require("../core/config-validate");
const hapi = require("hapi");
const path = require("path");

const persblog = {
  basePath: path.join(__dirname, "../../../data/posts/persblog"),
  prefix: "/persblog",
  staticPath: config.staticDir,
  subtitle: "Sporadic musing and accounts of my personal life",
  title: "The Stretch of Vitality"
};

async function setup({port = config.persPort, logLevel = "debug"} = {}) {
  const server = hapi.server({debug: false, host: "localhost", port});

  await server.register({
    plugin: require("hapi-pino"),
    options: {
      mergeHapiLogData: true
    }
  });
  server.logger().level = logLevel;
  server.log("info", "PLWS (play) server starting");

  await server.register(require("vision"));
  server.views({
    engines: {pug: require("pug")},
    relativeTo: path.join(__dirname, ".."),
    context: require("../core/template-vars")()
  });

  await server.register([
    require("../core/errors/errors-plugin"),
    require("../core/css-plugin"),
    require("../core/static-plugin"),
    require("./pages-plugin"),
    require("./redirect-plugin")
  ]);
  await server.register({
    plugin: require("./photos/photos-plugin"),
    options: {
      baseDir: config.photos.galleryDir,
      galleries: require("./photos/galleries-data")
    }
  });
  await server.register({
    plugin: require("../core/blog/blog-plugin"),
    options: persblog
  });
  return server;
}

module.exports = {setup};
