var expectations = require("expectations");
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
    expect($("title").text()).toMatch(/apogaea/i);
  });
  it("should process a flickr tag", function() {
    expect($("flickr").length).toBe(0);
    expect($("object").length).toBeGreaterThan(0);
  });
  it("should process a youtube tag", function() {
    expect($("youtube").length).toBe(0);
    expect($("iframe").length).toBeGreaterThan(0);
  });
  it("should have disqus comments", function() {
    expect($("#disqus_thread").length).toBe(1);
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
    expect($("td.date").length).toBeGreaterThan(0);
    var date = $("td.date").last().html();
    expect(date).toMatch(/Mar 14, 2009/);
  });
});

describe("the preview converter", function() {
  it("should convert markdown to HTML", function(done) {
    testUtils.post("/convert")
        .send("#Header One")
        .set("Content-Type", "text/x-markdown")
        .set("Accept", "text/html")
        .expect(200)
        .end(function(error, res) {
      expect("<h1>Header One</h1>").toBe(res.text.trim());
      done();
    });
  });
  it("should have the flickr & youtube pipeline middleware", function(done) {
    testUtils.post("/convert")
        .send("<youtube href=\"http://www.youtube.com/embed/K27MA8v91D4\"></youtube>\n<flickrshow href=\"page_show_url=%2Fphotos%2F88096431%40N00%2Fsets%2F72157631932122934%2Fshow%2F&page_show_back_url=%2Fphotos%2F88096431%40N00%2Fsets%2F72157631932122934%2F&set_id=72157631932122934&\"></flickrshow>")
        .set("Content-Type", "text/x-markdown")
        .set("Accept", "text/html")
        .expect(200)
        .end(function(error, res) {
      var $ = cheerio.load(res.text);
      expect($("youtube").length).toBe(0);
      expect($("iframe").length).toBeGreaterThan(0);
      expect($("flickrshow").length).toBe(0);
      expect($("object").length).toBeGreaterThan(0);
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
