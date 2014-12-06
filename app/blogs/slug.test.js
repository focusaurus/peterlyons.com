var expect = require("chaimel");
var slug = require("app/blogs/slug");

describe("app/blogs/slug", function () {
  it("should replace URL-unfriendly characters", function() {
    expect(slug("space to dash")).toEqual("space-to-dash");
    expect(slug("no apostrophe's")).toEqual("no-apostrophes");
    expect(slug("dot.to.dash")).toEqual("dot-to-dash");
    expect(slug("double--dash--to--dash")).toEqual("double-dash-to-dash");
    expect(slug("no!bang")).toEqual("nobang");
    expect(slug("no trailing dash-")).toEqual("no-trailing-dash");
    expect(slug("LOWERCASE")).toEqual("lowercase");
  });

  it("should normalize to lowercase", function() {
    expect(slug("LOWERCASE")).toEqual("lowercase");
  });

  it("should handle null", function() {
    expect(slug(void 0)).toEqual("");
    expect(slug(null)).toEqual("");
  });
});
