var config = require("config3");
var fs = require("fs");
var join = require("path").join;

var snippetPath = join(
  __dirname, "..", "..", "..", "thirdParty", "googleAnalytics.js");
/* eslint no-sync:0 */
var snippet = fs.readFileSync(snippetPath, "utf8");

function render() {
  return snippet.replace("TRACKING_CODE", config.analytics.code);
}

module.exports = render;
