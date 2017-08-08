const expect = require("chaimel");
const testBlog = require("./test-blog");

describe("a blog feed XML", () => {
  let $ = null;
  before(async () => {
    await testBlog.load();
    $ = await testBlog.loadPage("/utb/feed");
  });

  it("should have an atom XML feed tag", () => {
    expect($("feed").length).toEqual(1);
  });

  it("should have the right feed > title content", () => {
    expect($("feed > title").text()).toEqual("Unit Test Blog 1");
  });

  it("should have 10 recent posts", () => {
    expect($("entry").length).toEqual(10);
  });

  it("should have the author", () => {
    expect($("author > name").text()).toEqual("Peter Lyons");
  });

  it("should have the self ref link", () => {
    expect($('link[rel="self"]').attr("href")).toEqual(
      "http://127.0.0.1/utb/feed"
    );
  });

  it("should have the post content", () => {
    // Post 8 should be index 3 because 11, 10, 9, 8
    expect($("entry > content")[3].children[0].data).toInclude(
      "Unit Test Post 8 content"
    );
  });
});
