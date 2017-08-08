const cheerio = require("cheerio");
const expect = require("chaimel");
const request = require("supertest")(process.env.URL);
const testUtils = require("../test-utils");
const smokeTests = require("../smoke-tests");

const configs = [
  ["/app/photos?gallery=burning_man_2011", /Gallery/],
  ["/persblog", /travel/],
  ["/persblog/2007/10/hometown-dracula", /Randall/]
];

smokeTests("persblog smoke tests", process.env.URL, configs);

describe("the photos page", () => {
  let $ = null;

  before(done => {
    request
      .get("/app/photos?gallery=burning_man_2011")
      .expect(200)
      .end((error, res) => {
        expect(error).notToExist();
        $ = cheerio.load(res.text);
        done(error);
      });
  });

  it("should have the photo surrounding structure", () => {
    testUtils.assertSelectors(
      $,
      "h1#photo",
      "figure",
      "figcaption",
      "#nextPrev",
      "a.thumbnail"
    );
  });

  it("should redirect to the newest gallery", done => {
    request
      .get("/app/photos")
      .expect(302)
      .expect("Location", "/photos?gallery=burning_man_2011")
      .end(done);
  });
});
