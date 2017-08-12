const app = require("./");
const glob = require("glob");
const HeadlessChrome = require("simple-headless-chrome");

const browser = new HeadlessChrome();
const suites = glob.sync(process.argv[2] || `${__dirname}/**/*btest.js`);

/* eslint-disable no-console,no-restricted-syntax,no-await-in-loop,import/no-dynamic-require */
async function runTests(port) {
  try {
    await browser.init();
    const tab = await browser.newTab({privateTab: false});
    for (const suite of suites) {
      const mod = require(suite);
      console.log("go to:", mod.uri);
      await tab.goTo(`http://localhost:${port}${mod.uri}`);
      await mod.run(tab);
    }
    await browser.close();
  } catch (error) {
    console.error(error);
  }
}
const server = app.listen(() => {
  runTests(server.address().port).catch(console.error).then(() => {
    // eslint-disable-next-line no-process-exit
    process.exit();
  });
});
