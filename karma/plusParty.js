var assert = require("assert");
var PlusParty = require("app/browser/plusParty").Controller;

describe("PlusParty Controller", function () {
  var injector;
  var options;

  beforeEach(inject(function($injector) {
    injector = $injector;
    options = {
      $scope: injector.get("$rootScope"),
    };
  }));

  it("should set up scope with rawText and numbers array", function() {
    injector.instantiate(PlusParty, options);
    assert(options.$scope.rawText.toLowerCase().indexOf("paste some") >= 0);
    assert(Array.isArray(options.$scope.numbers));
    assert.equal(options.$scope.numbers.length, 0);
  });
});
