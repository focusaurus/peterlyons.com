#!/usr/bin/env node

const bole = require('bole')
const log = bole(__filename)

bole.output({
  level: 'debug',
  stream: process.stdout
})

process.on('uncaughtException', function uncaught (exception) {
  log.error(exception, 'uncaught exception. Process will exit')
  setImmediate(function exit () {
    process.exit(66) // eslint-disable-line no-process-exit
  }, 1000)
})

log.info({
  env: process.env.NODE_ENV
}, 'Express server process starting')

function listen (app, port, ip) {
  app.listen(port, ip, function listening (error) {
    if (error) {
      log.error('Could not bind server port. Aborting.')
      process.exit(10) // eslint-disable-line no-process-exit
    }
    log.info({ip: ip, port: port}, 'express server listening')
  })
}

require('process-title')
const config = require('config3')
const persApp = require('./personal/app')
const proApp = require('./index')

listen(proApp, config.proPort, config.ip)
listen(persApp, config.persPort, config.ip)
