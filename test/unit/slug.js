var assert = require("assert");
var slug = require("app/blogs/slug");

describe("app/blogs/slug", function () {
  it("should replace URL-unfriendly characters", function() {
    assert.equal(slug("space to dash"), "space-to-dash");
    assert.equal(slug("no apostrophe's"), "no-apostrophes");
    assert.equal(slug("dot.to.dash"), "dot-to-dash");
    assert.equal(slug("double--dash--to--dash"), "double-dash-to-dash");
    assert.equal(slug("no trailing dash-"), "no-trailing-dash");
    assert.equal(slug("LOWERCASE"), "lowercase");
  });

  it("should normalize to lowercase", function() {
    assert.equal(slug("LOWERCASE"), "lowercase");
  });

  it("should handle null", function() {
    assert.equal(slug(undefined), "");
    assert.equal(slug(null), "");
  });
});
