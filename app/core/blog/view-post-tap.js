"use strict";
const tap = require("tap");
const testBlogHapi = require("./test-blog");
const testUtils = require("../test-utils");

let server;
tap.beforeEach(async () => {
  server = await testBlogHapi();
});

tap.test("a blog post page", async test => {
  const $ = await testUtils.loadDom(
    server.info.uri,
    "/utb/2015/12/unit-test-post-1"
  );
  test.match(
    $("title").text(),
    /Unit Test Post 1/i,
    "should have the right title"
  );
  test.match(
    $("article").text(),
    /Unit Test Post 1 Content/i,
    "should have the post content"
  );
  test.same(
    $("a.blogIndex").attr("href"),
    "/utb",
    "should have a link to the blog index"
  );
  test.same(
    $("a.previous").length,
    0,
    "first post should NOT have a link to previous"
  );

  test.same(
    $("a.next").attr("href"),
    "/utb/2015/12/unit-test-post-2",
    "should have a link to the next post"
  );

  test.same($("flickr").length, 0, "should process a flickr tag");
  test.same($("youtube").length, 0, "should process a youtube tag");
  test.ok($("iframe").length > 0, "should process a flickr tag");

  test.same($("#disqus_thread").length, 1, "should have disqus comments");
  // look for disqus_shortname
  test.ok(
    $("#comments")
      .html()
      .includes("peterlyons-utb")
  );

  test.end();
});

tap.test("the most recent blog post", async test => {
  const $ = await testUtils.loadDom(
    server.info.uri,
    "/utb/2016/01/unit-test-post-11"
  );

  test.match(
    $("title").text(),
    /Unit Test Post 11/i,
    "should have the post title"
  );

  test.same(
    $("a.blogIndex").attr("href"),
    "/utb",
    "should have a link to the blog index"
  );

  test.same(
    $("a.previous").attr("href"),
    "/utb/2016/01/unit-test-post-10",
    "should have a link to the previous post"
  );

  test.same($("a.next").length, 0, "last post should NOT have a link to next");
});

tap.test("a blog post in the middle", async test => {
  const $ = await testUtils.loadDom(
    server.info.uri,
    "/utb/2015/12/unit-test-post-2"
  );

  test.match(
    $("title").text(),
    /Unit Test Post 2/i,
    "should have the post title"
  );

  test.same(
    $("a.blogIndex").attr("href"),
    "/utb",
    "should have a link to the blog index"
  );

  test.same(
    $("a.previous").attr("href"),
    "/utb/2015/12/unit-test-post-1",
    "should have a link to the previous post"
  );
  test.same(
    $("a.next").attr("href"),
    "/utb/2015/12/unit-test-post-3",
    "should have a link to the next post"
  );
});
