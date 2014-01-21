var cheerio = require("cheerio");
var config = require("app/config");
var fs = require("fs");
var jade = require("jade");
var path = require("path");
var templateMiddleware = require("./templateMiddleware");

var titles = {
  code_conventions: "Code Conventions",
  leveling_up: "Leveling Up: Career Advancement for Software Developers",
  oberlin: "Music from Oberlin",
  bands: "My Bands"
};

function setup(app) {
  app.locals({
    titleSuffix: config.titleSuffix
  });
  app.engine("md", function(mdPath, options, callback) {
    fs.readFile(mdPath, "utf8", function(error, markdownText) {
      if (error) {
        return callback(error);
      }
      var viewName = path.basename(mdPath).slice(0, -3);
      var title = titles[viewName];
      var jadeText = [
        "extends ../site/layout",
        "block variables",
        '  - title = "' + title + '"',
        "block body",
        "  :markdown",
        "    " + markdownText.split("\n").join("\n    ")
      ].join("\n");
      var tplFunction = jade.compile(jadeText, {filename: mdPath});
      callback(null, tplFunction(options));
    });
  });
  app.use(templateMiddleware("jade"));
  app.use(templateMiddleware("md"));
  app.get("/", function(req, res) {
    res.render("pages/home");
  });
  app.get("/:deck(web_data|rapid_feedback)", function(req, res, next) {
    app.render("pages/decks/" + req.params.deck, function(error, html) {
      if (error) {
        return next(error);
      }
      var $ = cheerio.load(html);
      $("body").addClass("deck-container");
      $("section").addClass("slide");
      res.send($.html());
    });
  });
}

module.exports = setup;
