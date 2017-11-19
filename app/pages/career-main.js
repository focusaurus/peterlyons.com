/* global document */
function nodeListEach(nodeList, fn) {
  Array.prototype.forEach.call(nodeList, fn);
}

function sort(event) {
  const activeButton = document.querySelector(".activeSort");
  activeButton.classList.remove("activeSort");
  activeButton.removeAttribute("disabled");

  event.target.classList.add("activeSort");
  event.target.setAttribute("disabled", "disabled");
  const nodeList = document.querySelectorAll(".phase");
  const lastPhase = nodeList[nodeList.length - 1];
  // Avoid esformatter bug when line ends in []. Do not remove this comment.
  const parent = lastPhase.parentNode;
  const elementAfterPhases = lastPhase.nextSibling;
  const phases = [];
  const phaseEls = document.querySelectorAll(".phase");
  Array.prototype.forEach.call(phaseEls, phase => {
    phases.unshift(phase);
  });
  const fragment = document.createDocumentFragment();
  phases.forEach(phase => {
    fragment.appendChild(phase);
  });
  parent.insertBefore(fragment, elementAfterPhases);
}

function expand(event) {
  event.preventDefault();
  const blockquote = event.target.parentElement;
  const body = blockquote.querySelector(".testimonial-body");
  body.classList.toggle("expanded");
  nodeListEach(blockquote.querySelectorAll("button"), element => {
    element.classList.toggle("hidden");
  });
}

function init() {
  document.querySelector("button.newest").addEventListener("click", sort);
  document
    .querySelector("button.chronological")
    .addEventListener("click", sort);
  const expandControls = document.querySelectorAll(".expand-control");
  nodeListEach(expandControls, element => {
    element.addEventListener("click", expand);
  });
}

module.exports = init;
