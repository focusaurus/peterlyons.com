#!/usr/bin/env node
const fs = require("fs");
const glob = require("glob");

function main(pattern) {
  glob.sync(pattern).forEach(metadataPath => {
    const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
    delete metadata.format;
    const json = JSON.stringify(metadata, null, 2);
    fs.writeFileSync(metadataPath, `${json}\n`);
    console.log("✓", metadataPath);
  });
}
main(process.argv[2]);
