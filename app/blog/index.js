"use strict";
const _ = require("lodash");
const events = require("events");
const glob = require("glob");
const log = require("bole")(__filename);
const path = require("path");
const postStore = require("./post-store");
const presentPost = require("./present-post");
const util = require("util");

const globAsync = util.promisify(glob);

async function flushCache(request, h) {
  const blog = h.context;
  log.info("flushing blog cache", {title: blog.title});
  blog.load();
  return h.redirect(blog.prefix);
}

function setupNextPrevious(posts, post, index) {
  const next = posts[index - 1];
  const previous = posts[index + 1];
  /* eslint-disable no-param-reassign */
  if (next) {
    post.next = {
      title: next.title,
      uri: next.uri
    };
  }
  if (previous) {
    post.previous = {
      title: previous.title,
      uri: previous.uri
    };
  }
}

class Blog extends events.EventEmitter {
  constructor(options) {
    super();
    Object.assign(
      this,
      _.pick(options, "title", "subtitle", "basePath", "prefix", "staticPath")
    );
    this.basePath = path.normalize(this.basePath);
    this.staticPath = this.staticPath && path.normalize(this.staticPath);
  }

  async load() {
    const files = await globAsync(`${this.basePath}/**/*.json`);
    let posts = await Promise.all(
      files.map(postStore.load.bind(null, this.prefix))
    );
    posts = _.sortBy(posts, "publish_date").reverse();
    posts.forEach(setupNextPrevious.bind(null, posts));
    const feedPosts = (await Promise.all(
      posts.slice(0, 10).map(postStore.loadContent)
    )).map(presentPost.asObject);
    const presentedPosts = posts.map(presentPost.asObject);
    return {
      feedPosts,
      presentedPosts
    };
  }

  async assignNextPrevious(post) {
    const index = this.posts.findIndex(_post => _post.uri === post.uri);
    setupNextPrevious(this.posts, post, index);
  }
}

module.exports = {
  name: "blog",
  version: "1.0.0",
  async register(server, options) {
    const blog = new Blog(options);
    server.bind(blog);
    server.route({
      method: "GET",
      path: `${blog.prefix}`,
      handler: async (request, h) => h.view("blog/index", {blog})
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
    await blog.load();
  }
};
