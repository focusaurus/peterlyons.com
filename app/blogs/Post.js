var _ = require("lodash");
var async = require("async");
var asyncjs = require("asyncjs");
var fs = require("fs");
var markdown = require("markdown-js").makeHtml;
var mkdirp = require("mkdirp");
var moment = require("moment");
var path = require("path");
var slug = require("app/blogs/slug");

function Post(blog, title, publish_date, format) {
  this.blog = blog;
  this.title = title;
  this.publish_date = publish_date;
  this.format = format;
  this.name = slug(this.title);
}

Post.prototype.metadata = function() {
  return {
    publish_date: this.publish_date,
    name: this.name,
    title: this.title,
    format: this.format
  };
};

Post.prototype.URI = function() {
  var publishMoment = moment(this.publish_date);
  return path.join(this.blog,
    publishMoment.format("YYYY"), publishMoment.format("MM"), this.name);
};

Post.prototype.contentPath = function() {
  return this.URI() + "." + this.format;
};

Post.prototype.metadataPath = function() {
  return this.URI() + ".json";
};

Post.prototype.dirPath = function() {
  return path.dirname(path.join(this.base, this.contentPath()));
};

Post.prototype.viewPath = function() {
  return path.join(this.base, this.URI() + "." + this.format);
};

Post.prototype.loadMetadata = function(metadataPath, blog, callback) {
  var self;
  this.metadataPath = metadataPath;
  this.blog = blog;
  self = this;
  return fs.exists(this.metadataPath, function(exists) {
    if (!exists) {
      return;
    }
    return fs.readFile(metadataPath, "utf8", function(error, jsonString) {
      var metadata;
      if (error) {
        return callback(error);
      }
      metadata = JSON.parse(jsonString);
      _.extend(self, metadata);
      self.publish_date = new Date(self.publish_date);
      self.view = self.URI() + "." + self.format;
      callback();
    });
  });
};

Post.prototype.load = function(metadataPath, blog, callback) {
  var self;
  this.metadataPath = metadataPath;
  this.blog = blog;
  self = this;
  return asyncjs.files([this.metadataPath]).readFile("utf8").each(function(file, next) {
    var metadata;
    metadata = JSON.parse(file.data);
    _.extend(self, metadata);
    self.publish_date = new Date(self.publish_date);
    self.view = (self.URI()) + "." + self.format;
    return next();
  }).each(function(file, next) {
    var noExt;
    noExt = file.path.substr(0, file.path.lastIndexOf('.'));
    file.path = noExt + "." + self.format;
    file.name = path.basename(file.path);
    return next();
  }).readFile("utf8").each(function(file, next) {
    if (self.format === "md") {
      self.content = markdown(file.data);
    } else {
      self.content = file.data;
    }
    return next();
  }).end(function(error) {
    return callback(error);
  });
};

Post.prototype.save = function(callback) {
  var contentPath, metadataPath, self;
  self = this;
  contentPath = path.join(this.base, this.contentPath());
  metadataPath = path.join(this.base, this.metadataPath());
  return mkdirp(this.dirPath(), function(error) {
    var work;
    if (error) {
      return callback(error);
    }
    work = [async.apply(fs.writeFile, contentPath, self.content), async.apply(fs.writeFile, metadataPath, JSON.stringify(self.metadata()))];
    return async.parallel(work, function(error) {
      if (error) {
        return callback(error);
      }
      return callback(null, self);
    });
  });
};

module.exports = Post;
