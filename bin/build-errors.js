#!/usr/bin/env node

// Re-renders the static HTML for our error pages for when express is down.
// Writes them out to the static repo where they can later be committed to git
const async = require('async')
const fs = require('fs')
const join = require('path').join
const request = require('../app/request')

function download (code, callback) {
  const outFile = join(__dirname, '/../../static/error' + code + '.html')
  const outStream = fs.createWriteStream(outFile)
  console.log('Building ' + outFile)
  request
    .get('/error' + code)
    .expect(code)
    .end((error, res) => {
      const html = res && res.text
      if (html) {
        outStream.end(html)
      } else {
        console.error(`ERROR: no HTML received for ${code}: ${error.message}`)
      }
      callback(error)
    })
}

async.forEach([404, 500], download, function (error) {
  if (error) {
    console.error(error)
    process.exit(10)
  }
  process.exit()
})
