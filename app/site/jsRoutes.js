var browserifyBundle = require("app/site/browserifyBundle");

function setup(app) {
  app.get("/browser.js", function (req, res) {
    res.type("js");
    if (browserifyBundle.prebuiltCache) {
      res.send(browserifyBundle.prebuiltCache);
      return;
    }
    browserifyBundle().pipe(res);
  });
}

module.exports = setup;
