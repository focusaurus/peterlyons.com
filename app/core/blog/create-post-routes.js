"use strict";
const {promisify} = require("util");
const bcrypt = require("bcryptjs");
const boom = require("boom");
const childProcess = require("child_process");
const config = require("../config-validate");
const fs = require("fs");
const path = require("path");
const postStore = require("./post-store");

const readFileAsync = promisify(fs.readFile);
const compareAsync = promisify(bcrypt.compare);
const execFileAsync = promisify(childProcess.execFile);

const newBlogPreparePath = path.join(
  __dirname,
  "../../../bin/new-blog-prepare.sh"
);
const newBlogFinalizePath = path.join(
  __dirname,
  "../../../bin/new-blog-finalize.sh"
);

async function verifyPasswordAsync(password, hash) {
  const correctPassword = await compareAsync(password, hash);
  if (!correctPassword) {
    throw boom.forbidden("incorrect password");
  }
  return correctPassword;
}

async function newBlogPrepare(request) {
  try {
    const io = await execFileAsync(newBlogPreparePath, []);
    request.log("blog", [
      {
        stdout: io.stdout.toString(),
        stderr: io.stderr.toString()
      },
      "new blog prepare succeeded"
    ]);
  } catch (error) {
    request.log(
      ["blog", "error"],
      [{err: error}, "Error preparing git repo for new blog"]
    );
    throw error;
  }
}

async function newBlogFinalize(request, password, post) {
  try {
    const io = await execFileAsync(newBlogFinalizePath, [password]);
    request.log("blog", [
      "new blog finalized successfully",
      {
        stdout: io.stdout.toString(),
        stderr: io.stderr.toString()
      }
    ]);
    return post;
  } catch (error) {
    request.log(
      ["blog", "error"],
      ["Error finalizing git commit/push for new blog", {error}]
    );
    throw error;
  }
}

async function createPost(request, h) {
  const {password, title, content} = request.payload;
  const hash = await readFileAsync(config.blog.hashPath, "utf8");
  await verifyPasswordAsync(password, hash);
  await newBlogPrepare(request);
  const blog = h.context;
  const post = {
    title,
    content: `${(content || "").trim()}\n`
  };
  const metadataPath = await postStore.save(blog.basePath, post);
  await newBlogFinalize(request, password, post);
  const loadedPost = await postStore.load(blog.prefix, metadataPath);
  blog.load(); // Don't await this on purpose
  return loadedPost;
}

module.exports = {
  handler: createPost,
  verifyPasswordAsync
};
