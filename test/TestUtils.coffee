cheerio = require "cheerio"
request = require "superagent"

loadPage = (URL, done) ->
  request.get URL, (res) ->
      $ = cheerio.load(res.text)
      done $

module.exports = {
  loadPage
}
