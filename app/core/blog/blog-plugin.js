"use strict";
const Blog = require("./blog");
const presentPost = require("./present-post");

async function flushCache(request, h) {
  const blog = h.context;
  request.log("blog", `flushing blog cache for ${blog.title}`);
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

    await server.register(require("inert"));
    server.path(options.staticPath);
    server.route({
      method: "GET",
      path: `${blog.prefix}`,
      handler: async (request, h) =>
        h.view("core/blog/index", {
          blog,
          presentedPosts: blog.posts.map(presentPost.asObject)
        })
    });
    server.route({
      method: "GET",
      path: `${blog.prefix}/post`,
      handler: async (request, h) => h.view("core/blog/create-post")
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
      path: `${blog.prefix}/{rest*}`,
      handler: require("./view-post")
    });
    server.method(
      "loadPosts",
      async () => {
        server.log("blog", "loading blog posts from disk");
        await blog.load();
        return blog.feedPosts;
      },
      {
        cache: { expiresIn: 1000 * 60 * 24, generateTimeout: 1000 * 60 * 1 }
      }
    );
  }
};
