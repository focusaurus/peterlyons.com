var Post = require("app/blogs/Post");
require("expectations");

var publishDate = new Date(2014, 0, 31);
var post = new Post(
  "unitTestBlog",
  "Unit Test Title",
  publishDate,
  "md"
);
post.base = "/unit/test/base";

describe("Post model class", function () {
  it("should store constructor props and compute slug", function() {
    expect(post.blog).toBe("unitTestBlog");
    expect(post.title).toBe("Unit Test Title");
    expect(post.publish_date).toBe(publishDate);
    expect(post.name).toBe("unit-test-title");
  });

  it("metadata should return the right fields", function() {
    var metadata = post.metadata();
    expect(metadata.format).toBe("md");
    expect(metadata.title).toBe("Unit Test Title");
    expect(metadata.publish_date).toBe(publishDate);
    expect(metadata.name).toBe("unit-test-title");
  });

  it("URI should be correct", function() {
    expect(post.uri()).toBe("unitTestBlog/2014/01/unit-test-title");
  });

  it("contentPath should be correct", function() {
    expect(post.contentPath()).toBe("unitTestBlog/2014/01/unit-test-title.md");
  });

  it("metadataPath should be correct", function() {
    expect(post.metadataPath()).toBe(
      "unitTestBlog/2014/01/unit-test-title.json");
  });

  it("viewPath should be correct", function() {
    expect(post.viewPath()).toBe(
      "/unit/test/base/unitTestBlog/2014/01/unit-test-title.md");
  });

  it("dirPath should be correct", function() {
    expect(post.dirPath()).toBe("/unit/test/base/unitTestBlog/2014/01");
  });
});
