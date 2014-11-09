var cheerio = require("cheerio");
var fs = require("fs");
var mustache = require("mustache");
var path = require("path");
var rawBody = require("raw-body");
var url = require("url");
var flickrshowTemplate = fs.readFileSync(
  path.join(__dirname, "flickrshowTemplate.html"), "utf8");
var youtubeTemplate =
  "<iframe width='420' height='315' src='{URL}' allowfullscreen></iframe>";

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
    var href = $elem.attr("href");
    //Need to parse this album URL, which I copy directly from a web browser
    //https://www.flickr.com/photos/88096431@N00/sets/72157645234728466/
    var slashes = url.parse(href).path.split("/");
    var locals = {
      userId: slashes[2],
      setId: slashes[4]
    };
    var flickrHtml = mustache.render(flickrshowTemplate, locals);
    return $elem.replaceWith(flickrHtml);
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
