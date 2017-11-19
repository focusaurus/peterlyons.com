const showdown = require("showdown");
const url = require("url");

const converter = new showdown.Converter();
const flickrRE = /!\[flickr\]\((.*)\)/g;
const youtubeRE = /!\[youtube\]\((.*)\)/g;

function doFlickr(match, src) {
  // Need to parse this album URL, which I copy directly from a web browser
  // https://www.flickr.com/photos/88096431@N00/sets/72157645234728466/
  const slashes = url.parse(src).path.split("/");
  const userId = slashes[2];
  const setId = slashes[4];
  return `<iframe
    align="center"
    frameborder="0"
    height="375"
    scrolling="no"
    width="500"
    src="https://www.flickr.com/slideShow/index.gne?user_id=${encodeURIComponent(
      userId
    )}&set_id=${encodeURIComponent(setId)}"></iframe>`;
}

function doYoutube(match, src) {
  return `<iframe width="420" height="315" src="${src}" allowfullscreen></iframe>`;
}

function render(fomark) {
  const markdown = fomark
    .replace(flickrRE, doFlickr)
    .replace(youtubeRE, doYoutube);
  return converter.makeHtml(markdown);
}

module.exports = render;
