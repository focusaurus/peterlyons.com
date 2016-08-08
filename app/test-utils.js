const expect = require('chaimel')

function assertSelectors () {
  const $ = arguments[0]
  const selectors = Array.prototype.slice.call(arguments, 1)
  selectors.forEach(function (selector) {
    expect($(selector)).toHaveLengthAbove(
      0, 'Document missing selector ' + selector)
  })
}

function assertSubstrings () {
  const $ = arguments[0]
  const html = $.html()
  const phrases = Array.prototype.slice.call(arguments, 1)
  phrases.forEach(function (phrase) {
    expect(html).toInclude(phrase, 'Document missing phrase ' + phrase)
  })
}

function assertDeck ($) {
  expect($('.reveal .slides section').length).toBeAbove(3)
  assertSubstrings($, 'reveal.js')
}

module.exports = {
  assertSelectors: assertSelectors,
  assertSubstrings: assertSubstrings,
  assertDeck: assertDeck
}
