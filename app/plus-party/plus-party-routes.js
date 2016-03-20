var server = require('react-dom/server')

var plusPartyHtml = server.renderToStaticMarkup(
  require('./plus-party').PlusParty)

function plusParty (req, res) {
  res.render('plus-party/plus-party.jade', {plusPartyHtml: plusPartyHtml})
}

function setup (app) {
  app.get('/plus-party', plusParty)
}

module.exports = setup
