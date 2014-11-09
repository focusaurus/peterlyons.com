#!/usr/bin/env node
//
// Re-renders the static HTML for our error pages for when express is down.
// Writes them out to the static repo where they can later be committed to git

var config = require("config3");
var fs = require("fs");
var jade = require("jade");
var path = require("path");

[404, 500].forEach(function(code) {
  var filename = path.join(__dirname + "/../app/site/error" +
    code + ".jade");
  var template = fs.readFileSync(filename, "utf8");
  var templateFn = jade.compile(template, {filename: filename});
  var html = templateFn(config);
  var outFile = path.join(__dirname + "/../../static/error" +
    code + ".html");
  console.log("Writing " + outFile);
  fs.writeFileSync(outFile, html, "utf8");
});
