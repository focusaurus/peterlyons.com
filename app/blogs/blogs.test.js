require("expectations");
var cheerio = require("cheerio");
var testUtils = require("app/testUtils");
var blogRoutes = require("app/blogs/blogRoutes");

describe("wait for blogs to be loaded from disk", function () {
  it("should wait for blogRoutes.ready event", function(done) {
    this.slow(3000);
    this.timeout(6000);
    if (blogRoutes.loaded) {
      done();
      return;
    }
    blogRoutes.events.on("ready", done);
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
    expect($("iframe").length).toBeGreaterThan(0);
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
        /* eslint max-len:0 */
        .send("<youtube href=\"http://www.youtube.com/embed/K27MA8v91D4\"></youtube>\n<flickrshow href=\"https://www.flickr.com/photos/88096431@N00/sets/72157645234728466/\"></flickrshow>")
        .set("Content-Type", "text/x-markdown")
        .set("Accept", "text/html")
        .expect(200)
        .end(function(error, res) {
      var $ = cheerio.load(res.text);
      expect($("youtube").length).toBe(0);
      expect($("iframe").length).toBe(2);
      expect($("flickrshow").length).toBe(0);
      expect($("object").length).toBe(0);
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

describe("a blog feed XML", function() {
  var $ = null;
  before(function(done) {
    testUtils.loadPage("/problog/feed", function(error, dom) {
      $ = dom;
      done(error);
    });
  });

  it("should have an atom XML feed tag", function() {
    expect($("feed").length).toEqual(1);
  });

  it("should have the right feed > title content", function() {
    expect($("feed > title").text()).toEqual("Pete's Points");
  });

  it("should have 10 recent posts", function() {
    expect($("entry").length).toEqual(10);
  });

  it("should have the author", function() {
    expect($("author > name").text()).toEqual("Peter Lyons");
  });
});
