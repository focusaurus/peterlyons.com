function personal (req) {
  return 'http://peterlyons.org' + req.url
}

const matchers = []
matchers.push([/^\/app\/photos/i, personal])
matchers.push([/^\/bands(\.html)?/i, personal])
matchers.push([/^\/favorites(\.html)?/i, personal])
matchers.push([/^\/oberlin(\.html)?/i, personal])
matchers.push([/^\/persblog/i, personal])
matchers.push([/^\/photos/i, personal])

function redirectHandler (req, res, next) {
  for (let i = 0; i < matchers.length; i++) {
    if (matchers[i][0].test(req.url)) {
      res.redirect(301, matchers[i][1](req))
      return
    }
  }
  next()
}

module.exports = redirectHandler
