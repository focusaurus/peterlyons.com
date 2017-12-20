const testBlog = require("./test-blog");
const expect = require("chaimel");

describe("a blog post list page", () => {
  let $ = null;
  before(async () => {
    await testBlog.load();
    $ = await testBlog.loadPage("/utb");
  });

  it("should have nicely formatted dates", () => {
    expect($(".postDate")).notToHaveLength(0);
    const date = $(".postDate").last().html();
    expect(date).toMatch(/December 01, 2015/);
  });

  it("should include all the posts", () => {
    expect($(".postTitle").length).toEqual(11);
  });
});
