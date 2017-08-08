const COMMA_RE = /,/g;
const DATE_RE = /\b\d{1,2}\/\d{1,2}\/(\d{2}|\d{4})\b/g;
const NUMBER_RE = /-?(\d{1,3}(,\d{3})*|\d+)(\.\d+)?\b/g;

function parseNumbers(rawText) {
  // eslint-disable-next-line no-param-reassign
  rawText = rawText.replace(DATE_RE, "");
  const numbers = [];
  let match;
  // eslint-disable-next-line no-cond-assign
  while ((match = NUMBER_RE.exec(rawText))) {
    const number = parseFloat(match[0].replace(COMMA_RE, ""), 10);
    numbers.push(number);
  }
  return numbers;
}

function sum(subTotal, number) {
  return subTotal + number;
}

exports.parseNumbers = parseNumbers;
exports.sum = sum;
