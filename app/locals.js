"use strict";
const _ = require("lodash");
const config = require("config3");

const app = {
  proSite: true,
  analytics: config.analytics
};

function locals(overrides) {
  return _.merge({}, app, overrides);
}
module.exports = locals;
