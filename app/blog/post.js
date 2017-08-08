const _ = require("lodash");
const {promisify} = require("util");
const fs = require("fs");
const join = require("path").join;
const markdown = require("marked");
const moment = require("moment");
const slug = require("./slug");

const mkdirpAsync = promisify(require("mkdirp"));

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
class Post {
  constructor(blog, title="", publish_date=new Date(), format="md") {
    this.blog = blog;
    this.title = title;
    this.publish_date = publish_date;
    this.format = format;
    this.name = slug(this.title);
  }

  _monthPath() {
    const publishMoment = moment(this.publish_date);
    return join(publishMoment.format("YYYY"), publishMoment.format("MM"));
  }

  dirPath() {
    return join(this.blog.basePath, this._monthPath());
  }

  contentPath() {
    return join(this.dirPath(), `${this.name}.${this.format}`);
  }

  metadataPath() {
    return join(this.dirPath(), `${this.name}.json`);
  }

  uri() {
    return join(this.blog.prefix, this._monthPath(), this.name);
  }

  metadata() {
    return {
      publish_date: this.publish_date,
      name: this.name,
      title: this.title,
      format: this.format
    };
  }

  async loadMetadata(metadataPath) {
    this.metadataPath = metadataPath;
    const jsonString = await readFileAsync(metadataPath, "utf8");
    const metadata = JSON.parse(jsonString);
    _.extend(this, metadata);
    this.publish_date = new Date(this.publish_date);
    // load next, previous links
    Object.assign(this, this.blog.postLinks[this.uri()]);
  }

  async load(metadataPath) {
    await this.loadMetadata(metadataPath);
    const noExt = this.metadataPath.substr(
      0,
      this.metadataPath.lastIndexOf(".")
    );
    const contentPath = `${noExt}.${this.format}`;
    this.content = await readFileAsync(contentPath, "utf8");
    if (this.format === "md") {
      this.content = markdown(this.content);
    }
    return this;
  }

  async save() {
    await mkdirpAsync(this.dirPath());
    const metadataJson = JSON.stringify(this.metadata(), null, 2);
    return Promise.all([
      writeFileAsync(this.contentPath(), this.content),
      writeFileAsync(this.metadataPath(), metadataJson)
    ]);
  }
}

module.exports = Post;
