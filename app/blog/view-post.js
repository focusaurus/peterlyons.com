"use strict";
const boom = require("boom");
const path = require("path");
const postStore = require("./post-store");
const presentPost = require("./present-post");

async function viewPost(request, h) {
  const blog = h.context;
  const metadataPath = path.join(
    blog.basePath,
    `${request.params.year}/${request.params.month}/${request.params.slug}.json`
  );
  let post;
  try {
    post = await postStore.load(blog.prefix, metadataPath);
    await postStore.loadContent(post);
  } catch (error) {
    if (error && error.code === "ENOENT") {
      throw boom.notFound(request.path);
    }
    throw error;
  }
  post = presentPost.asObject(post);
  blog.assignNextPrevious(post);
  return h.view("blog/view-post", {blog, post});
}

module.exports = viewPost;
