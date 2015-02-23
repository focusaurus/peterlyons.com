#!/usr/bin/env node

// NOTE during travis CI this gets run after node/iojs install but
// before npm install, so only core modules can be used.
var fs = require("fs");
var join = require("path").join;
var pack = require("./_package");

// https://github.com/Raynos/xtend/blob/master/mutable.js
function extend(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}
var sets = {};

sets.build = {
  "bower": "1.3.12",
  "browserify": "7.0.3",
  "uglify-js": "2.4.16",
  "npm-pkgr": "0.1.0"
};

sets.test = extend({
  "chaimel": "1.1.0",
  "eslint": "0.10.0",
  "eslint-formatter-comment": "1.0.0",
  "mocha": "2.1.0",
  "phantomjs": "1.9.15",
  "superagent": "0.18.0",
  "supertest": "0.15.0",
  "w3c-validate": "0.0.2",
  "zuul": "1.16.3"
}, sets.build);

sets.develop = extend({
  "bump-cli": "1.1.3",
  "promptly": "0.2.1",
  "watchify": "2.2.1"
}, sets.build, sets.test);

sets.optional = extend({
  "bistre": "1.0.1",
  "node-dev": "2.3.0",
  "node-inspector": "0.7.4"
}, sets.develop);

sets.production = {};

function main() {
  var setName = process.argv[2] || "develop";
  extend(pack.dependencies, sets[setName]);
  fs.writeFileSync(
    join(__dirname, "package.json"), JSON.stringify(pack, null, 2), "utf8");
}

if (require.main === module) {
  main();
}

module.exports = pack;
