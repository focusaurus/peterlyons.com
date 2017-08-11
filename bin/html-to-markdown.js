#!/usr/bin/env node
const childProcess = require("child_process");
const fs = require("fs");
const glob = require("glob");
const path = require("path");
const toMarkdown = require("to-markdown");

function main(pattern) {
  glob.sync(pattern).forEach(htmlPath => {
    const mdName = `${path.basename(htmlPath, ".html")}.md`;
    const mdPath = path.join(path.dirname(htmlPath), mdName);
    const html = fs.readFileSync(htmlPath, "utf8");
    const markdown = toMarkdown(html);
    const child = childProcess.spawnSync("git", ["mv", htmlPath, mdPath]);
    if (child.status !== 0) {
      process.exit(child.status);
    }
    console.log("✓", mdPath);
    fs.writeFileSync(mdPath, markdown);
  });
}
main(process.argv[2]);
