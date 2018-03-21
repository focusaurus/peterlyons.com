"use strict";
require("process-title");

let workServer;

process.on("unhandledRejection", error => {
  if (workServer && typeof workServer.log === "function") {
    workServer.log("fatal", error);
  } else {
    // eslint-disable-next-line no-console
    console.error("Programmer error. Process will exit.", error);
  }
  setImmediate(() => {
    process.exit(66); // eslint-disable-line no-process-exit
  }, 1000); // Allow time for log to flush
});

async function main() {
  workServer = await require("./work/server").setup({});
  await workServer.start();
  workServer.log("info", `Server (work) running at: ${workServer.info.uri}`);

  const playServer = await require("./play/server").setup({});
  await playServer.start();
  playServer.log("info", `Server (play) running at: ${playServer.info.uri}`);
}

main();
