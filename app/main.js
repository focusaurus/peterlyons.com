"use strict";
const log = require("pino")();

log.info("PLWS server process starting");

const proServer = require("./server-hapi");
const persServer = require("./personal/server");

process.on("unhandledRejection", err => {
  log.fatal(err);
  // eslint-disable-next-line no-process-exit
  process.exit(66);
});

async function main() {
  await proServer.start({});
  await persServer.start({});
}

main();
