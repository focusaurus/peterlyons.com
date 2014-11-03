#!/usr/bin/env node

var childProcess = require("child_process");
var commander = require("commander");
var fs = require("fs");
var mkdirp = require("mkdirp");
var path = require("path");

var Post = require("app/blogs/Post");

commander.version("0.0.1")
  .option("-f, --format [format]", "Post file format [md]", "md")
  .option("-b, --blog [persblog]", "blog name [persblog]", "persblog")
  .option("-t, --title [title]", "Post title")
  .option("-s, --slug [slug]", "Permalink URI (slug)")
  .parse(process.argv);

var post = new Post(
  commander.blog, commander.title, new Date(), commander.format);
post.name = commander.slug || post.name;
post.base = path.join(__dirname, "..", "..", "data", "posts");
var metaPath = path.join(post.base, post.metadataPath());
mkdirp.sync(path.dirname(metaPath));
var metadata = JSON.stringify(post.metadata()) + "\n";
fs.writeFileSync(metaPath, metadata);
childProcess.exec("subl " + post.viewPath());
