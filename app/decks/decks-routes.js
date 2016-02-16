function setup (app) {
  app.get(
    '/:deck(web-data|rapid-feedback|npm-gold|twelve-factor-nodejs|white-glove)',
    function (req, res) {
      res.render('decks/' + req.params.deck)
    })
}

module.exports = setup
