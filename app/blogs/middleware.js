var cheerio = require("cheerio");
var config = require("app/config");
var flickrshowTemplate = '<object width="500" height="375"><param name="flashvars" value="offsite=true&lang=en-us&{URLs}&jump_to="></param> <param name="movie" value="http://www.flickr.com/apps/slideshow/show.swf?v=109615"></param> <param name="allowFullScreen" value="true"></param><embed type="application/x-shockwave-flash" src="http://www.flickr.com/apps/slideshow/show.swf?v=109615" allowFullScreen="true" flashvars="offsite=true&lang=en-us&{URLs}&jump_to=" width="500" height="375"></embed></object>';
var fs = require("fs");
var path = require("path");
var rawBody = require("raw-body");
var TEXT_MIME_TYPES = ["application/json", "application/x-www-form-urlencoded"];
var utils = require("connect").utils;
var youtubeTemplate = "<iframe width='420' height='315' src='{URL}' frameborder='0' allowfullscreen></iframe>";

function relevantMIMEType(req) {
  var mime = utils.mime(req);
  return (TEXT_MIME_TYPES.indexOf(mime) >= 0) || (0 === mime.indexOf("text/"));
}

function debugLog(message) {
  return function(req, res, next) {
    console.log(req.method, req.path, message);
    next();
  };
}

function domify(req, res, next) {
  res.$ = cheerio.load(res.html);
  next();
}

function undomify(req, res, next) {
  res.html = res.$.html() + "\n";
  next();
}

function flickr(req, res, next) {
  var $ = res.$;
  res.$("flickrshow").each(function(index, elem) {
    var $elem, URLs;
    $elem = $(elem);
    URLs = $elem.attr("href");
    return $elem.replaceWith(flickrshowTemplate.replace(/\{URLs\}/g, URLs));
  });
  next();
}

function youtube(req, res, next) {
  var $;
  $ = res.$;
  $("youtube").each(function(index, elem) {
    var $elem, URL;
    $elem = $(elem);
    URL = $elem.attr("href");
    return $elem.replaceWith(youtubeTemplate.replace(/\{URL\}/, URL));
  });
  next();
}

function send(req, res) {
  res.send(res.html);
}

function text(req, res, next) {
  if (req._body) {
    return next();
  }
  if (!utils.hasBody(req)) {
    return next();
  }
  if (!relevantMIMEType(req)) {
    return next();
  }
  rawBody(req, function(error, buffer) {
    if (error) {
      return next(error);
    }
    req._body = true;
    req.body = buffer.toString("utf8");
    req.body = req.body || '';
    next();
  });
}

module.exports = {
  debugLog: debugLog,
  domify: domify,
  flickr: flickr,
  send: send,
  text: text,
  undomify: undomify,
  youtube: youtube
};
