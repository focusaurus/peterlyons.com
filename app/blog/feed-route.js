const postStore = require("./post-store");
const presentPost = require("./present-post");
// const pug = require("pug");

async function feed(request, h) {
  const blog = h.context;
  if (blog.cachedFeedXML) {
    return h
      .response(blog.cachedFeedXML)
      .type("application/xml; charset=utf-8");
  }

  const loaded = await Promise.all(
    blog.posts.slice(0, 10).map(postStore.loadContent)
  );
  const locals = {
    pretty: true,
    posts: loaded.map(presentPost.asObject),
    hostname: request.url.hostname
  };
  // TODO render the XML to string and cache it
  return h.view("blog/feed", locals);
}

module.exports = feed;
