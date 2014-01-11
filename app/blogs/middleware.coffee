cheerio   = require "cheerio"
config    = require "app/config"
fs        = require "fs"
path      = require "path"
rawBody   = require "raw-body"
utils     = require("connect").utils

flickrshowTemplate = """<object width="500" height="375">
  <param name="flashvars" value="offsite=true&lang=en-us&{URLs}&jump_to="></param> <param name="movie" value="http://www.flickr.com/apps/slideshow/show.swf?v=109615"></param> <param name="allowFullScreen" value="true"></param><embed type="application/x-shockwave-flash" src="http://www.flickr.com/apps/slideshow/show.swf?v=109615" allowFullScreen="true" flashvars="offsite=true&lang=en-us&{URLs}&jump_to=" width="500" height="375"></embed></object>"""

youtubeTemplate = "<iframe width='420' height='315' src='{URL}' frameborder='0' allowfullscreen></iframe>"

TEXT_MIME_TYPES = [
  "application/json"
  "application/x-www-form-urlencoded"
]
relevantMIMEType = (req) ->
  mime = utils.mime req
  (TEXT_MIME_TYPES.indexOf(mime) >= 0) or (0 is mime.indexOf "text/")

debugLog = (message) ->
  (req, res, next) ->
    console.log req.method, req.path, message
    next()

domify = (req, res, next) ->
  res.$ = cheerio.load res.html
  next()

undomify = (req, res, next) ->
  res.html = res.$.html() + "\n"
  next()

flickr = (req, res, next) ->
  $ = res.$
  res.$("flickrshow").each (index, elem) ->
    $elem = $(elem)
    URLs = $elem.attr "href"
    $elem.replaceWith(flickrshowTemplate.replace /\{URLs\}/g, URLs)
  next()

youtube = (req, res, next) ->
  $ = res.$
  $("youtube").each (index, elem) ->
    $elem = $(elem)
    URL = $elem.attr "href"
    $elem.replaceWith(youtubeTemplate.replace /\{URL\}/, URL)
  next()

send = (req, res) ->
  res.send res.html

text = (req, res, next) ->
  return next() if req._body
  return next() if not utils.hasBody(req)
  return next() if not relevantMIMEType(req)
  rawBody req, (error, buffer) ->
    return next(error) if error
    #mark as assembled/buffered
    req._body = true
    req.body = buffer.toString "utf8"
    req.body = req.body or ''
    next()


module.exports = {
  debugLog
  domify
  flickr
  send
  text
  undomify
  youtube
}
