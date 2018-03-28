"use strict";
const smokeTests = require("../core/smoke-tests");

const configs = [
  ["/humans.txt", /JavaScript/], // tests static assets
  ["/problog", /Points/],
  ["/problog/2009/03/announcing-petes-points", /electronics/]
];

smokeTests("work smoke tests", process.env.URI, configs);
