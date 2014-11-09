var HEADER_SELECTOR = ".intro .highlight";
var subtitle;

function speed() {
  return Math.random() * 200 + 20;
}

function pushLetter() {
  var header = document.querySelector(HEADER_SELECTOR);
  var text = header.textContent;
  if (text.length === subtitle.length) {
    return;
  }
  header.textContent = text + subtitle[text.length];
  setTimeout(pushLetter, speed());
}

function init() {
  var header = document.querySelector(HEADER_SELECTOR);
  subtitle = header.textContent;
  header.textContent = "";
  setTimeout(pushLetter, speed());
}

module.exports = init;
