function plusParty (req, res) {
  res.render('plus-party/plus-party.jade')
}

function setup (app) {
  app.get('/plusparty', plusParty)
}

module.exports = setup
