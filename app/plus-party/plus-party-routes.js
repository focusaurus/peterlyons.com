var server = require('react-dom/server')

var plusPartyHtml = server.renderToStaticMarkup(
  require('./plus-party-react').PlusParty)

function plusParty (req, res) {
  res.render('plus-party/plus-party.jade')
}

function plusPartyReact (req, res) {
  res.render('plus-party/plus-party-react.jade', {plusPartyHtml: plusPartyHtml})
}

function setup (app) {
  app.get('/plus-party', plusParty)
  app.get('/plus-party-react', plusPartyReact)
}

module.exports = setup
