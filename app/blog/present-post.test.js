const presentPost = require("./present-post");
const expect = require("chaimel");
const Post = require("./post");

const fakeBlog = {
  prefix: "/tmp"
};
describe("presentPost", () => {
  it("should format the date", () => {
    const presented = presentPost(
      new Post(fakeBlog, "foo", new Date(2014, 0, 31))
    );
    expect(presented.date).toEqual("Jan 31, 2014");
  });

  it("should trim the title", () => {
    const presented = presentPost(new Post(fakeBlog, " a "));
    expect(presented.title).toEqual("a");
  });
});
