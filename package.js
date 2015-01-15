#!/usr/bin/env node
var _ = require("lodash");
var fs = require("fs");
var join = require("path").join;

var pack = {
  "name": "peterlyons.com",
  "description": "The node/express web app for the peterlyons.com web site",
  "version": "5.10.0",
  "homepage": "http://peterlyons.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/focusaurus/peterlyons.com.git"
  },
  "author": "Peter Lyons <pete@peterlyons.com> (http://peterlyons.com)",
  "main": "app/server.js",
  "engines": {
    "iojs": "1.0.1",
    "node": "0.10.33"
  },
  "scripts": {
    "start": "./bin/go express",
    "test": "./bin/go test"
  },
  "files": [],
  "browser": {
    "angular": "./bower_components/angular/angular.js",
    "angular-sanitize":
      "./bower_components/angular-sanitize/angular-sanitize.js",
    "angular-route": "./bower_components/angular-route/angular-route.js",
    "angular-mocks": "./bower_components/angular-mocks/angular-mocks.js"
  },
  "dependencies": {
    "async": "0.9.0",
    "bcryptjs": "2.0.2",
    "bole": "1.0.0",
    "cheerio": "0.17.0",
    "compression": "1.2.2",
    "config3": "1.0.0",
    "connect": "2.14.4",
    "connect-cache": "0.2.1",
    "express": "4.0.0",
    "glob": "4.0.5",
    "httperrors": "0.7.0",
    "jade": "1.5.0",
    "lodash": "2.4.1",
    "markdown-js": "0.0.3",
    "mkdirp": "0.5.0",
    "moment": "2.8.1",
    "mustache": "0.8.2",
    "nib": "1.0.3",
    "process-title": "0.0.0",
    "raw-body": "1.3.0",
    "sharify": "0.1.5",
    "stylish": "0.4.1",
    "stylus": "0.47.3",
    "zeroclipboard": "1.3.5"
  }
};

var _ = require("lodash");

var sets = {};

sets.build = {
  "bower": "1.3.12",
  "browserify": "7.0.3",
  "uglify-js": "2.4.16",
  "npm-pkgr": "0.1.0"
};

sets.test = _.extend({
  "chaimel": "1.1.0",
  "eslint": "0.10.0",
  "eslint-formatter-comment": "1.0.0",
  "mocha": "1.20.1",
  "phantomjs": "1.9.12",
  "superagent": "0.18.0",
  "supertest": "0.13.0",
  "w3c-validate": "0.0.2",
  "zuul": "1.16.3"
}, sets.build);

sets.optional = _.extend({
  "bistre": "1.0.1",
  "node-dev": "2.3.0",
  "node-inspector": "0.7.4"
}, sets.build);

sets.develop = _.extend({
  "commander": "0.5.2",
  "watchify": "2.2.1"
}, sets.build, sets.test);

sets.production = {};

function main() {
  var setName = process.argv[2] || "develop";
  _.extend(pack.dependencies, sets[setName]);
  fs.writeFileSync(
    join(__dirname, "package.json"), JSON.stringify(pack, null, 2), "utf8");
}

if (require.main === module) {
  main();
}

module.exports = pack;
