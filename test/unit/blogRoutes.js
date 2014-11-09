require("expectations");
var blogRoutes = require("app/blogs/blogRoutes");
var bcrypt = require("bcryptjs");


describe("blogRoutes", function () {
  describe("presentPost", function () {
    it("should format the date", function() {
      var presented = blogRoutes.presentPost({
        "publish_date": new Date(2014, 0, 31),
        title: "foo"
      });
      expect(presented.date).toBe("Jan 31, 2014");
    });
    it("should trim the title", function() {
      var presented = blogRoutes.presentPost({
        "publish_date": new Date(2014, 0, 31),
        title: " a "
      });
      expect(presented.title).toBe("a");
    });
  });

  describe("BlogIndex", function () {
    it("should store URI, title, and blogTitle", function() {
      var index = new blogRoutes.BlogIndex("/uri", "blog title");
      expect(index.URI).toBe("/uri");
      expect(index.title).toBe("blog title");
      expect(index.blogTitle).toBe("blog title");
    });
  });

  describe("verifyPassword", function () {
    var password = "unit test blog password";
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    it("should callback without error with correct password", function(done) {
      blogRoutes.verifyPassword(password, hash, function (error) {
        expect(error).toBeFalsey();
        done();
      });
    });
  });
});
