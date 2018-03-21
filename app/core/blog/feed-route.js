"use strict";

async function feed(request, h) {
  const blog = h.context;
  const posts = await request.server.methods.loadPosts();
  const locals = {
    blog,
    pretty: true,
    posts,
    hostname: (request.headers.host || "127.0.0.1").split(":", 1)[0]
  };
  return h.view("core/blog/feed", locals);
}

module.exports = feed;
