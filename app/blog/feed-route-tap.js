"use strict";
const tap = require("tap");
const testUtils = require("../test-utils");

let server;

tap.beforeEach(async () => {
  server = await require("./test-blog-hapi")();
});

tap.test("blog feed XML", async test => {
  const $ = await testUtils.loadDom(server.info.uri, "/utb/feed");
  testUtils.assertSelectors($, "feed");
  test.same(
    $("feed > title").text(),
    "Unit Test Blog 1",
    "should have the right title"
  );
  test.same($("entry").length, 10, "should have 10 recent posts");
  test.same(
    $("author > name").text(),
    "Peter Lyons",
    "should have the correct author"
  );

  test.same(
    $('link[rel="self"]').attr("href"),
    "https://127.0.0.1/utb/feed",
    "should have the self ref link"
  );
  // Post 8 should be index 3 because 11, 10, 9, 8
  test.ok(
    $("entry > content")[3].children[0].data.includes(
      "Unit Test Post 8 content"
    ),
    "should have the post content"
  );
  test.end();
});
