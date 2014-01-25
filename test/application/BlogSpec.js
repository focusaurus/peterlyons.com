var assert = require("chai").assert;
var cheerio = require("cheerio");
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

describe("a blog post page", function() {
  var $ = null;
  before(function(done) {
    testUtils.loadPage("/persblog/2012/06/apogaea", function(error, dom) {
      $ = dom;
      done(error);
    });
  });
  it("should have the post title", function() {
    assert.match($("title").text(), /apogaea/i);
  });
  it("should process a flickr tag", function() {
    assert.lengthOf($("flickr"), 0);
    assert($("object").length > 0);
  });
  it("should process a youtube tag", function() {
    assert.lengthOf($("youtube"), 0);
    assert($("iframe").length > 0);
  });
  it("should have disqus comments", function() {
    assert.lengthOf($("#disqus_thread"), 1);
  });
});

describe("a blog index page", function() {
  var $ = null;
  before(function(done) {
    testUtils.loadPage("/problog", function(error, dom) {
      $ = dom;
      done(error);
    });
  });
  it("should have nicely formatted dates", function() {
    assert($("td.date").length > 0);
    var date = $("td.date").last().html();
    assert.match(date, /Mar 14, 2009/);
  });
});

describe("the preview converter", function() {
  it("should convert markdown to HTML", function(done) {
    testUtils.post("/convert")
        .send("#Header One")
        .set("Content-Type", "text/x-markdown")
        .set("Accept", "text/html")
        .end(function(error, res) {
      assert(res.ok);
      assert.equal("<h1>Header One</h1>", res.text.trim());
      done();
    });
  });
  it("should have the flickr & youtube pipeline middleware", function(done) {
    testUtils.post("/convert")
        .send("<youtube href=\"http://www.youtube.com/embed/K27MA8v91D4\"/>\n<flickrshow href=\"page_show_url=%2Fphotos%2F88096431%40N00%2Fsets%2F72157631932122934%2Fshow%2F&page_show_back_url=%2Fphotos%2F88096431%40N00%2Fsets%2F72157631932122934%2F&set_id=72157631932122934&\"/>")
        .set("Content-Type", "text/x-markdown")
        .set("Accept", "text/html")
        .end(function(error, res) {
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
    testUtils.loadPage("/persblog/post", function(error, dom) {
      $ = dom;
      done(error);
    });
  });
  it("should have a preview section and a textarea", function() {
    testUtils.assertSelectors($,"section.preview", "textarea");
  });
});
