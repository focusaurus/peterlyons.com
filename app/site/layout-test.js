const _ = require("lodash");
const config = require("config3");
const expect = require("chaimel");
const pack = require("../../package");
const request = require("../request");
const testUtils = require("../test-utils");

describe("the main layout", () => {
  let $ = null;
  before(done => {
    request.loadPage("/", (error, dom) => {
      $ = dom;
      done(error);
    });
  });
  it("should have the google fonts", () => {
    const selector = "link[rel=stylesheet]";
    testUtils.assertSelectors($, selector);
    const hrefs = [];
    $(selector).each((index, item) => {
      hrefs.push($(item).attr("href"));
    });
    expect(
      _.some(hrefs, href => href.indexOf("fonts.googleapis.com") >= 0)
    ).toBeTrue();
  });

  it("should have the key structural elements", () => {
    testUtils.assertSelectors(
      $,
      "header h1",
      "body .content",
      "nav.site",
      ".license"
    );
  });

  it("should include the pro nav links", () => {
    const body = $.html();
    expect(body).toInclude("Code Conventions");
    expect(body).toInclude("Career");
    expect(body).toInclude("Projects");
  });

  it("should have the normal title", () => {
    expect($("title").text()).toEqual("Peter Lyons: node.js expert consultant");
  });

  it("should include the javascript with cachebusting", () => {
    testUtils.assertSelectors($, `script[src='/plws.js?v=${pack.version}']`);
  });

  it("should have the browserified JavaScript", done => {
    request
      .get(`/plws.js?v=${pack.version}`)
      .expect(200)
      .expect("Content-Type", "application/javascript; charset=UTF-8")
      .expect("Content-Encoding", "gzip")
      .end(done);
  });

  it("should include HTML comment with app version", () => {
    testUtils.assertSelectors($, "meta[name=x-app-version]");
    expect($("meta[name=x-app-version]").attr("content")).toEqual(pack.version);
  });
});

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
