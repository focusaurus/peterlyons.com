const _ = require("lodash");
const analyticsScript = require("./site/blocks/analytics");
const compression = require("compression");
const config = require("config3");
const cssRoutes = require("./site/css-routes");
const express = require("express");
const httpErrors = require("httperrors");
const log = require("bole")(__filename);

function locals(req, res, next) {
  Object.assign(
    res.locals,
    _.pick(config, "appURI", "appVersion", "analytics", "titleSuffix")
  );
  res.locals.analytics.script = analyticsScript;
  next();
}

function security(req, res, next) {
  res.header("X-Frame-Options", "DENY");
  res.header("X-Content-Type-Options", "nosniff");
  res.header("X-XSS-Protection", "1");
  next();
}

function head(app) {
  app.set("view engine", "pug");
  app.set("views", __dirname);
  app.set("trust proxy", true);
  app.disable("x-powered-by");
  if (config.enableLogger) {
    app.use((req, res, next) => {
      log.debug(req);
      next();
    });
  }
  app.use(compression());
  app.use(security);
  app.use(locals);
  app.use(cssRoutes);
}

function tail(app) {
  app.use(express.static(config.staticDir));
  app.use(express.static(config.wwwDir));
  app.use((req, res, next) => {
    next(new httpErrors.NotFound(req.path));
  });
  app.use(require("./errors/error-handler"));
}

module.exports = {
  head,
  tail
};
