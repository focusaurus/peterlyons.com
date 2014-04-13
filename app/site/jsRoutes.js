var bundle = require("app/site/browserifyBundle");

function setup(app) {
  app.get("/browser.js", function (req, res) {
    res.type("js");
    bundle().pipe(res);
  });
}

module.exports = setup;
