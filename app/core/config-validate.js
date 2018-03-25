"use strict";
const config = require("config3");
const joi = require("joi");
const summarize = require("joi-summarize");

const port = joi
  .number()
  .min(1025)
  .max(65535);
const schema = joi.object().keys({
  appVersion: joi.string().regex(/\d+\.\d+\.\d+/),
  persPort: port,
  proPort: port,
  revealDir: joi.string(),
  staticDir: joi.string(),
  photos: joi.object().keys({
    galleryDir: joi.string()
  }),
  blog: joi.object().keys({
    hashPath: joi.string()
  })
});

const result = schema.validate(config, {abortEarly: false});
if (result.error) {
  process.stderr.write(summarize(result.error, "Invalid Configuration"));
  process.exit(66); // eslint-disable-line no-process-exit
}
module.exports = result.value;
