#!/usr/bin/env node
const bcrypt = require("bcryptjs");
const fs = require("fs");
const join = require("path").join;
const promptly = require("promptly");

const outPath = join(__dirname, "../../data", "blog_password.bcrypt");

/* eslint-disable no-sync */
/* eslint-disable no-process-exit */
function save(nope, newPassword) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(newPassword, salt);
  fs.writeFileSync(outPath, hash, "utf8");
  console.log("password hash stored at", outPath);
  process.exit(0);
}

promptly.prompt("New blog password: ", { silent: true }, save);
