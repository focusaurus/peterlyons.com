var connect = require("connect");

function plusParty(req, res) {
  res.render("plusParty/plusParty.jade");
}

function setup(app) {
  app.get("/plusparty", plusParty);
}

module.exports = setup;
