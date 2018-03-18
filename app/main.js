"use strict";
const log = require("pino")();

log.info("PLWS server process starting");

const proServer = require("./server");
const persServer = require("./personal/server");

process.on("unhandledRejection", err => {
  log.fatal(err);
  setImmediate(() => {
    process.exit(66); // eslint-disable-line no-process-exit
  }, 1000);
});

async function main() {
  await proServer.start({});
  await persServer.start({});
}

main();
