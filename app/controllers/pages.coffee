cheerio = require "cheerio"
fs = require "fs"
jade = require "jade"
path = require "path"

class Page
  constructor: (@view, @locals={}) ->
    if @view.indexOf(".") >= 0
      @URI = @view.split(".")[0]
    else
      @URI = @view
      @view = "#{@view}.jade"

  render: (req) =>
    if @locals.title? and @locals.title.indexOf("Peter Lyons") < 0
      @locals.title = @locals.title + " | Peter Lyons"
    req.res.render @view, {locals: @locals}

pages = []
page = (URI, title) ->
  pages.push new Page(URI, {title})
page "home", "Peter Lyons: node.js coder for hire"
page "bands", "My Bands"
page "bigclock", "BigClock: a full screen desktop clock in java"
page "career", "My Career"
page "code_conventions", "Code Conventions"
page "error404", "Not Found"
page "error502", "Oops"
page "favorites", "Favorite Musicians"
page "hackstars", "TechStars, pick me!"
page "leveling_up.md", "Leveling Up: Career Advancement for Software Developers"
page "linkzie", "Linkzie: A Simple Bookmark Manager"
page "oberlin", "Music from Oberlin"
page "practices.md", "Practices and Values"
page "smartears", "SmartEars: Ear Training Software"
page "stacks.md", "Technology Stacks"
page "web_prog.md", "Web Programming Concepts for Non-Programmers"
#page "web_data", "Data on the Web"
homePage = new Page "home", {title: pages[0].locals.title}
homePage.URI = ""
pages.push homePage

route = (app, page) ->
  app.get "/" + page.URI, (req) ->
    page.render req

setup = (app) ->
  #Route all the simple static pages
  route app, page for page in pages

  app.get "/web_data", (req, res, next) ->
    templatePath = __dirname + "/../templates/web_data.jade"
    fs.readFile templatePath, "utf-8", (error, template) ->
      return next(error) if error
      templateFunction = jade.compile(template, {layout: false})
      $ = cheerio.load(templateFunction())
      $("body").addClass "deck-container"
      $("section").addClass "slide"
      #$("li").addClass "slide"
      res.send $.html()

module.exports = {setup, Page}
