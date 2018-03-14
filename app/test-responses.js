"use strict";
const supertest = require("supertest");
const tap = require("tap");

function testResponses(description, appOrUrl, pairs) {
  const request = supertest(appOrUrl);
  pairs.forEach(([uri, regex]) => {
    tap.test(`${description} smoke test ${uri}`, test => {
      request
        .get(uri)
        .expect(regex)
        .expect(200)
        .end(error => {
          test.error(error);
          test.end();
        });
    });
  });
}

module.exports = testResponses;
