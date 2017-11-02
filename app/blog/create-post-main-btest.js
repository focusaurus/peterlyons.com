const tap = require("tap");

async function clear(page, selector) {
  const inputValue = await page.$eval(selector, el => el.value);
  await page.focus(selector);
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < inputValue.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    await page.keyboard.press("Delete");
  }
}

async function run(page) {
  await tap.test(
    "create-post-main should have the correct initial title",
    async test => {
      const title = await page.$eval(
        ".create-post input[name=title]",
        el => el.value
      );
      test.same(title, "new-post-title-here");
    }
  );

  await tap.test("should disable save initially", async test => {
    const disabled = await page.$eval(".create-post .save", el => el.disabled);
    test.same(disabled, true);
  });

  await tap.test("should enable save with valid input", async test => {
    await clear(page, ".create-post input[name=title]");
    await page.type(".create-post input[name=title]", "unit test title 2");
    await page.type(".create-post textarea.content", "unit test **content** 2");
    await page.type(
      ".create-post input[name=password]",
      "unit test password 2"
    );
    const disabled = await page.$eval(".create-post .save", el => el.disabled);
    test.same(disabled, false);
    const title = await page.$eval(".create-post .title", el => el.innerText);
    test.same(title, "unit test title 2");
    await page.waitFor(1500); // preview is debounced
    const preview = await page.$eval(
      ".create-post .preview",
      el => el.innerHTML
    );
    test.same(preview, "<p>unit test <strong>content</strong> 2</p>\n");
  });
}

module.exports = {run, uri: "/problog/post"};
