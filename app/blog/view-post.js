"use strict";
const postStore = require("./post-store");
const presentPost = require("./present-post");

async function viewPost(request, h) {
  const blog = h.context;
  const post = blog.findPostByUri(request.url.pathname);
  if (!post) {
    // Slice removes the leading / so the path is relative,
    // which is what we want since the blug plugin establishes the base path
    return h.file(request.url.pathname.slice(1), {confine: false});
  }
  await postStore.loadContent(post);
  return h.view("blog/view-post", {blog, post: presentPost.asObject(post)});
}

module.exports = viewPost;
