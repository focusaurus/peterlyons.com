const tap = require("tap");
/* global document */

async function run(tab) {
  await tap.test(
    "create-post-main should have the correct initial title",
    async test => {
      const title = await tab.getValue(".create-post input[name=title]");
      test.same(title, "new-post-title-here");
    }
  );

  await tap.test("should disable save initially", async test => {
    const wrapper = await tab.evaluate(
      selector => document.querySelector(selector).disabled,
      ".create-post .save"
    );
    test.same(wrapper.result.value, true);
  });

  await tap.test("should enable save with valid input", async test => {
    await tab.clear(".create-post input[name=title]");
    await tab.type(".create-post input[name=title]", "unit test title 2");
    await tab.type(".create-post textarea.content", "unit test **content** 2");
    await tab.type(".create-post input[name=password]", "unit test password 2");
    const disabledEval = await tab.evaluate(
      () => document.querySelector(".create-post .save").disabled
    );
    test.same(disabledEval.result.value, false);
    const titleEval = await tab.evaluate(
      () => document.querySelector(".create-post .title").innerText
    );
    test.same(titleEval.result.value, "unit test title 2");
    await tab.wait(2000); // preview is debounced
    const previewEval = await tab.evaluate(
      selector => document.querySelector(selector).innerHTML,
      ".create-post .preview"
    );
    test.same(
      previewEval.result.value,
      "<p>unit test <strong>content</strong> 2</p>\n"
    );
  });
}
exports.uri = "/problog/post";
exports.run = run;
