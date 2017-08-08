const appCommon = require("../app-common");
const Blog = require("../blog");
const compression = require("compression");
const config = require("config3");
const express = require("express");
const join = require("path").join;

const app = express();
appCommon.head(app);

app.use((req, res, next) => {
  res.locals.analytics.code = config.analytics.persCode;
  next();
});

function render(view) {
  return function renderMW(req, res) {
    res.render(`personal/${view}`);
  };
}
app.use(compression());
app.get("/", render("home"));
app.get("/oberlin", render("oberlin"));
app.get("/bands", render("bands"));
app.get("/favorites", render("favorites"));
app.use(require("./photos/photos-routes"));
app.use(require("./redirects"));

const persblog = new Blog({
  basePath: join(__dirname, "../../../data/posts/persblog"),
  prefix: "/persblog",
  title: "The Stretch of Vitality",
  subtitle: "Sporadic musing and accounts of my personal life"
});
app.use(persblog.prefix, persblog.app);
appCommon.tail(app);

module.exports = app;
