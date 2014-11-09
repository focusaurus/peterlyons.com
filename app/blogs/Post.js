var _ = require("lodash");
var async = require("async");
var fs = require("fs");
var markdown = require("markdown-js").makeHtml;
var mkdirp = require("mkdirp");
var moment = require("moment");
var path = require("path");
var slug = require("app/blogs/slug");

/* eslint camelcase:0 */
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
  var self = this;
  this.metadataPath = metadataPath;
  this.blog = blog;
  fs.exists(this.metadataPath, function(exists) {
    if (!exists) {
      return;
    }
    fs.readFile(metadataPath, "utf8", function(error, jsonString) {
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
  var self = this;
  this.metadataPath = metadataPath;
  this.blog = blog;
  function loadMetadata(callback) {
    fs.readFile(self.metadataPath, "utf8", function (error, json) {
      if (error) {
        callback(error);
        return;
      }
      try {
        _.extend(self, JSON.parse(json));
        self.publish_date = new Date(self.publish_date);
        self.view = (self.URI()) + "." + self.format;
        callback();
        return;
      } catch (exception) {
        callback(exception);
        return;
      }
    });
  }

  function loadContent(callback) {
    var noExt = self.metadataPath.substr(0, self.metadataPath.lastIndexOf("."));
    var contentPath = noExt + "." + self.format;
    fs.readFile(contentPath, "utf8", function (error, content) {
      if (error) {
        callback(error);
        return;
      }
      self.content = content;
      if (self.format === "md") {
        self.content = markdown(content);
      }
      callback();
    });
  }

  async.series([loadMetadata, loadContent], callback);
};

Post.prototype.save = function(callback) {
  var self = this;
  var contentPath = path.join(this.base, this.contentPath());
  var metadataPath = path.join(this.base, this.metadataPath());
  mkdirp(this.dirPath(), function(error) {
    var work;
    if (error) {
      return callback(error);
    }
    work = [
     async.apply(fs.writeFile, contentPath, self.content),
     async.apply(fs.writeFile, metadataPath, JSON.stringify(self.metadata()))
    ];
    async.parallel(work, function(error) {
      if (error) {
        return callback(error);
      }
      return callback(null, self);
    });
  });
};

module.exports = Post;
