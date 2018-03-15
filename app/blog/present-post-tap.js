"use strict";
const cheerio = require("cheerio");
const presentPost = require("./present-post");
const tap = require("tap");
const testUtils = require("../test-utils");

tap.test("presentPost.asObject should format the date", test => {
  const presented = presentPost.asObject({
    publish_date: new Date(2014, 0, 31)
  });
  test.same(presented.date, "January 31, 2014");
  test.end();
});

tap.test("presentPost.asObject should format the default date", test => {
  const presented = presentPost.asObject({});
  test.ok(presented.date.length > 0);
  test.end();
});

tap.test("presentPost.asObject should trim the title", test => {
  const presented = presentPost.asObject({title: " a "});
  test.same(presented.title, "a");
  test.end();
});

tap.test("presentPost.asObject should trim the name", test => {
  const presented = presentPost.asObject({name: " a "});
  test.same(presented.name, "a");
  test.end();
});

tap.test("presentPost.asObject should preserve next/previous", test => {
  const next = {title: "unit-test-next", uri: "/utb/unit-test-next"};
  const previous = {
    title: "unit-test-previous",
    uri: "/utb/unit-test-previous"
  };

  const presented = presentPost.asObject({next, previous});
  test.same(presented.next, next);
  test.same(presented.previous, previous);
  test.end();
});

tap.test("presentPost.asObject should render markdown", test => {
  const presented = presentPost.asObject({content: "# header\n"});
  test.same(presented.html, '<h1 id="header">header</h1>\n');
  test.end();
});

tap.test("presentPost.asObject should render fomark", test => {
  const presented = presentPost.asObject({
    content: `
  ![youtube](//testyoutube/1234)
  ![flickr](https://www.flickr.com/photos/88096431@N00/sets/72157645234728466/)
  `
  });
  const $ = cheerio.load(presented.html);
  testUtils.assertSelectors(
    $,
    'iframe[src="//testyoutube/1234"]',
    'iframe[src="https://www.flickr.com/slideShow/index.gne?user_id=88096431%40N00&set_id=72157645234728466"]'
  );
  test.end();
});
