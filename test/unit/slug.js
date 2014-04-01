var expectations = require("expectations");
var slug = require("app/blogs/slug");

describe("app/blogs/slug", function () {
  it("should replace URL-unfriendly characters", function() {
    expect(slug("space to dash")).toBe("space-to-dash");
    expect(slug("no apostrophe's")).toBe("no-apostrophes");
    expect(slug("dot.to.dash")).toBe("dot-to-dash");
    expect(slug("double--dash--to--dash")).toBe("double-dash-to-dash");
    expect(slug("no!bang")).toBe("nobang");
    expect(slug("no trailing dash-")).toBe("no-trailing-dash");
    expect(slug("LOWERCASE")).toBe("lowercase");
  });

  it("should normalize to lowercase", function() {
    expect(slug("LOWERCASE")).toBe("lowercase");
  });

  it("should handle null", function() {
    expect(slug(undefined)).toBe("");
    expect(slug(null)).toBe("");
  });
});
