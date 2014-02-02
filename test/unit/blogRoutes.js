var blogRoutes = require("app/blogs/blogRoutes");
var assert = require("assert");

describe("blogRoutes", function () {
  describe("presentPost", function () {
    it("should format the date", function() {
      var presented = blogRoutes.presentPost({
        publish_date: new Date(2014, 0, 31),
        title: "foo"
      });
      assert.equal(presented.date, "Jan 31, 2014");
    });
    it("should trim the title", function() {
      var presented = blogRoutes.presentPost({
        publish_date: new Date(2014, 0, 31),
        title: " a "
      });
      assert.equal(presented.title, "a");
    });
  });

  describe("BlogIndex", function () {
    it("should store URI, title, and blogTitle", function() {
      var index = new blogRoutes.BlogIndex("/uri", "blog title");
      assert.equal(index.URI, "/uri");
      assert.equal(index.title, "blog title");
      assert.equal(index.blogTitle, "blog title");
    });
  });
});
