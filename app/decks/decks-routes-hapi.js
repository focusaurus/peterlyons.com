"use strict";
const fs = require("fs");
const locals = require("../locals");
const path = require("path");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);

const DECKS = {
  "web-data": "How Data Powers the Web",
  "rapid-feedback": "Rapid Feedback Learning Tools",
  "npm-gold": "Nice Pretty Modules",
  "rust-at-recurse": "Learning Rust at Recurse Center",
  "twelve-factor-nodejs": "Twelve-Factor Apps in node.js",
  "white-glove": "Finding Inconsistencies in Your MongoDB Data"
};

async function setup(server) {
  server.route({
    method: "GET",
    path: "/{deck}",
    handler: async (request, reply) => {
      const {deck} = request.params;
      const title = DECKS[deck];
      if (!title) {
        return reply.continue;
      }
      const markdownPath = path.join(__dirname, `${deck}.md`);
      const contentMarkdown = await readFileAsync(markdownPath, "utf8");
      return reply.view(`decks/deck`, locals({title, contentMarkdown}));
    }
  });
}
module.exports = setup;
module.exports.DECKS = DECKS;
