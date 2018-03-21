"use strict";
const config = require("config3");
const _ = require("lodash");

module.exports = function get(overrides = {}) {
  return Object.assign(
    {},
    _.pick(config, "appVersion"),
    overrides
  );
};
