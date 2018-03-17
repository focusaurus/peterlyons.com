"use strict";
const pack = require("../../package");
const request = require("supertest");
const tap = require("tap");
const testUtils = require("../test-utils");

let server;
let $;
tap.beforeEach(async () => {
  if (server) {
    return;
  }
  server = await require("../test-hapi-server")();
  $ = await testUtils.loadDom(server.info.uri, "/");
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
  request(server.info.uri)
    .get(`/plws.js?v=${pack.version}`)
    .expect(200)
    .expect("Content-Type", "application/javascript; charset=utf-8")
    .expect("Content-Encoding", "gzip")
    .end(error => {
      test.error(error);
      test.end();
    });
});

/*

describe("analytics snippet", () => {
  before(() => {
    config.analytics.enabled = true;
    config.analytics.proCode = "UNIT_TEST";
  });

  after(() => {
    config.analytics.enabled = false;
    config.analytics.code = "";
  });

  it("should include the analytics snippet when enabled", done => {
    request.loadPage("/", (error, $) => {
      expect(error).notToExist();
      const selector = "script[data-id=analytics]";
      testUtils.assertSelectors($, selector);
      expect($(selector).html()).to.include("UNIT_TEST");
      done();
    });
  });
});
*/
