#!/usr/bin/env node
var bundle = require("browserify")();
var concat = require("concat-stream");
var config = require("app/config");

function build() {
  return bundle.bundle({debug: config.browserifyDebug});
}

function cache() {
  build().pipe(concat(function(buffer) {
    module.exports.prebuiltCache = buffer;
  }));
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

if (require.main === module) {
  var brStream = build();
  brStream.pipe(process.stdout);
  brStream.on('end', process.exit);
} else {
  cache();
}

module.exports = build;
