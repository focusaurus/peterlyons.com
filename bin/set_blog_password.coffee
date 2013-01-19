#!/usr/bin/env coffee
bcrypt = require "bcrypt"
commander = require "commander"
fs = require "fs"
path = require "path"

outPath = path.join __dirname, "..", "app", "data", "blog_password.bcrypt"
path = require "path"
commander
  .version("0.0.1")
  .parse(process.argv);
commander.password "New blog password: ", (newPassword) ->
  salt = bcrypt.genSaltSync 10
  hash = bcrypt.hashSync newPassword, salt
  fs.writeFileSync outPath, hash, "utf8"
  console.log "password hash stored at #{outPath}"
  process.exit 0
