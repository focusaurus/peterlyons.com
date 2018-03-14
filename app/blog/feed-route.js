"use strict";

async function feed(request, h) {
  const blog = h.context;
  const {feedPosts} = await request.server.methods.loadPosts();
  const locals = {
    blog,
    pretty: true,
    posts: feedPosts,
    hostname: (request.headers.host || "127.0.0.1").split(":", 1)[0]
  };
  return h.view("blog/feed", locals);
}

module.exports = feed;
