var fs = require('fs')
var join = require('path').join

var snippetPath = join(
  __dirname, '..', '..', '..', 'third-party', 'googleAnalytics.js')
/* eslint no-sync:0 */
var snippet = fs.readFileSync(snippetPath, 'utf8')

function render (code) {
  return snippet.replace('TRACKING_CODE', code)
}

module.exports = render
