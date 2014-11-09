var config = require("config3");
var childProcess = require("child_process");

if (config.inspector.enabled) {
  setTimeout(function () {
    childProcess.fork(
      require.resolve("node-inspector/bin/inspector"),
      ["--web-port=" + config.inspector.webPort, "--web-host=127.0.0.1"],
      {execArgv: []}
    );
    //tell node to start up the v8 debugger
    //delay is here to avoid TCP port bind conflicts during node-dev restarts
    //process.kill(process.pid, "SIGUSR1");

  }, 2000);
}
