function sort(event) {
  var activeButton = document.querySelector(".activeSort")
  activeButton.classList.remove("activeSort");
  activeButton.removeAttribute("disabled");

  event.target.classList.add("activeSort");
  event.target.setAttribute("disabled", "disabled");
  var nodeList = document.querySelectorAll(".phase");
  var lastPhase = nodeList[nodeList.length - 1];
  var parent = lastPhase.parentNode;
  var elementAfterPhases = lastPhase.nextSibling;
  var phases = [];
  [].forEach.call(document.querySelectorAll(".phase"), function(phase) {
    phases.unshift(phase);
  });
  var fragment = document.createDocumentFragment();
  phases.forEach(function(phase) {
    fragment.appendChild(phase);
  });
  parent.insertBefore(fragment, elementAfterPhases);
}

function init() {
  document.querySelector("button.newest").addEventListener("click", sort);
  document.querySelector("button.chronological").addEventListener("click", sort);
}

module.exports = init;
