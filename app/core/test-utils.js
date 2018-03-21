"use strict";
const cheerio = require("cheerio");
const request = require("supertest");
const tap = require("tap");

function assertSelectors($, ...selectors) {
  selectors.forEach(selector => {
    tap.ok($(selector).length > 0, `Document missing selector ${selector}`);
  });
}

function assertSubstrings($, ...phrases) {
  const html = $.html();
  phrases.forEach(phrase => {
    tap.match(html, phrase, `Document missing phrase ${phrase}`);
  });
}

function assertDeck($) {
  tap.same($(".reveal .slides ").length, 1);
  assertSubstrings($, "reveal.js");
}

async function loadDom(uri, path) {
  return request(uri)
    .get(path)
    .expect(200)
    .then(res => cheerio.load(res.text));
}

module.exports = {
  assertSelectors,
  assertSubstrings,
  assertDeck,
  loadDom
};
