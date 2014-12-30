/* eslint-env node */
var pack = require("./package");
var path = require("path");

var IS_PRODUCTION = process.env.NODE_ENV === "production";

function get(name, defaultValue) {
  return process.env["PLWS_" + name.toUpperCase()] || defaultValue;
}

var config = {
  appURI: "/app",
  appVersion: pack.version,
  nodeVersion: pack.engines.node,
  enableLogger: process.env.NODE_ENV !== "test",
  errorPages: IS_PRODUCTION,
  hostname: get("hostname", "127.0.0.1"),
  ip: get("IP", "127.0.0.1"),
  port: get("port", 9000),
  staticDir: path.join(__dirname, "/../static"),
  titleSuffix: " | Peter Lyons",
  wwwDir: path.join(__dirname, "www"),
  zeroClipboardDir: path.join(__dirname, "/node_modules/zeroclipboard")
};

config.analytics = {
  enabled: IS_PRODUCTION,
  code: ""
};

config.photos = {
  photoURI: "/photos/",
  galleryURI: config.appURI + "/photos",
  galleryDir: config.staticDir + "/photos",
  thumbExtension: "-TN.jpg",
  extension: ".jpg",
  galleryDataPath: path.join(__dirname, "/../data/galleries.json"),
  serveDirect: !IS_PRODUCTION
};

config.blog = {
  hashPath: path.join(__dirname, "/../data/blog_password.bcrypt"),
  postBasePath: path.join(__dirname, "/../data/posts")
};

config.inspector = {
  enabled: !IS_PRODUCTION,
  webPort: config.port + 2
};

config.tests = {
  port: get("testPort", 9002),
  debugPort: get("testDebugPort", 9004),
  mochaPath: path.join(__dirname, "node_modules/mocha")
};

config.baseURL = "http://" + config.hostname + ":" + config.port;
module.exports = config;
