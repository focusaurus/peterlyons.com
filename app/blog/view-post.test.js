const expect = require("chaimel");
const testBlog = require("./test-blog");

describe("a blog post page", () => {
  let $ = null;
  before(async () => {
    await testBlog.load();
    $ = await testBlog.loadPage("/utb/2015/12/unit-test-post-1");
  });

  it("should have the post title", () => {
    expect($("title").text()).toMatch(/Unit Test Post 1/i);
  });

  it("should have the post content", () => {
    expect($("article").text()).toMatch(/Unit Test Post 1 Content/i);
  });

  it("should have a link to the blog index", () => {
    expect($("a.blogIndex").attr("href")).toEqual("/utb");
  });

  it("first post should NOT have a link to previous", () => {
    expect($("a.previous").length).toEqual(0);
  });

  it("should have a link to the next post", () => {
    expect($("a.next").attr("href")).toEqual("/utb/2015/12/unit-test-post-2");
  });

  it("should process a flickr tag", () => {
    expect($("flickr")).toHaveLength(0);
    expect($("iframe")).notToHaveLength(0);
  });

  it("should process a youtube tag", () => {
    expect($("youtube")).toHaveLength(0);
    expect($("iframe")).notToHaveLength(0);
  });

  it("should have disqus comments", () => {
    expect($("#disqus_thread").length).toEqual(1);
    // look for disqus_shortname
    expect($("#comments").html()).toContain("peterlyons-utb");
  });
});

describe("the most recent blog post", () => {
  let $ = null;
  before(async () => {
    await testBlog.load();
    $ = await testBlog.loadPage("/utb/2016/01/unit-test-post-11");
  });

  it("should have the post title", () => {
    expect($("title").text()).toMatch(/Unit Test Post 11/i);
  });

  it("should have a link to the blog index", () => {
    expect($("a.blogIndex").attr("href")).toEqual("/utb");
  });

  it("should have a link to the previous post", () => {
    expect($("a.previous").attr("href")).toEqual(
      "/utb/2016/01/unit-test-post-10"
    );
  });

  it("last post should NOT have a link to next", () => {
    expect($("a.next").length).toEqual(0);
  });
});

describe("a blog post in the middle", () => {
  let $ = null;
  before(async () => {
    await testBlog.load();
    $ = await testBlog.loadPage("/utb/2015/12/unit-test-post-2");
  });

  it("should have the post title", () => {
    expect($("title").text()).toMatch(/Unit Test Post 2/i);
  });

  it("should have a link to the blog index", () => {
    expect($("a.blogIndex").attr("href")).toEqual("/utb");
  });

  it("should have a link to the previous post", () => {
    expect($("a.previous").attr("href")).toEqual(
      "/utb/2015/12/unit-test-post-1"
    );
  });

  it("should have a link to the next post", () => {
    expect($("a.next").attr("href")).toEqual("/utb/2015/12/unit-test-post-3");
  });
});
