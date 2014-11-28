var expect = require("chai").expect;
var Post = require("app/blogs/Post");

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
    expect(post.blog).to.equal("unitTestBlog");
    expect(post.title).to.equal("Unit Test Title");
    expect(post.publish_date).to.equal(publishDate);
    expect(post.name).to.equal("unit-test-title");
  });

  it("metadata should return the right fields", function() {
    var metadata = post.metadata();
    expect(metadata.format).to.equal("md");
    expect(metadata.title).to.equal("Unit Test Title");
    expect(metadata.publish_date).to.equal(publishDate);
    expect(metadata.name).to.equal("unit-test-title");
  });

  it("URI should be correct", function() {
    expect(post.uri()).to.equal("unitTestBlog/2014/01/unit-test-title");
  });

  it("contentPath should be correct", function() {
    expect(post.contentPath()).to.equal("unitTestBlog/2014/01/unit-test-title.md");
  });

  it("metadataPath should be correct", function() {
    expect(post.metadataPath()).to.equal(
      "unitTestBlog/2014/01/unit-test-title.json");
  });

  it("viewPath should be correct", function() {
    expect(post.viewPath()).to.equal(
      "/unit/test/base/unitTestBlog/2014/01/unit-test-title.md");
  });

  it("dirPath should be correct", function() {
    expect(post.dirPath()).to.equal("/unit/test/base/unitTestBlog/2014/01");
  });
});
