"use strict";
const bcrypt = require("bcryptjs");
const createPost = require("./create-post-routes");
const tap = require("tap");
const testUtils = require("../test-utils");

let server;

tap.beforeEach(async () => {
  server = await require("./test-blog")();
});

/* eslint-disable no-sync */
const password = "unit test blog password";
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

tap.test("createPost.verifyPasswordAsync correct password", async test => {
  await createPost.verifyPasswordAsync(password, hash);
  test.end();
});

tap.test("createPost.verifyPasswordAsync incorrect password", async test => {
  try {
    await createPost.verifyPasswordAsync(`${password}NOPE`, hash);
    test.fail("Expected an exception");
  } catch (error) {
    test.ok(error);
    test.ok(error instanceof Error);
    test.end();
  }
});

tap.test("the blog post authoring/preview page", async test => {
  const $ = await testUtils.loadDom(server.info.uri, "/utb/post")
  testUtils.assertSelectors($, "section.preview", "textarea");
  test.end();
});
