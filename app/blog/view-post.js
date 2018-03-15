"use strict";
const boom = require("boom");
const presentPost = require("./present-post");

async function viewPost(request, h) {
  const blog = h.context;
  const uri = `${blog.prefix}/${request.params.year}/${request.params.month}/${
    request.params.slug
  }`;

  const post = blog.findPostByUri(uri);
  if (!post) {
    throw boom.notFound(request.path);
  }
  return h.view("blog/view-post", {blog, post: presentPost.asObject(post)});
}

module.exports = viewPost;
