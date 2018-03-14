"use strict";
const cheerio = require("cheerio");
const expect = require("chaimel");
const request = require("supertest");

function assertSelectors($, ...selectors) {
  selectors.forEach(selector => {
    expect($(selector)).toHaveLengthAbove(
      0,
      `Document missing selector ${selector}`
    );
  });
}

function assertSubstrings($, ...phrases) {
  const html = $.html();
  phrases.forEach(phrase => {
    expect(html).toInclude(phrase, `Document missing phrase ${phrase}`);
  });
}

function assertDeck($) {
  expect($(".reveal .slides ").length).toEqual(1);
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
