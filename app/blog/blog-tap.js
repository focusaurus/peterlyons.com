"use strict";
const tap = require("tap");
const path = require("path");
const Blog = require("./blog");

let blog;
const options = {
  basePath: path.join(__dirname, "unit-test-blog1"),
  staticPath: path.join(__dirname, "unit-test-blog1"),
  title: "Unit Test Blog 1",
  prefix: "/utb",
  subtitle: "Unit Test Subtitle 1"
};

tap.beforeEach(async () => {
  blog = new Blog(options);
});

tap.test("Blog constructor should accept and store options", test => {
  test.same(blog.basePath, options.basePath);
  test.same(blog.prefix, options.prefix);
  test.same(blog.subtitle, options.subtitle);
  test.same(blog.title, options.title);
  test.end();
});

tap.test("blog.load() should load and link the posts", async test => {
  await blog.load();
  const {posts} = blog;
  const last = posts[0];
  const penultimate = posts[1];
  const first = posts[posts.length - 1];
  test.notOk(first.previous);
  test.match(first.next, {
    title: "Unit Test Post 2",
    uri: "/utb/2015/12/unit-test-post-2"
  });
  test.match(penultimate.previous, {
    title: "Unit Test Post 9",
    uri: "/utb/2016/01/unit-test-post-9"
  });
  test.match(penultimate.next, {
    title: "Unit Test Post 11",
    uri: "/utb/2016/01/unit-test-post-11"
  });
  test.match(last.previous, {
    title: "Unit Test Post 10",
    uri: "/utb/2016/01/unit-test-post-10"
  });
  test.notOk(last.next);
  test.end();
});
