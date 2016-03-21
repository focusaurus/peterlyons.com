var COMMA_RE = /,/g
var DATE_RE = /\b\d{1,2}\/\d{1,2}\/(\d{2}|\d{4})\b/g
var NUMBER_RE = /-?(\d{1,3}(,\d{3})*|\d+)(\.\d+)?\b/g

function parseNumbers (rawText) {
  rawText = rawText.replace(DATE_RE, '')
  var numbers = []
  var match
  while ((match = NUMBER_RE.exec(rawText))) {
    var number = parseFloat(match[0].replace(COMMA_RE, ''), 10)
    numbers.push(number)
  }
  return numbers
}

function sum (subTotal, number) {
  return subTotal + number
}

exports.parseNumbers = parseNumbers
exports.sum = sum
