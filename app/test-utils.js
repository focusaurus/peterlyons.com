const expect = require("chaimel");

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

module.exports = {
  assertSelectors,
  assertSubstrings,
  assertDeck
};
