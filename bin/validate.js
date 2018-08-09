#!/usr/bin/env mocha --reporter spec
/* eslint-env mocha */
/* eslint-disable */
process.env.NODE_ENV = "test";

const htmlValidator = require("html-validator");

function makeTest(request, configs) {
  xdescribe("The HTML of each page", () => {
    configs.forEach(testConfig => {
      const URI = testConfig[0];
      it(`${URI} should be valid HTML5 according to the W3C`, done => {
        this.slow(5000);
        this.timeout(9000);
        request.get(URI).expect(200).end((error, res) => {
          if (error) {
            done(error);
            return;
          }
          const options = {
            format: "text",
            data: res.text
          };
          htmlValidator(options, done);
        });
      });
    });
  });
}

/*
makeTest(require("../app/request"), require("../app/test-configs"));
makeTest(
  require("../app/play/request"),
  require("../app/play/test-configs")
);
*/
