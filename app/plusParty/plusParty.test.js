require("expectations");
var plusParty = require("app/browser/plusParty");
var testUtils = require("app/testUtils");

describe("plusParty", function () {
  describe("sum", function () {
    it("should do a basic addition", function() {
      expect(plusParty.sum(21, 21)).toBe(42, "sum should add numbers");
    });
  });

  describe("wrap", function () {
    it("should wrap a number into an object with a value property", function() {
      var wrapped = plusParty.wrap(42);
      expect(typeof wrapped).toBe("object");
      expect(wrapped.value).toBe(42);
    });
  });

  describe("parseNumbers", function () {
    it("should handle simple positive integers and whitespace", function() {
      expect(plusParty.parseNumbers("42")).toEqual([42]);
      expect(plusParty.parseNumbers("42 15 666")).toEqual([42, 15, 666]);
      expect(plusParty.parseNumbers("0 0 79")).toEqual([0, 0, 79]);
      expect(plusParty.parseNumbers("   \t\n26\t\r32\n")).toEqual([26, 32]);
    });

    it("should handle simple decimal points and negatives", function() {
      expect(plusParty.parseNumbers("-42")).toEqual([-42]);
      expect(plusParty.parseNumbers("42.15 666")).toEqual([42.15, 666]);
      expect(plusParty.parseNumbers("0 -0 -79")).toEqual([0, -0, -79]);
      expect(plusParty.parseNumbers(
        "   \t\n-26.987\t\r32.005\n")).toEqual([-26.987, 32.005]);
    });

    it("should handle currency symbols", function() {
      expect(plusParty.parseNumbers("$42")).toEqual([42]);
      expect(
        plusParty.parseNumbers("$42.15 $666 £92")).toEqual([42.15, 666, 92]);
      expect(plusParty.parseNumbers("€0")).toEqual([0]);
    });

    it("should handle commas", function() {
      expect(plusParty.parseNumbers("1484.57")).toEqual([1484.57]);
      expect(plusParty.parseNumbers("123,456.57")).toEqual([123456.57]);
    });

    it("should ignore mm/dd/yyyy dates", function() {
      expect(plusParty.parseNumbers("12/31/1984")).toEqual([]);
      expect(
        plusParty.parseNumbers("6 09/20/78 17")).toEqual([6, 17]);
    });
  });

  describe("recompute", function () {
    it("should convert rawText into numbers and total", function() {
      var instance = {
        scope: {
          rawText: "I need 42 chickens and 7 mice"
        }
      };
      plusParty.recompute.call(instance);
      expect(instance.scope.numbers).toEqual([42, 7]);
      expect(instance.scope.wrappedNumbers[0].value).toBe(42);
      expect(instance.scope.wrappedNumbers[1].value).toBe(7);
      expect(instance.scope.total).toBe(49);
    });
  });
});

describe("the plus party page", function() {
  it("should serve the zeroclipboard swf file", function(done) {
    testUtils.get("/ZeroClipboard.swf")
      .expect("Content-Type", "application/x-shockwave-flash")
      .expect(200)
      .end(done);
  });
});
