var path = require('path');

var IS_PRODUCTION = process.env.NODE_ENV === "production";

function get(name, defaultValue) {
  return process.env["PLWS_" + name.toUpperCase()] || defaultValue;
}

var config = {
  hostname: get("hostname", "127.0.0.1"),
  port: get("port", 9000),
  appURI: "/app",
  staticDir: path.resolve(__dirname + "/../static"),
  thirdPartyDir: path.resolve(__dirname + "/thirdParty"),
  loopback: true,
  errorPages: IS_PRODUCTION,
  enableLogger: process.env.NODE_ENV !== "test",
  titleSuffix: " | Peter Lyons",
  tests: !IS_PRODUCTION,
  cacheCSS: IS_PRODUCTION,
  browserifyDebug: !IS_PRODUCTION
};

config.analytics = {
  enabled: IS_PRODUCTION,
  code: ""
};

config.photos = {
  photoURI: "/photos/",
  galleryURI: config.appURI + "/photos",
  galleryDir:  config.staticDir + "/photos",
  thumbExtension: "-TN.jpg",
  extension: ".jpg",
  galleryDataPath: path.resolve(__dirname + "/../data/galleries.json"),
  serveDirect: !IS_PRODUCTION
};

config.blog = {
  hashPath: path.resolve(__dirname + "/../data/blog_password.bcrypt"),
  postBasePath: path.resolve(__dirname + "/../data/posts")
};

config.inspector = {
  enabled: !IS_PRODUCTION,
  webPort: config.port + 2
};

config.baseURL = "http://" + config.hostname + ":" + config.port;
module.exports = config;
