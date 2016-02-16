var expect = require('chaimel')

function assertSelectors () {
  var $ = arguments[0]
  var selectors = Array.prototype.slice.call(arguments, 1)
  selectors.forEach(function (selector) {
    expect($(selector)).toHaveLengthAbove(
      0, 'Document missing selector ' + selector)
  })
}

function assertSubstrings () {
  var $ = arguments[0]
  var html = $.html()
  var phrases = Array.prototype.slice.call(arguments, 1)
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
