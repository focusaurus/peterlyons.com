var bundle = require("browserify")();
bundle.require("app/blogs/browser/createPost");
bundle.require("app/navigation/browser");
bundle.require("app/pages/career");
bundle.require("app/pages/home");
bundle.require("app/photos/browser/viewGallery");
bundle.require("app/plusParty/browser");

function setup(app) {
  app.get("/browser.js", function (req, res) {
    res.header("Content-Type", "text/javascript");
    bundle.bundle().pipe(res);
  });
}

module.exports = setup;
