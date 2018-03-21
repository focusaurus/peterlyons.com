#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const request = require("supertest");

// Re-renders the static HTML for our error pages for when express is down.
// Writes them out to the static repo where they can later be committed to git
const workServer = require("../app/work/server");

async function download(server, code) {
  const outFile = path.join(__dirname, `/../../static/error${code}.html`);
  const outStream = fs.createWriteStream(outFile);
  console.log("Building", outFile);
  return request(server.info.uri)
    .get(`/error${code}`)
    .expect(code)
    .then(res => {
      const html = res && res.text;
      if (html) {
        outStream.end(html);
      }
    })
    .catch(error => {
      console.error(`ERROR: no HTML received for ${code}: ${error.message}`);
    });
}

async function main() {
  const server = await workServer.setup({logLevel: "silent"});
  await server.start();
  const promises = [404, 500].map(download.bind(null, server));
  try {
    await Promise.all(promises);
    server.stop();
  } catch (error) {
    console.error(error);
    process.exit(10);
  }
}

main();
