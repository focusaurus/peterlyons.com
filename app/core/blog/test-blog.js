"use strict";
const hapi = require("hapi");
const path = require("path");
const tap = require("tap");

let server;

async function getServer() {
  if (server) {
    return server;
  }
  server = hapi.server({debug: false, host: "localhost", port: 0});

  await server.register(require("vision"));
  server.views({
    engines: {pug: require("pug")},
    relativeTo: path.join(__dirname, "../..")
  });
  const options = {
    basePath: path.join(__dirname, "unit-test-blog1"),
    staticPath: path.join(__dirname, "unit-test-blog1"),
    title: "Unit Test Blog 1",
    prefix: "/utb",
    subtitle: "Unit Test Subtitle 1"
  };
  await server.register({plugin: require("./blog-plugin"), options});
  await server.start();
  return server;
}

tap.tearDown(async () => {
  if (!server) {
    return;
  }
  await server.stop();
});

module.exports = getServer;
