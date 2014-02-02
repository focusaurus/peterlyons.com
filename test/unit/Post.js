var Post = require("app/blogs/Post");
var assert = require("assert");

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
    assert.equal(post.blog, "unitTestBlog");
    assert.equal(post.title, "Unit Test Title");
    assert.equal(post.publish_date, publishDate);
    assert.equal(post.name, "unit-test-title");
  });

  it("metadata should return the right fields", function() {
    var metadata = post.metadata();
    assert.equal(metadata.format, "md");
    assert.equal(metadata.title, "Unit Test Title");
    assert.equal(metadata.publish_date, publishDate);
    assert.equal(metadata.name, "unit-test-title");
  });

  it("URI should be correct", function() {
    assert.equal(post.URI(), "unitTestBlog/2014/01/unit-test-title");
  });

  it("contentPath should be correct", function() {
    assert.equal(post.contentPath(), "unitTestBlog/2014/01/unit-test-title.md");
  });

  it("metadataPath should be correct", function() {
    assert.equal(post.metadataPath(), "unitTestBlog/2014/01/unit-test-title.json");
  });

  it("viewPath should be correct", function() {
    assert.equal(post.viewPath(), "/unit/test/base/unitTestBlog/2014/01/unit-test-title.md");
  });

  it("dirPath should be correct", function() {
    assert.equal(post.dirPath(), "/unit/test/base/unitTestBlog/2014/01");
  });
});
