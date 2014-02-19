var cheerio = require("cheerio");
var flickrshowTemplate = '<object width="500" height="375"><param name="flashvars" value="offsite=true&lang=en-us&{URLs}&jump_to="></param> <param name="movie" value="http://www.flickr.com/apps/slideshow/show.swf?v=109615"></param> <param name="allowFullScreen" value="true"></param><embed type="application/x-shockwave-flash" src="http://www.flickr.com/apps/slideshow/show.swf?v=109615" allowFullScreen="true" flashvars="offsite=true&lang=en-us&{URLs}&jump_to=" width="500" height="375"></embed></object>';
var fs = require("fs");
var path = require("path");
var rawBody = require("raw-body");
var youtubeTemplate = "<iframe width='420' height='315' src='{URL}' allowfullscreen></iframe>";

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
  res.$("flickrshow").each(function(index, elem) {
    var $elem = res.$(elem);
    var URLs = $elem.attr("href");
    return $elem.replaceWith(flickrshowTemplate.replace(/\{URLs\}/g, URLs));
  });
  next();
}

function youtube(req, res, next) {
  res.$("youtube").each(function(index, elem) {
    var $elem = res.$(elem);
    var URL = $elem.attr("href");
    return $elem.replaceWith(youtubeTemplate.replace(/\{URL\}/, URL));
  });
  next();
}

function send(req, res) {
  res.send(res.html);
}

function text(req, res, next) {
  rawBody(req, {
    length: req.headers["content-length"],
    limit: "1mb",
    encoding: "utf8"
  }, function (error, string) {
    if (error) {
      next(error);
      return;
    }
    req.text = string;
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
