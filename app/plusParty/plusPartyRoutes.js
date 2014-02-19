var express = require("express");

function plusParty(req, res) {
  res.render("plusParty/plusParty.jade");
}

function setup(app) {
  app.use("/plusparty", express.static(__dirname + "/browser"));
  app.get("/plusparty", plusParty);
}

module.exports = setup;
