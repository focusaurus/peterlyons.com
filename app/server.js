#!/usr/bin/env node
require("process-title");
var config = require("config3");
var connect = require("connect");
var express = require("express");
var NotFound = require("./NotFound");

var app = express();
app.set("view engine", "jade");
app.set("views", __dirname);
app.locals.config = config;
app.locals.appURI = config.appURI;
if (config.enableLogger) {
  app.use(connect.logger({
    immediate: true,
    format: ":method :url :date"
  }));
}
[
  "blogs/blogRoutes",
  "plusParty/plusPartyRoutes",
  "jsDebug/jsDebugRoutes",
  "pages/pagesRoutes",
  "photos/photosRoutes",
  "photos/galleriesRoutes",
  "site/cssRoutes",
  "site/jsRoutes",
  "site/errorRoutes"
].forEach(function(routesPath) {
  require("app/" + routesPath)(app);
});

app.use(connect.static(config.staticDir));
app.use(connect.static(config.thirdPartyDir));
app.use(function(req, res, next) {
  next(new NotFound(req.path));
});

app.use(function(error, req, res, next) {
  if (error instanceof NotFound) {
    res.render("site/error404");
  } else {
    res.render("site/error500");
    console.error(error);
  }
});

var ip = config.loopback ? "127.0.0.1" : "0.0.0.0";

module.exports = app;
if (module !== require.main) {
  return;
}

app.listen(config.port, ip, function(error) {
  if (error) {
    throw error;
  }
  console.log(
    "Express serving on http://" + ip + ":" + config.port,
    "\n\tbaseURL: " + config.baseURL,
    "\n\tenv: " + process.env.NODE_ENV
  );
});
// require('app/inspector');
