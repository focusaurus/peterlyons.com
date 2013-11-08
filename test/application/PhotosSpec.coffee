config = require "app/config"
expect = require("chai").expect
{loadPage} = require "../TestUtils"

describe "the photos page", ->
  $ = null

  before (done) ->
    loadPage config.baseURL + "/app/photos", (dom) ->
      $ = dom
      done()

  it "should have the photo surrounding structure", ->
    for selector in ["h1.galleryName", "figure", "figcaption", "#nextPrev", "a.thumbnail"]
      expect($(selector)).not.to.be.empty

  it "should have the correct title", ->
    expect($("title").text()).to.equal "Burning Man 2011 | Peter Lyons"

  it "should have the data attributes needed", ->
    expect($("body script").text()).to.include "data-fullSizeURI"
