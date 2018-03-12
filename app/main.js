"use strict";
const log = require("pino")();

log.info("PLWS server process starting");

process.on("unhandledRejection", err => {
  log.fatal(err);
  // eslint-disable-next-line no-process-exit
  process.exit(66);
});

async function main() {
  await require("./server-hapi").start({});
  await require("./personal/server").start({});
}

main();
