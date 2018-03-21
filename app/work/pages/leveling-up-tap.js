"use strict";
const tap = require("tap");
const testUtils = require("../../core/test-utils");

let uri;

tap.beforeEach(async () => {
  uri = await require("../../core/get-test-uri")(require("../server"));
});

tap.test("the leveling up article", async test => {
  const $ = await testUtils.loadDom(uri, "/leveling-up");
  testUtils.assertSelectors($, "#pillar1", "#pillar2", "#pillar3");
  testUtils.assertSubstrings($, "operating system", "thousands");
  test.match($("title").text(), /Leveling Up/);
  test.end();
});
