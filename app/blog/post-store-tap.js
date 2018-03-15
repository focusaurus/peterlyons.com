"use strict";
const fs = require("fs");
const mktmp = require("mktmp");
const path = require("path");
const postStore = require("./post-store");
const tap = require("tap");

/* eslint-disable no-sync */
const basePath = mktmp.createDirSync("unit-test-blog-XXXX");

const blog = {
  basePath,
  prefix: "/unit-test-blog"
};

tap.test("postStore.load should load all properties properly", async test => {
  const metadataPath = path.join(
    __dirname,
    "unit-test-blog1/2015/12/unit-test-post-1.json"
  );

  const post = await postStore.load(blog.prefix, metadataPath);
  test.match(post, {title: "Unit Test Post 1"});
  test.match(post, {name: "unit-test-post-1"});
  test.match(post, {metadataPath});
  test.notOk(post.format);
  test.match(post, {uri: "/unit-test-blog/2015/12/unit-test-post-1"});
  test.match(post, {dirPath: path.dirname(metadataPath)});
  test.match(post, {monthPath: "2015/12"});
  test.match(post, {contentPath: metadataPath.replace(/\.json$/, ".md")});
  test.match(post.publish_date, new Date("2015-12-01T15:54:53.298Z"));
  test.ok(post.publish_date instanceof Date);
  test.end();
});

tap.test("postStore.load non-existent metadata", async test => {
  try {
    await postStore.load("/unit-test-blog", "/tmp/no-such-metadata.json");
  } catch (error) {
    test.ok(error);
    test.ok(error instanceof Error);
    test.same(error.code, "ENOENT");
  } finally {
    test.end();
  }
});

tap.test("postStore.loadContent should load the content", async test => {
  const metadataPath = path.join(
    __dirname,
    "unit-test-blog1/2015/12/unit-test-post-1.json"
  );

  const post = await postStore.load(blog.prefix, metadataPath);
  await postStore.loadContent(post);
  test.ok(post.content.includes("Unit Test Post 1 content."));
});

tap.test("postStore.save should save properly", async test => {
  const publishDate = new Date(2017, 0, 1);
  const post = {
    content: "Unit Test Content 20",
    publish_date: publishDate,
    title: "Unit Test Title 20"
  };
  const metadataPath = await postStore.save(basePath, post);
  test.same(
    metadataPath,
    path.join(basePath, "2017/01/unit-test-title-20.json")
  );
  const metadataString = fs.readFileSync(metadataPath, "utf-8");
  const metadata = JSON.parse(metadataString);
  test.match(metadata, {
    name: "unit-test-title-20",
    publish_date: publishDate.toISOString(),
    title: post.title
  });
  const content = fs.readFileSync(
    metadataPath.replace(/\.json$/, ".md"),
    "utf-8"
  );
  test.same(content, post.content);
});
