function redirector (newPath) {
  return function redirectMW (req, res) {
    res.redirect(301, newPath)
  }
}

module.exports = redirector
