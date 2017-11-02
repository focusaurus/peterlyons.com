async function clear(page, selector) {
  const value = await page.$eval(
    selector,
    el => el.value || el.innerText || ""
  );
  await page.focus(selector);
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < value.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    await page.keyboard.press("Backspace");
  }
}

module.exports = clear;
