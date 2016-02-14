var log = require('bole')(__filename)

// Express looks at function arity, so we must declare 4 arguments here
/* eslint no-unused-vars:0 */
function errorHandler (error, req, res, next) {
  /* eslint no-unused-vars:1 */
  log.warn(req.path, 'app-wide error handler')
  res.status(error.statusCode || 500)
  if (error.statusCode === 404) {
    res.render('errors/error404')
  } else {
    res.render('errors/error500')
    log.error(error, req.path)
  }
}

module.exports = errorHandler
