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
      options: { cache: false },
      handler: async (request, h) =>
        h.view("core/blog/index", {
          blog,
          presentedPosts: blog.posts.map(presentPost.asObject)
        })
    });
    server.route({
      method: "GET",
      path: `${blog.prefix}/post`,
      options: { cache: false },
      handler: async (request, h) => h.view("core/blog/create-post")
    });
    server.route({
      method: "POST",
      path: `${blog.prefix}/post`,
      options: { cache: false },
      handler: require("./create-post-routes").handler
    });
    server.route({
      method: "GET",
      path: `${blog.prefix}/feed`,
      options: { cache: false },
      handler: require("./feed-route")
    });
    server.route({
      method: "GET",
      path: `${blog.prefix}/flush-cache`,
      options: { cache: false },
      handler: flushCache
    });
    server.route({
      method: "GET",
      path: `${blog.prefix}/{rest*}`,
      options: { cache: false },
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
