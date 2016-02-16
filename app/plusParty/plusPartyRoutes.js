function plusParty (req, res) {
  res.render('plusParty/plus-party.jade')
}

function setup (app) {
  app.get('/plusparty', plusParty)
}

module.exports = setup
