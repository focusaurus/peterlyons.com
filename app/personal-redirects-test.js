const request = require("./request");

describe("personal URLs should redirect to .org", () => {
  const pages = [
    "/app/photos",
    "/bands",
    "/favorites",
    "/oberlin",
    "/persblog",
    "/photos"
  ];
  pages.forEach(page => {
    it(`${page} should redirect to .org`, done => {
      request
        .get(page)
        .expect(301)
        .expect("location", `https://peterlyons.org${page}`)
        .end(done);
    });
  });

  it("should maintain photo gallery path and query", done => {
    const page = "/app/photos?gallery=fall_2009&photo=020_paint_and_blinds";
    request
      .get(page)
      .expect(301)
      .expect("location", `https://peterlyons.org${page}`)
      .end(done);
  });
});
