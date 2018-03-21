const tap = require("tap");

async function getTotal(page) {
  return page.$eval(".plus-party .total", el => el.textContent);
}

async function input(page, text) {
  await page.$eval(".plus-party textarea", el => {
    el.value = "";
  });
  await page.type(".plus-party textarea", text, {delay: 10}); // force input event
  await page.waitFor(50);
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
    await input(page, "5 6 7.3");
    test.same(await getTotal(page), "18.30");
    test.end();
  });

  await tap.test("should parse out numbers correctly", async test => {
    // page.on("console", msg => console.log(msg.args.join(" ")));
    await input(page, "nope 42 biscuits 7 8.5");
    const parsed = await page.$eval(".plus-party ul", el => [
      el.children[0].innerText,
      el.children[1].innerText,
      el.children[2].innerText
    ]);
    test.match(parsed, ["42", "7", "8.5"]);
  });
}

module.exports = {run, uri: "/plus-party"};
