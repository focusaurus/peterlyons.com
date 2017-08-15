const _ = require("lodash");
const errors = require("httperrors");
const events = require("events");
const express = require("express");
const glob = require("glob");
const log = require("bole")(__filename);
const path = require("path");
const postStore = require("./post-store");
const presentPost = require("./present-post");
const util = require("util");
const viewPost = require("./view-post");

const globAsync = util.promisify(glob);

function flushCache(req, res) {
  const blog = res.app.locals.blog;
  log.info("flushing blog cache", {title: blog.title});
  blog.load();
  res.redirect(blog.prefix);
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

function Blog(options) {
  if (!(this instanceof Blog)) {
    return new Blog(options);
  }
  events.EventEmitter.call(this);
  Object.assign(
    this,
    _.pick(options, "title", "subtitle", "basePath", "prefix", "staticPath")
  );
  this.basePath = path.normalize(this.basePath);
  this.staticPath = this.staticPath && path.normalize(this.staticPath);
  const app = express();
  this.app = app;
  app.locals.blog = this;
  app.set("view engine", "pug");
  app.set("views", path.join(__dirname, ".."));
  app.get("/", (req, res) => res.render("blog/index"));
  app
    .route("/post")
    .get((req, res) => res.render("blog/create-post"))
    .post(require("./create-post-routes").handler);
  app.get("/feed", require("./feed-route"));
  app.get("/flush-cache", flushCache);
  app.get(new RegExp("/\\d{4}/\\d{2}/\\w+"), viewPost);
  if (this.staticPath) {
    app.use(express.static(this.staticPath));
  }
  app.use((req, res, next) => {
    next(new errors.NotFound(req.path));
  });
  app.use(require("../errors/error-handler"));
  this.load();
}
util.inherits(Blog, events.EventEmitter);

Blog.prototype.load = async function load() {
  delete this.cachedFeedXML;
  const files = await globAsync(`${this.basePath}/**/*.json`);
  let posts = await Promise.all(
    files.map(postStore.load.bind(null, this.prefix))
  );
  posts = _.sortBy(posts, "publish_date").reverse();
  posts.forEach(setupNextPrevious.bind(null, posts));
  this.posts = posts;
  this.presentedPosts = posts.map(presentPost.asObject);
  log.info(`blog at ${this.prefix} loaded ${this.posts.length} posts`);
};

Blog.prototype.assignNextPrevious = function assignNextPrevious(post) {
  const index = this.posts.findIndex(_post => _post.uri === post.uri);
  setupNextPrevious(this.posts, post, index);
};
module.exports = Blog;
