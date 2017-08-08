const cheerio = require("cheerio");
const errors = require("httperrors");
const fs = require("fs");
const markdown = require("marked");
const path = require("path");
const Post = require("./post");
const presentPost = require("./present-post");
const promiseHandler = require("../promise-handler");
const pug = require("pug");
const rawBody = require("raw-body");
const url = require("url");

// eslint-disable-next-line no-sync
const flickrshow = fs.readFileSync(
  path.join(__dirname, "flickrshow.pug"),
  "utf8"
);
const youtubeTemplate =
  "<iframe width='420' height='315' src='{URL}' allowfullscreen></iframe>";

function flickr($) {
  $("flickrshow").each((index, elem) => {
    const $elem = $(elem);
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
}

function youtube($) {
  $("youtube").each((index, elem) => {
    const $elem = $(elem);
    const URL = $elem.attr("href");
    return $elem.replaceWith(youtubeTemplate.replace(/\{URL\}/, URL));
  });
}

function customHtml(html) {
  const $ = cheerio.load(html);
  flickr($);
  youtube($);
  return `${$.html()}\n`;
}

async function viewPublished(req, res, next) {
  const blog = res.app.locals.blog;
  const post = new Post(blog);
  res.locals.post = post;
  try {
    await post.load(path.join(blog.basePath, `${req.path}.json`));
  } catch (error) {
    if (error && error.code === "ENOENT") {
      next(new errors.NotFound(req.path));
      return;
    }
    next(error);
    return;
  }
  post.presented = presentPost(post);
  res.app.render("blog/view-post", res.locals, (error, html) => {
    if (error) {
      next(error);
      return;
    }
    res.send(customHtml(html));
  });
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

async function viewDraft(req, res) {
  const html = markdown(req.text);
  res.send(customHtml(html));
}

exports.viewPublished = promiseHandler(viewPublished);
exports.viewDraft = [text, promiseHandler(viewDraft)];
