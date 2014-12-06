var expect = require("chaimel");
var cheerio = require("cheerio");
var request = require("supertest")(require("app"));

function loadPage(URL, callback) {
  request.get(URL).expect(200).end(function(error, res) {
    if (error) {
      callback(error);
      return;
    }
    var $ = cheerio.load(res.text);
    callback(null, $);
  });
}

function get(URL) {
  return request.get(URL);
}

function post(URL) {
  return request.post(URL);
}

function assertSelectors() {
  var $ = arguments[0];
  var selectors = Array.prototype.slice.call(arguments, 1);
  selectors.forEach(function(selector) {
    expect($(selector)).toHaveLengthAbove(
      0, "Document missing selector " + selector);
  });
}

function assertSubstrings() {
  var $ = arguments[0];
  var html = $.html();
  var phrases = Array.prototype.slice.call(arguments, 1);
  phrases.forEach(function(phrase) {
    expect(html).toInclude(phrase, "Document missing phrase " + phrase);
  });
}

/* eslint no-unused-vars:0 */
function pageContains(_url, _phraseVarArgs, _done) {
  var phrases = Array.prototype.slice.call(arguments);
  var url = phrases.shift();
  var done = phrases.pop();

  request.get(url).expect(200).end(function(error, res) {
    if (error) {
      done(error);
      return;
    }
    phrases.forEach(function(phrase) {
      if (typeof phrase === "string") {
        expect(res.text).toInclude(
          phrase, "Document missing phrase " + phrase + res.text);
      } else {
        //regex
        expect(res.text).toMatch(
          phrase, "Document does not match " + phrase.pattern);
      }
    });
    done(null, cheerio.load(res.text));
  });
}

module.exports = {
  get: get,
  post: post,
  loadPage: loadPage,
  pageContains: pageContains,
  assertSelectors: assertSelectors,
  assertSubstrings: assertSubstrings
};
