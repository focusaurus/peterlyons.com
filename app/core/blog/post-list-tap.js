"use strict";
const tap = require("tap");
const testUtils = require("../test-utils");

let server;
let $;

tap.beforeEach(async () => {
  server = await require("./test-blog")();
  $ = await testUtils.loadDom(server.info.uri, "/utb");
});

tap.test("blog post list page", test => {
  test.same($(".postTitle").length, 11, "should list all the posts");
  test.ok($(".postDate").length > 0);
  const date = $(".postDate")
    .last()
    .html();
  test.match(date, /December 01, 2015/, "should have nicely formatted dates");
  test.end();
});
