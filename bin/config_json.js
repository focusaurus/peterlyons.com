#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2))
console.log(JSON.stringify(argv))
