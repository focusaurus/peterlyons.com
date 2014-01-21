var config = require("app/config");
var request = require("superagent");
var expect = require("chai").expect;

describe('smoke tests for most pages on the site', function() {
  var testConfigs = [
    ["/", /node\.js/],
    ["/career", /Opsware/],
    ["/contact", /pete@peterlyons.com/],
    ["/stacks", /JavaScript/],
    ["/practices", /Craftsmanship/],
    ["/bands", /Afronauts/],
    ["/bands.html", /Afronauts/],
    ["/code_conventions", /readability/],
    ["/this-will-cause-404", /404 error page/],
    ["/leveling_up", /Pillar 1/],
    ["/web_prog", /PHP/],
    ["/oberlin", /Edison/],
    ["/oberlin.html", /Edison/],
    ["/favorites", /Imogen/],
    ["/problog", /Pete's Points/],
    ["/persblog", /travel/],
    ["/app/photos", /Gallery/],
    ["/problog/2009/03/announcing-petes-points", /professional/],
    ["/persblog/2007/10/petes-travel-adventure-2007-begins-friday-october-5th", /Alitalia/]
  ];
  testConfigs.forEach(function (testConfig) {
    var URI = testConfig[0];
    var regex = testConfig[1];
    it(URI + " should match " + regex, function(done) {
      request.get(config.baseURL + URI, function(res) {
        expect(res.status).to.equal(200);
        expect(res.text).to.match(regex);
        done();
      });
    });
  });
});
