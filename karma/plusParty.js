var expect = require("expectations");
var PlusParty = require("app/browser/plusParty").Controller;

describe("PlusParty Controller", function () {
  var injector;
  var options;

  beforeEach(inject(function($injector) {
    injector = $injector;
    options = {
      $scope: injector.get("$rootScope")
    };
  }));

  it("should set up scope with rawText and numbers array", function() {
    injector.instantiate(PlusParty, options);
    expect(options.$scope.rawText.toLowerCase()).toContain("paste some");
    expect(Array.isArray(options.$scope.numbers)).toBeTruthy();
    expect(options.$scope.numbers.length).toBe(0);
  });
});
