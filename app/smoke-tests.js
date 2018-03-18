"use strict";
const supertest = require("supertest");
const tap = require("tap");

function smokeTests(description, appOrUrl, pairs) {
  const request = supertest(appOrUrl);
  pairs.forEach(([uri, regex]) => {
    tap.test(`should load ${uri}`, test => {
      request
        .get(uri)
        .expect(200)
        .expect(regex)
        .end(error => {
          test.error(error);
          test.end();
        });
    });
  });
}

module.exports = smokeTests;
