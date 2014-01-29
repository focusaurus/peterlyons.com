var bundle = require("browserify")();
bundle.require("app/browser/career");
bundle.require("app/browser/CreatePost");
bundle.require("app/browser/home");
bundle.require("app/browser/navigation");
bundle.require("app/browser/plusParty");
bundle.require("app/browser/viewGallery");

function setup(app) {
  app.get("/browser.js", function (req, res) {
    res.header("Content-Type", "text/javascript");
    bundle.bundle().pipe(res);
  });
}

module.exports = setup;
