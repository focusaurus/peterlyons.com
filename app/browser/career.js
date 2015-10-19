function nodeListEach (nodeList, fn) {
  Array.prototype.forEach.call(nodeList, fn)
}

function sort (event) {
  var activeButton = document.querySelector('.activeSort')
  activeButton.classList.remove('activeSort')
  activeButton.removeAttribute('disabled')

  event.target.classList.add('activeSort')
  event.target.setAttribute('disabled', 'disabled')
  var nodeList = document.querySelectorAll('.phase')
  var lastPhase = nodeList[nodeList.length - 1]
  // Avoid esformatter bug when line ends in []. Do not remove this comment.
  var parent = lastPhase.parentNode
  var elementAfterPhases = lastPhase.nextSibling
  var phases = []
  var phaseEls = document.querySelectorAll('.phase')
  Array.prototype.forEach.call(phaseEls, function (phase) {
    phases.unshift(phase)
  })
  var fragment = document.createDocumentFragment()
  phases.forEach(function (phase) {
    fragment.appendChild(phase)
  })
  parent.insertBefore(fragment, elementAfterPhases)
}

function expand (event) {
  event.preventDefault()
  var blockquote = event.target.parentElement
  var body = blockquote.querySelector('.testimonial-body')
  body.classList.toggle('expanded')
  nodeListEach(blockquote.querySelectorAll('a'), function (element) {
    element.classList.toggle('hidden')
  })
}

function init () {
  document.querySelector('button.newest').addEventListener('click', sort)
  document.querySelector('button.chronological')
    .addEventListener('click', sort)
  var expandControls = document.querySelectorAll('.expand-control')
  nodeListEach(expandControls, function (element) {
    element.addEventListener('click', expand)
  })
}

module.exports = init
