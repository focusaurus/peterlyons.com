var testUtils = require("../testUtils");
var blogRoutes = require("app/blogs/blogRoutes");

describe("wait for blogs to be loaded from disk", function () {
  it("should wait for blogRoutes.ready event", function(done) {
    if (blogRoutes.loaded) {
      done();
      return;
    }
    require("app/blogs/blogRoutes").events.on("ready", done);
  });
});

describe('smoke tests for most pages on the site', function() {
  var testConfigs = [
    ["/", /node\.js/],
    ["/career", /Opsware/],
    ["/contact", /pete@peterlyons.com/],
    ["/stacks", /JavaScript/],
    ["/practices", /Craftsmanship/],
    ["/bands", /Afronauts/],
    ["/code_conventions", /readability/],
    ["/this-will-cause-404", /404 error page/],
    ["/leveling_up", /Pillar 1/],
    ["/web_prog", /PHP/],
    ["/oberlin", /Edison/],
    ["/favorites", /Imogen/],
    ["/plusparty", /Plus Party/],
    ["/problog", /Pete's Points/],
    ["/persblog", /travel/],
    ["/app/photos?gallery=burning_man_2011", /Gallery/],
    ["/problog/2009/03/announcing-petes-points", /professional/],
    ["/persblog/2007/10/petes-travel-adventure-2007-begins-friday-october-5th", /Alitalia/]
  ];
  testConfigs.forEach(function (testConfig) {
    var URI = testConfig[0];
    var regex = testConfig[1];
    it(URI + " should match " + regex, function(done) {
      testUtils.pageContains(URI, regex, done);
    });
  });
});
