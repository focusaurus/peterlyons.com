cheerio = require "cheerio"
config = require "app/config"
fs = require "fs"
jade = require "jade"
middleware = require "./middleware"
path = require "path"

#Need titles for pure markdown templates (not jade)
titles =
  code_conventions: "Code Conventions"
  leveling_up: "Leveling Up: Career Advancement for Software Developers"
  oberlin: "Music from Oberlin"

renderTemplate = (viewPath) ->
  (req, res) -> res.render viewPath

setup = (app) ->
  app.locals {title: middleware.title}

  #This custom engine allows pure markdown files without any jade wrapping
  #or indenting required
  app.engine "md", (mdPath, options, callback) ->
    fs.readFile mdPath, "utf8", (error, markdownText) ->
      return callback error if error
      #Don't mess with the whitespace below, it is correct
      viewName = path.basename(mdPath)[..-4]
      title = titles[viewName] + config.titleSuffix
      jadeText = """extends layout
block title
  title #{title}
block body
  :markdown
    
    """ + markdownText.split("\n").join("\n    ")
      tplFunction = jade.compile jadeText, {filename: mdPath}
      callback null, tplFunction options

  app.use middleware.template "jade"
  app.use middleware.template "md"

  app.get "/", (req, res) -> res.render "home"
  app.get "/:deck(web_data|rapid_feedback)", (req, res, next) ->
    app.render "decks/" + req.params.deck, (error, html) ->
      return next(error) if error
      $ = cheerio.load html
      $("body").addClass "deck-container"
      $("section").addClass "slide"
      #$("li").addClass "slide"
      res.send $.html()

module.exports = {setup}
