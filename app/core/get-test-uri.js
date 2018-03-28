"use strict";
const tap = require("tap");

/**
 * This file works in 2 modes.
 * For unit tests, it starts a local server on a free port
 * and returns the URI for testing. The server gets stopped at the end of the
 * test suite.
 *
 * For integration testing a running instance
 * (could be local, stage, production), set the environment variable URI
 * to the base URI the tests should hit, and that will be used instead.
 */
let server;

async function getServer(serverMod) {
  const uri = process.env.URI;
  /* istanbul ignore if */
  if (/^https?:\/\//.test(uri)) {
    return uri;
  }
  if (server) {
    return server.info.uri;
  }
  server = await serverMod.setup({port: 0, logLevel: "silent"});
  await server.start();
  return server.info.uri;
}

tap.tearDown(async () => {
  await server.stop();
});

module.exports = getServer;
