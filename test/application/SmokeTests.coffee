config = require "app/config"
request = require "superagent"
expect = require("chai").expect

describe 'smoke tests for most pages on the site', ->

  testConfigs = [
    ["/", /node\.js/]
    ["/career", /Opsware/]
    ["/contact", /pete@peterlyons.com/]
    ["/stacks", /JavaScript/]
    ["/practices", /Craftsmanship/]
    ["/bands", /Afronauts/]
    ["/bands.html", /Afronauts/]
    ["/bigclock", /clock/]
    ["/linkzie", /bookmark/]
    ["/code_conventions", /readability/]
    ["/this-will-cause-404", /404 error page/]
    ["/leveling_up", /Pillar 1/]
    ["/web_prog", /PHP/]
    ["/smartears", /interval/]
    ["/oberlin", /Edison/]
    ["/oberlin.html", /Edison/]
    ["/favorites", /Imogen/]
    ["/problog", /Pete's Points/]
    ["/persblog", /travel/]
    ["/app/photos", /Gallery/]
    #TODO troubleshoot this. It's returning the wrong blog post
    #["/app/photos?gallery=jacksonville_2008&photo=012_matthew_the_kitten", /Matthew/]
    ["/problog/2009/03/announcing-petes-points", /professional/]
    ["/persblog/2007/10/petes-travel-adventure-2007-begins-friday-october-5th", /Alitalia/]
  ]

  for test in testConfigs
    makeTest = (URI, regex) ->
      it "#{URI} should match #{regex}", (done) ->
        request.get config.baseURL + URI, (res) ->
          expect(res.status).to.equal 200
          expect(res.text).to.match regex
          done()
    makeTest test...
