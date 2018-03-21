"use strict";
const tap = require("tap");
const slug = require("./slug");

tap.test("slug should replace URL-unfriendly characters", async test => {
  test.same(slug("space to dash"), "space-to-dash");
  test.same(slug("no apostrophe's"), "no-apostrophes");
  test.same(slug("Quick Thoughts: Hey There"), "quick-thoughts-hey-there");
  test.same(slug("dot.to.dash"), "dot-to-dash");
  test.same(slug("double--dash--to--dash"), "double-dash-to-dash");
  test.same(slug("no!bang"), "nobang");
  test.same(slug("no trailing dash-"), "no-trailing-dash");
  test.same(slug("LOWERCASE"), "lowercase");
  test.end();
});

tap.test("slug should normalize to lowercase", async test => {
  test.same(slug("LOWERCASE"), "lowercase");
  test.end();
});

tap.test("slug should handle null", async test => {
  test.same(slug(), "");
  test.same(slug(null), "");
  test.end();
});
