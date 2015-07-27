#!/usr/bin/env node
var bcrypt = require('bcryptjs')
var fs = require('fs')
var join = require('path').join
var promptly = require('promptly')

var outPath = join(__dirname, '../../data', 'blog_password.bcrypt')

/* eslint no-sync:0 */
function save (error, newPassword) {
  var salt = bcrypt.genSaltSync(10)
  var hash = bcrypt.hashSync(newPassword, salt)
  fs.writeFileSync(outPath, hash, 'utf8')
  console.log('password hash stored at ' + outPath)
  process.exit(0)
}

promptly.prompt('New blog password: ', {silent: true}, save)
