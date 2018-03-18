"use strict";
const {join} = require("path");
const pack = require("./package");

const IS_PRODUCTION = process.env.NODE_ENV === "production";

function get(name, defaultValue) {
  return process.env[`PLWS_${name}`] || defaultValue;
}

const config = {
  appURI: "/app",
  appVersion: pack.version,
  enableLogger: false, // process.env.NODE_ENV !== 'test',
  host: get("HOST", "127.0.0.1"),
  logLevel: get("LOG_LEVEL", IS_PRODUCTION ? "info" : "debug"),
  persPort: get("PERS_PORT", 9001),
  proPort: get("PRO_PORT", 9000),
  revealDir: join(__dirname, "node_modules/reveal.js"),
  staticDir: join(__dirname, "../static"),
  titleSuffix: " | Peter Lyons",
  wwwDir: join(__dirname, "www")
};

config.analytics = {
  enabled: IS_PRODUCTION,
  proCode: "",
  persCode: ""
};

config.photos = {
  photoURI: "/photos/",
  galleryURI: `${config.appURI}/photos`,
  galleryDir: `${config.staticDir}/photos`,
  thumbExtension: "-TN.jpg",
  extension: ".jpg",
  serveDirect: !IS_PRODUCTION
};

config.blog = {
  hashPath: join(__dirname, "../data/blog_password.bcrypt")
};

module.exports = config;
