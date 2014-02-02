var presentPost = require("app/blogs/blogRoutes").presentPost;
var assert = require("assert");

describe("blogRoutes", function () {
  describe("presentPost", function () {
    it("should format the date", function() {
      var presented = presentPost({
        publish_date: new Date(2014, 0, 31),
        title: "foo"
      });
      assert.equal(presented.date, "Jan 31, 2014");
    });
    it("should trim the title", function() {
      var presented = presentPost({
        publish_date: new Date(2014, 0, 31),
        title: " a "
      });
      assert.equal(presented.title, "a");
    });
  });
});
