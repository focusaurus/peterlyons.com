const expect = require("chaimel");
const fs = require("fs");
const mktmp = require("mktmp");
const path = require("path");
const postStore = require("./post-store");

/* eslint-disable no-sync */
const basePath = mktmp.createDirSync("unit-test-blog-XXXX");

const blog = {
  basePath,
  prefix: "/unit-test-blog"
};

describe("post.load", () => {
  it("should load all properties properly", () => {
    const metadataPath = path.join(
      __dirname,
      "unit-test-blog1/2015/12/unit-test-post-1.json"
    );

    return postStore.load(blog.prefix, metadataPath).then(post => {
      expect(post).toHaveProperty("title", "Unit Test Post 1");
      expect(post).toHaveProperty("name", "unit-test-post-1");
      expect(post).toHaveProperty("metadataPath", metadataPath);
      expect(post).notToHaveProperty("format");
      expect(post).toHaveProperty(
        "uri",
        "/unit-test-blog/2015/12/unit-test-post-1"
      );
      expect(post).toHaveProperty("dirPath", path.dirname(metadataPath));
      expect(post).toHaveProperty("monthPath", "2015/12");
      expect(post).toHaveProperty(
        "contentPath",
        metadataPath.replace(/\.json$/, ".md")
      );
      expect(post.publish_date).toDeepEqual(
        new Date("2015-12-01T15:54:53.298Z")
      );
      expect(post.publish_date).toBeAnInstanceOf(Date);
    });
  });

  it("should handle non-existent metadata correctly", () =>
    postStore
      .load("/unit-test-blog", "/tmp/no-such-metadata.json")
      .catch(error => {
        expect(error).toBeAnInstanceOf(Error);
        expect(error.code).toEqual("ENOENT");
      }));
});

describe("post.loadContent", () => {
  it("should load all properties properly", () => {
    const metadataPath = path.join(
      __dirname,
      "unit-test-blog1/2015/12/unit-test-post-1.json"
    );

    return postStore.load(blog.prefix, metadataPath).then(async post => {
      await postStore.loadContent(post);
      expect(post.content).toInclude("Unit Test Post 1 content.");
    });
  });
});

describe("post.save", () => {
  it("should save properly", () => {
    const publishDate = new Date(2017, 0, 1);
    const post = {
      content: "Unit Test Content 20",
      publish_date: publishDate,
      title: "Unit Test Title 20"
    };
    return postStore.save(basePath, post).then(metadataPath => {
      expect(metadataPath).toEqual(
        path.join(basePath, "2017/01/unit-test-title-20.json")
      );
      const metadataString = fs.readFileSync(metadataPath, "utf-8");
      const metadata = JSON.parse(metadataString);
      expect(metadata).toDeepEqual({
        name: "unit-test-title-20",
        publish_date: publishDate.toISOString(),
        title: post.title
      });
      const content = fs.readFileSync(
        metadataPath.replace(/\.json$/, ".md"),
        "utf-8"
      );
      expect(content).toEqual(post.content);
    });
  });
});
