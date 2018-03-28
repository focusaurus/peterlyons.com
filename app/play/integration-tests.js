"use strict";
const smokeTests = require("../core/smoke-tests");

const configs = [
  ["/humans.txt", /JavaScript/], // tests static assets
  ["/photos?gallery=burning_man_2011", /Gallery/],
  ["/photos?gallery=summer_2000", /gentlemen/],
  ["/persblog", /travel/],
  ["/persblog/2007/10/hometown-dracula", /Randall/]
];

smokeTests("persblog smoke tests", process.env.URI, configs);
