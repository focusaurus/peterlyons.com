#!/usr/bin/env node
const workServer = require("../app/work/server");
const glob = require("glob");
const puppeteer = require("puppeteer");

const suites = glob.sync(process.argv[2] || `${__dirname}/../app/**/*btest.js`);

/* eslint-disable no-console,no-restricted-syntax,no-await-in-loop,import/no-dynamic-require */
async function runTests(uri) {
  let browser;
  try {
    browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    for (const suite of suites) {
      const mod = require(suite);
      console.log("go to:", mod.uri);
      await page.goto(`${uri}${mod.uri}`);
      await mod.run(page);
    }
  } catch (error) {
    console.error(error);
  } finally {
    await (browser && browser.close());
  }
}

async function main() {
  console.log("Headless browser tests…");
  const server = await workServer.setup({logLevel: "silent"});
  await server.start();
  await runTests(server.info.uri).catch(console.error);
  console.log("✓");
  // eslint-disable-next-line no-process-exit
  process.exit();
}

main();
