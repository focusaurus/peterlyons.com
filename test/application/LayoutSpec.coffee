config = require "app/config"
expect = require("chai").expect
_ = require "lodash"
{loadPage} = require "../TestUtils"

describe "the main layout", ->
  $ = null

  before (done) ->
    loadPage config.baseURL, (dom) ->
      $ = dom
      done()

  it "should have the google fonts",->
    hrefs = _.map $("link[rel=stylesheet]"), (elem) -> $(elem).attr("href")
    found = _.some hrefs, (href) ->
      href.indexOf("fonts.googleapis.com") >= 0
    expect(found)

  it "should have the key structural elements", ->
    for selector in ["header nav a", "header img", "body .content", "footer"]
      expect($(selector)).not.to.be.empty

  it "should have the normal title", ->
    expect($("title").text()).to.eql "Peter Lyons: node.js coder for hire"
