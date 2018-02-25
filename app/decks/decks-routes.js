const httpErrors = require("httperrors");
const fs = require("fs");
const path = require("path");

const DECKS = {
  "web-data": "How Data Powers the Web",
  "rapid-feedback": "Rapid Feedback Learning Tools",
  "npm-gold": "Nice Pretty Modules",
  "rust-at-recurse": "Learning Rust at Recurse Center",
  "twelve-factor-nodejs": "Twelve-Factor Apps in node.js",
  "white-glove": "Finding Inconsistencies in Your MongoDB Data"
};
const deckPattern = `/:deck(${Object.keys(DECKS).join("|")})`;

function renderDeck(req, res, next) {
  const markdownPath = path.join(__dirname, `${req.params.deck}.md`);
  fs.readFile(markdownPath, "utf8", (error, contentMarkdown) => {
    if (error) {
      if (error.code === "ENOENT") {
        next(new httpErrors.NotFound(req.path));
        return;
      }
      next(error);
      return;
    }
    res.locals.title = DECKS[req.params.deck];
    res.locals.contentMarkdown = contentMarkdown;
    res.render("decks/deck.pug");
  });
}

function setup(app) {
  app.get(deckPattern, renderDeck);
}

module.exports = setup;
module.exports.DECKS = DECKS;
