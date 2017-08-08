const redirector = require("../redirector");

function jsDebug(req, res) {
  res.render("js-debug/js-debug");
}

function randomDelay(req, res) {
  const delay = Math.random() * 10000;
  setTimeout(() => {
    res.send(
      `Responded after ${delay.toFixed(0)} ms to request number ${req.query
        .requestNumber}`
    );
  }, delay);
}

function setup(app) {
  app.get("/js-debug", jsDebug);
  app.get("/jsDebug", redirector("/js-debug"));
  app.get("/js-debug/random-delay", randomDelay);
  app.get("/jsDebug/randomDelay", redirector("/js-debug/random-delay"));
}

module.exports = setup;
