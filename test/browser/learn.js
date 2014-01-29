var assert = require("assert");
var plusParty = require("app/plusParty/browser");

describe("karma", function () {
  it("should be working", function() {
    assert(true, "karma and browserify are partying");
  });
  it("should get plusParty via browserify", function () {
    assert(typeof plusParty.Controller === "function");
  });
});


