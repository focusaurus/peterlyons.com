config = require "app/config"

setup = (app) ->
  return if not config.errorPages
  app.get /error(\d+)/, (req, res) ->
    code = req.params[0]
    switch code
      when "500", "502", "503", "504"
        res.render "errors/error500"
      else
        res.render "errors/error404"

module.exports = setup
