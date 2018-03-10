"use strict";
const serverHapi = require("./server-hapi");
const tap = require("tap");

let server;

async function getServer() {
  if (!server) {
    server = await serverHapi.start({port: null, logLevel: 'silent'});
  }
  return server;
}
module.exports = getServer;

tap.tearDown(async () => {
  if (!server) {
    return;
  }
  await server.stop();
});
