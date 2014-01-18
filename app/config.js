var path = require('path');

var projectRoot = path.resolve(__dirname + "/..");
var isProduction = process.env.NODE_ENV === "production";

function get(name, defaultValue) {
  return process.env["PLWS_" + name.toUpperCase()] || defaultValue;
}

var config = {
  hostname: get("hostname", "127.0.0.1"),
  port: get("port", 9000),
  appURI: "/app",
  staticDir: path.resolve(projectRoot + "/../static"),
  loopback: true,
  errorPages: isProduction,
  titleSuffix: " | Peter Lyons",
  tests: !isProduction,
  cacheCSS: !isProduction
};

config.photos = {
  photoURI: "/photos/",
  galleryURI: config.appURI + "/photos",
  galleryDir:  config.staticDir + "/photos",
  thumbExtension: "-TN.jpg",
  extension: ".jpg",
  galleryDataPath: path.resolve(projectRoot + "/../data/galleries.json"),
  serveDirect: !isProduction
};

config.blog = {
  hashPath: path.resolve(projectRoot + "/../data/blog_password.bcrypt"),
  postBasePath: path.resolve(projectRoot + "/../data/posts")
};

config.inspector = {
  enabled: !isProduction,
  webPort: config.port + 2
};

config.baseURL = "http://" + config.hostname + ":" + config.port;
module.exports = config;
