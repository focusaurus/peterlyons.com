var _ = require("lodash");
var async = require("async");
var asyncjs = require("asyncjs");
var bcrypt = require("bcrypt");
var blogIndicesBySlug = {};
var config = require("app/config");
var events = require("events");
var express = require("express");
var fs = require("fs");
var markdown = require("markdown-js").makeHtml;
var middleware = require("./middleware");
var moment = require("moment");
var NotFound = require("app/NotFound");
var path = require("path");
var Post = require("./Post");
var postLinks = {};

function BlogIndex(URI, title) {
  this.URI = URI;
  this.title = title || "";
  this.blogTitle = this.title;
}

function loadBlogMW(req, res, next) {
  res.blog = blogIndicesBySlug[req.params.blogSlug];
  next();
}

function loadPost(req, res, next) {
  var blog = req.params[0];
  var post = new Post();
  post.base = config.blog.postBasePath;
  post.load(path.join(post.base, req.path + ".json"), blog, function(error) {
    if (error && error.code === "ENOENT") {
      next(new NotFound(req.path));
      return;
    }
    if (error) {
      next(error);
      return;
    }
    res.post = post;
    post.presented = presentPost(post);
    var links = postLinks[post.URI()];
    post.previous = links.previous;
    post.next = links.next;
    res.viewPath = post.viewPath();
    next();
  });
}

function html(req, res, next) {
  if (!/\.html$/.test(res.viewPath)) {
    next();
    return;
  }
  return fs.readFile(res.viewPath, "utf8", function(error, htmlText) {
    res.html = htmlText;
    next(error);
    return;
  });
}

function markdownToHTML(req, res, next) {
  if (!/\.md$/.test(res.viewPath)) {
    next();
    return;
  }
  return fs.readFile(res.viewPath, "utf8", function(error, markdownText) {
    if (error) {
      next(error);
      return;
    }
    res.html = markdown(markdownText);
    next(error);
    return;
  });
}

function renderPost(req, res, next) {
  var locals = {
    post: res.post,
    postContent: res.html
  };
  res.app.render("blogs/viewPost", locals, function(error, html) {
    if (error) {
      next(error);
      return;
    }
    res.html = html;
    next();
  });
}

function previewMarkdown(req, res, next) {
  res.html = markdown(req.text);
  next();
}

var convertMiddleware = [
  middleware.text,
  previewMarkdown,
  middleware.domify,
  middleware.flickr,
  middleware.youtube,
  middleware.undomify,
  middleware.send
];

var viewPostMiddleware = [
  loadPost,
  html,
  markdownToHTML,
  renderPost,
  middleware.domify,
  middleware.flickr,
  middleware.youtube,
  middleware.undomify,
  middleware.send
];

function presentPost(post) {
  var presented = _.clone(post);
  presented.title = presented.title.trim();
  presented.date = moment(post.publish_date).format("MMM DD, YYYY");
  return presented;
}

function loadBlog(URI, callback) {
  var basePath = path.join(config.blog.postBasePath, URI);
  basePath = path.normalize(basePath);
  var posts = [];

  asyncjs.walkfiles(basePath, null, asyncjs.PREORDER).stat().each(function(file, next) {
    if (file.stat.isDirectory()) {
      next();
      return;
    }
    if (!/\.json$/.test(file.name)) {
      next();
      return;
    }
    var post = new Post();
    posts.push(post);
    post.base = config.blog.postBasePath;
    post.load(file.path, URI, function(error) {
      if (error) {
        next(error);
        return;
      }
      post.presented = presentPost(post);
      next();
    });
  }).end(function(error) {
    posts = _.sortBy(posts, function(post) {
      return post.publish_date;
    }).reverse();
    posts.forEach(function (post, index) {
      postLinks[post.URI()] = {
        next: index > 0 ? posts[index - 1] : null,
        previous: index < posts.length ? posts[index + 1] : null
      };
    });
    callback(error, posts);
  });
}

function verifyPassword(password, hash, callback) {
  bcrypt.compare(password, hash, function(error, correctPassword) {
    if (error) {
      callback(error);
      return;
    }
    if (!correctPassword) {
      callback("incorrect password");
      return;
    }
    callback();
  });
}

function savePost(req, callback) {
  var post = new Post(req.params.blogSlug, req.body.title, new Date(), "md");
  post.content = (req.body.content || "").trim() + "\n";
  post.base = config.blog.postBasePath;
  post.save(callback);
}

function createPost(req, res, next) {
  var password = req.body.password;
  var work = [
    async.apply(fs.readFile, config.blog.hashPath, "utf8"),
    async.apply(verifyPassword, password),
    async.apply(savePost, req)
  ];
  async.waterfall(work, function(error, post) {
    if (error) {
      return res.status(500).send(error);
    }
    var response = post.metadata();
    response.uri = post.URI();
    res.send(response);
    loadBlog(post.blog, function(error, posts) {
      var blog;
      blog = blogIndicesBySlug[post.blog];
      blog.posts = posts;
      delete blog.cachedFeedXML;
    });
  });
}

function feed(req, res, next) {
  res.header("Content-Type", "text/xml");
  if (res.blog.cachedFeedXML) {
    return res.send(res.blog.cachedFeedXML);
  }
  var recentPosts = res.blog.posts.slice(0, 10);
  var locals = {
    title: res.blog.title,
    URI: res.blog.URI,
    pretty: true,
    posts: recentPosts
  };
  asyncjs.list(recentPosts).map(function(post, next) {
    var fakeRes;
    fakeRes = {
      post: post,
      viewPath: post.viewPath()
    };
    next(null, fakeRes);
    return;
  }).each(function(fakeRes, next) {
    html(req, fakeRes, next);
  }).each(function(fakeRes, next) {
    markdownToHTML(req, fakeRes, next);
  }).each(function(fakeRes, next) {
    middleware.domify(req, fakeRes, next);
  }).each(function(fakeRes, next) {
    middleware.flickr(req, fakeRes, next);
  }).each(function(fakeRes, next) {
    middleware.youtube(req, fakeRes, next);
  }).each(function(fakeRes, next) {
    fakeRes.post.content = fakeRes.html;
    next();
  }).end(function(error, fakeRes) {
    res.app.render("blogs/feed", locals, function(error, feedXML) {
      if (error) {
        next(error);
        return;
      }
      res.blog.cachedFeedXML = feedXML;
      res.send(feedXML);
    });
  });
}

function flushCache(req, res, next) {
  delete res.blog.cachedFeedXML;
  loadBlog(res.blog.URI, function(error, posts) {
    if (error) {
      next(error);
      return;
    }
    res.blog.posts = posts;
    res.redirect("/" + res.blog.URI);
  });
}

function setup(app) {
  var problog = new BlogIndex("problog", "Pete's Points");
  var persblog = new BlogIndex("persblog", "The Stretch of Vitality");
  blogIndicesBySlug[problog.URI] = problog;
  blogIndicesBySlug[persblog.URI] = persblog;
  function _load(blog, next) {
    loadBlog(blog.URI, function(error, posts) {
      blog.posts = posts;
      next(error);
    });
  }
  function doneLoading(error) {
    if (error) {
      throw error;
    }
    setup.loaded = true;
    setup.events.emit("ready");
  }
  async.forEach([problog, persblog], _load, doneLoading);
  app.use("/blogs", express.static(__dirname + "/browser"));
  var blogRoute = "/:blogSlug(persblog|problog)";
  app.get(blogRoute, loadBlogMW, function(req, res) {
    res.render("blogs/" + req.params.blogSlug, res.blog);
  });
  app.get(blogRoute + "/post", function(req, res) {
    res.render("blogs/post");
  });
  app.post(blogRoute + "/post", express.json(), createPost);
  app.get(blogRoute + "/feed", loadBlogMW, feed);
  app.get(blogRoute + "/flushCache}", loadBlogMW, flushCache);
  app.get(new RegExp("/(persblog|problog)/\\d{4}/\\d{2}/\\w+"), viewPostMiddleware);
  app.post("/convert", convertMiddleware);
}

module.exports = setup;
module.exports.events = new events.EventEmitter();
module.exports.presentPost = presentPost;
