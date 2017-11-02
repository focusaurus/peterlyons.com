#!/usr/bin/env node
const app = require("../app");
const glob = require("glob");
const puppeteer = require("puppeteer");

const suites = glob.sync(process.argv[2] || `${__dirname}/../app/**/*btest.js`);

/* eslint-disable no-console,no-restricted-syntax,no-await-in-loop,import/no-dynamic-require */
async function runTests(port) {
  let browser;
  try {
    browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    for (const suite of suites) {
      const mod = require(suite);
      console.log("go to:", mod.uri);
      await page.goto(`http://localhost:${port}${mod.uri}`);
      await mod.run(page);
    }
  } catch (error) {
    console.error(error);
  } finally {
    await (browser && browser.close());
  }
}

const server = app.listen(() => {
  console.log("Headless browser tests…");
  runTests(server.address().port)
    .catch(console.error)
    .then(() => {
      // eslint-disable-next-line no-process-exit
      console.log("✓");
      process.exit();
    });
});
