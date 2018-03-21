const fs = require('fs')
const join = require('path').join

const snippetPath = join(
  __dirname, '..', '..', '..', 'third-party', 'googleAnalytics.js')
/* eslint no-sync:0 */
const snippet = fs.readFileSync(snippetPath, 'utf8')

function render (code) {
  return snippet.replace('TRACKING_CODE', code)
}

module.exports = render
