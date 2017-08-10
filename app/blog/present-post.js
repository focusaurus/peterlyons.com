const dateFns = require("date-fns");
const marked = require("marked");
const url = require("url");

const flickrRE = /!\[flickr\]\((.*)\)/g;
const youtubeRE = /!\[youtube\]\((.*)\)/g;

function doFlickr(match, src) {
  // Need to parse this album URL, which I copy directly from a web browser
  // https://www.flickr.com/photos/88096431@N00/sets/72157645234728466/
  const slashes = url.parse(src).path.split("/");
  const userId = encodeURIComponent(slashes[2]);
  const setId = encodeURIComponent(slashes[4]);
  return `<iframe
    align="center"
    frameborder="0"
    height="375"
    width="500"
    scrolling="no"
    src="https://www.flickr.com/slideShow/index.gne?user_id=${userId}&set_id=${setId}">
    </iframe>`;
}

function doYoutube(match, src) {
  return `<iframe width="420" height="315" src="${src}" allowfullscreen></iframe>`;
}

function asHtml(fomark) {
  return marked(
    fomark.replace(flickrRE, doFlickr).replace(youtubeRE, doYoutube)
  );
}
exports.asHtml = asHtml;

function asObject(post) {
  const withDefaults = Object.assign(
    {
      publish_date: new Date(),
      content: "",
      title: "",
      name: "",
      uri: ""
    },
    post
  );
  return {
    date: dateFns.format(withDefaults.publish_date, "MMM DD, YYYY"),
    html: asHtml(withDefaults.content),
    name: withDefaults.name.trim(),
    publish_date: withDefaults.publish_date,
    title: withDefaults.title.trim(),
    uri: withDefaults.uri
  };
}
exports.asObject = asObject;
