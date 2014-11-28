var expect = require("chai").expect;
var slug = require("app/blogs/slug");

describe("app/blogs/slug", function () {
  it("should replace URL-unfriendly characters", function() {
    expect(slug("space to dash")).to.equal("space-to-dash");
    expect(slug("no apostrophe's")).to.equal("no-apostrophes");
    expect(slug("dot.to.dash")).to.equal("dot-to-dash");
    expect(slug("double--dash--to--dash")).to.equal("double-dash-to-dash");
    expect(slug("no!bang")).to.equal("nobang");
    expect(slug("no trailing dash-")).to.equal("no-trailing-dash");
    expect(slug("LOWERCASE")).to.equal("lowercase");
  });

  it("should normalize to lowercase", function() {
    expect(slug("LOWERCASE")).to.equal("lowercase");
  });

  it("should handle null", function() {
    expect(slug(void 0)).to.equal("");
    expect(slug(null)).to.equal("");
  });
});
