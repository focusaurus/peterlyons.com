function preventDefault (next) {
  return function pd (e) {
    e.preventDefault()
    return next(e)
  }
}

module.exports = preventDefault
