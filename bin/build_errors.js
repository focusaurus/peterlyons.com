#!/usr/bin/env node
//
// Re-renders the static HTML for our error pages for when express is down.
// Writes them out to the static repo where they can later be committed to git

var config = require('config3')
var fs = require('fs')
var jade = require('jade')
var join = require('path').join

/* eslint-disable no-sync */
var codes = [404, 500]
codes.forEach(function (code) {
  var filename = join(__dirname, '../app/site/error' + code + '.jade')
  var template = fs.readFileSync(filename, 'utf8')
  var templateFn = jade.compile(template, {filename: filename})
  var html = templateFn(config)
  var outFile = join(__dirname, '/../../static/error' + code + '.html')
  console.log('Writing ' + outFile)
  fs.writeFileSync(outFile, html, 'utf8')
})
