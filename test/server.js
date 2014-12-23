#!/usr/bin/env node
var config = require("config3");
var express = require("express");
var path = require("path");

var app = express();

app.use("/mocha", express.static(config.tests.mochaPath));
app.use(express.static(path.join(__dirname, "../test")));

app.listen(config.tests.port, "127.0.0.1", function (error) {
  if (error) {
    console.error(error);
    /* eslint no-process-exit:0 */
    process.exit(10);
  }
  console.log("http://127.0.0.1:" + config.tests.port);
});
