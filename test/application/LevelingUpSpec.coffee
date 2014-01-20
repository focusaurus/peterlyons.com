config = require "app/config"
expect = require("chai").expect
{loadPage} = require "../testUtils"

describe "the Leveling Up article", ->
  $ = null

  before (done) ->
    loadPage config.baseURL + "/leveling_up", (dom) ->
      $ = dom
      done()

  it "should have the proper content", ->
    ids = [
      "#pillar1"
      "#pillar2"
      "#pillar3"
      ]
    for id in ids
      expect($(id)).not.to.be.empty
    html = $("body").html().toLowerCase()
    for phrase in ["operating system", "thousands"]
      expect(html).to.include phrase

  it "should have the proper title", ->
      expect($("title").text()).to.match /Leveling Up/
