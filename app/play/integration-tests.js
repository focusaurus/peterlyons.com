const cheerio = require("cheerio");
const expect = require("chaimel");
const request = require("supertest")(process.env.URL);
const testUtils = require("../test-utils");
const smokeTests = require("../smoke-tests");

const configs = [
  ["/app/photos?gallery=burning_man_2011", /Gallery/],
  ["/persblog", /travel/],
  ["/persblog/2007/10/hometown-dracula", /Randall/]
];

smokeTests("persblog smoke tests", process.env.URL, configs);