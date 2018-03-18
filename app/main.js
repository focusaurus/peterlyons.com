"use strict";
let proServer;

process.on("unhandledRejection", error => {
  if (proServer) {
    proServer.log("fatal", error);
  } else {
    // eslint-disable-next-line no-console
    console.error("Programmer error. Process will exit.", error);
  }
  setImmediate(() => {
    process.exit(66); // eslint-disable-line no-process-exit
  }, 1000);
});

async function main() {
  proServer = require("./server");
  const persServer = require("./personal/server");

  await proServer.start({});
  await persServer.start({});
}

main();
