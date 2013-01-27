#config = require "app/config"
#fs = require "fs"
cheerio = require "cheerio"
#jade = require "jade"
#path = require "path"

flickrshowTemplate = """<object width="500" height="375">
  <param name="flashvars" value="offsite=true&lang=en-us&{URLs}&jump_to="></param> <param name="movie" value="http://www.flickr.com/apps/slideshow/show.swf?v=109615"></param> <param name="allowFullScreen" value="true"></param><embed type="application/x-shockwave-flash" src="http://www.flickr.com/apps/slideshow/show.swf?v=109615" allowFullScreen="true" flashvars="offsite=true&lang=en-us&{URLs}&jump_to=" width="500" height="375"></embed></object>"""

youtubeTemplate = "<iframe width='420' height='315' src='{URL}' frameborder='0' allowfullscreen></iframe>"

#Not needed for express 3
# exports.layout = (req, res, next) ->
#   layoutPath = path.join __dirname, "..", "templates", "layout.jade"
#   fs.readFile layoutPath, "utf8", (error, jadeText) ->
#     layoutFunc = jade.compile jadeText, {filename: layoutPath}
#     locals =
#       config: config
#       title: ""
#       body: res.html or ""
#     res.html = layoutFunc locals
#     next error

exports.domify = (req, res, next) ->
  res.$ = cheerio.load res.html
  console.log("@bug domified", res.$('title').text())
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

exports.debugLog = (message) ->
  (req, res, next) ->
    console.log message
    next()
