var cheerio = require("cheerio");
var request = require("superagent");

function loadPage(URL, done) {
  request.get(URL, function(res) {
    var $ = cheerio.load(res.text);
    done($);
  });
}

module.exports = {
  loadPage: loadPage
};
