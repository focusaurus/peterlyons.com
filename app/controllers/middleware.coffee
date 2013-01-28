cheerio = require "cheerio"
config = require "app/config"
#fs = require "fs"
#jade = require "jade"
#path = require "path"

flickrshowTemplate = """<object width="500" height="375">
  <param name="flashvars" value="offsite=true&lang=en-us&{URLs}&jump_to="></param> <param name="movie" value="http://www.flickr.com/apps/slideshow/show.swf?v=109615"></param> <param name="allowFullScreen" value="true"></param><embed type="application/x-shockwave-flash" src="http://www.flickr.com/apps/slideshow/show.swf?v=109615" allowFullScreen="true" flashvars="offsite=true&lang=en-us&{URLs}&jump_to=" width="500" height="375"></embed></object>"""

youtubeTemplate = "<iframe width='420' height='315' src='{URL}' frameborder='0' allowfullscreen></iframe>"

exports.domify = (req, res, next) ->
  res.$ = cheerio.load res.html
  next()

exports.undomify = (req, res, next) ->
  res.html = res.$.html() + "\n"
  next()

exports.send = (req, res) ->
  res.send res.html

exports.flickr = (req, res, next) ->
  $ = res.$
  res.$("flickrshow").each (index, elem) ->
    $elem = $(elem)
    URLs = $elem.attr "href"
    $elem.replaceWith(flickrshowTemplate.replace /\{URLs\}/g, URLs)
  next()

exports.youtube = (req, res, next) ->
  $ = res.$
  $("youtube").each (index, elem) ->
    $elem = $(elem)
    URL = $elem.attr "href"
    $elem.replaceWith(youtubeTemplate.replace /\{URL\}/, URL)
  next()

# exports.jadeWithLayout = (titles) ->
#   (req, res, next) ->
#     templatePath = path.join req.app.get("views"), req.path + ".l.jade"
#     fs.readFile templatePath, "utf8", (error, jadeText) ->
#       #@todo distinguish ENOENT vs other errors
#       return next() if error
#       jadeText = "extends layout\nblock body\n  " + jadeText.split("\n").join("\n  ")
#       tplFunction = jade.compile jadeText, {filename: templatePath}
#       title = titles[req.path.slice(1)] || "Peter Lyons: node.js coder for hire"
#       if title.indexOf("Peter Lyons") < 0
#         title = title + config.titleSuffix
#       res.locals {config, title}
#       html = tplFunction res.locals
#       res.type('html').send html

exports.title = (text) ->
  parts = ["<title>", text]
  if text.indexOf("Peter Lyons") < 0
    parts.push config.titleSuffix
  parts.push "</title>"
  parts.join("")

exports.debugLog = (message) ->
  (req, res, next) ->
    console.log req.method, req.path
    console.log message
    next()
