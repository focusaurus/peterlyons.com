const app = require("./");
const glob = require("glob");
const puppeteer = require("puppeteer");

const suites = glob.sync(process.argv[2] || `${__dirname}/**/*btest.js`);

/* eslint-disable no-console,no-restricted-syntax,no-await-in-loop,import/no-dynamic-require */
async function runTests(port) {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
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
  runTests(server.address().port).catch(console.error).then(() => {
    // eslint-disable-next-line no-process-exit
    process.exit();
  });
});
