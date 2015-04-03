var expect = require("chaimel");
var Post = require("app/blogs/Post");

var publishDate = new Date(2014, 0, 31);
var post = new Post(
  "unitTestBlog",
  "Unit Test Title",
  publishDate,
  "md"
);
post.base = "/unit/test/base";

describe("Post model class", function() {
  it("should store constructor props and compute slug", function() {
    expect(post.blog).toEqual("unitTestBlog");
    expect(post.title).toEqual("Unit Test Title");
    expect(post.publish_date).toEqual(publishDate);
    expect(post.name).toEqual("unit-test-title");
  });

  it("metadata should return the right fields", function() {
    var metadata = post.metadata();
    expect(metadata.format).toEqual("md");
    expect(metadata.title).toEqual("Unit Test Title");
    expect(metadata.publish_date).toEqual(publishDate);
    expect(metadata.name).toEqual("unit-test-title");
  });

  it("URI should be correct", function() {
    expect(post.uri()).toEqual("unitTestBlog/2014/01/unit-test-title");
  });

  it("contentPath should be correct", function() {
    expect(post.contentPath())
      .toEqual("unitTestBlog/2014/01/unit-test-title.md");
  });

  it("metadataPath should be correct", function() {
    expect(post.metadataPath()).toEqual(
      "unitTestBlog/2014/01/unit-test-title.json");
  });

  it("viewPath should be correct", function() {
    expect(post.viewPath()).toEqual(
      "/unit/test/base/unitTestBlog/2014/01/unit-test-title.md");
  });

  it("dirPath should be correct", function() {
    expect(post.dirPath()).toEqual("/unit/test/base/unitTestBlog/2014/01");
  });
});
