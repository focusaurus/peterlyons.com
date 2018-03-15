"use strict";
const Blog = require("./blog");
const log = require("bole")(__filename);
const presentPost = require("./present-post");

async function flushCache(request, h) {
  const blog = h.context;
  log.info("flushing blog cache", {title: blog.title});
  await blog.load();
  return h.redirect(blog.prefix);
}

module.exports = {
  name: "blog",
  version: "1.0.0",
  async register(server, options) {
    const blog = new Blog(options);
    await blog.load();
    server.bind(blog);
    server.app.blog = blog;
    server.route({
      method: "GET",
      path: `${blog.prefix}`,
      handler: async (request, h) =>
        h.view("blog/index", {
          blog,
          presentedPosts: blog.posts.map(presentPost.asObject)
        })
    });
    server.route({
      method: "GET",
      path: `${blog.prefix}/post`,
      handler: async (request, h) => h.view("blog/create-post")
    });
    server.route({
      method: "POST",
      path: `${blog.prefix}/post`,
      handler: require("./create-post-routes").handler
    });
    server.route({
      method: "GET",
      path: `${blog.prefix}/feed`,
      handler: require("./feed-route")
    });
    server.route({
      method: "GET",
      path: `${blog.prefix}/flush-cache`,
      handler: flushCache
    });
    server.route({
      method: "GET",
      path: `${blog.prefix}/{year}/{month}/{slug}`,
      handler: require("./view-post")
    });
    server.method(
      "loadPosts",
      async () => {
        server.log(["blog"], "loading blog posts from disk");
        return blog.load();
      },
      {
        cache: {expiresIn: 1000 * 60 * 24, generateTimeout: 1000 * 60 * 1}
      }
    );
    // if (this.staticPath) {
    //   app.use(express.static(this.staticPath));
    // }
  }
};
