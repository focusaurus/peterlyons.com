const appCommon = require("./app-common");
const Blog = require("./blog");
const config = require("config3");
const express = require("express");
const glob = require("glob");
const path = require("path");
const redirector = require("./redirector");

const app = express();
appCommon.head(app);
const problog = new Blog({
  basePath: path.join(__dirname, "../../data/posts/problog"),
  prefix: "/problog",
  staticPath: path.join(__dirname, "../../static/problog"),
  subtitle: "A blog about web development, programming, technology",
  title: "Pete's Points"
});
app.use((req, res, next) => {
  res.locals.proSite = true;
  res.locals.analytics.code = config.analytics.proCode;
  next();
});
app.use(problog.prefix, problog.app);

app.get("/", (req, res) => {
  res.render("pages/home");
});
require("./plus-party/plus-party-routes")(app);
require("./js-debug/js-debug-routes")(app);
require("./decks/decks-routes")(app);
// Add routes for each template in "pages" directory
const pagesPattern = path.join(__dirname, "pages/*.pug");
const pages = glob.sync(pagesPattern); // eslint-disable-line no-sync
pages.forEach(page => {
  const ext = path.extname(page);
  const base = path.basename(page, ext);
  app.get(`/${base}`, (req, res) => {
    res.render(path.join("pages", base));
  });
});

app.use(require("./play-redirects"));

app.get("/plusparty", redirector("/plus-party"));
// Permanent redirect any legacy snake_case URLs to kebab-case
app.get(/^\/[a-z0-9]+_/, (req, res) => {
  res.redirect(301, req.path.replace(/_/g, "-"));
});
app.use(require("./errors/error-routes"));
// needed for reveal slideshows
app.use("/reveal.js", express.static(config.revealDir));
appCommon.tail(app);

module.exports = app;
