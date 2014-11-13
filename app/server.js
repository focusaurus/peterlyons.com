#!/usr/bin/env node
require("process-title");
var app = require("./index");
var config = require("config3");
var ip = config.loopback ? "127.0.0.1" : "0.0.0.0";

app.listen(config.port, ip, function(error) {
  if (error) {
    throw error;
  }
  console.log(
    "Express serving on http://" + ip + ":" + config.port,
    "\n\tbaseURL: " + config.baseURL,
    "\n\tenv: " + process.env.NODE_ENV
  );
});
// require('app/inspector');
