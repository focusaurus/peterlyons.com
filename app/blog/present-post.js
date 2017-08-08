const moment = require("moment");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const pug = require("pug");
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

function presentPost(post) {
  return {
    date: moment(post.publish_date).format("MMM DD, YYYY"),
    html: customHtml(post.content || ""),
    name: post.name.trim(),
    publish_date: post.publish_date,
    title: post.title.trim(),
    uri: post.uri(),
  }
}

module.exports = presentPost;
