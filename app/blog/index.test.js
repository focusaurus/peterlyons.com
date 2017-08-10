const Blog = require("./");
const expect = require("chaimel");
const testBlog = require("./test-blog");

before(() => testBlog.load());

describe("Blog constructor", () => {
  it("should accept and store options properly", () => {
    const options = {
      title: "Unit Test Title",
      subtitle: "Unit Test Subtitle",
      prefix: "/utb1",
      basePath: "/tmp/unit-test-base-path"
    };
    const blog = new Blog(options);
    expect(blog.basePath).toEqual(options.basePath);
    expect(blog.prefix).toEqual(options.prefix);
    expect(blog.subtitle).toEqual(options.subtitle);
    expect(blog.title).toEqual(options.title);
  });
});

describe("blog.load", () => {
  it("should link next/previous posts", () => {
    const last = testBlog.posts[0];
    const penultimate = testBlog.posts[1];
    const first = testBlog.posts[testBlog.posts.length - 1];
    expect(first.previous).notToExist();
    expect(first.next).toDeepEqual({
      title: "Unit Test Post 2",
      uri: "/utb/2015/12/unit-test-post-2"
    });
    expect(penultimate.previous).toDeepEqual({
      title: "Unit Test Post 9",
      uri: "/utb/2016/01/unit-test-post-9"
    });
    expect(penultimate.next).toDeepEqual({
      title: "Unit Test Post 11",
      uri: "/utb/2016/01/unit-test-post-11"
    });
    expect(last.previous).toDeepEqual({
      title: "Unit Test Post 10",
      uri: "/utb/2016/01/unit-test-post-10"
    });
    expect(last.next).notToExist();
  });
});

describe("a request for a non-existent blog post name", () => {
  it("should 404", () =>
    testBlog.request.get("/utb/2014/01/no-such-post").expect(404));
});

describe("a static image request", () => {
  it("should 200", () =>
    testBlog.request
      .get("/utb/images/one.png")
      .expect(200)
      .expect("Content-Type", "image/png"));
});
