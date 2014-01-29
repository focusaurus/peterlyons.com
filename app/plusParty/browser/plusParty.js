;(function iife(exports, undefined) {
  var NUMBER_RE = /-?(\d{1,3}(,\d{3})*(\.\d+)?|\d+)\b/g;
  var COMMA_RE = /,/g;

  function PlusPartyController($scope) {
    this.scope = $scope;
    this.scope.rawText = "Paste some numbers in here and we'll total them up" +
      " even if there's some words and junk, too.\n\n" +
      "For example: 1 plus 2 plus 2 plus 1";
    this.scope.$watch("rawText", parseNumbers.bind(this));
    this.scope.numbers = [];
  }

  function sum(subTotal, number) {
    return subTotal + number;
  }

  function wrap(number) {
    return {value: number};
  }

  function parseNumbers() {
    this.scope.numbers = [];
    var match;
    while ((match = NUMBER_RE.exec(this.scope.rawText))) {
      var number = parseFloat(match[0].replace(COMMA_RE, ""), 10);
      this.scope.numbers.push(number);
    }
    //AngularJS repeaters require distinct objects, so we have to
    //wrap our raw floats in objects to accommodate that
    this.scope.wrappedNumbers = this.scope.numbers.map(wrap);
    this.scope.total = this.scope.numbers.reduce(sum, 0);
  }

  exports.PlusPartyController = PlusPartyController;
})(window);
