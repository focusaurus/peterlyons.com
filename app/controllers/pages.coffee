cheerio = require "cheerio"
config = require "app/config"
fs = require "fs"
jade = require "jade"
markdown = require("markdown-js").makeHtml
path = require "path"

class Page
  constructor: (@view, @title) ->
    if @view.indexOf(".") >= 0
      @URI = @view.split(".")[0]
    else
      @URI = @view
      @view = "#{@view}.jade"

  render: (req) =>
    if @title?.indexOf("Peter Lyons") < 0
      @title = @title + config.titleSuffix
    req.res.render @view, {title: @title}

pages = []
page = (URI, title) ->
  pages.push new Page(URI, title)
page "home", "Peter Lyons: node.js coder for hire"
page "bands", "My Bands"
page "bigclock", "BigClock: a full screen desktop clock in java"
page "career", "My Career"
page "code_conventions.md", "Code Conventions"
page "error404", "Not Found"
page "error502", "Oops"
page "favorites.md", "Favorite Musicians"
page "hackstars", "TechStars, pick me!"
page "leveling_up.md", "Leveling Up: Career Advancement for Software Developers"
page "linkzie", "Linkzie: A Simple Bookmark Manager"
page "oberlin.md", "Music from Oberlin"
page "practices.md", "Practices and Values"
page "smartears", "SmartEars: Ear Training Software"
page "stacks.md", "Technology Stacks"
page "web_prog.md", "Web Programming Concepts for Non-Programmers"
homePage = new Page "home", pages[0].title
homePage.URI = ""
pages.push homePage

skipLayout = ["web_data.jade"]

route = (app, page) ->
  app.get "/" + page.URI, (req) ->
    page.render req

setup = (app) ->
  app.engine "html", (htmlPath, options, callback) ->
    fs.readFile htmlPath, "utf8", callback

  #These two custom engines avoid having to put "extends layout\nblock body\n"
  #boilerplate at the top of every .jade template and have the entire template
  #indented
  app.engine "md", (mdPath, options, callback) ->
    fs.readFile mdPath, "utf8", (error, markdownText) ->
      return callback error if error
      jadeText = "extends layout\nblock body\n  :markdown\n    " + markdownText.split("\n").join("\n    ")
      tplFunction = jade.compile jadeText, {filename: mdPath}
      callback null, tplFunction options

  app.engine "jade", (jadePath, options, callback) ->
    fs.readFile jadePath, "utf8", (error, jadeText) ->
      return callback error if error
      if path.basename(jadePath) not in skipLayout
        jadeText = "extends layout\nblock body\n  " + jadeText.split("\n").join("\n  ")
      tplFunction = jade.compile jadeText, {filename: jadePath}
      callback null, tplFunction options

  #Route all the simple static pages
  route app, page for page in pages

  app.get "/web_data", (req, res, next) ->
    res.locals
      rawJade: true
    app.render "web_data", (error, html) ->
      return next(error) if error
      $ = cheerio.load html
      $("body").addClass "deck-container"
      $("section").addClass "slide"
      #$("li").addClass "slide"
      res.send $.html()

module.exports = {setup, Page}
