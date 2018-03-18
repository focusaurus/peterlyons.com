"use strict";
require("process-title");

let proServer;

process.on("unhandledRejection", error => {
  if (proServer && typeof proServer.log === "function") {
    proServer.log("fatal", error);
  } else {
    // eslint-disable-next-line no-console
    console.error("Programmer error. Process will exit.", error);
  }
  setImmediate(() => {
    process.exit(66); // eslint-disable-line no-process-exit
  }, 1000); // Allow time for log to flush
});

async function main() {
  proServer = await require("./server").setup({});
  await proServer.start();
  proServer.log("info", `Server (pro) running at: ${proServer.info.uri}`);

  const persServer = await require("./personal/server").setup({});
  await persServer.start();
  persServer.log("info", `Server (pers) running at: ${persServer.info.uri}`);
}

main();
