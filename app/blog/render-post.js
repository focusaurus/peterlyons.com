const marked = require("marked");
const url = require("url");

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
    src="https://www.flickr.com/slideShow/index.gne?user_id=${encodeURIComponent(userId)}&set_id=${encodeURIComponent(setId)} width="500">
    </iframe>`;
}

function doYoutube(match, src) {
  return `<iframe width="420" height="315" src="${src}" allowfullscreen></iframe>`;
}

function render(fomark) {
  return marked(
    fomark.replace(flickrRE, doFlickr).replace(youtubeRE, doYoutube)
  );
}
module.exports = render;
