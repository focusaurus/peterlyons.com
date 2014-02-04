var ZeroClipboard = require("zeroclipboard");

var NUMBER_RE = /-?(\d{1,3}(,\d{3})*(\.\d+)?|\d+)\b/g;
var COMMA_RE = /,/g;
var DATE_RE = /\b\d{1,2}\/\d{1,2}\/(\d{2}|\d{4})\b/g;

function sum(subTotal, number) {
  return subTotal + number;
}

function wrap(number) {
  return {value: number};
}

function parseNumbers(rawText) {
  rawText = rawText.replace(DATE_RE, "");
  var numbers = [];
  var match;
  while ((match = NUMBER_RE.exec(rawText))) {
    var number = parseFloat(match[0].replace(COMMA_RE, ""), 10);
    numbers.push(number);
  }
  return numbers;
}

function recompute() {
  this.scope.numbers = parseNumbers(this.scope.rawText);
  //AngularJS repeaters require distinct objects, so we have to
  //wrap our raw floats in objects to accommodate that
  this.scope.wrappedNumbers = this.scope.numbers.map(wrap);
  this.scope.total = this.scope.numbers.reduce(sum, 0);
}

function Controller($scope) {
  this.scope = $scope;
  this.scope.rawText = "Paste some numbers in here and we'll total them up" +
    " even if there's some words and junk, too.\n\n" +
    "For example: 1 plus 2 plus 2 plus 1";
  this.scope.$watch("rawText", recompute.bind(this));
  this.scope.numbers = [];
}

function init() {
  angular.module("PlusParty", []).controller("PlusPartyController", Controller);
  //https://github.com/zeroclipboard/zeroclipboard/issues/332
  window.ZeroClipboard = ZeroClipboard;
  var copyButton = document.getElementById("copyToClipboard");
  var originalText = copyButton.textContent;
  var resetText = function() {
    copyButton.textContent = originalText;
  };
  var clip = new ZeroClipboard(copyButton);
  clip.on("load", function (client) {
    client.on("complete", function (event) {
      copyButton.textContent = "Copied!";
      setTimeout(resetText, 2000);
    });
  });
}

module.exports = {
  Controller: Controller,
  sum: sum,
  wrap: wrap,
  parseNumbers: parseNumbers,
  recompute: recompute,
  init: init
};
