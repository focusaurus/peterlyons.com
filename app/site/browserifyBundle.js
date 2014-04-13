#!/usr/bin/env node
var bundle = require("browserify")();
var config = require("app/config");

if (config.browserifyDebug) {
  bundle = require("watchify")();
  bundle.on("update", build);
}
[
  "angular",
  "angular-sanitize",
  "angular-route"
].forEach(function (name) {
  bundle.require(config.thirdPartyDir + "/" + name + ".js", {expose: name});
});
bundle.require("app/browser/career");
bundle.require("app/browser/post");
bundle.require("app/browser/home");
bundle.require("app/browser/plusParty");
bundle.require("app/browser/viewGallery");
bundle.require("app/browser/navigation");

function build() {
  return bundle.bundle({debug: config.browserifyDebug});
}

if (require.main === module) {
  build().pipe(process.stdout);
}

module.exports = build;
