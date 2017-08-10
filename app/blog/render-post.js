const marked = require("marked");

const flickrRE = /!\[flickr\]\((.*)\)/g;
const youtubeRE = /!\[youtube\]\((.*)\)/g;

function doFlickr(match, url) {
  return `<p> This is a flickrshow ${url}</p>`;
}

function doYoutube(match, url) {
  return `<p> This is a youtube video ${url}</p>`;
}

function render(fomark) {
  return marked(
    fomark.replace(flickrRE, doFlickr).replace(youtubeRE, doYoutube)
  );
}
module.exports = render;
