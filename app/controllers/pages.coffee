cheerio = require "cheerio"
fs = require "fs"
jade = require "jade"
markdown = require("markdown-js").makeHtml
middleware = require "./middleware"
path = require "path"

# class Page
#   constructor: (@view, @title) ->
#     if @view.indexOf(".") >= 0
#       @URI = @view.split(".")[0]
#     else
#       @URI = @view
#       @view = "#{@view}.jade"

#   render: (req) =>
#     if @title?.indexOf("Peter Lyons") < 0
#       @title = @title + config.titleSuffix
#     req.res.render @view, {title: @title}

# pages = []
# page = (URI, title) ->
#   pages.push new Page(URI, title)
# page "home", "Peter Lyons: node.js coder for hire"
# page "bands", "My Bands"
# page "bigclock", "BigClock: a full screen desktop clock in java"
# page "career", "My Career"
# page "code_conventions.md", "Code Conventions"
# page "error404", "Not Found"
# page "error502", "Oops"
# page "favorites.md", "Favorite Musicians"
# #@bugpage "hackstars", "TechStars, pick me!"
# page "leveling_up.md", "Leveling Up: Career Advancement for Software Developers"
# page "linkzie", "Linkzie: A Simple Bookmark Manager"
# page "oberlin.md", "Music from Oberlin"
# page "practices.md", "Practices and Values"
# page "smartears", "SmartEars: Ear Training Software"
# page "stacks.md", "Technology Stacks"
# page "web_prog.md", "Web Programming Concepts for Non-Programmers"
#homePage = new Page "home", pages[0].title
#homePage.URI = ""
#pages.push homePage

titles =
  code_conventions: "Code Conventions"
  leveling_up: "Leveling Up: Career Advancement for Software Developers"
  oberlin: "Music from Oberlin"

setup = (app) ->
  app.locals {title: middleware.title}
  app.get "/", (req, res) -> res.render "home"

  fs.readdirSync(app.get("views")).forEach (viewPath) ->
    if /\.jade$/i.test viewPath
      app.get "/" + viewPath[..-6], (req, res) ->
        res.render viewPath
    if /\.md$/i.test viewPath
      app.get "/" + viewPath[..-4], (req, res) ->
        res.render viewPath

  #app.use middleware.jadeWithLayout(titles)
  app.engine "html", (htmlPath, options, callback) ->
    fs.readFile htmlPath, "utf8", callback

  #These two custom engines avoid having to put "extends layout\nblock body\n"
  #boilerplate at the top of every .jade template and have the entire template
  #indented
  app.engine "md", (mdPath, options, callback) ->
    fs.readFile mdPath, "utf8", (error, markdownText) ->
      return callback error if error
      #Don't mess with the whitespace below, it is correct
      viewName = path.basename(mdPath)[..-4]
      title = titles[viewName]
      jadeText = """extends layout
block title
  title #{title}
block body
  :markdown
    
    """ + markdownText.split("\n").join("\n    ")
      tplFunction = jade.compile jadeText, {filename: mdPath}
      callback null, tplFunction options

  # app.engine "l.jade", (jadePath, options, callback) ->
  #   fs.readFile jadePath, "utf8", (error, jadeText) ->
  #     return callback error if error
  #     if path.basename(jadePath) not in skipLayout
  #       jadeText = "extends layout\nblock body\n  " + jadeText.split("\n").join("\n  ")
  #     tplFunction = jade.compile jadeText, {filename: jadePath}
  #     callback null, tplFunction options

  #Route all the simple static pages
  #route app, page for page in pages

  app.get "/:deck(web_data|rapid_feedback)", (req, res, next) ->
    app.render "decks/" + req.params.deck, (error, html) ->
      return next(error) if error
      $ = cheerio.load html
      $("body").addClass "deck-container"
      $("section").addClass "slide"
      #$("li").addClass "slide"
      res.send $.html()

module.exports = {setup}
