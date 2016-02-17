#!/usr/bin/env node

// Re-renders the static HTML for our error pages for when express is down.
// Writes them out to the static repo where they can later be committed to git
var async = require('async')
var fs = require('fs')
var join = require('path').join
var request = require('../app/request')

function download (code, callback) {
  var outFile = join(__dirname, '/../../static/error' + code + '.html')
  var outStream = fs.createWriteStream(outFile)
  console.log('Building ' + outFile)
  var req = request
    .get('/error' + code)
    .expect(200)
  req.on('end', callback)
  req.pipe(outStream)
}

var codes = [404, 500]
async.forEach(codes, download, function (error) {
  if (error) {
    console.error(error)
    process.exit(10) // eslint-disable-line no-process-exit
    return
  }
  process.exit() // eslint-disable-line no-process-exit
})
