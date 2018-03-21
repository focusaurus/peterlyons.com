const tap = require("tap");

async function run(page) {
  await tap.test("should have the correct list of galleries", async test => {
    test.same(await page.$$eval("a.galleryLink", list => list.length), 87);
    test.same(
      await page.$eval("a.galleryLink", el => el.innerText),
      "Burning Man 2011"
    );
  });

  await tap.test("should have the correct thumbnails", async test => {
    test.same(await page.$$eval("a.thumbnail", list => list.length), 98);
    test.match(
      await page.$eval("a.thumbnail", el => el.href),
      "/photos?gallery=burning_man_2011&photo=001_hexayurt_model"
    );
  });
}

module.exports = {run, uri: "/photos"};
