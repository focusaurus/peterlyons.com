const clear = require("../clear");
const tap = require("tap");

async function getTotal(page) {
  return page.$eval(".plus-party .total", el => el.innerText);
}

async function run(page) {
  await tap.test(
    "plus-party should have the correct initial total",
    async test => {
      test.same(await getTotal(page), "6.00");
      test.end();
    }
  );

  await tap.test("plus-party should calculate total correctly", async test => {
    await clear(page, ".plus-party textarea");
    await page.type(".plus-party textarea", "5 6 7.2");
    await page.waitFor(1500); // total is debounced
    test.same(await getTotal(page), "18.20");
    test.end();
  });

  await tap.test("should parse out numbers correctly", async test => {
    await clear(page, ".plus-party textarea");
    await page.type(".plus-party textarea", "nope 42 biscuits 7 8.5");
    await page.waitFor(2000); // total is debounced
    const parsed = await page.$eval("ul", el => [
      el.children[0].innerText,
      el.children[1].innerText,
      el.children[2].innerText
    ]);
    test.match(parsed, ["42", "7", "8.5"]);
  });
}

module.exports = {run, uri: "/plus-party"};
