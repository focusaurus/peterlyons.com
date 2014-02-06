#!/usr/bin/env node
var child_process = require("child_process");
var config = require("app/config");
var express = require("express");
var NotFound = require("./NotFound");
var path = require("path");

var app = express();
app.set("view engine", "jade");
app.set("views", __dirname);
app.locals({
  config: config,
  appURI: config.appURI
});
if (config.enableLogger) {
  app.use(express.logger({
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

app.use(express.static(config.staticDir));
app.use(express.static(config.thirdPartyDir));
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

if (config.inspector.enabled) {
  child_process.fork(
    require.resolve("node-inspector/bin/inspector"),
    ["--web-port=" + config.inspector.webPort, "--web-host=127.0.0.1"],
    {execArgv: []}
  );
}
