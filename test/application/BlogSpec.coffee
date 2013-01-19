config = require "../../config"
assert = require("chai").assert
cheerio = require "cheerio"

{loadPage} = require "../TestUtils"
request = require "superagent"

describe "a blog post page", ->
  $ = null

  before (done) ->
    URL = config.baseURL + "/persblog/2012/01/san-francisco-walkabout"
    loadPage URL, (dom)->
      $ = dom
      done()

  it "should have the post title", ->
    assert.match $("title").text(), /walkabout/i

  it "should process a flickr tag", ->
    assert.lengthOf $("flickr"), 0
    assert $("object").length > 0

  it "should process a youtube tag", ->
    assert.lengthOf $("youtube"), 0
    assert $("object").length > 0

  it "should have disqus comments", ->
    assert.lengthOf $("#disqus_thread"), 1

describe "a blog index page", ->
  $ = null

  before (done) ->
    loadPage config.baseURL + "/problog", (dom)->
      $ = dom
      done()

  it "should have nicely formatted dates", ->
    assert $("li.post span.date").length > 0
    date = $("li.post span.date").last().html()
    assert.match date, /Mar 14, 2009/

describe "the preview converter", ->

  it "should convert markdown to HTML", (done) ->
    request
      .post("#{config.baseURL}/convert")
      .send("#Header One")
      .set("Content-Type", "text/x-markdown")
      .set("Accept", "text/html")
      .end (res) ->
        assert res.ok
        assert.equal "<h1>Header One</h1>", res.text.trim()
        done()

  it "should have the flickr & youtube pipeline middleware", (done) ->
    request
      .post("#{config.baseURL}/convert")
      .send("""
        <youtube href="http://www.youtube.com/embed/K27MA8v91D4"/>
        <flickrshow href="page_show_url=%2Fphotos%2F88096431%40N00%2Fsets%2F72157631932122934%2Fshow%2F&page_show_back_url=%2Fphotos%2F88096431%40N00%2Fsets%2F72157631932122934%2F&set_id=72157631932122934&"/>
        """)
      .set("Content-Type", "text/x-markdown")
      .set("Accept", "text/html")
      .end (res) ->
        assert res.ok
        $ = cheerio.load(res.text)
        assert.lengthOf $('flickrshow'), 0
        assert.lengthOf $('youtube'), 0
        assert $("object").length > 0
        done()


describe "the blog post authoring/preview page", ->
  $ = null

  before (done) ->
    loadPage config.baseURL + "/persblog/post", (dom)->
      $ = dom
      done()

  it "should have a preview section and a textarea", ->
    assert $("section.preview").length > 0
    assert $("textarea").length > 0
