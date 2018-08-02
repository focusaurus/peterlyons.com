"use strict";
const fs = require("fs");
const path = require("path");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);

const DECKS = {
  "npm-gold": "Nice Pretty Modules",
  "rapid-feedback": "Rapid Feedback Learning Tools",
  "rust-at-recurse": "Learning Rust at Recurse Center",
  "twelve-factor-nodejs": "Twelve-Factor Apps in node.js",
  "web-data": "How Data Powers the Web",
  "white-glove": "Finding Inconsistencies in Your MongoDB Data"
};

module.exports = {
  DECKS,
  name: "decks",
  version: "1.0.0",
  async register(server) {
    Object.keys(DECKS).forEach(deck => {
      server.route({
        method: "GET",
        path: `/${deck}`,
        options: { cache: false },
        handler: async (request, h) => {
          const title = DECKS[deck];
          const markdownPath = path.join(__dirname, `${deck}.md`);
          const contentMarkdown = await readFileAsync(markdownPath, "utf8");
          return h.view(`work/decks/deck`, {title, contentMarkdown});
        }
      });
      // Redirectly old snake_case_routes to kebab-case
      server.methods.redirect(`/${deck.replace(/-/g, "_")}`, `/${deck}`);
    });
  }
};
