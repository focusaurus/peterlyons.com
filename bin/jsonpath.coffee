#!/usr/bin/env coffee
fs = require "fs"
path = require "path"
jsonpath = require("JSONPath").eval

inFile = path.join __dirname, "..", "package.json"
fs.readFile inFile, "utf8", (error, data) ->
  obj = JSON.parse data
  for value in jsonpath(obj, process.argv[2])
    console.log value
