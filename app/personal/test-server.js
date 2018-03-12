"use strict";
const serverHapi = require("./server");
const tap = require("tap");

let server;

async function getServer() {
  if (!server) {
    server = await serverHapi.start({port: null, logLevel: 'silent'});
  }
  return server;
}

tap.tearDown(async () => {
  if (!server) {
    return;
  }
  await server.stop();
});

module.exports = getServer;
