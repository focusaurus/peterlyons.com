function init() {
  var button = document.querySelector(".reverse button");
  var initialText = button.textContent;
  var nodeList = document.querySelectorAll(".phase");
  var lastPhase = nodeList[nodeList.length - 1];
  var parent = lastPhase.parentNode;
  var elementAfterPhases = lastPhase.nextSibling;
  button.addEventListener("click", function() {
    var phases = [];
    [].forEach.call(document.querySelectorAll(".phase"), function(phase) {
      phases.unshift(phase);
    });
    var fragment = document.createDocumentFragment();
    phases.forEach(function(phase) {
      fragment.appendChild(phase);
    });
    parent.insertBefore(fragment, elementAfterPhases);
    if (button.textContent === initialText) {
      button.textContent = "View newest first";
    } else {
      button.textContent = initialText;
    }
  });
}

module.exports = init;
