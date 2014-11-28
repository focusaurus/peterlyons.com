var analytics = require("app/site/blocks/analytics");
var config = require("config3");
var connect = require("connect");
var express = require("express");
var httpErrors = require("httperrors");
var log = require("bole")(__filename);

var app = express();
app.set("view engine", "jade");
app.set("views", __dirname);
app.locals.config = config;
app.locals.appURI = config.appURI;
app.locals.appVersion = config.appVersion;
app.locals.analytics = analytics;
if (config.enableLogger) {
  app.use(function logger(req, res, next) {
    log.debug(req);
    next();
  });
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
app.use(connect.static(config.zeroClipboardDir));
app.use(function(req, res, next) {
  next(new httpErrors.NotFound(req.path));
});

/* eslint no-unused-vars:0 */
//Express looks at function arity, so we must declare 4 arguments here
app.use(function(error, req, res, next) {
  res.status(error.statusCode || 500);
  if (error.statusCode === 404) {
    res.render("site/error404");
  } else {
    res.render("site/error500");
    log.error(error, req);
  }
});

module.exports = app;
