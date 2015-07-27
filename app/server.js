#!/usr/bin/env node
var bole = require('bole')
var log = bole(__filename)
bole.output({level: 'debug', stream: process.stdout})
process.on('uncaughtException', function uncaught (exception) {
  log.error(exception, 'uncaught exception. Process will exit')
  setImmediate(function exit () {
    process.exit(66)
  }, 1000)
})
log.info({env: process.env.NODE_ENV}, 'Express server process starting')

require('process-title')
var _ = require('lodash')
var app = require('./index')
var config = require('config3')

app.listen(config.port, config.ip, function (error) {
  if (error) {
    log.error('Could not bind server port. Aborting.')
    process.exit(10)
  }
  log.info(_.pick(config, 'baseURL'), 'express server listening')
})
// require('app/inspector')
