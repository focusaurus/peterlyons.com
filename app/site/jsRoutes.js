var bmw = require("browserify-middleware");
var config = require("config3");

var bmwOptions = {
  cache: 1000 * 60 * 60 * 24 * 7, //1 week in milliseconds
  debug: false,
  gzip: true,
  //don't mangle due to angularjs Function.toString() dependency injection
  minify: {mangle: false},
  precompile: false //browserify-middleware bug if this is true
  //https://github.com/ForbesLindesay/browserify-middleware/issues/49
};

if (config.browserifyDebug) {
  bmwOptions.cache = 'dynamic';
  bmwOptions.debug = true;
  bmwOptions.minify = false;
}

function setup(app) {
  app.get("/browser.js", bmw([
    {"app/browser/navigation": {"add": true}},
    "app/browser/career",
    "app/browser/home",
    "app/browser/plusParty",
    "app/browser/post",
    "app/browser/viewGallery",
    "app/browser/navigation"
  ], bmwOptions));
}

module.exports = setup;
