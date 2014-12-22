var config = require("config3");
var fs = require("fs");
var path = require("path");

var snippetPath = path.join(
  __dirname, "..", "..", "..", "thirdParty", "googleAnalytics.js");
var snippet = fs.readFileSync(snippetPath, "utf8");

function render() {
  return snippet.replace("TRACKING_CODE", config.analytics.code);
}

module.exports = render;
