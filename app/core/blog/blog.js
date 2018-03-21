"use strict";
const _ = require("lodash");
const events = require("events");
const glob = require("glob");
const path = require("path");
const postStore = require("./post-store");
const presentPost = require("./present-post");
const util = require("util");

const globAsync = util.promisify(glob);

function setupNextPrevious(post, index, posts) {
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
    this.posts = await Promise.all(
      files.map(postStore.load.bind(null, this.prefix))
    );
    this.posts = _.sortBy(this.posts, "publish_date").reverse();
    this.posts.forEach(setupNextPrevious);
    this.feedPosts = (await Promise.all(
      this.posts.slice(0, 10).map(postStore.loadContent)
    )).map(presentPost.asObject);
  }

  findPostByUri(uri) {
    return this.posts.find(post => post.uri === uri);
  }
}

module.exports = Blog;
