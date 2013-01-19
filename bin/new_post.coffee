#!/usr/bin/env coffee
path = require "path"
child_process = require "child_process"
commander = require "commander"
fs = require "fs"
mkdirp = require "mkdirp"

Post = require("../app/models/post").Post
commander
  .version("0.0.1")
  .option("-f, --format [format]", "Post file format [md]", "md")
  .option("-b, --blog [persblog]", "blog name [persblog]", "persblog")
  .option("-t, --title [title]", "Post title")
  .option("-s, --slug [slug]", "Permalink URI (slug)")
  .parse(process.argv);

post = new Post commander.blog, commander.title, new Date(), commander.format
post.name = commander.slug || post.name
post.base = path.join __dirname, "..", "app", "posts"
metaPath = path.join post.base, post.metadataPath()
mkdirp.sync path.dirname(metaPath)
metadata = JSON.stringify(post.metadata()) + "\n"
fs.writeFileSync metaPath, metadata
child_process.exec "subl #{post.viewPath()}", ->
