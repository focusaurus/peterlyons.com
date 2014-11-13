#!/usr/bin/env node
require("process-title");
var app = require("./index");
var config = require("config3");

app.listen(config.port, config.ip, function(error) {
  if (error) {
    throw error;
  }
  console.log(
    "Express serving on http://" + config.ip + ":" + config.port,
    "\n\tbaseURL: " + config.baseURL,
    "\n\tenv: " + process.env.NODE_ENV
  );
});
// require('app/inspector');
