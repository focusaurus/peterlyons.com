"use strict";
const {join} = require("path");
const pack = require("./package");

const config = {
  appVersion: pack.version,
  host: process.env.PLWS_HOST || "127.0.0.1",
  persPort: process.env.PLWS_PERS_PORT || 9001,
  proPort: process.env.PLWS_PRO_PORT || 9000,
  revealDir: join(__dirname, "node_modules/reveal.js"),
  staticDir: join(__dirname, "../static")
};

config.photos = {
  galleryDir: `${config.staticDir}/photos`
};

config.blog = {
  hashPath: join(__dirname, "../data/blog_password.bcrypt")
};

module.exports = config;
