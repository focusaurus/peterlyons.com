function setup (app) {
  app.get(
    '/:deck(web_data|rapid_feedback|npm_gold|twelve_factor_nodejs|white_glove)',
    function (req, res) {
      res.render('decks/' + req.params.deck)
    })
}

module.exports = setup
