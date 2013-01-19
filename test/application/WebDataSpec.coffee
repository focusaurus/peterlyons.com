config = require "../../config"
assert = require("chai").assert
{loadPage} = require "../TestUtils"

describe "the Web Data Slide Deck", ->
  $ = null

  before (done) ->
    loadPage config.baseURL + "/web_data", (dom) ->
      $ = dom
      done()

  it 'should have many sections with class slide', ->
    assert.isTrue($("section.slide").length > 15)

  it 'should mention some DBs', ->
  	html = $.html()
  	for phrase in ["Oracle", "SQL Server", "Dynamo"]
  		assert.isTrue(html.indexOf(phrase) >= 0)

  it 'should include deck.js and the menu plugin', ->
  	html = $.html()
  	for phrase in ["deck.js", "deck.menu.js"]
  		assert.isTrue(html.indexOf(phrase) >= 0)
