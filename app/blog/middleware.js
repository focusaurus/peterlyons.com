const cheerio = require("cheerio");
const errors = require("httperrors");
const fs = require("fs");
const pug = require("pug");
const markdown = require("marked");
const path = require("path");
const rawBody = require("raw-body");
const url = require("url");

/* eslint no-sync:0 */
const flickrshow = fs.readFileSync(
  path.join(__dirname, "flickrshow.pug"),
  "utf8"
);
const youtubeTemplate =
  "<iframe width='420' height='315' src='{URL}' allowfullscreen></iframe>";

function debugLog(message) {
  return (req, res, next) => {
    console.log(req.method, req.path, message); // eslint-disable-line no-console
    next();
  };
}

function domify(req, res, next) {
  res.locals.$ = cheerio.load(res.locals.postContent);
  next();
}

function flickr(req, res, next) {
  res.locals.$("flickrshow").each((index, elem) => {
    const $elem = res.locals.$(elem);
    const href = $elem.attr("href");
    // Need to parse this album URL, which I copy directly from a web browser
    // https://www.flickr.com/photos/88096431@N00/sets/72157645234728466/
    const slashes = url.parse(href).path.split("/");
    const locals = {
      userId: slashes[2],
      setId: slashes[4]
    };
    const flickrHtml = pug.render(flickrshow, locals);
    return $elem.replaceWith(flickrHtml);
  });
  next();
}

function html(req, res, next) {
  if (!/\.html$/.test(res.contentPath)) {
    next();
    return;
  }
  fs.readFile(res.contentPath, "utf8", (error, htmlText) => {
    if (error && error.code === "ENOENT") {
      next(new errors.NotFound(req.path));
      return;
    }
    res.locals.postContent = htmlText;
    next(error);
  });
}

function markdownToHTML(req, res, next) {
  if (!/\.md$/.test(res.contentPath)) {
    next();
    return;
  }
  fs.readFile(res.contentPath, "utf8", (error, markdownText) => {
    if (error && error.code === "ENOENT") {
      next(new errors.NotFound(req.path));
      return;
    }
    if (error) {
      next(error);
      return;
    }
    res.locals.postContent = markdown(markdownText);
    next(error);
  });
}

function previewMarkdown(req, res, next) {
  res.locals.postContent = markdown(req.text);
  next();
}

function renderPost(req, res, next) {
  res.app.render("blog/view-post", res.locals, (error, html2) => {
    if (error) {
      next(error);
      return;
    }
    res.locals.postContent = html2;
    next();
  });
}

function send(req, res) {
  res.send(res.locals.postContent);
}

function text(req, res, next) {
  rawBody(
    req,
    {
      length: req.headers["content-length"],
      limit: "1mb",
      encoding: "utf8"
    },
    (error, string) => {
      if (error) {
        next(error);
        return;
      }
      req.text = string;
      next();
    }
  );
}

function undomify(req, res, next) {
  res.locals.postContent = `${res.locals.$.html()}\n`;
  next();
}

function youtube(req, res, next) {
  res.locals.$("youtube").each((index, elem) => {
    const $elem = res.locals.$(elem);
    const URL = $elem.attr("href");
    return $elem.replaceWith(youtubeTemplate.replace(/\{URL\}/, URL));
  });
  next();
}

exports.debugLog = debugLog;
exports.domify = domify;
exports.flickr = flickr;
exports.html = html;
exports.markdownToHTML = markdownToHTML;
exports.previewMarkdown = previewMarkdown;
exports.renderPost = renderPost;
exports.send = send;
exports.text = text;
exports.undomify = undomify;
exports.youtube = youtube;
exports.convert = [
  text,
  previewMarkdown,
  domify,
  flickr,
  youtube,
  undomify,
  send
];
