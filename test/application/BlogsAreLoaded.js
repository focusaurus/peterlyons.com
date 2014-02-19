var blogRoutes = require("app/blogs/blogRoutes");

describe("wait for blogs to be loaded from disk", function () {
  it("should wait for blogRoutes.ready event", function(done) {
    this.slow(1000);
    if (blogRoutes.loaded) {
      done();
      return;
    }
    blogRoutes.events.on("ready", done);
  });
});
