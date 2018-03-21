const tap = require("tap");

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
    await page.$eval(".create-post input[name=title]", el => {
      el.value = "";
    });
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
    test.match(preview, "<p>unit test <strong>content</strong> 2</p>");
  });

  await tap.test("should render flickr properly", async test => {
    await page.$eval(".create-post textarea.content", el => {
      el.value = `# first header

![flickr](https://www.flickr.com/photos/focusaurus/albums/72157687300615032)

paragraph`;
    });
    await page.type(".create-post textarea.content", "1");
    await page.waitFor(1500); // preview is debounced
    const preview = await page.$eval(
      ".create-post .preview",
      el => el.innerHTML
    );
    test.match(preview, `<h1 id="first-header">first header</h1>`);
    test.match(
      preview,
      `<iframe align="center" frameborder="0" height="375" scrolling="no" width="500"`
    );
    test.match(
      preview,
      `src="https://www.flickr.com/slideShow/index.gne?user_id=focusaurus&amp;set_id=72157687300615032"></iframe>`
    );
    test.match(preview, "<p>paragraph1</p>");
  });

  await tap.test("should render youtube properly", async test => {
    await page.$eval(".create-post textarea.content", el => {
      el.value = `# first header

![youtube](https://www.youtube.com/embed/XYxQw-YujEw)

paragraph`;
    });
    await page.type(".create-post textarea.content", "1");
    await page.waitFor(1500); // preview is debounced
    const preview = await page.$eval(
      ".create-post .preview",
      el => el.innerHTML
    );
    test.match(preview, `<h1 id="first-header">first header</h1>`);
    test.match(preview, `<iframe width="420" height="315"`);
    test.match(
      preview,
      `src="https://www.youtube.com/embed/XYxQw-YujEw" allowfullscreen=""></iframe>`
    );
    test.match(preview, "<p>paragraph1</p>");
  });

  await tap.test("should render unordered lists properly", async test => {
    await page.$eval(".create-post textarea.content", el => {
      el.value = `- one
  - 1 sub 1
- two
  - 2 sub 1

para
`;
    });
    await page.type(".create-post textarea.content", "1");
    await page.waitFor(1500); // preview is debounced
    const preview = await page.$eval(
      ".create-post .preview",
      el => el.innerHTML
    );
    test.match(preview, `<ul>\n<li>one<ul>`);
    test.match(preview, `<li>two<ul>`);
    test.match(preview, `<li>2 sub 1</li>`);
  });
}

module.exports = {run, uri: "/problog/post"};
