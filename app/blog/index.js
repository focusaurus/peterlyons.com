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
    delete this.cachedFeedXML;
    const files = await globAsync(`${this.basePath}/**/*.json`);
    let posts = await Promise.all(
      files.map(postStore.load.bind(null, this.prefix))
    );
    posts = _.sortBy(posts, "publish_date").reverse();
    posts.forEach(setupNextPrevious.bind(null, posts));
    this.posts = posts;
    this.presentedPosts = posts.map(presentPost.asObject);
    log.info(`this at ${this.prefix} loaded ${this.posts.length} posts`);
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
    // if (this.staticPath) {
    //   app.use(express.static(this.staticPath));
    // }
    await blog.load();
  }
};
