const request = require("./request");

describe("legacy URLs with .html suffix should redirect", () => {
  const pages = ["/bands.html", "/oberlin.html"];
  pages.forEach(page => {
    it(`${page} should redirect without .html`, done => {
      const noHtml = page.slice(0, page.length - ".html".length);
      request.get(page).expect(301).expect("location", noHtml).end(done);
    });
  });
});
