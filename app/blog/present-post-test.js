const presentPost = require("./present-post");
const expect = require("chaimel");
const testUtils = require("../test-utils");
const cheerio = require("cheerio");

describe("presentPost.asObject", () => {
  it("should format the date", () => {
    const presented = presentPost.asObject({
      publish_date: new Date(2014, 0, 31)
    });
    expect(presented.date).toEqual("January 31, 2014");
  });

  it("should format the default date", () => {
    const presented = presentPost.asObject({});
    expect(presented.date.length).toBeGreaterThan(0);
  });

  it("should trim the title", () => {
    const presented = presentPost.asObject({title: " a "});
    expect(presented.title).toEqual("a");
  });

  it("should trim the name", () => {
    const presented = presentPost.asObject({name: " a "});
    expect(presented.name).toEqual("a");
  });

  it("should render markdown", () => {
    const presented = presentPost.asObject({content: "# header\n"});
    expect(presented.html).toEqual('<h1 id="header">header</h1>\n');
  });

  it("should render fomark", () => {
    const presented = presentPost.asObject({
      content: `
![youtube](//testyoutube/1234)
![flickr](https://www.flickr.com/photos/88096431@N00/sets/72157645234728466/)
`
    });
    const $ = cheerio.load(presented.html);
    testUtils.assertSelectors(
      $,
      'iframe[src="//testyoutube/1234"]',
      'iframe[src="https://www.flickr.com/slideShow/index.gne?user_id=88096431%40N00&set_id=72157645234728466"]'
    );
  });
});
