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
  await server.register(require("vision")); // renders page templates (pug)
  server.views({
    engines: {pug: require("pug")},
    relativeTo: path.join(__dirname, "../.."),
    context: require("../../core/template-vars")({proSite: false})
  });
  const options = {
    galleries: require("./galleries-test"),
    baseDir: path.join(__dirname, "unit-test-galleries")
  };
  await server.register({plugin: require("./photos-plugin"), options});
  await server.start();
  return server;
}

tap.tearDown(async () => {
  await server.stop();
});

module.exports = getServer;

// if (require.main === module) {
//   (async () => {
//     server = await getServer();
//     console.log("HEY", server.info.uri); // fixme
//   })();
// }
