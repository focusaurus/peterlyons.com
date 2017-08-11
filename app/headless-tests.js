const HeadlessChrome = require("simple-headless-chrome");
/* global document */
const browser = new HeadlessChrome();
const suite = require("./blog/create-post-main-btest");
const app = require("./");

async function runTests(port) {
  try {
    await browser.init();
    const tab = await browser.newTab({privateTab: false});
    await tab.goTo(`http://localhost:${port}${suite.uri}`);
    await suite.run(tab);
    await browser.close();
  } catch (error) {
    console.error(error);
  }
}
const server = app.listen(() => {
  runTests(server.address().port).catch(console.error).then(() => {
    console.log("done tests, closing"); // fixme
    server.close();
    process.exit()
  });
});
