#!/usr/bin/env coffee
fs = require "fs"
path = require "path"
jsonPath = path.join __dirname, "..", "package.json"
json = fs.readFileSync jsonPath, "utf8"
config = JSON.parse(json)
if process.argv.length > 2
  json = json.replace config.version, process.argv[2]
  fs.writeFileSync jsonPath, json, "utf8"
else
  console.log config.version
