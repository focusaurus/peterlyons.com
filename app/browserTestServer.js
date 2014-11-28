#!/usr/bin/env node
var bmw = require("browserify-middleware");
var config = require("config3");
var express = require("express");
var glob = require("glob");
var path = require("path");

var CTEST_GLOB = path.join(__dirname, "**/*.btest.js");
var app = express();

function bmwAdd(path) {
  var pathConfig = {};
  pathConfig[path] = {entry: true};
  return pathConfig;
}

function bundleTests(req, res, next) {
  glob(CTEST_GLOB, function (error, clientTests) {
    if (error) {
      next(error);
      return;
    }
    var toAdd = clientTests.map(bmwAdd);
    bmw.call(null, toAdd)(req, res, next);
  });
}
app.use("/mocha", express.static(config.tests.mochaPath));
app.get("/browser-tests.js", bundleTests);
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../test/index.html"));
});

app.listen(config.tests.port, "127.0.0.1", function (error) {
  if (error) {
    console.error(error);
    /* eslint no-process-exit:0 */
    process.exit(10);
  }
  console.log("http://127.0.0.1:" + config.tests.port);
});
