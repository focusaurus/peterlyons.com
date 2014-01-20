var assert = require("assert");
var cheerio = require("cheerio");
var request = require("superagent");

function loadPage(URL, done) {
  request.get(URL, function(res) {
    var $ = cheerio.load(res.text);
    done($);
  });
}

function assertSelectors() {
  var $ = arguments[0];
  var selectors = Array.prototype.slice.call(arguments, 1);
  selectors.forEach(function(selector) {
    assert.ok($(selector).length > 0, "Document missing selector " + selector);
  });
}
module.exports = {
  loadPage: loadPage,
  assertSelectors: assertSelectors
};
