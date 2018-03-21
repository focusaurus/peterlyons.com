"use strict";
const getTestUri = require("./get-test-uri");
const pack = require("../../package");
const request = require("supertest");
const tap = require("tap");
const testUtils = require("./test-utils");

let uri;
let $;
tap.beforeEach(async () => {
  uri = await getTestUri(require("../work/server"));
  $ = await testUtils.loadDom(uri, "/");
});

tap.test("the main layout", async test => {
  const selector = "link[rel=stylesheet]";
  testUtils.assertSelectors($, selector);
  const hrefs = [];
  $(selector).each((index, item) => {
    hrefs.push($(item).attr("href"));
  });
  test.ok(
    hrefs.some(href => href.indexOf("fonts.googleapis.com") >= 0),
    "should have the google fonts"
  );
  // should have the key structural elements
  testUtils.assertSelectors(
    $,
    "header h1",
    "body .content",
    "nav.site",
    ".license"
  );
  // should include the pro nav links
  const body = $.html();
  test.ok(body.includes("Code Conventions"));
  test.ok(body.includes("Career"));
  test.ok(body.includes("Projects"));
  test.same(
    $("title").text(),
    "Peter Lyons: node.js expert consultant",
    "should have the normal title"
  );
  // should include the javascript with cachebusting
  testUtils.assertSelectors($, `script[src='/plws.js?v=${pack.version}']`);

  // should include HTML comment with app version
  testUtils.assertSelectors($, "meta[name=x-app-version]");
  test.same($("meta[name=x-app-version]").attr("content"), pack.version);

  test.end();
});

tap.test("should have the browserified JavaScript", test => {
  request(uri)
    .get(`/plws.js?v=${pack.version}`)
    .expect(200)
    .expect("Content-Type", "application/javascript; charset=utf-8")
    .expect("Content-Encoding", "gzip")
    .end(error => {
      test.error(error);
      test.end();
    });
});
