#!/usr/bin/env node
"use strict";
const request = require("supertest")(process.env.URL);
const smokeTests = require("./smoke-tests");
const tap = require("tap");

tap.test(`${process.env.URL} web server basics`, test => {
  request
    .get("/scnd.pdf")
    .expect(200)
    .expect("Content-Type", "application/pdf")
    .end((error) => {
      test.end(error);
    });
});
const configs = [
  ["/problog", /Pete's Points/],
  ["/problog/2009/03/announcing-petes-points", /professional/]
].concat(require("./test-configs"));

smokeTests("blog smoke tests", process.env.URL, configs);
