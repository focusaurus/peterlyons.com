function jsdebug(req, res) {
  res.render("jsdebug/jsdebug");
}

function randomDelay(req, res) {
  var delay = Math.random() * 10000;
  setTimeout(function () {
    res.send("Responded after " + delay.toFixed(0) + " ms to request number " +
    req.query.requestNumber);
  }, delay);
}

function setup(app) {
  app.get("/jsdebug", jsdebug);
  app.get("/jsdebug/randomDelay", randomDelay);
}

module.exports = setup;
