const expect = require("chaimel");
const fs = require("fs");
const mktmp = require("mktmp");
const Post = require("./post");

/* eslint-disable no-sync */
const basePath = mktmp.createDirSync("unit-test-blog-XXXX");

const blog = {
  basePath,
  prefix: "/unit-test-blog"
};

const publishDate = new Date(2014, 0, 31);
const post = new Post(blog, "Unit Test Title", publishDate, "md");
post.content = "# Unit Test Post Content\n";

describe("Post model class", () => {
  it("should store constructor props and compute slug", () => {
    expect(post.title).toEqual("Unit Test Title");
    expect(post.publish_date).toEqual(publishDate);
    expect(post.name).toEqual("unit-test-title");
  });

  it("metadata should return the right fields", () => {
    const metadata = post.metadata();
    expect(metadata.format).toEqual("md");
    expect(metadata.title).toEqual("Unit Test Title");
    expect(metadata.publish_date).toEqual(publishDate);
    expect(metadata.name).toEqual("unit-test-title");
  });

  it("dirPath should be correct", () => {
    expect(post.dirPath()).toEqual(`${basePath}/2014/01`);
  });

  it("contentPath should be correct", () => {
    expect(post.contentPath()).toEqual(
      `${basePath}/2014/01/unit-test-title.md`
    );
  });

  it("metadataPath should be correct", () => {
    expect(post.metadataPath()).toEqual(
      `${basePath}/2014/01/unit-test-title.json`
    );
  });

  it("URI should be correct", () => {
    expect(post.uri()).toEqual("/unit-test-blog/2014/01/unit-test-title");
  });

  it("should handle non-existent metadata correctly", () => {
    const post2 = new Post();
    return post2.loadMetadata("/tmp/no-such-metadata.json").catch(error => {
      expect(error).toBeAnInstanceOf(Error);
      expect(error.code).toEqual("ENOENT");
    });
  });

  it("should save properly", () =>
    post.save().then(() => {
      const content = fs.readFileSync(post.contentPath(), "utf-8");
      expect(content).toEqual("# Unit Test Post Content\n");
      const metadataString = fs.readFileSync(post.metadataPath(), "utf-8");
      const metadata = JSON.parse(metadataString);
      expect(metadata).toHaveProperty("format", "md");
      expect(metadata).toHaveProperty("name", "unit-test-title");
      expect(metadata).toHaveProperty("title", "Unit Test Title");
      expect(metadata).toHaveProperty("publish_date");
    }));
});
