const presentPost = require("./present-post");
const expect = require("chaimel");

describe("presentPost", () => {
  it("should format the date", () => {
    const presented = presentPost({
      publish_date: new Date(2014, 0, 31),
      title: "foo"
    });
    expect(presented.date).toEqual("Jan 31, 2014");
  });
  it("should trim the title", () => {
    const presented = presentPost({
      publish_date: new Date(2014, 0, 31),
      title: " a "
    });
    expect(presented.title).toEqual("a");
  });
});
