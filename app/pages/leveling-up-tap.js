"use strict";
const tap = require("tap");
const testUtils = require("../test-utils");

let uri;

tap.beforeEach(async () => {
  uri = await require("../test-hapi-server")();
});

tap.test("the leveling up article", async test => {
  const $ = await testUtils.loadDom(server.info.uri, "/leveling-up");
  testUtils.assertSelectors($, "#pillar1", "#pillar2", "#pillar3");
  testUtils.assertSubstrings($, "operating system", "thousands");
  test.match($("title").text(), /Leveling Up/);
  test.end();
});
