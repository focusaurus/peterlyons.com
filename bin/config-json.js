#!/usr/bin/env node

const argv = require("minimist")(process.argv.slice(2));

console.log(JSON.stringify(argv));
