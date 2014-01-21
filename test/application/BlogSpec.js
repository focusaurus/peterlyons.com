var config = require("app/config");
var assert = require("chai").assert;
var cheerio = require("cheerio");
var loadPage = require("../testUtils").loadPage;
var request = require("superagent");

describe("a blog post page", function() {
  var $ = null;
  before(function(done) {
    var URL = config.baseURL + "/persblog/2012/01/san-francisco-walkabout";
    loadPage(URL, function(dom) {
      $ = dom;
      done();
    });
  });
  it("should have the post title", function() {
    assert.match($("title").text(), /walkabout/i);
  });
  it("should process a flickr tag", function() {
    assert.lengthOf($("flickr"), 0);
    assert($("object").length > 0);
  });
  it("should process a youtube tag", function() {
    assert.lengthOf($("youtube"), 0);
    assert($("object").length > 0);
  });
  it("should have disqus comments", function() {
    assert.lengthOf($("#disqus_thread"), 1);
  });
});

describe("a blog index page", function() {
  var $ = null;
  before(function(done) {
    loadPage(config.baseURL + "/problog", function(dom) {
      $ = dom;
      done();
    });
  });
  it("should have nicely formatted dates", function() {
    var date;
    assert($("td.date").length > 0);
    date = $("td.date").last().html();
    assert.match(date, /Mar 14, 2009/);
  });
});

describe("the preview converter", function() {
  it("should convert markdown to HTML", function(done) {
    request.post("" + config.baseURL + "/convert").send("#Header One").set("Content-Type", "text/x-markdown").set("Accept", "text/html").end(function(res) {
      assert(res.ok);
      assert.equal("<h1>Header One</h1>", res.text.trim());
      done();
    });
  });
  it("should have the flickr & youtube pipeline middleware", function(done) {
    request.post("" + config.baseURL + "/convert").send("<youtube href=\"http://www.youtube.com/embed/K27MA8v91D4\"/>\n<flickrshow href=\"page_show_url=%2Fphotos%2F88096431%40N00%2Fsets%2F72157631932122934%2Fshow%2F&page_show_back_url=%2Fphotos%2F88096431%40N00%2Fsets%2F72157631932122934%2F&set_id=72157631932122934&\"/>").set("Content-Type", "text/x-markdown").set("Accept", "text/html").end(function(res) {
      assert(res.ok);
      var $ = cheerio.load(res.text);
      assert.lengthOf($('flickrshow'), 0);
      assert.lengthOf($('youtube'), 0);
      assert($("object").length > 0);
      done();
    });
  });
});

describe("the blog post authoring/preview page", function() {
  var $ = null;
  before(function(done) {
    loadPage(config.baseURL + "/persblog/post", function(dom) {
      $ = dom;
      done();
    });
  });
  it("should have a preview section and a textarea", function() {
    assert($("section.preview").length > 0);
    assert($("textarea").length > 0);
  });
});
