"use strict";

async function feed(request, h) {
  const blog = h.context;
  const {feedPosts} = await request.server.methods.loadPosts();
  const locals = {
    blog,
    pretty: true,
    posts: feedPosts,
    hostname: request.url.hostname
  };
  return h.view("blog/feed", locals);
}

module.exports = feed;
