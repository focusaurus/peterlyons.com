config = require "app/config"
expect = require("chai").expect
{loadPage} = require "../TestUtils"

describe "the home page", ->
  $ = null

  before (done) ->
    loadPage config.baseURL, (dom) ->
      $ = dom
      done()

  it 'should have the intro material', ->
    for selector in ["section#intro", "section#chops", "section#writing"]
      expect($(selector)).not.to.be.empty
