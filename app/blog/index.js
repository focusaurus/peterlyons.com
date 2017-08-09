const _ = require("lodash");
const CreatePost = require("./create-post-react");
const errors = require("httperrors");
const events = require("events");
const express = require("express");
const glob = require("glob");
const log = require("bole")(__filename);
const path = require("path");
const Post = require("./post");
const presentPost = require("./present-post");
const React = require("react");
const server = require("react-dom/server");
const util = require("util");
const viewPost = require("./view-post");

const globAsync = util.promisify(glob);

function flushCache(req, res) {
  const blog = res.app.locals.blog;
  log.info("flushing blog cache", {title: blog.title});
  blog.load();
  res.redirect(blog.prefix);
}

function Blog(options) {
  if (!(this instanceof Blog)) {
    return new Blog();
  }
  events.EventEmitter.call(this);
  Object.assign(
    this,
    _.pick(options, "title", "subtitle", "basePath", "prefix", "staticPath")
  );
  this.basePath = path.normalize(this.basePath);
  this.staticPath = this.staticPath && path.normalize(this.staticPath);
  this.postLinks = {};
  const app = express();
  this.app = app;
  app.locals.blog = this;
  app.set("view engine", "pug");
  app.set("views", path.join(__dirname, ".."));
  app.get("/", (req, res) => {
    res.locals.posts = res.app.locals.blog.posts.map(presentPost);
    res.render("blog/index");
  });
  app
    .route("/post")
    .get((req, res) => {
      const element = React.createElement(CreatePost);
      const bodyHtml = server.renderToStaticMarkup(element);
      res.render("blog/create-post", {bodyHtml});
    })
    .post(require("./create-post-routes").handler);
  app.post("/convert", viewPost.viewDraft);
  app.get("/feed", require("./feed-route"));
  app.get("/flush-cache", flushCache);
  app.get(new RegExp("/\\d{4}/\\d{2}/\\w+"), viewPost.viewPublished);
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
  const self = this;
  const files = await globAsync(`${this.basePath}/**/*.json`);
  async function loadPost(file) {
    const post = new Post(self);
    await post.load(file);
    post.presented = presentPost(post);
    return post;
  }
  let posts = await Promise.all(files.map(loadPost));
  posts = _.sortBy(posts, "publish_date").reverse();
  posts.forEach((post, index) => {
    /* eslint no-ternary:0 */
    this.postLinks[post.uri()] = {
      next: index > 0 ? posts[index - 1] : null,
      previous: index < posts.length ? posts[index + 1] : null
    };
  });
  this.posts = posts;
};

module.exports = Blog;
