"use strict";
const tap = require("tap");

function testResponses(description, appOrUrl, pairs) {
  const request = require("supertest")(appOrUrl);
  pairs.forEach(pair => {
    const uri = pair[0];
    const regex = pair[1];
    tap.test(`${description} smoke test ${uri}`, test => {
      request
        .get(uri)
        .expect(regex)
        .expect(200)
        .expect(200, err => {
          test.end(err);
        });
    });
  });
}

module.exports = testResponses;
