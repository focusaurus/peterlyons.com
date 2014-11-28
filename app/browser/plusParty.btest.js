var expect = require("expectacle");
var plusParty = require("app/browser/plusParty");

describe("plusParty.sum", function () {
  it("sum should work", function() {
    expect(plusParty.sum(42, 7)).toBe(49);
  });
  it("wrap should work", function() {
    var wrapped = plusParty.wrap(42);
    expect(wrapped).toBeObject();
    expect(wrapped).toHaveProperty("value");
    expect(wrapped.value).toBe(42);
  });
});
