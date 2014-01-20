#!/usr/bin/env node
var fs = require("fs");
var path = require("path");
var jsonPath = path.join(__dirname, "..", "package.json");
var json = fs.readFileSync(jsonPath, "utf8");
var config = JSON.parse(json);
if (process.argv.length > 2) {
  json = json.replace(config.version, process.argv[2]);
  fs.writeFileSync(jsonPath, json, "utf8");
} else {
  console.log(config.version);
}
